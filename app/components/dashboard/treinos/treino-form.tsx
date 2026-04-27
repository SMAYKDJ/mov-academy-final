'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Dumbbell, Clock, Target, Calendar } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { WorkoutPlan, ExerciseDetail, MuscleGroup, WorkoutObjective } from '@/types/treinos';

interface TreinoFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (plano: WorkoutPlan) => void;
  initialData?: WorkoutPlan | null;
}

const muscleGroups: { value: MuscleGroup; label: string }[] = [
  { value: 'peito', label: 'Peito' },
  { value: 'costas', label: 'Costas' },
  { value: 'ombros', label: 'Ombros' },
  { value: 'biceps', label: 'Bíceps' },
  { value: 'triceps', label: 'Tríceps' },
  { value: 'abdomen', label: 'Abdômen' },
  { value: 'quadriceps', label: 'Quadríceps' },
  { value: 'posterior', label: 'Posterior' },
  { value: 'panturrilha', label: 'Panturrilha' },
  { value: 'gluteos', label: 'Glúteos' },
];

const objectives: { value: WorkoutObjective; label: string }[] = [
  { value: 'hipertrofia', label: 'Hipertrofia' },
  { value: 'emagrecimento', label: 'Emagrecimento' },
  { value: 'forca', label: 'Força' },
  { value: 'resistencia', label: 'Resistência' },
  { value: 'funcional', label: 'Funcional' },
];

const levels = ['Iniciante', 'Intermediário', 'Avançado'] as const;
const types = ['A', 'B', 'C', 'D'] as const;

