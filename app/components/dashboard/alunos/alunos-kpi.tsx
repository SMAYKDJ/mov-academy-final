'use client';

import React from 'react';
import { Users, UserCheck, UserX, UserPlus, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Skeleton } from '@/components/ui/skeleton';
import type { Aluno } from '@/types/aluno';

interface AlunosKPIProps {
  alunos: Aluno[];
  loading?: boolean;
}

export function AlunosKPI({ alunos, loading }: AlunosKPIProps) {
  const total = alunos.length;
  const ativos = alunos.filter(a => a.status === 'ativo').length;
  const inativos = alunos.filter(a => a.status === 'inativo').length;
  const pendentes = alunos.filter(a => a.status === 'pendente').length;
  // "novos no mês" — simulated: students enrolled in last 30 days (matching '2026')
  const novos = alunos.filter(a => {
    const parts = a.dataMatricula.split('/');
    if (parts.length !== 3) return false;
    const year = parseInt(parts[2]);
    const month = parseInt(parts[1]);
    return year >= 2026 && month >= 1;
  }).length;

  const cards = [
    {
      id: 'total',
      label: 'Total de Alunos',
      value: total,
      icon: Users,
      change: '+12.5%',
      trend: 'up' as const,
      color: 'from-primary-500 to-primary-600',
      bgLight: 'bg-primary-50 dark:bg-primary-900/20',
      textColor: 'text-primary-600 dark:text-primary-400',
    },
    {
      id: 'ativos',
      label: 'Alunos Ativos',
      value: ativos,
      icon: UserCheck,
      change: '+8.3%',
      trend: 'up' as const,
      color: 'from-success-500 to-emerald-600',
      bgLight: 'bg-success-50 dark:bg-green-900/20',
      textColor: 'text-success-600 dark:text-green-400',
    },
    {
      id: 'inativos',
      label: 'Inativos',
      value: inativos,
      icon: UserX,
      change: '-2.1%',
      trend: 'down' as const,
      color: 'from-danger-500 to-red-600',
      bgLight: 'bg-danger-50 dark:bg-red-900/20',
      textColor: 'text-danger-600 dark:text-red-400',
    },
    {
      id: 'novos',
      label: 'Novos no Mês',
      value: novos,
      icon: UserPlus,
      change: '+24%',
      trend: 'up' as const,
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-warning-50 dark:bg-amber-900/20',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" role="status" aria-label="Carregando métricas">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white dark:bg-[#0f1117] rounded-2xl p-6 border border-gray-100 dark:border-[#1e2235]">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="w-11 h-11 rounded-xl" />
              <Skeleton className="w-16 h-5 rounded-full" />
            </div>
            <Skeleton className="w-20 h-4 mb-2" />
            <Skeleton className="w-16 h-8" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" role="region" aria-label="Métricas de alunos">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="bg-white dark:bg-[#0f1117] rounded-2xl p-6 border border-gray-100 dark:border-[#1e2235] hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-none transition-all duration-300 group relative overflow-hidden"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Gradient decoration */}
          <div className={cn("absolute top-0 left-0 w-1 h-full bg-gradient-to-b rounded-r-full", card.color)} />

          <div className="flex items-center justify-between mb-4">
            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", card.bgLight)}>
              <card.icon className={cn("w-5 h-5", card.textColor)} />
            </div>
            <span className={cn(
              "flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full",
              card.trend === 'up'
                ? "bg-success-50 dark:bg-green-900/20 text-success-700 dark:text-green-400"
                : "bg-danger-50 dark:bg-red-900/20 text-danger-700 dark:text-red-400"
            )}>
              {card.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {card.change}
            </span>
          </div>

          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1">
            {card.label}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {card.value.toLocaleString('pt-BR')}
          </p>
        </div>
      ))}
    </div>
  );
}
