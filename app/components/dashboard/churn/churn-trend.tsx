'use client';

import React from 'react';
import { TrendingDown, TrendingUp, Brain } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { ChurnTrendPoint } from '@/types/churn';

/**
 * ChurnTrend — Line chart showing churn evolution over time.
 * 
 * Renders a pure-CSS/SVG line chart with:
 * - Actual churn rate (solid line)
 * - ML-predicted rate (dashed line)
 * - Interactive data points with tooltips
 * - Gradient fill under the actual line
 */

interface ChurnTrendProps {
  data: ChurnTrendPoint[];
  className?: string;
}

export function ChurnTrend({ data, className }: ChurnTrendProps) {
  if (data.length === 0) return null;

  const allValues = data.flatMap((d) => [d.churnRate, d.predicted]);
  const maxVal = Math.max(...allValues) * 1.2;
  const minVal = 0;

  const chartWidth = 400;
  const chartHeight = 160;
  const padding = { top: 20, right: 20, bottom: 30, left: 0 };
  const plotW = chartWidth - padding.left - padding.right;
  const plotH = chartHeight - padding.top - padding.bottom;

  const xStep = plotW / (data.length - 1);

  const toY = (val: number) => {
    const ratio = (val - minVal) / (maxVal - minVal);
    return padding.top + plotH - ratio * plotH;
  };

  const toX = (i: number) => padding.left + i * xStep;

  // Build SVG path strings
  const actualPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(d.churnRate)}`)
    .join(' ');

  const predictedPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(d.predicted)}`)
    .join(' ');

  // Area fill path (close to bottom)
  const areaPath = `${actualPath} L ${toX(data.length - 1)} ${padding.top + plotH} L ${toX(0)} ${padding.top + plotH} Z`;

  const currentRate = data[data.length - 1]?.churnRate || 0;
  const previousRate = data[data.length - 2]?.churnRate || currentRate;
  const isImproving = currentRate < previousRate;

  return (
    <div
      className={cn(
        "bg-white dark:bg-[#0f1117] p-6 rounded-2xl border border-gray-100 dark:border-[#1e2235] shadow-sm hover:shadow-md transition-all duration-300",
        className
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white leading-none">
            Evolução do Churn
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Últimos 6 meses • Previsão IA
          </p>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
            isImproving
              ? "bg-success-50 dark:bg-green-900/20 text-success-700 dark:text-green-400"
              : "bg-danger-50 dark:bg-red-900/20 text-danger-700 dark:text-red-400"
          )}
        >
          {isImproving ? (
            <TrendingDown className="w-3 h-3" />
          ) : (
            <TrendingUp className="w-3 h-3" />
          )}
          {isImproving ? 'Melhorando' : 'Atenção'}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full" style={{ aspectRatio: `${chartWidth}/${chartHeight}` }}>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full"
          role="img"
          aria-label="Gráfico de evolução do churn"
        >
          <defs>
            <linearGradient id="churnAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => {
            const y = padding.top + (plotH / 4) * i;
            return (
              <line
                key={`grid-${i}`}
                x1={padding.left}
                y1={y}
                x2={padding.left + plotW}
                y2={y}
                stroke="currentColor"
                className="text-gray-100 dark:text-gray-800"
                strokeWidth="0.5"
              />
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="url(#churnAreaGrad)" />

          {/* Predicted line (dashed) */}
          <path
            d={predictedPath}
            fill="none"
            stroke="#818cf8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="opacity-60"
          />

          {/* Actual line */}
          <path
            d={actualPath}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points + Labels */}
          {data.map((d, i) => (
            <g key={i}>
              {/* Actual point */}
              <circle
                cx={toX(i)}
                cy={toY(d.churnRate)}
                r="4"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="2"
                className="dark:stroke-[#0f1117] hover:r-6 transition-all cursor-pointer"
              />
              {/* Predicted point */}
              <circle
                cx={toX(i)}
                cy={toY(d.predicted)}
                r="3"
                fill="#818cf8"
                stroke="#ffffff"
                strokeWidth="1.5"
                className="dark:stroke-[#0f1117] opacity-60"
              />
              {/* Month label */}
              <text
                x={toX(i)}
                y={chartHeight - 5}
                textAnchor="middle"
                className="fill-gray-400 dark:fill-gray-500"
                style={{ fontSize: '10px', fontWeight: 600 }}
              >
                {d.month}
              </text>
              {/* Value label on last point */}
              {i === data.length - 1 && (
                <text
                  x={toX(i) + 5}
                  y={toY(d.churnRate) - 10}
                  className="fill-red-500"
                  style={{ fontSize: '11px', fontWeight: 700 }}
                >
                  {d.churnRate}%
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-red-500 rounded-full" />
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Real
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-indigo-400 rounded-full" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #818cf8 0px, #818cf8 3px, transparent 3px, transparent 6px)' }} />
          <div className="flex items-center gap-1">
            <Brain className="w-3 h-3 text-indigo-400" />
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Predição IA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
