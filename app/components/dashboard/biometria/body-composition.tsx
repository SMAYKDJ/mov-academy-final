'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import type { BiometriaKPIData } from '@/types/biometria';
import { Droplets, Dumbbell, Bone, Zap } from 'lucide-react';

interface BodyCompositionProps {
  stats: BiometriaKPIData;
}

/**
 * Visual body composition breakdown with ring charts and macro-display.
 */
export function BodyComposition({ stats }: BodyCompositionProps) {
  const agua = 100 - stats.gorduraAtual - stats.massaMuscularAtual - 15; // approx water + organs
  const ossos = 15; // approx

  const segments = [
    { label: 'Gordura', value: stats.gorduraAtual, color: '#f97316', icon: Droplets },
    { label: 'Massa Muscular', value: stats.massaMuscularAtual, color: '#22c55e', icon: Dumbbell },
    { label: 'Água + Vísceras', value: agua > 0 ? parseFloat(agua.toFixed(1)) : 28, color: '#3b82f6', icon: Zap },
    { label: 'Massa Óssea', value: ossos, color: '#a78bfa', icon: Bone },
  ];

  const total = segments.reduce((sum, s) => sum + s.value, 0);

  // Ring chart calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Composição Corporal</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Distribuição de massa atual</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* Ring Chart */}
        <div className="relative flex-shrink-0">
          <svg viewBox="0 0 180 180" className="w-44 h-44 -rotate-90">
            {/* Background ring */}
            <circle cx="90" cy="90" r={radius} fill="none" stroke="#f1f5f9" className="dark:stroke-gray-800" strokeWidth="16" />

            {/* Segments */}
            {segments.map((seg, idx) => {
              const segLength = (seg.value / total) * circumference;
              const offset = circumference - accumulatedOffset;
              accumulatedOffset += segLength;

              return (
                <circle
                  key={seg.label}
                  cx="90" cy="90" r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="16"
                  strokeDasharray={`${segLength} ${circumference - segLength}`}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              );
            })}
          </svg>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-gray-900 dark:text-white">{stats.pesoAtual}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">kg</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-3">
          {segments.map(seg => {
            const pct = ((seg.value / total) * 100).toFixed(1);
            return (
              <div key={seg.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${seg.color}15` }}>
                  <seg.icon className="w-4 h-4" style={{ color: seg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{seg.label}</span>
                    <span className="text-xs font-bold" style={{ color: seg.color }}>{seg.value}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${pct}%`, background: seg.color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
