'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, ShieldCheck, Timer, MapPin, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';

export default function CheckinPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleCheckin = () => {
    setLoading(true);
    // Simulate check-in
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      showToast('Check-in realizado com sucesso!', 'success', 'Presença confirmada');
      setTimeout(() => router.push('/app-aluno'), 3000);
    }, 1500);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-scale-in text-center">
        <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-200/50 dark:shadow-none">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Acesso Liberado!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Bom treino, atleta. Vamos pra cima! 💪</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-[#12141c] rounded-2xl border border-gray-100 dark:border-[#1e2235] w-full max-w-[280px]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unidade</span>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Sede Principal</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Horário</span>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <h2 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">Check-in</h2>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
          Acesso à Academia
        </h1>
      </section>

      <div className="bg-white dark:bg-[#0f1117] rounded-[40px] p-8 border border-gray-100 dark:border-[#1e2235] shadow-xl flex flex-col items-center relative overflow-hidden">
        {/* QR Code Placeholder */}
        <div className="relative z-10 w-full aspect-square max-w-[240px] bg-gray-50 dark:bg-[#1a1d27] rounded-3xl border-4 border-gray-100 dark:border-[#2e334d] flex items-center justify-center group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 to-transparent" />
          <QrCode className="w-32 h-32 text-gray-300 dark:text-gray-700 group-hover:scale-110 transition-transform duration-500" />
          
          {/* Animated Scanning Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-primary-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-[scan_2s_infinite_ease-in-out]" />
        </div>

        <div className="mt-8 text-center space-y-4 relative z-10">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium px-4">
            Aponte a câmera ou clique no botão abaixo para simular a leitura do código na recepção.
          </p>
          
          <button
            onClick={handleCheckin}
            disabled={loading}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Timer className="w-5 h-5 animate-spin" />
                Validando...
              </>
            ) : (
              'Confirmar Presença'
            )}
          </button>
        </div>

        {/* Info row */}
        <div className="mt-8 flex items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest relative z-10">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-primary-500" />
            <span>Sede</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>Online</span>
          </div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary-50 dark:bg-primary-900/10 rounded-full blur-3xl" />
      </div>

      <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
        <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
          O QR Code é renovado a cada 30 segundos por segurança. Certifique-se de estar próximo ao leitor.
        </p>
      </div>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
