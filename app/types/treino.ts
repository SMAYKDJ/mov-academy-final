/**
 * Tipos para a Experiência do Aluno (App Aluno).
 */

export interface Exercise {
  id: string;
  nome: string;
  series: number;
  repeticoes: string;
  carga: string;
  descanso: string; // segundos
  observacao?: string;
  concluido: boolean;
  videoUrl?: string;
}

export interface Workout {
  id: string;
  titulo: string;
  tipo: 'A' | 'B' | 'C' | 'D' | 'Extra';
  duracao: string; // ex: "45-60 min"
  exercicios: Exercise[];
  frequência: string[]; // ['seg', 'qua', 'sex']
}

export interface StudentStats {
  peso: number;
  altura: number;
  bf: number; // % de Gordura Corporal
  treinosNoMes: number;
  sequenciaAtual: number; // dias seguidos
}
