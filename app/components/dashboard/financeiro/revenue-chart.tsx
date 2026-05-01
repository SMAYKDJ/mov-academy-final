'use client';

import React, { useMemo } from 'react';
import { cn } from '@/utils/cn';
import type { MonthlyRevenue } from '@/types/financeiro';

interface RevenueChartProps {
  data: MonthlyRevenue[];
}

/**
 * Gráfico de barras em CSS puro mostrando receita mensal vs despesas.
 * Nenhuma biblioteca de gráficos externa necessária.
 */
export function RevenueChart({ data }: RevenueChartProps) {
  const maxValue = useMemo(() => {
    return Math.max(...data.flatMap(d => [d.receita, d.despesa]));
  }, [data]);

  const formatCurrency = (val: number) =>
    `R$ ${(val / 1000).toFixed(1)}k`;

  // Totais do mês atual
  const current = data[data.length - 1];
  const prev = data[data.length - 2];
  const revenueChange = prev ? ((current.receita - prev.receita) / prev.receita * 100).toFixed(1) : '0';
  const expenseChange = prev ? ((current.despesa - prev.despesa) / prev.despesa * 100).toFixed(1) : '0';

  return (
    <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Receita vs Despesas</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Últimos 6 meses</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-emerald-500 to-emerald-400" />
            <span className="text-gray-500 dark:text-gray-400 font-medium">Receita</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-red-500 to-rose-400" />
            <span className="text-gray-500 dark:text-gray-400 font-medium">Despesas</span>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="flex items-end gap-3 h-48 md:h-56 mt-4" role="img" aria-label="Gráfico de receita e despesas">
        {data.map((month, idx) => {
          const receitaHeight = (month.receita / maxValue) * 100;
          const despesaHeight = (month.despesa / maxValue) * 100;
          const isLast = idx === data.length - 1;

          return (
            <div key={month.mes} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              {/* Container de Barras */}
              <div className="w-full flex items-end justify-center gap-1.5 h-full px-1">
                
                {/* Barra de receita */}
                <div className="relative flex-1 max-w-[40px] h-full flex flex-col justify-end">
                  <div
                    className={cn(
                      "w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all duration-700 ease-out group-hover:shadow-lg group-hover:-translate-y-1 relative",
                      isLast && "ring-2 ring-emerald-400 dark:ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-[#0f1117]"
                    )}
                    style={{ height: `${receitaHeight}%`, minHeight: '4px' }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20 rounded-t-lg" />
                    
                    {/* Tooltip de Receita */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 pointer-events-none z-20 shadow-xl whitespace-nowrap">
                      +{formatCurrency(month.receita)}
                    </div>
                  </div>
                </div>

                {/* Barra de despesa */}
                <div className="relative flex-1 max-w-[40px] h-full flex flex-col justify-end">
                  <div
                    className={cn(
                      "w-full rounded-t-lg bg-gradient-to-t from-red-600 to-rose-400 transition-all duration-700 ease-out group-hover:shadow-lg group-hover:-translate-y-1 relative",
                      isLast && "ring-2 ring-red-400 dark:ring-red-500 ring-offset-2 ring-offset-white dark:ring-offset-[#0f1117]"
                    )}
                    style={{ height: `${despesaHeight}%`, minHeight: '4px' }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-white/10 rounded-t-lg" />
                    
                    {/* Tooltip de Despesa */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-red-600 text-white text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 pointer-events-none z-20 shadow-xl whitespace-nowrap">
                      -{formatCurrency(month.despesa)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rótulo do mês */}
              <span className={cn(
                "text-[10px] font-black uppercase tracking-tighter mt-2",
                isLast ? "text-primary-600 dark:text-primary-400" : "text-gray-400 dark:text-gray-500"
              )}>
                {month.mes}
              </span>
            </div>
          );
        })}
      </div>

      {/* Linha de resumo */}
      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100 dark:border-[#1e2235]">
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Receita Mês Atual</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            R$ {(current.receita / 1000).toFixed(1)}k
          </p>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-green-400">
            +{revenueChange}% vs mês anterior
          </span>
        </div>
        <div className="h-10 w-px bg-gray-100 dark:bg-[#1e2235]" />
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Despesas Mês Atual</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            R$ {(current.despesa / 1000).toFixed(1)}k
          </p>
          <span className={cn(
            "text-[10px] font-bold",
            Number(expenseChange) > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-green-400"
          )}>
            {Number(expenseChange) > 0 ? '+' : ''}{expenseChange}% vs mês anterior
          </span>
        </div>
        <div className="h-10 w-px bg-gray-100 dark:bg-[#1e2235]" />
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Margem</p>
          <p className={cn(
            "text-lg font-bold",
            current.receita - current.despesa >= 0 ? "text-emerald-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}>
            {((current.receita - current.despesa) / current.receita * 100).toFixed(1)}%
          </p>
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">
            R$ {((current.receita - current.despesa) / 1000).toFixed(1)}k líquido
          </span>
        </div>
      </div>
    </div>
  );
}
