'use client';

import React from 'react';
import { Dumbbell, Calendar, Target, TrendingUp, Zap, Trophy } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { TreinosKPIData } from '@/types/treinos';

interface TreinosKPIProps {
  stats: TreinosKPIData;
}

export function TreinosKPI({ stats }: TreinosKPIProps) {
  // XP progress to next level
  const xpForNextLevel = (stats.nivel + 1) * 550;
  const xpProgress = ((stats.xpTotal % 550) / 550) * 100;

  const cards = [
    {
      id: 'total',
      label: 'Treinos Totais',
      value: stats.totalTreinos.toString(),
      icon: Dumbbell,
      change: '+12 este mês',
      color: 'from-primary-500 to-indigo-600',
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      text: 'text-primary-600 dark:text-primary-400',
    },
    {
      id: 'freq',
      label: 'Frequência Semanal',
      value: `${stats.frequenciaSemanal}x`,
      icon: Calendar,
      change: 'Média últimas 4 semanas',
      color: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50 dark:bg-green-900/20',
      text: 'text-emerald-600 dark:text-green-400',
    },
    {
      id: 'muscle',
      label: 'Mais Treinado',
      value: stats.musculoMaisTreinado,
      icon: Target,
      change: '20 séries/semana',
      color: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-600 dark:text-amber-400',
    },
    {
      id: 'evolucao',
      label: 'Evolução',
      value: `+${stats.evolucao}%`,
      icon: TrendingUp,
      change: 'Carga média vs mês anterior',
      color: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      text: 'text-violet-600 dark:text-violet-400',
    },
  ];

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="bg-white dark:bg-[#0f1117] rounded-2xl p-5 border border-gray-100 dark:border-[#1e2235] hover:shadow-lg transition-all group relative overflow-hidden"
          >
            <div className={cn("absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r", card.color)} />
            <div className="flex items-center justify-between mb-3">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", card.bg)}>
                <card.icon className={cn("w-4 h-4", card.text)} />
              </div>
            </div>
            <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-0.5">{card.label}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{card.value}</p>
            <p className="text-[10px] text-gray-400 mt-1">{card.change}</p>
          </div>
        ))}
      </div>

      {/* XP / Gamification Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-[#0f1117] dark:to-[#1a1d27] rounded-2xl p-5 border border-gray-700 dark:border-[#2d3348] flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Nível Atual</p>
            <p className="text-2xl font-black text-white">{stats.nivel}</p>
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <Zap className="w-3 h-3 inline mr-1 text-amber-400" />
              {stats.xpTotal.toLocaleString()} XP
            </span>
            <span className="text-[10px] font-bold text-gray-500">
              {xpForNextLevel.toLocaleString()} XP para nível {stats.nivel + 1}
            </span>
          </div>
          <div className="h-3 bg-gray-700 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
