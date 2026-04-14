'use client';

import React, { useState, useCallback } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { TreinosKPI } from '@/components/dashboard/treinos/treinos-kpi';
import { BodyProgress } from '@/components/dashboard/treinos/body-progress';
import { TreinoCard } from '@/components/dashboard/treinos/treino-card';
import { TreinoDrawer } from '@/components/dashboard/treinos/treino-drawer';
import { MuscleDetailDrawer } from '@/components/dashboard/treinos/muscle-detail-drawer';
import { treinosKPIData, muscleMapData, workoutPlansData } from '@/utils/treinos-data';
import { useToast } from '@/components/ui/toast';
import type { WorkoutPlan, MuscleData } from '@/types/treinos';

/**
 * Treinos (Workouts) page — Complete workout management with interactive body map.
 * Features: KPIs, gamification XP, SVG body heatmap, workout cards, detail drawers.
 */
export default function TreinosPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Drawer states
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [planDrawerOpen, setPlanDrawerOpen] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleData | null>(null);
  const [muscleDrawerOpen, setMuscleDrawerOpen] = useState(false);

  const handlePlanClick = useCallback((plano: WorkoutPlan) => {
    setSelectedPlan(plano);
    setPlanDrawerOpen(true);
  }, []);

  const handleMuscleClick = useCallback((muscle: MuscleData) => {
    setSelectedMuscle(muscle);
    setMuscleDrawerOpen(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#080a0f]">
      <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      <div className="flex-1 md:ml-64 transition-all duration-300">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-fade-in">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Treinos
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                Gestão de treinos, body mapping e acompanhamento de evolução
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => showToast('Iniciando geração de treino personalizado com IA... 🤖', 'info', 'Inteligência Artificial')}
                className="px-4 py-2.5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                Gerar com IA
              </button>
              <button 
                onClick={() => setPlanDrawerOpen(true)}
                className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Novo Treino
              </button>
            </div>
          </div>

          {/* KPIs + Gamification */}
          <TreinosKPI stats={treinosKPIData} />

          {/* Body Map (THE CENTERPIECE) */}
          <BodyProgress
            muscleData={muscleMapData}
            onMuscleClick={handleMuscleClick}
          />

          {/* Workout Plans Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Planos de Treino</h2>
                <p className="text-xs text-gray-400 mt-0.5">Clique para ver exercícios detalhados</p>
              </div>
              <p className="text-xs text-gray-400">
                <span className="font-bold text-gray-600 dark:text-gray-300">{workoutPlansData.length}</span> planos
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {workoutPlansData.map(plano => (
                <TreinoCard key={plano.id} plano={plano} onClick={handlePlanClick} />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Drawers */}
      <TreinoDrawer
        plano={selectedPlan}
        open={planDrawerOpen}
        onClose={() => setPlanDrawerOpen(false)}
      />
      <MuscleDetailDrawer
        muscle={selectedMuscle}
        open={muscleDrawerOpen}
        onClose={() => setMuscleDrawerOpen(false)}
      />
    </div>
  );
}
