/**
 * Módulo de Previsão de Churn — Definições de Tipos.
 * 
 * Esses tipos suportam o recurso de análise de churn alimentado por IA,
 * incluindo resultados de previsão, classificação de risco e dados de tendência.
 */

export type RiskLevel = 'alto' | 'medio' | 'baixo';

export interface ChurnPrediction {
  studentId: string;
  studentName: string;
  probability: number;         // 0–100 (%)
  riskLevel: RiskLevel;
  lastPresence: string;        // ISO ou data formatada
  daysSinceLastVisit: number;
  weeklyFrequency: number;
  paymentStatus: 'up_to_date' | 'overdue';
  enrollmentMonths: number;
  updatedAt: string;
  impacts?: Record<string, number>;
}

export interface ChurnDistribution {
  alto: number;
  medio: number;
  baixo: number;
  total: number;
}

export interface ChurnTrendPoint {
  month: string;
  churnRate: number;    // porcentagem
  predicted: number;    // taxa prevista
}

export interface ChurnInsight {
  id: string;
  icon: string;         // emoji
  text: string;
  impact: string;       // ex: "+75% risco"
  severity: RiskLevel;
}

export interface ChurnSummary {
  currentRate: number;
  trend: 'up' | 'down';
  change: string;
  atRiskCount: number;
  distribution: ChurnDistribution;
  trendData: ChurnTrendPoint[];
  predictions: ChurnPrediction[];
  insights: ChurnInsight[];
}
