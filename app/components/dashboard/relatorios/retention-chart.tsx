'use client';

import React, { useMemo } from 'react';
import { cn } from '@/utils/cn';
import type { RetentionData } from '@/types/relatorios';

interface RetentionChartProps {
  data: RetentionData[];
}

/**
 * Visualization for student retention and churn rates over time.
 * Uses pure CSS lines and bars.
 */
export function RetentionChart({ data }: RetentionChartProps) {
  // Calculate average churn
  const avgChurn = useMemo(() => {
    return (data.reduce((sum, d) => sum + d.churn, 0) / data.length).toFixed(1);
  }, [data]);

  return (
    <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] p-6 h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Taxa de Retenção</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Engajamento de alunos por mês</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Churn Médio</p>
          <p className="text-lg font-bold text-danger-600 dark:text-red-400">{avgChurn}%</p>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 h-48 mb-4">
        {data.map((item, idx) => {
          const height = (item.taxaRetencao - 80) * 5; // Scale for 80-100% display
          const isPositive = idx === 0 || item.taxaRetencao >= data[idx - 1].taxaRetencao;

          return (
            <div key={item.mes} className="flex-1 flex flex-col items-center group relative">
                {/* Retention bar */}
                <div 
                  className={cn(
                    "w-full rounded-t-lg transition-all duration-500 relative",
                    isPositive 
                      ? "bg-gradient-to-t from-emerald-500 to-emerald-400" 
                      : "bg-gradient-to-t from-amber-500 to-amber-400"
                  )}
                  style={{ height: `${item.taxaRetencao}%`, minHeight: '5%' }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                    Retenção: {item.taxaRetencao}%
                    <br />
                    Engajamento: {item.engajamento}%
                    <br />
                    Churn: {item.churn}%
                  </div>
                </div>
              
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-3 uppercase tracking-wider">
                {item.mes}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50 dark:border-[#1e2235]">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Meta de Retenção</p>
          <p className="text-sm font-bold text-emerald-600 dark:text-green-400">98.0%</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Status Atual</p>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-sm font-bold text-gray-900 dark:text-white">Dentro da meta</p>
          </div>
        </div>
      </div>
    </div>
  );
}
