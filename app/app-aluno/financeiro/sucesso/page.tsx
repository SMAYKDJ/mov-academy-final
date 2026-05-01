'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, ArrowRight, Download, Home } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function StudentPaymentSuccessPage() {
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
    <div className="flex flex-col items-center text-center space-y-8 py-8 animate-fade-in">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-6 scale-in">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Pagamento Confirmado!
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 px-6">
          Obrigado! Sua mensalidade foi paga com sucesso e seu acesso está garantido.
        </p>
      </div>

      <div className="w-full bg-white dark:bg-[#0f1117] p-6 rounded-3xl border border-gray-100 dark:border-[#1e2235] shadow-sm space-y-4 text-left">
        <div className="flex justify-between items-center pb-3 border-b border-gray-50 dark:border-gray-800/50">
          <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Valor</span>
          <span className="font-bold text-gray-900 dark:text-white">R$ 149,90</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-gray-50 dark:border-gray-800/50">
          <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Data</span>
          <span className="font-semibold text-gray-700 dark:text-gray-300 text-xs">22 de Abril, 2026</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Status</span>
          <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded text-[9px] font-bold uppercase">Confirmado</span>
        </div>
      </div>

      <div className="flex flex-col w-full gap-3">
        <Link 
          href="/app-aluno"
          className="w-full py-4 bg-gray-900 dark:bg-white dark:text-black text-white rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          Voltar ao Início
        </Link>
        <button
          className="w-full py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Baixar Comprovante
        </button>
      </div>
    </div>
  );
}
