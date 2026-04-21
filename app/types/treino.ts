/**
 * Types for the Student Experience (App Aluno).
 */

export interface Exercise {
  id: string;
  nome: string;
  series: number;
  repeticoes: string;
  carga: string;
  descanso: string; // seconds
  observacao?: string;
  concluido: boolean;
  videoUrl?: string;
}

export interface Workout {
  id: string;
  titulo: string;
  tipo: 'A' | 'B' | 'C' | 'D' | 'Extra';
  duracao: string; // e.g., "45-60 min"
  exercicios: Exercise[];
  frequência: string[]; // ['seg', 'qua', 'sex']
}

export interface StudentStats {
  peso: number;
  altura: number;
  bf: number; // Body Fat %
  treinosNoMes: number;
  sequenciaAtual: number; // days in a row
}
