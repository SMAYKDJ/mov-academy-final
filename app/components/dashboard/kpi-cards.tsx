'use client';

import { Users, DollarSign, TrendingDown, UserPlus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { KPIStat } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Icon mapping for KPI cards.
 * Maps string keys from data to Lucide icon components.
 */
const iconMap = {
  Users,
  DollarSign,
  TrendingDown,
  UserPlus,
};

/**
 * Color configuration for each KPI type — 
 * uses semantic colors instead of mixing red/green arbitrarily.
 */
const colorConfig: Record<string, {
  iconBg: string;
  iconText: string;
  gradient: string;
}> = {
  'Total Alunos': {
    iconBg: 'bg-primary-50 dark:bg-primary-900/20',
    iconText: 'text-primary-600 dark:text-primary-400',
    gradient: 'from-primary-500/5 to-transparent',
  },
  'Receita Mensal': {
    iconBg: 'bg-success-50 dark:bg-green-900/20',
    iconText: 'text-success-600 dark:text-green-400',
    gradient: 'from-success-500/5 to-transparent',
  },
  'Taxa de Churn': {
    iconBg: 'bg-danger-50 dark:bg-red-900/20',
    iconText: 'text-danger-600 dark:text-red-400',
    gradient: 'from-danger-500/5 to-transparent',
  },
  'Novas Matrículas': {
    iconBg: 'bg-warning-50 dark:bg-amber-900/20',
    iconText: 'text-warning-600 dark:text-amber-400',
    gradient: 'from-warning-500/5 to-transparent',
  },
};

function KPICard({ label, value, change, trend, icon, description }: KPIStat) {
  const Icon = iconMap[icon];
  const isChurn = label.includes('Churn');
  // For churn, down is good. For everything else, up is good.
  const isPositive = isChurn ? trend === 'down' : trend === 'up';
  const colors = colorConfig[label] || colorConfig['Total Alunos'];

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white dark:bg-[#0f1117] p-6 rounded-2xl border border-gray-100 dark:border-[#1e2235]",
        "shadow-sm hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-primary-500/5",
        "transition-all duration-300 group cursor-default"
      )}
      role="region"
      aria-label={`${label}: ${value}`}
    >
      {/* Background gradient decoration */}
      <div className={cn(
        "absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl rounded-full -translate-y-1/2 translate-x-1/2 opacity-60 group-hover:opacity-100 transition-opacity",
        colors.gradient
      )} aria-hidden="true" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={cn("p-2.5 rounded-xl", colors.iconBg)}>
            <Icon className={cn("w-5 h-5", colors.iconText)} />
          </div>
          <div className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
            isPositive
              ? "bg-success-50 dark:bg-green-900/20 text-success-700 dark:text-green-400"
              : "bg-danger-50 dark:bg-red-900/20 text-danger-700 dark:text-red-400"
          )}>
            {isPositive
              ? <ArrowUpRight className="w-3 h-3" />
              : <ArrowDownRight className="w-3 h-3" />
            }
            {change}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">{label}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-none tracking-tight">{value}</h3>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">{description}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for KPI cards — maintains layout during data fetch.
 */
export function KPICardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6" aria-label="Carregando indicadores">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-[#0f1117] p-6 rounded-2xl border border-gray-100 dark:border-[#1e2235]">
          <div className="flex justify-between items-start mb-4">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="w-16 h-6 rounded-lg" />
          </div>
          <Skeleton className="w-24 h-3 rounded mb-2" />
          <Skeleton className="w-20 h-7 rounded" />
          <Skeleton className="w-28 h-3 rounded mt-3" />
        </div>
      ))}
    </div>
  );
}

/**
 * KPI Cards grid with responsive breakpoints:
 * - xl: 4 columns
 * - sm: 2 columns
 * - mobile: 1 column
 */
export function KPICards({ stats }: { stats: KPIStat[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
        >
          <KPICard {...stat} />
        </div>
      ))}
    </div>
  );
}
