'use client';

import React, { useMemo } from 'react';
import { cn } from '@/utils/cn';
import type { RetentionData } from '@/types/relatorios';

interface RetentionChartProps {
  data: RetentionData[];
}

/**
 * Visualização para taxas de retenção e churn de alunos ao longo do tempo.
 * Usa linhas e barras em CSS puro.
 */
export function RetentionChart({ data }: RetentionChartProps) {
  // Calcular churn médio
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

      <div className="flex items-end justify-between gap-3 h-48 mb-6 mt-4 px-2">
        {data.map((item, idx) => {
          // Escala dinâmica: 80% é a base (altura 0), 100% é a altura total.
          // Isso torna pequenas variações (95% vs 98%) muito mais visíveis.
          const displayHeight = Math.max(5, (item.taxaRetencao - 80) * 5); 
          const isPositive = idx === 0 || item.taxaRetencao >= data[idx - 1].taxaRetencao;

          return (
            <div key={item.mes} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                {/* Rótulo de Valor de Dados */}
                <span className="absolute -top-6 text-[10px] font-black text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.taxaRetencao}%
                </span>

                {/* Barra de retenção */}
                <div 
                  className={cn(
                    "w-full rounded-t-xl transition-all duration-700 relative shadow-sm group-hover:shadow-md group-hover:-translate-y-1",
                    isPositive 
                      ? "bg-gradient-to-t from-primary-600 to-primary-400" 
                      : "bg-gradient-to-t from-primary-500 to-primary-300 opacity-80"
                  )}
                  style={{ height: `${displayHeight}%` }}
                >
                  {/* Destaque tipo vidro (Glass) */}
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20 rounded-t-xl" />
                  
                  {/* Tooltip */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 pointer-events-none z-20 shadow-2xl whitespace-nowrap">
                    <p className="flex justify-between gap-4"><span>Retenção:</span> <span>{item.taxaRetencao}%</span></p>
                    <p className="flex justify-between gap-4"><span>Engajamento:</span> <span>{item.engajamento}%</span></p>
                    <p className="flex justify-between gap-4 text-primary-400 dark:text-primary-600"><span>Churn:</span> <span>{item.churn}%</span></p>
                  </div>
                </div>
              
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-3 uppercase tracking-tighter">
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
