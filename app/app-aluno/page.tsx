'use client';

import React from 'react';
import { 
  Play, 
  Flame, 
  Calendar, 
  TrendingUp, 
  ChevronRight, 
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { currentWorkout, studentStats } from '@/utils/treino-data';
import Link from 'next/link';

export default function StudentDashboardPage() {
  const workout = currentWorkout;
  const stats = studentStats;
  const progress = (workout.exercicios.filter(e => e.concluido).length / workout.exercicios.length) * 100;

  return (
    <div className="space-y-6">
      {/* 1. Welcome Section */}
      <section className="animate-fade-in">
        <h2 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">Área do Aluno</h2>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
          Olá, João <span className="inline-block animate-float">👋</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Você já treinou <span className="font-bold text-gray-900 dark:text-white">{stats.treinosNoMes} vezes</span> este mês. Foco total!
        </p>
      </section>

      {/* 2. Stats Grid */}
      <section className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-[#0f1117] p-4 rounded-3xl border border-gray-100 dark:border-[#1e2235] shadow-sm">
          <div className="w-8 h-8 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center mb-3">
            <Flame className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Sequência</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.sequenciaAtual} dias</p>
        </div>
        <div className="bg-white dark:bg-[#0f1117] p-4 rounded-3xl border border-gray-100 dark:border-[#1e2235] shadow-sm">
          <div className="w-8 h-8 bg-emerald-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center mb-3">
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Peso Atual</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.peso} kg</p>
        </div>
      </section>

      {/* 3. Daily Workout Card */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Treino de Hoje</h3>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">45-60 min</span>
        </div>
        
        <Link 
          href="/app-aluno/treinos"
          className="block group relative overflow-hidden bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[32px] p-6 text-white shadow-xl shadow-primary-200 dark:shadow-none"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-white/20 rounded-md text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                Treino {workout.tipo}
              </span>
            </div>
            <h4 className="text-xl font-bold mb-4">{workout.titulo}</h4>
            
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-bold mb-1 opacity-80 uppercase tracking-wider">
                  <span>Progresso</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-xl group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
            </div>
          </div>
          
          {/* Abstract decoration */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </Link>
      </section>

      {/* 4. Weekly View */}
      <section className="bg-white dark:bg-[#0f1117] rounded-[32px] border border-gray-100 dark:border-[#1e2235] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Frequência Semanal</h3>
          <Link href="/app-aluno/historico" className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">Ver Tudo</Link>
        </div>
        <div className="flex justify-between items-center gap-2 px-1">
          {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, i) => {
            const completed = [0, 2, 4].includes(i); // seg, qua, sex
            const isToday = i === 1; // ter
            return (
              <div key={i} className="flex flex-col items-center gap-3">
                <span className={cn("text-[9px] font-bold", isToday ? "text-primary-600" : "text-gray-400")}>{day}</span>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  completed ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100 dark:shadow-none" : 
                  isToday ? "border-2 border-primary-600 text-primary-600" : "bg-gray-50 dark:bg-gray-800 text-gray-300"
                )}>
                  {completed ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-1 h-1 rounded-full bg-current" />}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Quick Actions */}
      <section className="grid grid-cols-1 gap-3 pb-8">
        <button className="flex items-center justify-between p-5 bg-white dark:bg-[#0f1117] rounded-3xl border border-gray-100 dark:border-[#1e2235] hover:bg-gray-50 transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900 dark:text-white">Histórico de Acessos</p>
              <p className="text-[10px] text-gray-400">Ver suas últimas visitas</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
        </button>
      </section>
    </div>
  );
}
