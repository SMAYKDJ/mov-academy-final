import type { Workout, StudentStats } from '@/types/treino';

/**
 * Dados simulados realistas para a experiência mobile de um aluno.
 */

export const studentStats: StudentStats = {
  peso: 78.5,
  altura: 1.78,
  bf: 14.2,
  treinosNoMes: 18,
  sequenciaAtual: 4,
};

export const currentWorkout: Workout = {
  id: 'w-001',
  titulo: 'Hipertrofia — Peito e Tríceps',
  tipo: 'A',
  duracao: '55 min',
  exercicios: [
    {
      id: 'ex-1',
      nome: 'Supino Reto (Barra)',
      series: 4,
      repeticoes: '10-12',
      carga: '40kg/lado',
      descanso: '90',
      concluido: true,
      videoUrl: 'https://example.com/supino.mp4',
    },
    {
      id: 'ex-2',
      nome: 'Supino Inclinado (Halteres)',
      series: 3,
      repeticoes: '12',
      carga: '28kg',
      descanso: '60',
      concluido: false,
    },
    {
      id: 'ex-3',
      nome: 'Crucifixo Máquina',
      series: 3,
      repeticoes: '15',
      carga: '45kg',
      descanso: '45',
      concluido: false,
    },
    {
      id: 'ex-4',
      nome: 'Tríceps Polia Alta (Corda)',
      series: 4,
      repeticoes: '12-15',
      carga: '35kg',
      descanso: '60',
      concluido: false,
    },
    {
      id: 'ex-5',
      nome: 'Tríceps Testa',
      series: 3,
      repeticoes: '10',
      carga: '12kg/lado',
      descanso: '60',
      concluido: false,
    },
  ],
  frequência: ['seg', 'qua', 'sex'],
};
