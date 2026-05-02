'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripePayment } from '@/components/dashboard/financeiro/stripe-payment';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Loader2, ArrowLeft } from 'lucide-react';
import { cn } from '@/utils/cn';
import Link from 'next/link';

// Carregar o Stripe fora do componente para evitar recriá-lo
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function PagamentoStripePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Simulação de uma seleção de plano (poderia vir de query params)
  const amount = 14990; // R$ 149,90

  useEffect(() => {
    // Criar o PaymentIntent assim que a página carregar
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/payments/create-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        amount: amount,
        currency: "brl",
        description: "Mensalidade Moviment Academy - Plano Platinum",
        metadata: { student_id: "MOV-AUTO", plan: "Platinum" }
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao iniciar sessão de pagamento");
        return res.json();
      })
      .then((data) => setClientSecret(data.clientSecret))
      .catch((err) => {
        console.error(err);
        setError("Não foi possível conectar ao servidor de pagamentos.");
      })
      .finally(() => setLoading(false));
  }, []);

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0ea5e9',
      colorBackground: '#ffffff',
      colorText: '#1e293b',
      borderRadius: '12px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#080a0f]">
      <Sidebar 
        mobileOpen={mobileMenuOpen} 
        onMobileClose={() => setMobileMenuOpen(false)} 
        onCollapse={setIsSidebarCollapsed}
      />

      <div className={cn(
        "flex-1 w-full min-w-0 transition-all duration-300",
        isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
      )}>
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="px-4 md:px-8 py-8 w-full max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <Link 
              href="/financeiro"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Finalizar Pagamento
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Complete os dados abaixo para ativar sua assinatura
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
              <p className="text-sm text-gray-500 animate-pulse font-medium">Iniciando ambiente seguro...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-6 rounded-2xl text-center">
              <p className="text-red-600 dark:text-red-400 font-semibold mb-4">{error}</p>
              <Link 
                href="/financeiro"
                className="inline-flex px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all"
              >
                Voltar ao Financeiro
              </Link>
            </div>
          ) : (
            clientSecret && (
              <div className="animate-fade-in-up">
                <Elements options={options} stripe={stripePromise}>
                  <StripePayment 
                    amount={amount} 
                    onSuccess={() => {}} 
                    onCancel={() => window.location.href = '/financeiro'} 
                  />
                </Elements>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}
