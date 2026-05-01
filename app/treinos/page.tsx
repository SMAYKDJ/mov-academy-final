'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { TreinosKPI } from '@/components/dashboard/treinos/treinos-kpi';
import { BodyProgress } from '@/components/dashboard/treinos/body-progress';
import { TreinoCard } from '@/components/dashboard/treinos/treino-card';
import { TreinoDrawer } from '@/components/dashboard/treinos/treino-drawer';
import { MuscleDetailDrawer } from '@/components/dashboard/treinos/muscle-detail-drawer';
import { TreinoForm } from '@/components/dashboard/treinos/treino-form';
import { treinosKPIData, muscleMapData, workoutPlansData } from '@/utils/treinos-data';
import { Plus, Sparkles, UserCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { StudentSelector, mockStudents } from '@/components/dashboard/student-selector';
import { useLocalStorage } from '@/utils/persistence';
import type { WorkoutPlan, MuscleData } from '@/types/treinos';

export default function TreinosPage() {
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Persistência de Dados
  const [plans, setPlans] = useLocalStorage<WorkoutPlan[]>('moviment-plans', workoutPlansData, 'treinos');
  const [selectedStudentId, setSelectedStudentId] = useState(mockStudents[0].id);

  // Memoized filtered plans
  const filteredPlans = useMemo(() => {
    return plans.filter(p => p.alunoId === selectedStudentId);
  }, [plans, selectedStudentId]);

  // Drawer states
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [planDrawerOpen, setPlanDrawerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
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

  const handleSavePlan = (plano: WorkoutPlan) => {
    const planWithStudent = { ...plano, alunoId: selectedStudentId };
    if (selectedPlan) {
      setPlans(prev => prev.map(p => p.id === plano.id ? planWithStudent : p));
      showToast('Treino atualizado com sucesso!', 'success');
    } else {
      setPlans(prev => [planWithStudent, ...prev]);
      showToast('Novo treino cadastrado para o aluno!', 'success');
    }
    setFormOpen(false);
    setSelectedPlan(null);
  };

  const handleGenerateAI = () => {
    const student = mockStudents.find(s => s.id === selectedStudentId);
    showToast(`Analisando perfil de ${student?.name} e histórico... 🤖`, 'info', 'IA Moviment');
    setTimeout(() => {
      const aiPlan: WorkoutPlan = {
        id: Math.random().toString(36).substr(2, 9),
        alunoId: selectedStudentId,
        nome: 'Sugestão IA: Foco em ' + (selectedStudentId === 'MOV-0001' ? 'Hipertrofia' : 'Definição'),
        tipo: 'A',
        objetivo: 'hipertrofia',
        nivel: 'Intermediário',
        tempoEstimado: '55 min',
        diasSemana: ['Segunda', 'Quarta', 'Sexta'],
        ativo: true,
        exercicios: [
          { id: 'ex-ai-1', nome: 'Supino Inclinado com Halteres', grupoMuscular: 'peito', series: 4, repeticoes: '10-12', carga: '24kg', descanso: '60s' },
          { id: 'ex-ai-2', nome: 'Remada Curvada', grupoMuscular: 'costas', series: 4, repeticoes: '8-10', carga: '30kg', descanso: '90s' },
        ]
      };
      setSelectedPlan(aiPlan);
      setFormOpen(true);
      showToast('Treino estratégico gerado com sucesso!', 'success', 'IA Moviment');
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#080a0f]">
      <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      <div className="flex-1 md:ml-64 transition-all duration-300">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Global Context Selector */}
        <div className="bg-white dark:bg-[#0f1117] border-b border-gray-100 dark:border-[#1e2235] px-4 md:px-8 py-3 flex items-center justify-between sticky top-16 z-30 animate-fade-in shadow-sm">
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
              <UserCircle2 className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Modo Individual</span>
            </div>
            <StudentSelector 
              selectedId={selectedStudentId} 
              onSelect={(s) => {
                setSelectedStudentId(s.id);
                showToast(`Carregando contexto de treinos para ${s.name}...`, 'info');
              }} 
            />
          </div>
        </div>

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
                onClick={handleGenerateAI}
                className="px-4 py-2.5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                Gerar com IA
              </button>
              <button 
                onClick={() => { setSelectedPlan(null); setFormOpen(true); }}
                className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Novo Treino
              </button>
            </div>
          </div>

          {/* KPIs + Gamificação */}
          <TreinosKPI stats={treinosKPIData} />

          {/* Mapa Corporal (PEÇA CENTRAL) */}
          <BodyProgress
            muscleData={muscleMapData}
            onMuscleClick={handleMuscleClick}
          />

          {/* Grade de Planos de Treino */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Planos de Treino</h2>
                <p className="text-xs text-gray-400 mt-0.5">Clique para ver exercícios detalhados</p>
              </div>
              <p className="text-xs text-gray-400">
                <span className="font-bold text-gray-600 dark:text-gray-300">{filteredPlans.length}</span> planos
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredPlans.map(plano => (
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
        onEdit={() => { setPlanDrawerOpen(false); setFormOpen(true); }}
      />
      <MuscleDetailDrawer
        muscle={selectedMuscle}
        open={muscleDrawerOpen}
        onClose={() => setMuscleDrawerOpen(false)}
      />
      <TreinoForm 
        open={formOpen}
        initialData={selectedPlan}
        onClose={() => { setFormOpen(false); setSelectedPlan(null); }}
        onSave={handleSavePlan}
      />
    </div>
  );
}
