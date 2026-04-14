'use client';

import React from 'react';
import { 
  CreditCard, 
  ChevronRight, 
  AlertCircle, 
  History, 
  MessageCircle,
  QrCode,
  Copy
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/components/ui/toast';
import Link from 'next/link';

export default function StudentFinanceiroPage() {
  const { showToast } = useToast();
  
  const handleCopyPix = () => {
    navigator.clipboard.writeText('00020126580014BR.GOV.BCB.PIX0114123456780001955204000053039865405189.905802BR5915MOVIMENT ACAD6009SAO PAULO62070503***6304E2D1');
    showToast('Código PIX copiado para a área de transferência', 'success', 'Copiado');
  };

  const openWhatsApp = () => {
    const phone = '5511999999999';
    const message = encodeURIComponent('Olá! Gostaria de tirar uma dúvida sobre meu plano na Moviment Academy.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Minhas Contas</h1>

      {/* Active Monthly Bill Card */}
      <section className="bg-white dark:bg-[#0f1117] rounded-[32px] border border-gray-100 dark:border-[#1e2235] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none mb-1">Fatura em Aberto</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Vence em 05/05/2026</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">R$ 189,90</p>
          <p className="text-xs text-gray-400 mt-1">Plano Trimestral • Março/2026</p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={handleCopyPix}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <QrCode className="w-4 h-4" />
            Pagar com PIX
          </button>
          <button 
            onClick={openWhatsApp}
            className="w-full py-4 bg-emerald-50 text-emerald-700 dark:bg-green-900/10 dark:text-green-400 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Falar com Financeiro
          </button>
        </div>
      </section>

      {/* History List */}
      <section>
        <div className="flex items-center justify-between mb-4 px-2">
           <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
             <History className="w-4 h-4 text-gray-400" />
             Histórico de Pagamentos
           </h3>
        </div>
        <div className="space-y-3">
          {[
            { ref: 'FEV/26', val: '189,90', date: '05/02', status: 'pago' },
            { ref: 'JAN/26', val: '189,90', date: '06/01', status: 'pago' },
            { ref: 'DEZ/25', val: '189,90', date: '05/12', status: 'pago' },
          ].map((bill, i) => (
            <div key={i} className="bg-white dark:bg-[#0f1117] p-4 rounded-2xl border border-gray-100 dark:border-[#1e2235] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{bill.ref}</p>
                  <p className="text-[10px] text-gray-400">{bill.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600 dark:text-green-400">R$ {bill.val}</p>
                <span className="text-[10px] uppercase font-bold text-gray-300">Pago</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
