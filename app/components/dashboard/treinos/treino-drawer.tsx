'use client';

import React, { useEffect, useRef } from 'react';
import { X, Clock, Dumbbell, Repeat, Timer, Weight, Target, Calendar } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { WorkoutPlan, WorkoutObjective } from '@/types/treinos';

interface TreinoDrawerProps {
  plano: WorkoutPlan | null;
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

const objectiveLabel: Record<WorkoutObjective, string> = {
  hipertrofia: 'Hipertrofia',
  emagrecimento: 'Emagrecimento',
  forca: 'Força',
  resistencia: 'Resistência',
  funcional: 'Funcional',
};

const typeGradients: Record<string, string> = {
  A: 'from-primary-500 to-indigo-600',
  B: 'from-emerald-500 to-teal-600',
  C: 'from-red-500 to-rose-600',
  D: 'from-violet-500 to-purple-600',
};

const muscleLabels: Record<string, string> = {
  peito: 'Peito', costas: 'Costas', ombros: 'Ombros', biceps: 'Bíceps',
  triceps: 'Tríceps', abdomen: 'Abdômen', quadriceps: 'Quadríceps',
  posterior: 'Posterior', panturrilha: 'Panturrilha', gluteos: 'Glúteos',
  antebraco: 'Antebraço', trapezio: 'Trapézio',
};

export function TreinoDrawer({ plano, open, onClose, onEdit }: TreinoDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [open, onClose]);

  useEffect(() => {
    if (open && drawerRef.current) drawerRef.current.focus();
  }, [open]);

  if (!open || !plano) return null;

  // Group exercises by muscle
  const grouped = plano.exercicios.reduce((acc, ex) => {
    if (!acc[ex.grupoMuscular]) acc[ex.grupoMuscular] = [];
    acc[ex.grupoMuscular].push(ex);
    return acc;
  }, {} as Record<string, typeof plano.exercicios>);

  const totalSets = plano.exercicios.reduce((sum, ex) => sum + ex.series, 0);

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={plano.nome}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div
        ref={drawerRef}
        tabIndex={-1}
        className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white dark:bg-[#0f1117] shadow-2xl flex flex-col animate-slide-in-right"
      >
        {/* Header */}
        <div className={cn("p-6 text-white relative overflow-hidden bg-gradient-to-r", typeGradients[plano.tipo] || typeGradients.A)}>
          <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-white/20 rounded-md text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                    Treino {plano.tipo}
                  </span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-md text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                    {plano.nivel}
                  </span>
                </div>
                <h2 className="text-xl font-bold">{plano.nome}</h2>
                <p className="text-white/70 text-xs mt-1">{objectiveLabel[plano.objetivo]}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors" aria-label="Fechar">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 mt-4 text-xs">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md">
                <Clock className="w-3.5 h-3.5" /> {plano.tempoEstimado}
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md">
                <Dumbbell className="w-3.5 h-3.5" /> {plano.exercicios.length} exercícios
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md">
                <Target className="w-3.5 h-3.5" /> {totalSets} séries
              </span>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-[#1e2235] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {plano.diasSemana.join(' · ')}
          </span>
        </div>

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {Object.entries(grouped).map(([muscle, exercises]) => (
            <div key={muscle}>
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-500" />
                {muscleLabels[muscle] || muscle}
              </h3>
              <div className="space-y-3">
                {exercises.map((ex, idx) => (
                  <div
                    key={ex.id}
                    className="bg-gray-50 dark:bg-[#1a1d27] rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-[#242838] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-white dark:bg-[#0f1117] rounded-lg flex items-center justify-center text-[10px] font-bold text-gray-400 border border-gray-200 dark:border-[#2d3348]">
                          {idx + 1}
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{ex.nome}</h4>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="flex flex-col items-center p-2 bg-white dark:bg-[#0f1117] rounded-lg border border-gray-100 dark:border-[#2d3348]">
                        <Repeat className="w-3 h-3 text-gray-400 mb-0.5" />
                        <span className="text-[10px] font-bold text-gray-900 dark:text-white">{ex.series}</span>
                        <span className="text-[8px] text-gray-400 uppercase">Séries</span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-white dark:bg-[#0f1117] rounded-lg border border-gray-100 dark:border-[#2d3348]">
                        <Target className="w-3 h-3 text-gray-400 mb-0.5" />
                        <span className="text-[10px] font-bold text-gray-900 dark:text-white">{ex.repeticoes}</span>
                        <span className="text-[8px] text-gray-400 uppercase">Reps</span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-white dark:bg-[#0f1117] rounded-lg border border-gray-100 dark:border-[#2d3348]">
                        <Weight className="w-3 h-3 text-gray-400 mb-0.5" />
                        <span className="text-[10px] font-bold text-gray-900 dark:text-white truncate max-w-full">{ex.carga}</span>
                        <span className="text-[8px] text-gray-400 uppercase">Carga</span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-white dark:bg-[#0f1117] rounded-lg border border-gray-100 dark:border-[#2d3348]">
                        <Timer className="w-3 h-3 text-gray-400 mb-0.5" />
                        <span className="text-[10px] font-bold text-gray-900 dark:text-white">{ex.descanso}</span>
                        <span className="text-[8px] text-gray-400 uppercase">Desc.</span>
                      </div>
                    </div>
                    {ex.observacao && (
                      <p className="mt-2 text-[10px] text-gray-400 italic">💡 {ex.observacao}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-[#1e2235] flex gap-3">
          <button className="flex-1 py-3 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center justify-center gap-2">
            <Dumbbell className="w-4 h-4" />
            Iniciar Treino
          </button>
          <button 
            onClick={onEdit}
            className="px-4 py-3 border border-gray-200 dark:border-[#2d3348] text-gray-600 dark:text-gray-400 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-[#1a1d27] transition-all"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}
