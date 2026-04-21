/**
 * Churn Prediction Module — Type Definitions.
 * 
 * These types support the ML-powered churn analysis feature,
 * including prediction results, risk classification, and trend data.
 */

export type RiskLevel = 'alto' | 'medio' | 'baixo';

export interface ChurnPrediction {
  studentId: string;
  studentName: string;
  probability: number;         // 0–100 (%)
  riskLevel: RiskLevel;
  lastPresence: string;        // ISO or formatted date
  daysSinceLastVisit: number;
  weeklyFrequency: number;
  paymentStatus: 'up_to_date' | 'overdue';
  enrollmentMonths: number;
  updatedAt: string;
}

export interface ChurnDistribution {
  alto: number;
  medio: number;
  baixo: number;
  total: number;
}

export interface ChurnTrendPoint {
  month: string;
  churnRate: number;    // percentage
  predicted: number;    // predicted rate
}

export interface ChurnInsight {
  id: string;
  icon: string;         // emoji
  text: string;
  impact: string;       // e.g. "+75% risco"
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
