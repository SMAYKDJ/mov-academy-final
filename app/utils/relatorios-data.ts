import type { RetentionData, FrequenciaHoraria, PlanoDistribution, BIStats, DailyCheckins } from '@/types/relatorios';

/**
 * Realistic mock data for the Business Intelligence module.
 */

export const biStatsData: BIStats = {
  churnRate: 2.4,
  avgRetentionMonths: 14.5,
  lifetimeValue: 2650.00,
  mrr: 45800.00,
  growthRate: 12.5,
};

export const retentionHistoryData: RetentionData[] = [
  { mes: 'Nov', taxaRetencao: 96.5, churn: 3.5 },
  { mes: 'Dez', taxaRetencao: 97.2, churn: 2.8 },
  { mes: 'Jan', taxaRetencao: 95.8, churn: 4.2 },
  { mes: 'Fev', taxaRetencao: 97.5, churn: 2.5 },
  { mes: 'Mar', taxaRetencao: 98.1, churn: 1.9 },
  { mes: 'Abr', taxaRetencao: 97.6, churn: 2.4 },
];

export const frequencyHeatmapData: FrequenciaHoraria[] = [
  { hora: '06h', seg: 85, ter: 80, qua: 88, qui: 82, sex: 75, sab: 40, dom: 10 },
  { hora: '08h', seg: 60, ter: 55, qua: 62, qui: 58, sex: 50, sab: 70, dom: 30 },
  { hora: '10h', seg: 40, ter: 35, qua: 42, qui: 38, sex: 35, sab: 90, dom: 50 },
  { hora: '12h', seg: 50, ter: 45, qua: 52, qui: 48, sex: 45, sab: 60, dom: 20 },
  { hora: '14h', seg: 30, ter: 25, qua: 32, qui: 28, sex: 25, sab: 40, dom: 15 },
  { hora: '16h', seg: 55, ter: 50, qua: 58, qui: 52, sex: 45, sab: 30, dom: 10 },
  { hora: '18h', seg: 95, ter: 98, qua: 96, qui: 92, sex: 85, sab: 20, dom: 5 },
  { hora: '20h', seg: 80, ter: 75, qua: 82, qui: 78, sex: 70, sab: 10, dom: 0 },
  { hora: '22h', seg: 40, ter: 35, qua: 42, qui: 38, sex: 30, sab: 0, dom: 0 },
];

export const planDistributionData: PlanoDistribution[] = [
  { plano: 'Anual', quantidade: 145, receita: 21750 },
  { plano: 'Trimestral', quantidade: 82, receita: 9840 },
  { plano: 'Mensal', quantidade: 124, receita: 12400 },
  { plano: 'Black VIP', quantidade: 54, receita: 18900 },
];

export const dailyCheckinsData: DailyCheckins[] = [
  { data: '07/04', quantidade: 285 },
  { data: '08/04', quantidade: 312 },
  { data: '09/04', quantidade: 298 },
  { data: '10/04', quantidade: 275 },
  { data: '11/04', quantidade: 145 },
  { data: '12/04', quantidade: 85 },
  { data: '13/04', quantidade: 324 },
];
