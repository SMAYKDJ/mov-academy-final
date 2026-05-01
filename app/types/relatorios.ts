/**
 * Definições de tipos para o módulo de Relatórios (BI/Analytics).
 */

export interface RetentionData {
  mes: string;
  taxaRetencao: number; // Porcentagem
  churn: number; // Porcentagem
  engajamento: number; // Porcentagem
}

export interface FrequenciaHoraria {
  hora: string; // "06:00", "07:00", etc.
  seg: number; // Nível de frequência 0-100
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
  mrr: number; // Receita Recorrente Mensal (MRR)
  growthRate: number;
}

export interface DailyCheckins {
  data: string;
  quantidade: number;
}
