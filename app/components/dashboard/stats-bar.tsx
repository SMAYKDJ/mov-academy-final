'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Barra de estatísticas mostrando dados de resumo rápidos em uma faixa compacta.
 * Útil para métricas secundárias abaixo dos KPIs principais.
 */

interface QuickStat {
  label: string;
  value: string;
  color: string;
}

const quickStats: QuickStat[] = [
  { label: 'Frequência Hoje', value: '312 check-ins', color: 'text-primary-600 dark:text-primary-400' },
  { label: 'Receita Hoje', value: 'R$ 4.820', color: 'text-success-600 dark:text-green-400' },
  { label: 'Alertas Ativos', value: '7 alunos', color: 'text-danger-600 dark:text-red-400' },
  { label: 'Horário de Pico', value: '18h–20h', color: 'text-warning-600 dark:text-amber-400' },
];

interface StatsBarProps {
  stats?: { label: string; value: string; color: string }[];
}

export function StatsBar({ stats }: StatsBarProps) {
  const displayStats = stats || quickStats;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}>
      {displayStats.map((stat, index) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#0f1117] border border-gray-100 dark:border-[#1e2235] rounded-xl hover:shadow-sm transition-all"
        >
          <div className={cn("w-2 h-8 rounded-full", (stat.color || 'bg-primary-600').replace('text-', 'bg-').split(' ')[0])} aria-hidden="true" />
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</p>
            <p className={cn("text-sm font-bold", stat.color || 'text-primary-600')}>{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsBarSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#0f1117] border border-gray-100 dark:border-[#1e2235] rounded-xl">
          <Skeleton className="w-2 h-8 rounded-full" />
          <div>
            <Skeleton className="w-20 h-3 rounded mb-1.5" />
            <Skeleton className="w-16 h-4 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
