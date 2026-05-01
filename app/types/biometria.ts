/**
 * Definições de tipos para o módulo de Biometria (Composição Corporal).
 */

export interface BiometricEvaluation {
  id: string;
  alunoId: string;
  data: string; // DD/MM/YYYY
  peso: number; // kg
  altura: number; // cm
  imc: number;
  gordura: number; // % gordura corporal
  massaMuscular: number; // % massa muscular
  idadeMetabolica: number;
  circunferencias: {
    peito: number;
    cintura: number;
    quadril: number;
    bracoD: number;
    bracoE: number;
    coxaD: number;
    coxaE: number;
    panturrilha: number;
  };
  observacao?: string;
}

export interface BiometriaKPIData {
  pesoAtual: number;
  pesoAnterior: number;
  imcAtual: number;
  gorduraAtual: number;
  gorduraAnterior: number;
  massaMuscularAtual: number;
  massaMuscularAnterior: number;
  idadeMetabolica: number;
  healthScore: number; // 0-100
}

export interface EvolutionPoint {
  data: string;
  peso: number;
  gordura: number;
  massaMuscular: number;
  imc: number;
}

export type IMCCategory = 'abaixo' | 'normal' | 'sobrepeso' | 'obesidade1' | 'obesidade2' | 'obesidade3';

export const getIMCCategory = (imc: number): { label: string; color: string; bg: string } => {
  if (imc < 18.5) return { label: 'Abaixo do Peso', color: 'text-blue-600', bg: 'bg-blue-50' };
  if (imc < 25.0) return { label: 'Peso Normal', color: 'text-emerald-600', bg: 'bg-emerald-50' };
  if (imc < 30.0) return { label: 'Sobrepeso', color: 'text-amber-600', bg: 'bg-amber-50' };
  if (imc < 35.0) return { label: 'Obesidade Grau I', color: 'text-orange-600', bg: 'bg-orange-50' };
  if (imc < 40.0) return { label: 'Obesidade Grau II', color: 'text-red-600', bg: 'bg-red-50' };
  return { label: 'Obesidade Grau III', color: 'text-red-800', bg: 'bg-red-100' };
};
