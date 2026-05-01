import type { BiometricEvaluation, BiometriaKPIData, EvolutionPoint } from '@/types/biometria';

/**
 * Dados simulados — Avaliações biométricas para um aluno de exemplo.
 */

export const biometriaKPIData: BiometriaKPIData = {
  pesoAtual: 78.5,
  pesoAnterior: 80.2,
  imcAtual: 24.8,
  gorduraAtual: 14.2,
  gorduraAnterior: 16.1,
  massaMuscularAtual: 42.8,
  massaMuscularAnterior: 41.5,
  idadeMetabolica: 26,
  healthScore: 82,
};

export const evaluationHistory: BiometricEvaluation[] = [
  {
    id: 'eval-6', alunoId: 'aluno-001', data: '13/04/2026',
    peso: 78.5, altura: 178, imc: 24.8, gordura: 14.2, massaMuscular: 42.8, idadeMetabolica: 26,
    circunferencias: { peito: 102, cintura: 82, quadril: 96, bracoD: 36, bracoE: 35.5, coxaD: 58, coxaE: 57.5, panturrilha: 38 },
  },
  {
    id: 'eval-5', alunoId: 'aluno-001', data: '15/03/2026',
    peso: 80.2, altura: 178, imc: 25.3, gordura: 16.1, massaMuscular: 41.5, idadeMetabolica: 27,
    circunferencias: { peito: 101, cintura: 84, quadril: 97, bracoD: 35.5, bracoE: 35, coxaD: 57, coxaE: 56.5, panturrilha: 37.5 },
  },
  {
    id: 'eval-4', alunoId: 'aluno-001', data: '14/02/2026',
    peso: 81.0, altura: 178, imc: 25.6, gordura: 17.5, massaMuscular: 40.8, idadeMetabolica: 28,
    circunferencias: { peito: 100, cintura: 86, quadril: 98, bracoD: 35, bracoE: 34.5, coxaD: 56, coxaE: 55.5, panturrilha: 37 },
  },
  {
    id: 'eval-3', alunoId: 'aluno-001', data: '12/01/2026',
    peso: 82.5, altura: 178, imc: 26.0, gordura: 19.2, massaMuscular: 39.8, idadeMetabolica: 29,
    circunferencias: { peito: 99, cintura: 88, quadril: 99, bracoD: 34.5, bracoE: 34, coxaD: 55, coxaE: 54.5, panturrilha: 36.5 },
  },
  {
    id: 'eval-2', alunoId: 'aluno-001', data: '10/12/2025',
    peso: 84.0, altura: 178, imc: 26.5, gordura: 20.8, massaMuscular: 38.5, idadeMetabolica: 31,
    circunferencias: { peito: 98, cintura: 90, quadril: 100, bracoD: 34, bracoE: 33.5, coxaD: 54, coxaE: 53.5, panturrilha: 36 },
  },
  {
    id: 'eval-1', alunoId: 'aluno-001', data: '08/11/2025',
    peso: 85.5, altura: 178, imc: 27.0, gordura: 22.4, massaMuscular: 37.2, idadeMetabolica: 33,
    circunferencias: { peito: 97, cintura: 92, quadril: 101, bracoD: 33.5, bracoE: 33, coxaD: 53, coxaE: 52.5, panturrilha: 35.5 },
  },
];

export const evolutionData: EvolutionPoint[] = [
  { data: 'Nov', peso: 85.5, gordura: 22.4, massaMuscular: 37.2, imc: 27.0 },
  { data: 'Dez', peso: 84.0, gordura: 20.8, massaMuscular: 38.5, imc: 26.5 },
  { data: 'Jan', peso: 82.5, gordura: 19.2, massaMuscular: 39.8, imc: 26.0 },
  { data: 'Fev', peso: 81.0, gordura: 17.5, massaMuscular: 40.8, imc: 25.6 },
  { data: 'Mar', peso: 80.2, gordura: 16.1, massaMuscular: 41.5, imc: 25.3 },
  { data: 'Abr', peso: 78.5, gordura: 14.2, massaMuscular: 42.8, imc: 24.8 },
];