export function TreinoForm({ open, onClose, onSave, initialData }: TreinoFormProps) {
  const [formData, setFormData] = useState<Partial<WorkoutPlan>>({
    nome: '',
    tipo: 'A',
    objetivo: 'hipertrofia',
    nivel: 'Intermediário',
    tempoEstimado: '60 min',
    diasSemana: ['Segunda', 'Quarta', 'Sexta'],
    exercicios: [],
    ativo: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        nome: '',
        tipo: 'A',
        objetivo: 'hipertrofia',
        nivel: 'Intermediário',
        tempoEstimado: '60 min',
        diasSemana: ['Segunda', 'Quarta', 'Sexta'],
        exercicios: [],
        ativo: true,
      });
    }
  }, [initialData, open]);

  const addExercise = () => {
    const newEx: ExerciseDetail = {
      id: Math.random().toString(36).substr(2, 9),
      nome: '',
      grupoMuscular: 'peito',
      series: 3,
      repeticoes: '12',
      carga: '0kg',
      descanso: '60s',
    };
    setFormData(prev => ({
      ...prev,
      exercicios: [...(prev.exercicios || []), newEx]
    }));
  };

  const removeExercise = (id: string) => {
    setFormData(prev => ({
      ...prev,
      exercicios: prev.exercicios?.filter(ex => ex.id !== id)
    }));
  };

  const updateExercise = (id: string, fields: Partial<ExerciseDetail>) => {
    setFormData(prev => ({
      ...prev,
      exercicios: prev.exercicios?.map(ex => ex.id === id ? { ...ex, ...fields } : ex)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome) return;
    onSave({
      ...formData,
      id: formData.id || Math.random().toString(36).substr(2, 9),
    } as WorkoutPlan);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <form 
        onSubmit={handleSubmit}
        className="relative w-full max-w-4xl bg-white dark:bg-[#0f1117] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-scale-in"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-[#1e2235] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {initialData ? 'Editar Plano de Treino' : 'Novo Plano de Treino'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Configure os detalhes e exercícios do plano</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Basic Info */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5 ml-1">Nome do Plano</label>
              <input 
                type="text"
                required
                placeholder="Ex: Hipertrofia Avançada A"
                className="w-full bg-gray-50 dark:bg-[#1a1d27] border border-gray-100 dark:border-[#2d3348] rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 transition-all outline-none text-gray-900 dark:text-white"
                value={formData.nome}
                onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5 ml-1">Tipo / Letra</label>
              <select 
                className="w-full bg-gray-50 dark:bg-[#1a1d27] border border-gray-100 dark:border-[#2d3348] rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 transition-all outline-none text-gray-900 dark:text-white cursor-pointer"
                value={formData.tipo}
                onChange={e => setFormData(prev => ({ ...prev, tipo: e.target.value as any }))}
              >
                {types.map(t => <option key={t} value={t}>Treino {t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5 ml-1">Objetivo</label>
              <select 
                className="w-full bg-gray-50 dark:bg-[#1a1d27] border border-gray-100 dark:border-[#2d3348] rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 transition-all outline-none text-gray-900 dark:text-white cursor-pointer"
                value={formData.objetivo}
                onChange={e => setFormData(prev => ({ ...prev, objetivo: e.target.value as any }))}
              >
                {objectives.map(obj => <option key={obj.value} value={obj.value}>{obj.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5 ml-1">Nível</label>
              <select 
                className="w-full bg-gray-50 dark:bg-[#1a1d27] border border-gray-100 dark:border-[#2d3348] rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 transition-all outline-none text-gray-900 dark:text-white cursor-pointer"
                value={formData.nivel}
                onChange={e => setFormData(prev => ({ ...prev, nivel: e.target.value as any }))}
              >
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5 ml-1">Tempo Est.</label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Ex: 60 min"
                  className="w-full bg-gray-50 dark:bg-[#1a1d27] border border-gray-100 dark:border-[#2d3348] rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 transition-all outline-none text-gray-900 dark:text-white"
                  value={formData.tempoEstimado}
                  onChange={e => setFormData(prev => ({ ...prev, tempoEstimado: e.target.value }))}
                />
              </div>
            </div>
          </section>

          {/* Exercises */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Exercícios ({formData.exercicios?.length || 0})
              </h3>
              <button 
                type="button"
                onClick={addExercise}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary-100 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar
              </button>
            </div>

            <div className="space-y-3">
              {formData.exercicios?.map((ex, index) => (
                <div 
                  key={ex.id}
                  className="group bg-gray-50 dark:bg-[#1a1d27] border border-gray-100 dark:border-[#2d3348] rounded-2xl p-4 transition-all hover:border-primary-200 dark:hover:border-primary-900/30"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-1 pt-2">
                      <div className="w-6 h-6 bg-white dark:bg-[#0f1117] rounded-lg border border-gray-200 dark:border-[#2d3348] flex items-center justify-center text-[10px] font-black text-gray-400">
                        {index + 1}
                      </div>
                    </div>
                    <div className="md:col-span-5">
                      <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Nome do Exercício</label>
                      <input 
                        type="text"
                        placeholder="Ex: Supino Reto com Barra"
                        className="w-full bg-white dark:bg-[#0f1117] border border-gray-100 dark:border-[#2d3348] rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-primary-500 outline-none text-gray-900 dark:text-white"
                        value={ex.nome}
                        onChange={e => updateExercise(ex.id, { nome: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Grupo Muscular</label>
                      <select 
                        className="w-full bg-white dark:bg-[#0f1117] border border-gray-100 dark:border-[#2d3348] rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-primary-500 outline-none text-gray-900 dark:text-white cursor-pointer"
                        value={ex.grupoMuscular}
                        onChange={e => updateExercise(ex.id, { grupoMuscular: e.target.value as any })}
                      >
                        {muscleGroups.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-3 flex justify-end pt-2">
                      <button 
                        type="button"
                        onClick={() => removeExercise(ex.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="md:col-start-2 md:col-span-11 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[8px] font-bold text-gray-400 uppercase mb-1">Séries</label>
                        <input 
                          type="number"
                          className="w-full bg-white dark:bg-[#0f1117] border border-gray-100 dark:border-[#2d3348] rounded-lg px-3 py-2 text-xs font-medium outline-none text-gray-900 dark:text-white"
                          value={ex.series}
                          onChange={e => updateExercise(ex.id, { series: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-gray-400 uppercase mb-1">Reps</label>
                        <input 
                          type="text"
                          className="w-full bg-white dark:bg-[#0f1117] border border-gray-100 dark:border-[#2d3348] rounded-lg px-3 py-2 text-xs font-medium outline-none text-gray-900 dark:text-white"
                          value={ex.repeticoes}
                          onChange={e => updateExercise(ex.id, { repeticoes: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-gray-400 uppercase mb-1">Carga</label>
                        <input 
                          type="text"
                          className="w-full bg-white dark:bg-[#0f1117] border border-gray-100 dark:border-[#2d3348] rounded-lg px-3 py-2 text-xs font-medium outline-none text-gray-900 dark:text-white"
                          value={ex.carga}
                          onChange={e => updateExercise(ex.id, { carga: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-gray-400 uppercase mb-1">Descanso</label>
                        <input 
                          type="text"
                          className="w-full bg-white dark:bg-[#0f1117] border border-gray-100 dark:border-[#2d3348] rounded-lg px-3 py-2 text-xs font-medium outline-none text-gray-900 dark:text-white"
                          value={ex.descanso}
                          onChange={e => updateExercise(ex.id, { descanso: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!formData.exercicios || formData.exercicios.length === 0) && (
                <div className="text-center py-12 border-2 border-dashed border-gray-100 dark:border-[#1e2235] rounded-3xl">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Plus className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">Nenhum exercício adicionado</p>
                  <button 
                    type="button" 
                    onClick={addExercise}
                    className="mt-3 text-xs font-bold text-primary-600 hover:underline"
                  >
                    Adicionar primeiro exercício
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-[#1e2235] flex items-center justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="px-8 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Plano
          </button>
        </div>
      </form>
    </div>
  );
}
