/**
 * Dados simulados para o Módulo de Previsão de Churn.
 * 
 * Gera dados sintéticos de churn realistas seguindo a metodologia KDD:
 * - Engenharia de Características: frequência, dias inativos, status de pagamento, tempo de matrícula
 * - Alvo: probabilidade de churn (0–100%)
 * - Classificação de Risco: Alto (>70%), Médio (40–70%), Baixo (<40%)
 * 
 * Todos os valores aleatórios são semeados para consistência de hidratação SSR/cliente.
 */

import type {
  ChurnPrediction,
  ChurnDistribution,
  ChurnTrendPoint,
  ChurnInsight,
  ChurnSummary,
  RiskLevel,
} from '@/types/churn';

/** Pseudo-aleatório determinístico para corresponder ao padrão existente em mock-data.ts */
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function classifyRisk(probability: number): RiskLevel {
  if (probability > 70) return 'alto';
  if (probability >= 40) return 'medio';
  return 'baixo';
}

const studentNames = [
  'Daniela Costa', 'Helena Martins', 'Igor Ferreira', 'Lucas Pereira',
  'Pedro Almeida', 'Rafaela Nascimento', 'William Ribeiro', 'Camila Carvalho',
  'Bruno Santos', 'Vanessa Souza', 'Thiago Rocha', 'Juliana Alencar',
  'Eduardo Lima', 'Mariana Oliveira', 'Gabriel Silva', 'Ana Costa',
  'Carlos Ferreira', 'Fernanda Lima', 'Diego Martins', 'Yasmin Rocha',
  'João Nascimento', 'Letícia Almeida', 'Ricardo Souza', 'Isabela Santos',
];

const lastPresenceDates = [
  '07/04/2026', '01/04/2026', '28/03/2026', '15/03/2026',
  '10/04/2026', '05/04/2026', '20/03/2026', '25/03/2026',
  '12/04/2026', '08/04/2026', '02/04/2026', '18/03/2026',
  '11/04/2026', '03/04/2026', '22/03/2026', '14/04/2026',
  '06/04/2026', '30/03/2026', '09/04/2026', '26/03/2026',
  '13/04/2026', '04/04/2026', '19/03/2026', '07/04/2026',
];

/**
 * Simula a probabilidade de churn usando a lógica do pipeline KDD:
 *  - Linha de base 30%
 *  - Inatividade > 10 dias: +45%
 *  - Baixa frequência < 2x/semana: +20%
 *  - Pagamento em atraso: +15%
 *  - Idade > 45 (simulado via matrícula > 24 meses): -15%
 */
function simulateChurnProbability(seed: number): {
  probability: number;
  daysSince: number;
  weeklyFreq: number;
  paymentStatus: 'up_to_date' | 'overdue';
  enrollmentMonths: number;
} {
  const daysSince = Math.floor(seededRandom(seed * 3) * 30);
  const weeklyFreq = Math.floor(seededRandom(seed * 5) * 6);
  const paymentStatus: 'up_to_date' | 'overdue' = seededRandom(seed * 7) > 0.7 ? 'overdue' : 'up_to_date';
  const enrollmentMonths = Math.floor(seededRandom(seed * 11) * 36) + 1;

  let prob = 30;
  if (daysSince > 10) prob += 45;
  if (weeklyFreq < 2) prob += 20;
  if (paymentStatus === 'overdue') prob += 15;
  if (enrollmentMonths > 24) prob -= 15;

  prob = Math.max(5, Math.min(95, prob + Math.floor((seededRandom(seed * 13) - 0.5) * 10)));

  return { probability: prob, daysSince, weeklyFreq: weeklyFreq, paymentStatus, enrollmentMonths };
}

/** Gerar todas as previsões de churn */
export const churnPredictions: ChurnPrediction[] = studentNames.map((name, i) => {
  const sim = simulateChurnProbability(i);
  return {
    studentId: `MOV-${String(i + 1).padStart(4, '0')}`,
    studentName: name,
    probability: sim.probability,
    riskLevel: classifyRisk(sim.probability),
    lastPresence: lastPresenceDates[i % lastPresenceDates.length],
    daysSinceLastVisit: sim.daysSince,
    weeklyFrequency: sim.weeklyFreq,
    paymentStatus: sim.paymentStatus,
    enrollmentMonths: sim.enrollmentMonths,
    updatedAt: '14/04/2026',
  };
});

/** Resumo da distribuição de risco */
export const churnDistribution: ChurnDistribution = {
  alto: churnPredictions.filter(p => p.riskLevel === 'alto').length,
  medio: churnPredictions.filter(p => p.riskLevel === 'medio').length,
  baixo: churnPredictions.filter(p => p.riskLevel === 'baixo').length,
  total: churnPredictions.length,
};

/** Dados de tendência mensal de churn — 6 meses */
export const churnTrendData: ChurnTrendPoint[] = [
  { month: 'Nov', churnRate: 4.2, predicted: 4.5 },
  { month: 'Dez', churnRate: 3.8, predicted: 3.9 },
  { month: 'Jan', churnRate: 5.1, predicted: 4.8 },
  { month: 'Fev', churnRate: 3.5, predicted: 3.7 },
  { month: 'Mar', churnRate: 2.9, predicted: 3.1 },
  { month: 'Abr', churnRate: 2.4, predicted: 2.6 },
];

/** Insights gerados por IA a partir dos dados */
export const churnInsights: ChurnInsight[] = [
  {
    id: 'insight-1',
    icon: '🔴',
    text: 'Alunos com mais de 7 dias sem treino têm 3x mais chance de evasão',
    impact: '+200% risco',
    severity: 'alto',
  },
  {
    id: 'insight-2',
    icon: '💳',
    text: 'Atraso de pagamento aumenta risco de churn em 45%',
    impact: '+45% risco',
    severity: 'alto',
  },
  {
    id: 'insight-3',
    icon: '📉',
    text: 'Frequência abaixo de 2x/semana é o principal preditor de evasão',
    impact: '+60% risco',
    severity: 'medio',
  },
  {
    id: 'insight-4',
    icon: '🏆',
    text: 'Alunos com mais de 24 meses são 15% mais leais',
    impact: '-15% risco',
    severity: 'baixo',
  },
  {
    id: 'insight-5',
    icon: '⏰',
    text: 'Horário de pico (18h-20h) retém 30% mais alunos regulares',
    impact: '-30% risco',
    severity: 'baixo',
  },
];

/** Objeto de resumo de churn completo */
export const churnSummary: ChurnSummary = {
  currentRate: 2.4,
  trend: 'down',
  change: '-0.5%',
  atRiskCount: churnDistribution.alto,
  distribution: churnDistribution,
  trendData: churnTrendData,
  predictions: churnPredictions.sort((a, b) => b.probability - a.probability),
  insights: churnInsights,
};
