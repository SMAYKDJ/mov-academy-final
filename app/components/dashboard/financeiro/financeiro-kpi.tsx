'use client';

import React, { useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Receipt, PiggyBank } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Transaction } from '@/types/financeiro';

interface FinanceiroKPIProps {
  transacoes: Transaction[];
}

export function FinanceiroKPI({ transacoes }: FinanceiroKPIProps) {
  const kpis = useMemo(() => {
    const receitas = transacoes.filter(t => t.tipo === 'receita');
    const despesas = transacoes.filter(t => t.tipo === 'despesa');

    const receitaTotal = receitas.reduce((sum, t) => sum + t.valor, 0);
    const despesaTotal = despesas.reduce((sum, t) => sum + t.valor, 0);
    const lucro = receitaTotal - despesaTotal;
    const inadimplentes = receitas.filter(t => t.status === 'atrasado' || t.status === 'pendente');
    const inadimplenciaTotal = inadimplentes.reduce((sum, t) => sum + t.valor, 0);
    const receitasPagas = receitas.filter(t => t.status === 'pago');
    const ticketMedio = receitasPagas.length > 0
      ? receitasPagas.reduce((sum, t) => sum + t.valor, 0) / receitasPagas.length
      : 0;

    return {
      receitaTotal,
      despesaTotal,
      lucro,
      inadimplenciaTotal,
      ticketMedio,
      totalTransacoes: transacoes.length,
    };
  }, [transacoes]);

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const cards = [
    {
      id: 'receita',
      label: 'Receita Total',
      value: formatCurrency(kpis.receitaTotal),
      icon: TrendingUp,
      change: '+15.2%',
      trend: 'up' as const,
      color: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50 dark:bg-green-900/20',
      textColor: 'text-emerald-600 dark:text-green-400',
    },
    {
      id: 'despesa',
      label: 'Despesas',
      value: formatCurrency(kpis.despesaTotal),
      icon: TrendingDown,
      change: '-3.8%',
      trend: 'down' as const,
      color: 'from-red-500 to-rose-600',
      bgLight: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400',
    },
    {
      id: 'lucro',
      label: 'Lucro Líquido',
      value: formatCurrency(kpis.lucro),
      icon: PiggyBank,
      change: kpis.lucro >= 0 ? '+22%' : '-12%',
      trend: kpis.lucro >= 0 ? 'up' as const : 'down' as const,
      color: 'from-primary-500 to-indigo-600',
      bgLight: 'bg-primary-50 dark:bg-primary-900/20',
      textColor: 'text-primary-600 dark:text-primary-400',
    },
    {
      id: 'inadimplencia',
      label: 'Inadimplência',
      value: formatCurrency(kpis.inadimplenciaTotal),
      icon: AlertTriangle,
      change: `${((kpis.inadimplenciaTotal / (kpis.receitaTotal || 1)) * 100).toFixed(1)}%`,
      trend: 'down' as const,
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      id: 'ticket',
      label: 'Ticket Médio',
      value: formatCurrency(kpis.ticketMedio),
      icon: Receipt,
      change: '+8.5%',
      trend: 'up' as const,
      color: 'from-violet-500 to-purple-600',
      bgLight: 'bg-violet-50 dark:bg-violet-900/20',
      textColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      id: 'transacoes',
      label: 'Transações',
      value: kpis.totalTransacoes.toString(),
      icon: DollarSign,
      change: '+12',
      trend: 'up' as const,
      color: 'from-sky-500 to-blue-600',
      bgLight: 'bg-sky-50 dark:bg-blue-900/20',
      textColor: 'text-sky-600 dark:text-blue-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4" role="region" aria-label="Métricas financeiras">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="bg-white dark:bg-[#0f1117] rounded-2xl p-5 border border-gray-100 dark:border-[#1e2235] hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-none transition-all duration-300 group relative overflow-hidden"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          {/* Barra de gradiente */}
          <div className={cn("absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r", card.color)} />

          <div className="flex items-center justify-between mb-3">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", card.bgLight)}>
              <card.icon className={cn("w-4 h-4", card.textColor)} />
            </div>
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full",
              card.trend === 'up'
                ? "bg-emerald-50 dark:bg-green-900/20 text-emerald-700 dark:text-green-400"
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
            )}>
              {card.change}
            </span>
          </div>

          <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-0.5">
            {card.label}
          </p>
          <p className={cn(
            "font-bold text-gray-900 dark:text-white tracking-tight",
            card.value.length > 12 ? "text-base" : "text-lg"
          )}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
