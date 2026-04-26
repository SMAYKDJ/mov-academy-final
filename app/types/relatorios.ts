/**
 * Type definitions for the Relatórios (BI/Analytics) module.
 */

export interface RetentionData {
  mes: string;
  taxaRetencao: number; // Percentage
  churn: number; // Percentage
  engajamento: number; // Percentage
}

export interface FrequenciaHoraria {
  hora: string; // "06:00", "07:00", etc.
  seg: number; // Frequency level 0-100
  ter: number;
  qua: number;
  qui: number;
  sex: number;
  sab: number;
  dom: number;
}

export interface PlanoDistribution {
  plano: string;
  quantidade: number;
  receita: number;
}

export interface BIStats {
  churnRate: number;
  avgRetentionMonths: number;
  lifetimeValue: number;
  mrr: number; // Monthly Recurring Revenue
  growthRate: number;
}

export interface DailyCheckins {
  data: string;
  quantidade: number;
}
