/**
 * Definições de tipos para o módulo de Treinos.
 * Inclui grupos musculares, exercícios, planos de treino e dados do mapa corporal.
 */

export type MuscleGroup =
  | 'peito'
  | 'costas'
  | 'ombros'
  | 'biceps'
  | 'triceps'
  | 'abdomen'
  | 'quadriceps'
  | 'posterior'
  | 'panturrilha'
  | 'gluteos'
  | 'antebraco'
  | 'trapezio';

export type IntensityLevel = 'nenhum' | 'leve' | 'moderado' | 'intenso' | 'sobrecarga';

export type WorkoutObjective = 'hipertrofia' | 'emagrecimento' | 'forca' | 'resistencia' | 'funcional';

export interface MuscleData {
  grupo: MuscleGroup;
  intensidade: number; // 0–100
  ultimoTreino: string;
  volumeSemanal: number; // séries por semana
  exerciciosRelacionados: string[];
}

export interface ExerciseDetail {
  id: string;
  nome: string;
  grupoMuscular: MuscleGroup;
  series: number;
  repeticoes: string;
  carga: string;
  descanso: string;
  observacao?: string;
}

export interface WorkoutPlan {
  id: string;
  alunoId: string | number | null;
  nome: string;
  tipo: 'A' | 'B' | 'C' | 'D';
  objetivo: WorkoutObjective;
  diasSemana: string[];
  tempoEstimado: string;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  exercicios: ExerciseDetail[];
  ativo: boolean;
}

export interface TreinosKPIData {
  totalTreinos: number;
  frequenciaSemanal: number;
  musculoMaisTreinado: string;
  evolucao: number; // % de melhora
  xpTotal: number;
  nivel: number;
}
