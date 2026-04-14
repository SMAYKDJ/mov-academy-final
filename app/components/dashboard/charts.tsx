'use client';

import React from 'react';
import { BarChart, TrendingUp } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { ChartData } from '@/types';

/**
 * Weekly chart visualization using pure CSS bars.
 * Each bar is interactive with hover tooltip and scaling animation.
 */
interface WeeklyChartProps {
  data: ChartData[];
  className?: string;
}

export function WeeklyChart({ data, className }: WeeklyChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className={cn(
      "bg-white dark:bg-[#0f1117] p-6 rounded-2xl border border-gray-100 dark:border-[#1e2235] shadow-sm hover:shadow-md transition-all duration-300",
      className
    )}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white leading-none">Crescimento</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Inscrições semanais</p>
        </div>
        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl">
          <BarChart className="w-4 h-4" />
        </div>
      </div>

      {/* Chart Bars */}
      <div className="h-48 flex items-end gap-2 px-1" role="img" aria-label="Gráfico de inscrições semanais">
        {data.map((item, i) => {
          const height = (item.value / maxValue) * 100;
          return (
            <div key={i} className="flex-1 space-y-2 group cursor-pointer">
              <div
                className={cn(
                  "w-full rounded-t-lg transition-all duration-500 relative",
                  "bg-primary-100 dark:bg-primary-900/30 group-hover:bg-primary-500 dark:group-hover:bg-primary-400",
                  "group-hover:shadow-lg group-hover:shadow-primary-200 dark:group-hover:shadow-none"
                )}
                style={{
                  height: `${height}%`,
                  animationDelay: `${i * 100}ms`,
                }}
              >
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl">
                  {item.value} inscrições
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-white rotate-45" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-4 px-1">
        {data.map((item, i) => (
          <span key={i} className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Retention insight card with gradient background.
 * Acts as a CTA for the retention campaign feature.
 */
export function RetentionInsightCard({ className }: { className?: string }) {
  return (
    <div className={cn(
      "relative bg-gradient-to-br from-primary-600 via-indigo-600 to-purple-700 p-6 rounded-2xl shadow-xl shadow-primary-100 dark:shadow-none overflow-hidden group",
      className
    )}>
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" aria-hidden="true" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Meta Mensal</span>
        </div>

        <h3 className="text-white font-bold text-xl mb-2">97% de Retenção</h3>
        <p className="text-blue-100/80 text-sm leading-relaxed mb-6">
          Estamos a 3% de atingir a meta mensal. Inicie uma campanha de renovação para os alunos em risco!
        </p>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: '97%' }}
              role="progressbar"
              aria-valuenow={97}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progresso da meta de retenção"
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-white/50 font-medium">0%</span>
            <span className="text-[10px] text-white/80 font-bold">97% / 100%</span>
          </div>
        </div>

        <button className="w-full py-3 bg-white text-primary-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-lg">
          Ver Insights Completos
          <TrendingUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
