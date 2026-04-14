/**
 * Type definitions for the Treinos (Workouts) module.
 * Includes muscle groups, exercises, workout plans, and body map data.
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
  volumeSemanal: number; // sets per week
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
  evolucao: number; // % improvement
  xpTotal: number;
  nivel: number;
}
