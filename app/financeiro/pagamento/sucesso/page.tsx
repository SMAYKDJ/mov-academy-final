'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { CheckCircle2, ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function PagamentoSucessoPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Disparar confetes ao carregar
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#080a0f]">
      <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      <div className="flex-1 md:ml-64 transition-all duration-300">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="px-4 md:px-8 py-16 max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-6 scale-in">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Pagamento Confirmado!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Tudo certo! Sua assinatura foi ativada com sucesso.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0f1117] p-8 rounded-3xl border border-gray-100 dark:border-[#1e2235] shadow-xl space-y-6 text-left">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50 dark:border-gray-800">
              <span className="text-gray-500 text-sm">Valor Pago</span>
              <span className="font-bold text-gray-900 dark:text-white text-lg">R$ 149,90</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-50 dark:border-gray-800">
              <span className="text-gray-500 text-sm">Método</span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Cartão de Crédito</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Transação ID</span>
              <span className="font-mono text-xs text-gray-400">ch_3N...9Kz2</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/financeiro"
              className="flex-1 py-4 bg-gray-900 dark:bg-white dark:text-black text-white rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
              Ir para o Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              className="flex-1 py-4 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] text-gray-600 dark:text-gray-400 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Recibo PDF
            </button>
          </div>
          
          <p className="text-xs text-gray-400">
            Um e-mail de confirmação foi enviado para sua conta.
          </p>
        </main>
      </div>
    </div>
  );
}
