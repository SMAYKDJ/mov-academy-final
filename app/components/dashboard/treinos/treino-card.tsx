'use client';

import React from 'react';
import { Clock, Dumbbell, Calendar, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { WorkoutPlan, WorkoutObjective } from '@/types/treinos';

interface TreinoCardProps {
  plano: WorkoutPlan;
  onClick: (plano: WorkoutPlan) => void;
}

const objectiveConfig: Record<WorkoutObjective, { label: string; color: string; bg: string }> = {
  hipertrofia:   { label: 'Hipertrofia',   color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-900/20' },
  emagrecimento: { label: 'Emagrecimento', color: 'text-emerald-600 dark:text-green-400',   bg: 'bg-emerald-50 dark:bg-green-900/20' },
  forca:         { label: 'Força',         color: 'text-red-600 dark:text-red-400',          bg: 'bg-red-50 dark:bg-red-900/20' },
  resistencia:   { label: 'Resistência',   color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-900/20' },
  funcional:     { label: 'Funcional',     color: 'text-violet-600 dark:text-violet-400',   bg: 'bg-violet-50 dark:bg-violet-900/20' },
};

const nivelConfig: Record<string, string> = {
  'Iniciante': 'bg-emerald-50 dark:bg-green-900/20 text-emerald-700 dark:text-green-400 border-emerald-200 dark:border-green-800',
  'Intermediário': 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  'Avançado': 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
};

const typeGradients: Record<string, string> = {
  A: 'from-primary-500 to-indigo-600',
  B: 'from-emerald-500 to-teal-600',
  C: 'from-red-500 to-rose-600',
  D: 'from-violet-500 to-purple-600',
};

export function TreinoCard({ plano, onClick }: TreinoCardProps) {
  const objCfg = objectiveConfig[plano.objetivo];

  return (
    <button
      onClick={() => onClick(plano)}
      className="w-full bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] p-5 hover:shadow-xl hover:shadow-gray-100/50 dark:hover:shadow-none hover:scale-[1.02] transition-all duration-300 group text-left relative overflow-hidden"
    >
      {/* Top gradient bar */}
      <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r", typeGradients[plano.tipo] || typeGradients.A)} />

      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-black text-lg shadow-lg", typeGradients[plano.tipo] || typeGradients.A)}>
            {plano.tipo}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{plano.nome}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest", objCfg.bg, objCfg.color)}>
                {objCfg.label}
              </span>
              <span className={cn("px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border", nivelConfig[plano.nivel])}>
                {plano.nivel}
              </span>
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {plano.tempoEstimado}
        </span>
        <span className="flex items-center gap-1.5">
          <Dumbbell className="w-3.5 h-3.5" />
          {plano.exercicios.length} exercícios
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {plano.diasSemana.join(', ')}
        </span>
      </div>

      {/* Active indicator */}
      {plano.ativo && (
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-green-900/20 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold text-emerald-700 dark:text-green-400 uppercase">Ativo</span>
          </div>
        </div>
      )}
    </button>
  );
}
