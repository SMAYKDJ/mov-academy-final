'use client';

import React from 'react';
import { Target, Users2, TrendingUp, HandCoins, CalendarClock } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { BIStats } from '@/types/relatorios';

interface BIOverviewKPIProps {
  stats: BIStats;
}

export function BIOverviewKPI({ stats }: BIOverviewKPIProps) {
  const cards = [
    {
      label: 'Taxa de Churn',
      value: `${stats.churnRate}%`,
      sub: 'vs 2.8% mês ant.',
      trend: 'down', // cair é bom para o churn
      icon: Users2,
      color: 'text-emerald-600 dark:text-green-400',
      bg: 'bg-emerald-50 dark:bg-green-900/20',
    },
    {
      label: 'Crescimento',
      value: `+${stats.growthRate}%`,
      sub: 'Mês atual',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-primary-600 dark:text-primary-400',
      bg: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      label: 'Ticket Médio (LTV)',
      value: stats.lifetimeValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      sub: 'Vida útil do aluno',
      trend: 'up',
      icon: HandCoins,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      label: 'Permanência Média',
      value: `${stats.avgRetentionMonths} meses`,
      sub: 'Retenção média',
      trend: 'up',
      icon: CalendarClock,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div 
          key={card.label}
          className="bg-white dark:bg-[#0f1117] p-5 rounded-2xl border border-gray-100 dark:border-[#1e2235] hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", card.bg)}>
              <card.icon className={cn("w-5 h-5", card.color)} />
            </div>
            {card.trend && (
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full",
                (card.trend === 'up' && card.label !== 'Taxa de Churn') || (card.trend === 'down' && card.label === 'Taxa de Churn')
                  ? "bg-emerald-50 dark:bg-green-900/20 text-emerald-700 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
              )}>
                {card.trend === 'up' ? '↑' : '↓'} Estável
              </span>
            )}
          </div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-0.5">
            {card.label}
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {card.value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {card.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
