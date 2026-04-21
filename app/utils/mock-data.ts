/**
 * Mock Data for development and demonstration.
 * All data follows the interfaces defined in types/index.ts.
 */

import type { Student, KPIStat, ActivityItem, ChartData } from '@/types';

const firstNames = [
  'Carlos', 'Ana', 'Bruno', 'Daniela', 'Eduardo',
  'Fernanda', 'Gabriel', 'Helena', 'Igor', 'Juliana',
  'Lucas', 'Mariana', 'Pedro', 'Rafaela', 'Thiago',
  'Vanessa', 'William', 'Yasmin', 'Diego', 'Camila'
];

const lastNames = [
  'Silva', 'Oliveira', 'Santos', 'Costa', 'Lima',
  'Souza', 'Rocha', 'Martins', 'Ferreira', 'Alencar',
  'Pereira', 'Almeida', 'Nascimento', 'Ribeiro', 'Carvalho'
];

const plans: ('Black VIP' | 'Platinum' | 'Basic Fit')[] = ['Black VIP', 'Platinum', 'Basic Fit'];

function generateEmail(first: string, last: string): string {
  return `${first.toLowerCase()}.${last.toLowerCase()}@email.com`;
}

/**
 * Deterministic pseudo-random number generator (seeded).
 * Prevents hydration mismatches between server and client.
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const fixedDates = [
  '31/05/2025', '28/05/2025', '10/01/2025', '10/09/2025', '11/05/2025',
  '25/02/2025', '30/07/2025', '02/04/2025', '21/03/2025', '15/06/2025',
  '08/08/2025', '19/11/2025', '03/01/2025', '14/09/2025', '22/04/2025',
  '07/12/2025', '18/03/2025', '29/07/2025', '05/10/2025', '12/06/2025',
];

const fixedJoinDates = [
  '15/03/2023', '02/05/2023', '10/07/2023', '22/09/2023', '01/11/2023',
  '18/01/2024', '07/04/2024', '14/06/2024', '25/08/2024', '03/10/2024',
  '12/12/2024', '20/02/2025', '08/04/2025', '16/06/2025', '24/08/2025',
  '01/10/2025', '09/01/2024', '17/03/2024', '25/05/2024', '02/07/2024',
];

export const mockStudents: Student[] = Array.from({ length: 60 }, (_, i) => {
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[i % lastNames.length];
  const suffix = i >= 20 ? ` ${Math.floor(i / 20) + 1}` : '';

  return {
    id: `MOV-${String(i + 1).padStart(4, '0')}`,
    name: `${firstName} ${lastName}${suffix}`,
    email: generateEmail(firstName + (suffix.trim() || ''), lastName),
    status: i % 15 === 0 ? 'at_risk' as const : i % 8 === 0 ? 'inactive' as const : 'active' as const,
    score: Math.floor(seededRandom(i * 7 + 3) * 100),
    plan: plans[i % 3],
    lastVisit: fixedDates[i % fixedDates.length],
    payments: i % 12 === 0 ? 'overdue' as const : 'up_to_date' as const,
    joinDate: fixedJoinDates[i % fixedJoinDates.length],
  };
});

export const stats: KPIStat[] = [
  {
    id: 'kpi-total',
    label: 'Total Alunos',
    value: '2.840',
    change: '+12.5%',
    trend: 'up',
    icon: 'Users',
    description: 'vs. mês anterior',
  },
  {
    id: 'kpi-revenue',
    label: 'Receita Mensal',
    value: 'R$ 145.200',
    change: '+8.2%',
    trend: 'up',
    icon: 'DollarSign',
    description: 'vs. mês anterior',
  },
  {
    id: 'kpi-churn',
    label: 'Taxa de Churn',
    value: '2.4%',
    change: '-0.5%',
    trend: 'down',
    icon: 'TrendingDown',
    description: 'vs. mês anterior',
  },
  {
    id: 'kpi-signups',
    label: 'Novas Matrículas',
    value: '124',
    change: '+18%',
    trend: 'up',
    icon: 'UserPlus',
    description: 'vs. mês anterior',
  },
];

export const weeklyChartData: ChartData[] = [
  { label: 'SEG', value: 42 },
  { label: 'TER', value: 68 },
  { label: 'QUA', value: 47 },
  { label: 'QUI', value: 91 },
  { label: 'SEX', value: 58 },
  { label: 'SAB', value: 82 },
  { label: 'DOM', value: 35 },
];

export const recentActivity: ActivityItem[] = [
  { id: 'act-1', user: 'Carlos Silva', action: 'fez check-in', time: '2 min atrás', type: 'checkin' },
  { id: 'act-2', user: 'Ana Oliveira', action: 'realizou pagamento mensal', time: '15 min atrás', type: 'payment' },
  { id: 'act-3', user: 'Bruno Santos', action: 'se matriculou — Plano Platinum', time: '1h atrás', type: 'signup' },
  { id: 'act-4', user: 'Daniela Costa', action: 'não comparece há 7 dias', time: '2h atrás', type: 'alert' },
  { id: 'act-5', user: 'Eduardo Lima', action: 'fez check-in', time: '3h atrás', type: 'checkin' },
  { id: 'act-6', user: 'Fernanda Souza', action: 'realizou pagamento trimestral', time: '4h atrás', type: 'payment' },
  { id: 'act-7', user: 'Gabriel Rocha', action: 'se matriculou — Plano Basic Fit', time: '5h atrás', type: 'signup' },
  { id: 'act-8', user: 'Helena Martins', action: 'pagamento em atraso', time: '6h atrás', type: 'alert' },
];
