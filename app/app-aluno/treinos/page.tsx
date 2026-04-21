'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Play, 
  Info, 
  ChevronLeft,
  Timer,
  Weight,
  Repeat
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { currentWorkout } from '@/utils/treino-data';
import Link from 'next/link';

export default function StudentWorkoutPage() {
  const [workout, setWorkout] = useState(currentWorkout);

  const toggleExercise = (id: string) => {
    setWorkout(prev => ({
      ...prev,
      exercicios: prev.exercicios.map(ex => 
        ex.id === id ? { ...ex, concluido: !ex.concluido } : ex
      )
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header with Back button */}
      <div className="flex items-center gap-4">
        <Link 
          href="/app-aluno"
          className="p-2 -ml-2 bg-white dark:bg-[#0f1117] rounded-xl border border-gray-100 dark:border-[#1e2235] text-gray-500"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{workout.titulo}</h1>
          <p className="text-xs text-gray-400 font-medium">Treino {workout.tipo} • {workout.exercicios.length} exercícios</p>
        </div>
      </div>

      {/* Exercise List */}
      <div className="space-y-4">
        {workout.exercicios.map((ex, index) => (
          <div 
            key={ex.id}
            className={cn(
              "bg-white dark:bg-[#0f1117] rounded-[24px] border transition-all overflow-hidden",
              ex.concluido 
                ? "border-emerald-100 dark:border-green-900/30 opacity-70" 
                : "border-gray-100 dark:border-[#1e2235] shadow-sm"
            )}
          >
            <div className="p-5">
              {/* Top Row: Number + Title + Video */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold",
                    ex.concluido ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                  )}>
                    {index + 1}
                  </div>
                  <h4 className={cn("font-bold text-sm", ex.concluido ? "text-gray-400 line-through" : "text-gray-900 dark:text-white")}>
                    {ex.nome}
                  </h4>
                </div>
                {ex.videoUrl && (
                  <button 
                    title="Ver vídeo demonstrativo"
                    aria-label={`Ver vídeo de ${ex.nome}`}
                    className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary-600"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                )}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-[#1a1d27] rounded-xl">
                  <Repeat className="w-3 h-3 text-gray-400 mb-1" />
                  <span className="text-[10px] font-bold text-gray-900 dark:text-white">{ex.series} Séries</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-[#1a1d27] rounded-xl">
                  <Weight className="w-3 h-3 text-gray-400 mb-1" />
                  <span className="text-[10px] font-bold text-gray-900 dark:text-white">{ex.repeticoes} Reps</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-[#1a1d27] rounded-xl">
                  <Timer className="w-3 h-3 text-gray-400 mb-1" />
                  <span className="text-[10px] font-bold text-gray-900 dark:text-white">{ex.descanso}s Desc.</span>
                </div>
              </div>

              {/* Action: Toggle Concluido */}
              <button 
                onClick={() => toggleExercise(ex.id)}
                className={cn(
                  "w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                  ex.concluido 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                    : "bg-gray-900 text-white hover:bg-black"
                )}
              >
                {ex.concluido ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Concluído
                  </>
                ) : (
                  <>Finalizar Exercício</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Summary */}
      <div className="fixed bottom-24 left-6 right-6 md:max-w-[384px] md:mx-auto">
        <button className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-xl shadow-primary-200 dark:shadow-none flex items-center justify-center gap-2">
          Finalizar Treino
        </button>
      </div>
    </div>
  );
}
