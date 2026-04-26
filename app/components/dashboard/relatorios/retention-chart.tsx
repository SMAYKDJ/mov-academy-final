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

      <div className="relative h-64 mb-4 mt-4">
        {/* SVG for Engagement Line (Dashed) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" preserveAspectRatio="none">
          <path
            d={data.map((item, idx) => {
              const x = (idx * (100 / (data.length - 1))) + '%';
              // Scale engagement (0-100) to height (0-100)
              const y = (100 - (item.engajamento || 50)) + '%';
              return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="opacity-40"
          />
        </svg>

        {/* Bars Container */}
        <div className="flex items-end justify-between gap-3 h-full relative z-0">
          {data.map((item, idx) => {
            // Scale: 80% -> 0% height, 100% -> 100% height
            const barHeight = Math.max(10, (item.taxaRetencao - 70) * 3.33); 
            const isPositive = idx === 0 || item.taxaRetencao >= data[idx - 1].taxaRetencao;

            return (
              <div key={item.mes} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                {/* Value Label */}
                <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded shadow-sm border border-gray-100 dark:border-gray-700">
                  {item.taxaRetencao}%
                </span>

                {/* Retention bar */}
                <div 
                  className={cn(
                    "w-full rounded-t-xl transition-all duration-700 relative shadow-sm group-hover:shadow-lg",
                    isPositive 
                      ? "bg-gradient-to-t from-emerald-500 to-emerald-400" 
                      : "bg-gradient-to-t from-amber-500 to-amber-400"
                  )}
                  style={{ height: `${barHeight}%` }}
                >
                  {/* Internal Glow */}
                  <div className="absolute inset-0 bg-white/20 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Tooltip */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 shadow-2xl pointer-events-none border border-gray-100 dark:border-none">
                    <p className="flex justify-between gap-4"><span>Retenção:</span> <span className="text-emerald-400 dark:text-emerald-600">{item.taxaRetencao}%</span></p>
                    <p className="flex justify-between gap-4"><span>Engajamento:</span> <span className="text-indigo-400 dark:text-indigo-600">{item.engajamento}%</span></p>
                    <p className="flex justify-between gap-4"><span>Churn:</span> <span className="text-red-400 dark:text-red-600">{item.churn}%</span></p>
                  </div>
                </div>
                
                {/* Month Label */}
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-4 uppercase tracking-widest">
                  {item.mes}
                </span>
              </div>
            );
          })}
        </div>
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
