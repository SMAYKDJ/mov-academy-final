'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import type { EvolutionPoint } from '@/types/biometria';

interface BiometriaChartProps {
  data: EvolutionPoint[];
}

type MetricKey = 'peso' | 'gordura' | 'massaMuscular';

const metricConfig: Record<MetricKey, { label: string; unit: string; color: string; gradient: string }> = {
  peso: { label: 'Peso', unit: 'kg', color: '#6366f1', gradient: 'from-primary-500 to-indigo-600' },
  gordura: { label: 'Gordura', unit: '%', color: '#f97316', gradient: 'from-amber-500 to-orange-600' },
  massaMuscular: { label: 'Massa Muscular', unit: '%', color: '#22c55e', gradient: 'from-emerald-500 to-teal-600' },
};

/**
 * Gráfico de evolução multimétrica renderizado com CSS puro.
 * Inclui visualização em estilo de linha com pontos e área preenchida.
 */
export function BiometriaChart({ data }: BiometriaChartProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('peso');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const config = metricConfig[activeMetric];
  const values = data.map(d => d[activeMetric]);
  const minVal = Math.min(...values) * 0.95;
  const maxVal = Math.max(...values) * 1.02;
  const range = maxVal - minVal || 1;

  const getHeight = (val: number) => ((val - minVal) / range) * 100;

  // Calcular tendência
  const firstVal = values[0];
  const lastVal = values[values.length - 1];
  const trendPercent = (((lastVal - firstVal) / firstVal) * 100).toFixed(1);
  const trendPositive = activeMetric === 'massaMuscular' ? lastVal > firstVal : lastVal < firstVal;

  return (
    <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Evolução Corporal</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Últimos 6 meses de acompanhamento</p>
        </div>
        {/* Abas de Métricas */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1a1d27] rounded-xl p-1">
          {(Object.keys(metricConfig) as MetricKey[]).map(key => (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                activeMetric === key
                  ? "bg-white dark:bg-[#0f1117] text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              {metricConfig[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Resumo */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{lastVal}<span className="text-sm font-medium text-gray-400 ml-1">{config.unit}</span></p>
          <p className="text-xs text-gray-400">Atual</p>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-bold",
          trendPositive ? "bg-emerald-50 dark:bg-green-900/20 text-emerald-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
        )}>
          {trendPositive ? '↑' : '↓'} {trendPercent}%
        </div>
      </div>

      {/* Área do Gráfico */}
      <div className="relative h-56 flex items-end gap-1">
        {/* Rótulos do eixo Y */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[9px] font-bold text-gray-300 dark:text-gray-600 -ml-1 w-10" aria-hidden="true">
          <span>{maxVal.toFixed(1)}</span>
          <span>{((maxVal + minVal) / 2).toFixed(1)}</span>
          <span>{minVal.toFixed(1)}</span>
        </div>

        {/* Linhas de grade */}
        <div className="absolute inset-0 ml-12 flex flex-col justify-between" aria-hidden="true">
          {[0, 1, 2].map(i => (
            <div key={i} className="border-b border-dashed border-gray-100 dark:border-[#1e2235]" />
          ))}
        </div>

        {/* Barras + Pontos */}
        <div className="flex-1 flex items-end justify-between gap-2 ml-12 relative">
          {data.map((point, idx) => {
            const height = getHeight(point[activeMetric]);
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={point.data}
                className="flex-1 flex flex-col items-center group relative cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-10 animate-scale-in">
                    {point[activeMetric]} {config.unit}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-white rotate-45" />
                  </div>
                )}

                {/* Barra */}
                <div className="w-full relative" style={{ height: '200px' }}>
                  <div className="absolute bottom-0 w-full h-full flex flex-col items-center justify-end">
                    {/* Ponto */}
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full border-2 border-white dark:border-[#0f1117] z-10 transition-transform",
                        isHovered && "scale-150"
                      )}
                      style={{ background: config.color, marginBottom: '-6px' }}
                    />
                    {/* Preenchimento da barra */}
                    <div
                      className="w-full rounded-t-lg transition-all duration-700"
                      style={{
                        height: `${height}%`,
                        background: `linear-gradient(to top, ${config.color}15, ${config.color}40)`,
                        borderTop: `3px solid ${config.color}`,
                      }}
                    />
                  </div>
                </div>

                {/* Rótulo do eixo X */}
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-3 uppercase tracking-wider">
                  {point.data}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
