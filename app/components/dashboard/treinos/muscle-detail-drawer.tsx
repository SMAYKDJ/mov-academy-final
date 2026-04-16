'use client';

import React, { useEffect, useRef } from 'react';
import { X, Dumbbell, TrendingUp, BarChart3 } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { MuscleData, MuscleGroup } from '@/types/treinos';

interface MuscleDetailDrawerProps {
  muscle: MuscleData | null;
  open: boolean;
  onClose: () => void;
}

const labelMap: Record<MuscleGroup, string> = {
  peito: 'Peito', costas: 'Costas', ombros: 'Ombros', biceps: 'Bíceps',
  triceps: 'Tríceps', abdomen: 'Abdômen', quadriceps: 'Quadríceps',
  posterior: 'Posterior', panturrilha: 'Panturrilha', gluteos: 'Glúteos',
  antebraco: 'Antebraço', trapezio: 'Trapézio',
};

const getIntensityColor = (val: number) => {
  if (val >= 80) return '#ef4444';
  if (val >= 60) return '#f97316';
  if (val >= 40) return '#22c55e';
  if (val >= 20) return '#3b82f6';
  return '#d1d5db';
};

const getIntensityLabel = (val: number) => {
  if (val >= 80) return 'Sobrecarga';
  if (val >= 60) return 'Intenso';
  if (val >= 40) return 'Moderado';
  if (val >= 20) return 'Leve';
  return 'Não treinado';
};

/**
 * Drawer showing detailed info about a specific muscle group.
 * Opened when clicking a muscle on the BodyProgress SVG.
 */
export function MuscleDetailDrawer({ muscle, open, onClose }: MuscleDetailDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) { document.addEventListener('keydown', handler); document.body.style.overflow = 'hidden'; }
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open || !muscle) return null;

  const color = getIntensityColor(muscle.intensidade);

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        ref={drawerRef}
        tabIndex={-1}
        className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white dark:bg-[#0f1117] shadow-2xl flex flex-col animate-slide-in-right"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-[#1e2235]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: `var(--intensity-bg, ${color})` } as React.CSSProperties}
              >
                <Dumbbell className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Grupo Muscular</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{labelMap[muscle.grupo]}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              title="Fechar detalhes"
              aria-label="Fechar gaveta de detalhes corporais"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Intensity Ring */}
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" className="dark:stroke-gray-800" strokeWidth="12" />
                <circle
                  cx="60" cy="60" r="52" fill="none" stroke={color} strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - muscle.intensidade / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-gray-900 dark:text-white">{muscle.intensidade}%</span>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: `var(--intensity-color, ${color})` } as React.CSSProperties}>{getIntensityLabel(muscle.intensidade)}</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-[#1a1d27] p-4 rounded-xl">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Último Treino</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{muscle.ultimoTreino}</p>
            </div>
            <div className="bg-gray-50 dark:bg-[#1a1d27] p-4 rounded-xl">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Volume Semanal</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{muscle.volumeSemanal} séries</p>
            </div>
          </div>

          {/* Related Exercises */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-3">
              Exercícios Relacionados
            </h3>
            <div className="space-y-2">
              {muscle.exerciciosRelacionados.map((ex, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#1a1d27] rounded-xl">
                  <div className="w-7 h-7 bg-white dark:bg-[#0f1117] rounded-lg flex items-center justify-center text-[10px] font-bold text-gray-400 border border-gray-200 dark:border-[#2d3348]">
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{ex}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/10 dark:to-indigo-900/10 border border-primary-100 dark:border-primary-800/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-xs font-bold text-primary-700 dark:text-primary-400">Recomendação IA</span>
            </div>
            <p className="text-xs text-primary-600/80 dark:text-primary-300/70">
              {muscle.intensidade >= 80
                ? `O grupo ${labelMap[muscle.grupo]} está em sobrecarga. Recomendamos 48-72h de descanso antes do próximo estímulo direto.`
                : muscle.intensidade <= 20
                ? `O grupo ${labelMap[muscle.grupo]} está subtreinado. Adicione 4-6 séries extras nesta semana para equilibrar o desenvolvimento.`
                : `O grupo ${labelMap[muscle.grupo]} está com volume adequado. Mantenha a frequência atual para progressão ideal.`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
