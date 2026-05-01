'use client';

import React from 'react';
import { TrendingDown, AlertTriangle, ArrowDownRight, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { ChurnDistribution } from '@/types/churn';

/**
 * ChurnCard — Top-level KPI card for churn metrics.
 * 
 * Displays:
 * - Current churn rate (%) with trend indicator
 * - Number of students at risk (alto)
 * - Mini distribution bar (alto/médio/baixo)
 * 
 * Follows the same design system as KPICards (rounded-2xl, shadow-sm, etc.)
 */

interface ChurnCardProps {
  currentRate: number;
  trend: 'up' | 'down';
  change: string;
  atRiskCount: number;
  distribution: ChurnDistribution;
  className?: string;
}

export function ChurnCard({
  currentRate,
  trend,
  change,
  atRiskCount,
  distribution,
  className,
}: ChurnCardProps) {
  // Para o churn, "para baixo" é positivo (bom)
  const isPositive = trend === 'down';

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white dark:bg-[#0f1117] p-6 rounded-2xl border border-gray-100 dark:border-[#1e2235]",
        "shadow-sm hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-red-500/5",
        "transition-all duration-300 group cursor-default animate-slide-up",
        className
      )}
      role="region"
      aria-label={`Taxa de Churn: ${currentRate}%`}
    >
      {/* Background gradient decoration */}
      <div
        className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-red-500/8 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-60 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      />

      {/* Animated pulse ring for high-risk emphasis */}
      <div className="absolute top-4 right-4 w-3 h-3" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 rounded-xl bg-danger-50 dark:bg-red-900/20">
            <ShieldAlert className="w-5 h-5 text-danger-600 dark:text-red-400" />
          </div>
          <div
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
              isPositive
                ? "bg-success-50 dark:bg-green-900/20 text-success-700 dark:text-green-400"
                : "bg-danger-50 dark:bg-red-900/20 text-danger-700 dark:text-red-400"
            )}
          >
            {isPositive ? (
              <ArrowDownRight className="w-3 h-3" />
            ) : (
              <ArrowUpRight className="w-3 h-3" />
            )}
            {change}
          </div>
        </div>

        {/* Main Metric */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
            Churn Preditivo (IA)
          </p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white leading-none tracking-tight">
            {currentRate}%
          </h3>
        </div>

        {/* At Risk Badge */}
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          <span className="text-xs font-bold text-red-600 dark:text-red-400">
            {atRiskCount} aluno{atRiskCount !== 1 ? 's' : ''} em risco alto
          </span>
        </div>

        {/* Mini Distribution Bar */}
        <div className="space-y-2">
          <div className="flex h-2 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
            <div
              className="bg-red-500 transition-all duration-700"
              style={{ width: `${(distribution.alto / distribution.total) * 100}%` }}
              title={`Alto: ${distribution.alto}`}
            />
            <div
              className="bg-amber-400 transition-all duration-700"
              style={{ width: `${(distribution.medio / distribution.total) * 100}%` }}
              title={`Médio: ${distribution.medio}`}
            />
            <div
              className="bg-emerald-400 transition-all duration-700"
              style={{ width: `${(distribution.baixo / distribution.total) * 100}%` }}
              title={`Baixo: ${distribution.baixo}`}
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              Alto ({distribution.alto})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              Médio ({distribution.medio})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              Baixo ({distribution.baixo})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
