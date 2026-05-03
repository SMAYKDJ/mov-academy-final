'use client';

import { Users, DollarSign, TrendingDown, UserPlus, ArrowUpRight, ArrowDownRight, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { KPIStat } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

/**
 * Mapeamento de ícones para os cartões de KPI.
 * Mapeia chaves de string dos dados para componentes de ícones Lucide.
 */
const iconMap = {
  Users,
  DollarSign,
  TrendingDown,
  UserPlus,
  AlertTriangle,
};

/**
 * Configuração de cores para cada tipo de KPI — 
 * usa cores semânticas em vez de misturar vermelho/verde arbitrariamente.
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
  'Alertas de Risco': {
    iconBg: 'bg-red-50 dark:bg-red-900/20',
    iconText: 'text-red-600 dark:text-red-400',
    gradient: 'from-red-500/5 to-transparent',
  },
};

function KPICard({ label, value, change, trend, icon, description }: KPIStat) {
  const Icon = iconMap[icon];
  const isChurn = label.includes('Churn');
  // Para o churn, cair é bom. Para tudo o mais, subir é bom.
  const isPositive = isChurn ? trend === 'down' : trend === 'up';
  const colors = colorConfig[label] || colorConfig['Total Alunos'];
  const router = useRouter();

  const handleDetails = () => {
    if (label === 'Total Alunos') router.push('/alunos');
    if (label === 'Receita Mensal') router.push('/financeiro');
    if (label === 'Taxa de Churn') {
      const el = document.getElementById('churn-analytics');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    if (label === 'Novas Matrículas') router.push('/alunos');
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white dark:bg-[#0f1117] p-6 rounded-2xl border border-gray-100 dark:border-[#1e2235]",
        "shadow-sm hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-primary-500/5",
        "transition-all duration-300 group cursor-pointer"
      )}
      onClick={handleDetails}
      role="button"
      aria-label={`${label}: ${value}`}
    >
      {/* Decoração de gradiente de fundo */}
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
            {trend === 'up'
              ? <ArrowUpRight className="w-3 h-3" />
              : <ArrowDownRight className="w-3 h-3" />
            }
            {change}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">{label}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-none tracking-tight">{value}</h3>
          <div className="flex items-center justify-between mt-2">
            <p className="text-[11px] text-gray-400 dark:text-gray-500">{description}</p>
            <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
              VER MAIS →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Loader skeleton para cartões de KPI — mantém o layout durante a busca de dados.
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
 * Grade de Cartões de KPI com breakpoints responsivos:
 * - xl: 4 colunas
 * - sm: 2 colunas
 * - mobile: 1 coluna
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
