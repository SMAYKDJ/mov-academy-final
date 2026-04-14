'use client';

import React, { useState } from 'react';
import { PieChart, BarChart3 } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { ChurnDistribution } from '@/types/churn';

/**
 * ChurnChart — Donut/Bar distribution chart for risk levels.
 * 
 * Renders a pure-CSS donut chart showing the proportion of
 * Alto / Médio / Baixo risk students, with interactive hover states.
 */

interface ChurnChartProps {
  distribution: ChurnDistribution;
  className?: string;
}

const riskConfig = {
  alto: { label: 'Alto Risco', color: '#ef4444', bgClass: 'bg-red-500' },
  medio: { label: 'Médio Risco', color: '#f59e0b', bgClass: 'bg-amber-400' },
  baixo: { label: 'Baixo Risco', color: '#10b981', bgClass: 'bg-emerald-400' },
};

type ViewMode = 'donut' | 'bar';

export function ChurnChart({ distribution, className }: ChurnChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('donut');
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const total = distribution.total;
  const segments = [
    { key: 'alto', count: distribution.alto, ...riskConfig.alto },
    { key: 'medio', count: distribution.medio, ...riskConfig.medio },
    { key: 'baixo', count: distribution.baixo, ...riskConfig.baixo },
  ];

  // Calculate conic-gradient stops for the donut
  let cumulativePercent = 0;
  const gradientStops = segments.map((seg) => {
    const start = cumulativePercent;
    const percent = (seg.count / total) * 100;
    cumulativePercent += percent;
    return `${seg.color} ${start}% ${cumulativePercent}%`;
  });

  const conicGradient = `conic-gradient(${gradientStops.join(', ')})`;

  return (
    <div
      className={cn(
        "bg-white dark:bg-[#0f1117] p-6 rounded-2xl border border-gray-100 dark:border-[#1e2235] shadow-sm hover:shadow-md transition-all duration-300",
        className
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white leading-none">
            Distribuição de Risco
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Classificação por IA • {total} alunos
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <button
            onClick={() => setViewMode('donut')}
            className={cn(
              "p-1.5 rounded-md transition-all",
              viewMode === 'donut'
                ? "bg-white dark:bg-[#0f1117] shadow-sm text-primary-600 dark:text-primary-400"
                : "text-gray-400 hover:text-gray-600"
            )}
            aria-label="Visualização Donut"
          >
            <PieChart className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('bar')}
            className={cn(
              "p-1.5 rounded-md transition-all",
              viewMode === 'bar'
                ? "bg-white dark:bg-[#0f1117] shadow-sm text-primary-600 dark:text-primary-400"
                : "text-gray-400 hover:text-gray-600"
            )}
            aria-label="Visualização Barras"
          >
            <BarChart3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Donut View */}
      {viewMode === 'donut' && (
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-44 h-44">
            {/* Donut via conic-gradient */}
            <div
              className="w-full h-full rounded-full transition-all duration-700"
              style={{
                background: conicGradient,
                mask: 'radial-gradient(circle at center, transparent 55%, black 56%)',
                WebkitMask: 'radial-gradient(circle at center, transparent 55%, black 56%)',
              }}
              role="img"
              aria-label="Gráfico de distribuição de risco de churn"
            />
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {hoveredSegment
                  ? segments.find((s) => s.key === hoveredSegment)?.count
                  : total}
              </span>
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                {hoveredSegment
                  ? segments.find((s) => s.key === hoveredSegment)?.label
                  : 'Alunos'}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full space-y-2">
            {segments.map((seg) => (
              <div
                key={seg.key}
                className={cn(
                  "flex items-center justify-between p-2.5 rounded-xl transition-all cursor-default",
                  hoveredSegment === seg.key
                    ? "bg-gray-50 dark:bg-gray-800/50"
                    : "hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
                )}
                onMouseEnter={() => setHoveredSegment(seg.key)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn("w-3 h-3 rounded-full", seg.bgClass)} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {seg.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {seg.count}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md">
                    {((seg.count / total) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bar View */}
      {viewMode === 'bar' && (
        <div className="space-y-4">
          {segments.map((seg) => {
            const percent = (seg.count / total) * 100;
            return (
              <div key={seg.key} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2.5 h-2.5 rounded-full", seg.bgClass)} />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {seg.label}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    {seg.count} ({percent.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: seg.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
