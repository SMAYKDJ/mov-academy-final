'use client';

import React, { useState } from 'react';
import { 
  Dumbbell, 
  Calendar, 
  LineChart, 
  CreditCard, 
  User, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { cn } from "@/utils/cn";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";

export default function StudentAppPage() {
    const { user } = useAuth();
    const [userName, setUserName] = useState('Atleta');
    const [activeTab, setActiveTab] = useState<'treino' | 'agenda' | 'progresso' | 'pagar'>('treino');

    useEffect(() => {
      if (user) {
        const name = user.nome || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Atleta';
        setUserName(name.split(' ')[0]);
      }
    }, [user]);

  return (
    <div className="min-h-screen bg-[#080a0f] text-white font-sans pb-24">
      {/* Header Premium do Aluno */}
      <header className="p-6 pt-12 bg-gradient-to-b from-primary-600/20 to-transparent">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-primary-500/20 border border-white/10">
              {userName[0]}
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Bom dia,</p>
              <h1 className="text-2xl font-black tracking-tight">{userName} 👋</h1>
            </div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 relative">
            <div className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full" />
            <Award className="w-6 h-6 text-primary-400" />
          </div>
        </div>

        {/* Card de Engajamento */}
        <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-6 rounded-[32px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Status de Treino</p>
              <h2 className="text-xl font-black mb-4">Meta Semanal: 3/5</h2>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={cn(
                    "w-8 h-1.5 rounded-full transition-all",
                    i <= 3 ? "bg-white" : "bg-white/30"
                  )} />
                ))}
              </div>
            </div>
            <button className="bg-white text-primary-600 p-4 rounded-2xl shadow-lg hover:scale-110 transition-all">
              <Play className="w-6 h-6 fill-current" />
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Dinâmico */}
      <main className="px-6 space-y-8 animate-fade-in">
        {activeTab === 'treino' && <WorkoutSection />}
        {activeTab === 'agenda' && <ScheduleSection />}
        {activeTab === 'progresso' && <ProgressSection />}
        {activeTab === 'pagar' && <PaymentSection />}
      </main>

      {/* Navegação Inferior (Estilo App Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0f1117]/80 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex justify-between items-center z-[40]">
        <NavButton active={activeTab === 'treino'} onClick={() => setActiveTab('treino')} icon={Dumbbell} label="Treino" />
        <NavButton active={activeTab === 'agenda'} onClick={() => setActiveTab('agenda')} icon={Calendar} label="Agenda" />
        <NavButton active={activeTab === 'progresso'} onClick={() => setActiveTab('progresso')} icon={LineChart} label="Evolução" />
        <NavButton active={activeTab === 'pagar'} onClick={() => setActiveTab('pagar')} icon={CreditCard} label="Financeiro" />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all duration-300",
        active ? "text-primary-500 scale-110" : "text-gray-500 hover:text-gray-300"
      )}
    >
      <Icon className={cn("w-6 h-6", active && "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]")} />
      <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );
}

function WorkoutSection() {
  const exercises = [
    { name: 'Supino Inclinado', series: '4x12', load: '32kg', icon: '🔥' },
    { name: 'Crucifixo Reto', series: '3x15', load: '18kg', icon: '⚡' },
    { name: 'Tríceps Pulley', series: '4x10', load: '45kg', icon: '💪' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black tracking-tight">Treino de Hoje: Peito e Tríceps</h3>
        <span className="text-[10px] font-bold text-primary-400 uppercase bg-primary-400/10 px-2 py-1 rounded-lg">Ficha A</span>
      </div>
      <div className="space-y-4">
        {exercises.map((ex, i) => (
          <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-3xl flex items-center justify-between hover:bg-white/[0.08] transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1a1c26] rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                {ex.icon}
              </div>
              <div>
                <p className="font-bold text-sm">{ex.name}</p>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{ex.series} • {ex.load}</p>
              </div>
            </div>
            <CheckCircle2 className="w-6 h-6 text-gray-700 hover:text-emerald-500 transition-colors cursor-pointer" />
          </div>
        ))}
      </div>
      <button className="w-full py-5 bg-white text-gray-900 rounded-[24px] font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:bg-gray-100 transition-all">
        Finalizar Treino
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function ScheduleSection() {
  const classes = [
    { name: 'Yoga Zen', time: '17:00', instructor: 'Mestre Yoda', spots: 5 },
    { name: 'Crossfit WOD', time: '18:30', instructor: 'Capitão América', spots: 0 },
    { name: 'Zumba Dance', time: '19:45', instructor: 'Shakira', spots: 12 },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-black tracking-tight">Agendar Aulas</h3>
      <div className="grid grid-cols-1 gap-4">
        {classes.map((c, i) => (
          <div key={i} className={cn(
            "p-5 rounded-[32px] border transition-all relative overflow-hidden",
            c.spots > 0 ? "bg-white/5 border-white/5" : "bg-red-500/5 border-red-500/10 opacity-60"
          )}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-black">{c.time}</span>
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase px-2 py-1 rounded-lg",
                c.spots > 0 ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
              )}>
                {c.spots > 0 ? `${c.spots} vagas` : 'Esgotado'}
              </span>
            </div>
            <h4 className="text-xl font-black mb-1">{c.name}</h4>
            <p className="text-xs text-gray-400 mb-4">Instrutor: {c.instructor}</p>
            <button 
              disabled={c.spots === 0}
              className={cn(
                "w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                c.spots > 0 ? "bg-primary-600 text-white hover:bg-primary-700" : "bg-gray-800 text-gray-500 cursor-not-allowed"
              )}
            >
              Reservar Minha Vaga
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressSection() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-black tracking-tight">Minha Evolução</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-white/5 border border-white/5 rounded-[32px] text-center">
          <TrendingUp className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Peso Atual</p>
          <p className="text-2xl font-black">78.5 <span className="text-xs">kg</span></p>
          <span className="text-[10px] text-emerald-500 font-bold">-1.2kg este mês</span>
        </div>
        <div className="p-6 bg-white/5 border border-white/5 rounded-[32px] text-center">
          <Award className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Gordura</p>
          <p className="text-2xl font-black">14.2 <span className="text-xs">%</span></p>
          <span className="text-[10px] text-emerald-500 font-bold">Meta: 12%</span>
        </div>
      </div>
      
      <div className="p-6 bg-[#1a1c26] rounded-[32px] border border-white/5">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-gray-500 text-center">Gráfico de Progresso</h4>
        <div className="h-32 flex items-end justify-between gap-2 px-2">
          {[40, 65, 45, 90, 75, 100].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div 
                className="w-full bg-primary-600/20 group-hover:bg-primary-500 rounded-t-xl transition-all duration-500" 
                style={{ height: `${h}%` }}
              />
              <span className="text-[8px] font-black text-gray-600 uppercase tracking-tighter">Set</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PaymentSection() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-black tracking-tight">Pagamentos</h3>
      <div className="p-8 bg-gradient-to-br from-[#1a1c26] to-[#0f1117] rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Próximo Vencimento</p>
        <h4 className="text-3xl font-black mb-1">15 de Maio</h4>
        <p className="text-primary-400 text-lg font-black mb-8">R$ 149,90</p>
        
        <button className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-primary-500/20 hover:bg-primary-700 transition-all flex items-center justify-center gap-3">
          <CreditCard className="w-5 h-5" />
          Pagar Agora via PIX/Cartão
        </button>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">Histórico Recente</p>
        <div className="p-5 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-bold">Mensalidade Abril</p>
              <p className="text-[10px] text-gray-500">Pago em 14/04/2026</p>
            </div>
          </div>
          <p className="text-sm font-black">R$ 149,90</p>
        </div>
      </div>
    </div>
  );
}
