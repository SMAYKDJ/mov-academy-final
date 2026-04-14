'use client';

import React, { useMemo } from 'react';
import { cn } from '@/utils/cn';
import type { Transaction, ExpenseCategory } from '@/types/financeiro';

interface ExpenseBreakdownProps {
  transacoes: Transaction[];
}

const categoryConfig: Record<ExpenseCategory, { label: string; color: string; bgColor: string }> = {
  salario:      { label: 'Salários',     color: 'bg-blue-500',    bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  aluguel:      { label: 'Aluguel',      color: 'bg-violet-500',  bgColor: 'bg-violet-50 dark:bg-violet-900/20' },
  agua_luz:     { label: 'Água e Luz',   color: 'bg-amber-500',   bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
  marketing:    { label: 'Marketing',    color: 'bg-pink-500',    bgColor: 'bg-pink-50 dark:bg-pink-900/20' },
  manutencao:   { label: 'Manutenção',   color: 'bg-orange-500',  bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
  equipamento:  { label: 'Equipamentos', color: 'bg-teal-500',    bgColor: 'bg-teal-50 dark:bg-teal-900/20' },
  sistema:      { label: 'Sistemas',     color: 'bg-indigo-500',  bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
  outros:       { label: 'Outros',       color: 'bg-gray-500',    bgColor: 'bg-gray-50 dark:bg-gray-800/50' },
};

/**
 * Expense breakdown by category with horizontal bar visualization.
 * Calculates percentages from actual transaction data.
 */
export function ExpenseBreakdown({ transacoes }: ExpenseBreakdownProps) {
  const breakdown = useMemo(() => {
    const despesas = transacoes.filter(t => t.tipo === 'despesa');
    const total = despesas.reduce((sum, t) => sum + t.valor, 0);

    // Group by category
    const grouped = despesas.reduce((acc, t) => {
      const cat = t.categoria as ExpenseCategory;
      if (!acc[cat]) acc[cat] = 0;
      acc[cat] += t.valor;
      return acc;
    }, {} as Record<string, number>);

    // Sort by value descending
    return Object.entries(grouped)
      .map(([key, value]) => ({
        category: key as ExpenseCategory,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transacoes]);

  const totalDespesas = breakdown.reduce((sum, b) => sum + b.value, 0);

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Despesas por Categoria</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Distribuição do mês atual</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Total</p>
          <p className="text-base font-bold text-gray-900 dark:text-white">{formatCurrency(totalDespesas)}</p>
        </div>
      </div>

      {/* Stacked progress bar */}
      <div className="flex h-3 rounded-full overflow-hidden mb-5 bg-gray-100 dark:bg-gray-800">
        {breakdown.map((item) => {
          const config = categoryConfig[item.category];
          return (
            <div
              key={item.category}
              className={cn("h-full transition-all duration-700", config?.color || 'bg-gray-400')}
              style={{ width: `${item.percentage}%` }}
              title={`${config?.label}: ${formatCurrency(item.value)} (${item.percentage.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      {/* Category list */}
      <div className="space-y-3">
        {breakdown.map((item) => {
          const config = categoryConfig[item.category];
          if (!config) return null;

          return (
            <div key={item.category} className="flex items-center gap-3 group">
              {/* Color dot */}
              <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", config.color)} />

              {/* Label */}
              <span className="text-sm text-gray-600 dark:text-gray-400 flex-1 font-medium">
                {config.label}
              </span>

              {/* Bar */}
              <div className="hidden sm:block w-24 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-700", config.color)}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              {/* Value */}
              <span className="text-sm font-bold text-gray-900 dark:text-white min-w-[90px] text-right">
                {formatCurrency(item.value)}
              </span>

              {/* Percentage */}
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 min-w-[40px] text-right">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
