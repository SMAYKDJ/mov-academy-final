'use client';

import React, { useState, useEffect } from 'react';
import { User, Clock, Calendar, Trophy, Zap, Activity } from 'lucide-react';
import { cn } from '@/utils/cn';

interface AccessEvent {
  id: string;
  nome: string;
  timestamp: string;
  plano: string;
  frequencia: number;
}

export default function TVDashboard() {
  const [lastAccess, setLastAccess] = useState<AccessEvent | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showWelcome, setShowWelcome] = useState(false);

  // Atualizar Relógio
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simular detecção de acesso (Em produção: Usar Supabase Realtime ou Polling)
  useEffect(() => {
    const simulateAccess = () => {
      const mockNames = ["Ricardo Silva", "Ana Costa", "SMAYK DJ", "Beatriz Lima", "Carlos Eduardo"];
      const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
      
      const newAccess = {
        id: Math.random().toString(),
        nome: randomName,
        timestamp: new Date().toLocaleTimeString(),
        plano: "Plano Black VIP",
        frequencia: Math.floor(Math.random() * 5) + 1
      };

      setLastAccess(newAccess);
      setShowWelcome(true);

      // Esconder após 8 segundos
      setTimeout(() => setShowWelcome(false), 8000);
    };

    // Simular um acesso a cada 30 segundos para demonstração
    const interval = setInterval(simulateAccess, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#05070a] text-white overflow-hidden font-sans select-none">
      {/* Background Decorativo */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[150px] -mr-96 -mt-96" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -ml-64 -mb-64" />

      {/* Header / Relógio */}
      <div className="absolute top-0 left-0 right-0 p-12 flex justify-between items-start z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-600/20">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Moviment <span className="text-primary-500">Academy</span></h1>
          </div>
          <p className="text-gray-500 font-bold tracking-[0.3em] uppercase text-xs ml-1">High Performance Center</p>
        </div>

        <div className="text-right">
          <p className="text-7xl font-black tracking-tighter tabular-nums">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-xl font-bold text-primary-500 uppercase tracking-widest mt-2">
            {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
          </p>
        </div>
      </div>

      {/* Grid Principal (Informações de Fundo) */}
      <main className="h-full pt-48 pb-12 px-12 grid grid-cols-12 gap-8">
        {/* Lado Esquerdo: Ranking de Assiduidade */}
        <div className="col-span-4 space-y-6">
          <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 text-primary-500">
            <Trophy className="w-6 h-6" /> Ranking da Semana
          </h2>
          <div className="space-y-4">
            {[
              { nome: "Ricardo Silva", treinos: 5, pos: 1 },
              { nome: "Ana Costa", treinos: 4, pos: 2 },
              { nome: "SMAYK DJ", treinos: 4, pos: 3 },
              { nome: "Beatriz Lima", treinos: 3, pos: 4 },
              { nome: "Carlos Eduardo", treinos: 3, pos: 5 },
            ].map((user, i) => (
              <div key={user.nome} className="bg-white/5 border border-white/10 rounded-3xl p-5 flex items-center justify-between animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-black",
                    user.pos === 1 ? "bg-amber-500 text-black" : "bg-white/10 text-white"
                  )}>
                    {user.pos}
                  </div>
                  <p className="text-xl font-bold">{user.nome}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary-500" />
                  <span className="text-xl font-black">{user.treinos}x</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Centro/Direita: Avisos ou Treino do Dia */}
        <div className="col-span-8 flex flex-col gap-8">
          <div className="flex-1 bg-gradient-to-br from-primary-600/20 to-indigo-600/20 rounded-[40px] border border-white/10 p-10 flex flex-col justify-center items-center text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
             <Activity className="w-24 h-24 text-primary-500/50 mb-8 animate-pulse" />
             <h3 className="text-6xl font-black tracking-tight mb-4 uppercase italic">Supere seus <span className="text-primary-500">Limites</span></h3>
             <p className="text-2xl text-gray-400 font-medium max-w-2xl leading-relaxed">
               Lembre-se: O treino de hoje é o que constrói o resultado de amanhã. Mantenha o foco!
             </p>
          </div>
          
          <div className="h-48 flex gap-8">
             <div className="flex-1 bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col justify-center">
                <p className="text-xs font-black text-primary-500 uppercase tracking-widest mb-2">Temperatura</p>
                <p className="text-5xl font-black tracking-tighter">28°C <span className="text-2xl text-gray-500 font-bold ml-2">Castanhal</span></p>
             </div>
             <div className="flex-1 bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col justify-center">
                <p className="text-xs font-black text-primary-500 uppercase tracking-widest mb-2">Alunos Ativos</p>
                <p className="text-5xl font-black tracking-tighter">42 <span className="text-2xl text-gray-500 font-bold ml-2">Treinando agora</span></p>
             </div>
          </div>
        </div>
      </main>

      {/* OVERLAY DE BOAS-VINDAS (FULL SCREEN OVERLAY) */}
      <div className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center transition-all duration-1000",
        showWelcome ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-110 pointer-events-none"
      )}>
        {/* Backdrop escuro com blur */}
        <div className="absolute inset-0 bg-[#05070a]/90 backdrop-blur-2xl" />
        
        {/* Card de Boas-vindas Gigante */}
        <div className="relative z-10 flex flex-col items-center animate-bounce-subtle">
          <div className="w-64 h-64 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-[60px] flex items-center justify-center shadow-[0_0_100px_rgba(37,99,235,0.4)] mb-12 relative">
             <User className="w-32 h-32 text-white" />
             <div className="absolute -bottom-4 -right-4 bg-emerald-500 p-6 rounded-full border-[10px] border-[#05070a] shadow-xl">
                <Zap className="w-10 h-10 text-white" />
             </div>
          </div>

          <h4 className="text-3xl font-black text-primary-500 uppercase tracking-[0.4em] mb-4">Bem-vindo(a)!</h4>
          <h5 className="text-[120px] font-black tracking-tighter leading-none mb-6">
            {lastAccess?.nome.split(' ')[0]}
          </h5>
          
          <div className="flex items-center gap-6 bg-white/10 px-8 py-4 rounded-3xl border border-white/10">
            <div className="flex flex-col items-center border-r border-white/20 pr-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Plano</p>
              <p className="text-xl font-bold">{lastAccess?.plano}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Assiduidade</p>
              <p className="text-xl font-bold text-emerald-400">{lastAccess?.frequencia}x na semana</p>
            </div>
          </div>

          <p className="mt-12 text-2xl font-bold text-gray-500 animate-pulse uppercase tracking-widest">Bom Treino! Destrua hoje! 💪🔥</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
