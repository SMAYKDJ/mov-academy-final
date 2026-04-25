'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import type { AlunoStatus, AlunoPlan } from '@/types/aluno';

/* ── Status Badge ────────────────────────────────── */

const statusConfig: Record<AlunoStatus, { label: string; dot: string; bg: string; text: string }> = {
  ativo: {
    label: 'Ativo',
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50 dark:bg-green-900/20 border-emerald-200 dark:border-green-800',
    text: 'text-emerald-700 dark:text-green-400',
  },
  inativo: {
    label: 'Inativo',
    dot: 'bg-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-400',
  },
  pendente: {
    label: 'Pendente',
    dot: 'bg-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-400',
  },
};

interface StatusBadgeProps {
  status: AlunoStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    dot: 'bg-gray-400',
    bg: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800',
    text: 'text-gray-600 dark:text-gray-400',
  };
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      config.bg,
      config.text,
      className
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}

/* ── Plan Badge ──────────────────────────────────── */

const planConfig: Record<string, { bg: string; text: string }> = {
  'Mensal':     { bg: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700', text: 'text-gray-700 dark:text-gray-300' },
  'Trimestral': { bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-400' },
  'Semestral':  { bg: 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800', text: 'text-violet-700 dark:text-violet-400' },
  'Anual':      { bg: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800', text: 'text-teal-700 dark:text-teal-400' },
  'Black VIP':  { bg: 'bg-gray-900 dark:bg-gray-100 border-gray-800 dark:border-gray-300', text: 'text-white dark:text-gray-900' },
};

interface PlanBadgeProps {
  plan: string;
  className?: string;
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  const config = planConfig[plan] || { 
    bg: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800', 
    text: 'text-gray-600 dark:text-gray-400' 
  };
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
      config.bg,
      config.text,
      className
    )}>
      {plan}
    </span>
  );
}

/* ── Risk Indicator ──────────────────────────────── */

interface RiskIndicatorProps {
  risk: number;
  compact?: boolean;
}

export function RiskIndicator({ risk, compact }: RiskIndicatorProps) {
  const color = risk >= 70 ? 'bg-red-500' : risk >= 40 ? 'bg-amber-500' : 'bg-emerald-500';
  const textColor = risk >= 70 ? 'text-red-600 dark:text-red-400' : risk >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400';
  const label = risk >= 70 ? 'Alto' : risk >= 40 ? 'Médio' : 'Baixo';

  if (compact) {
    return (
      <span className={cn("text-[10px] font-bold", textColor)}>
        {risk}%
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className={cn("text-[10px] font-bold uppercase tracking-wider", textColor)}>{label}</span>
        <span className={cn("text-[10px] font-bold", textColor)}>{risk}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `var(--risk-width, ${risk}%)` } as React.CSSProperties}
          role="progressbar"
          {...({
            'aria-valuenow': risk,
            'aria-valuemin': 0,
            'aria-valuemax': 100
          })}
          aria-label={`Risco de churn: ${risk}%`}
        />
      </div>
    </div>
  );
}
