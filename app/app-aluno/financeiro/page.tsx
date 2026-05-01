'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripePayment } from '@/components/dashboard/financeiro/stripe-payment';
import { 
  CreditCard, 
  ChevronLeft, 
  Calendar, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  History
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function StudentFinancePage() {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Mensalidade fixa para o exemplo
  const MENSALIDADE_VALOR = 14990; // R$ 149,90

  useEffect(() => {
    async function fetchUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Buscar perfil complementar
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        setUserData({
          name: profile?.full_name || user.email?.split('@')[0],
          plan: 'Platinum',
          status: 'Ativo',
          dueDate: '05/05/2026',
          lastPayment: '05/04/2026'
        });
      }
      setLoading(false);
    }
    fetchUserData();
  }, []);

  const handlePayNow = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/payments/create-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: MENSALIDADE_VALOR,
          currency: "brl",
          description: "Mensalidade Moviment Academy - Plano Platinum",
          metadata: { student_id: userData?.id || "AUTO", type: "monthly_fee" }
        }),
      });
      
      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowPayment(true);
      } else {
        throw new Error("Falha ao gerar sessão de pagamento");
      }
    } catch (err) {
      setError("Não foi possível iniciar o pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !showPayment) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Carregando dados financeiros...</p>
      </div>
    );
  }

  if (showPayment && clientSecret) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button 
          onClick={() => setShowPayment(false)}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para Resumo
        </button>

        <Elements 
          options={{ 
            clientSecret, 
            appearance: { theme: 'stripe', variables: { colorPrimary: '#0ea5e9' } } 
          }} 
          stripe={stripePromise}
        >
          <StripePayment 
            amount={MENSALIDADE_VALOR} 
            onSuccess={() => window.location.href = '/app-aluno/financeiro/sucesso'} 
            onCancel={() => setShowPayment(false)} 
          />
        </Elements>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <section>
        <h2 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">Financeiro</h2>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
          Minha Assinatura
        </h1>
      </section>

      {/* Cartão de Status Principal */}
      <section className="bg-white dark:bg-[#0f1117] rounded-[32px] border border-gray-100 dark:border-[#1e2235] p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Plano Atual</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{userData?.plan || 'Carregando...'}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
              {userData?.status || 'Ativo'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50 dark:border-gray-800/50">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Próximo Vencimento
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{userData?.dueDate}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest flex items-center gap-1">
                <Clock className="w-3 h-3" /> Último Pagamento
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{userData?.lastPayment}</p>
            </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={handlePayNow}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center justify-center gap-2"
            >
              Pagar Mensalidade
              <span className="opacity-60 font-normal">|</span>
              R$ 149,90
            </button>
          </div>
        </div>
        
        {/* Decoração abstrata */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-50 dark:bg-primary-900/10 rounded-full blur-3xl" />
      </section>

      {/* Lista de Histórico */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <History className="w-4 h-4 text-gray-400" />
            Histórico Recente
          </h3>
        </div>

        <div className="space-y-3">
          {[
            { date: '05/04/2026', label: 'Mensalidade Abril', value: 'R$ 149,90', status: 'pago' },
            { date: '05/03/2026', label: 'Mensalidade Março', value: 'R$ 149,90', status: 'pago' },
            { date: '05/02/2026', label: 'Mensalidade Fevereiro', value: 'R$ 149,90', status: 'pago' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-[10px] text-gray-400">{item.date}</p>
                </div>
              </div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cartão de Informação */}
      <section className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
        <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
          <strong>Aviso:</strong> Pagamentos via Pix são compensados instantaneamente. Cartão de crédito pode levar até 24h para atualização no sistema.
        </p>
      </section>
    </div>
  );
}
