/**
 * Definições de tipos principais para o Moviment Academia Dashboard.
 * Todas as interfaces são centralizadas aqui para facilitar a manutenção.
 */

export interface Student {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'at_risk';
  score: number;
  plan: 'Black VIP' | 'Platinum' | 'Basic Fit';
  lastVisit: string;
  payments: 'up_to_date' | 'overdue';
  joinDate: string;
  frequency?: number;
  enrollment_months?: number;
  age?: number;
  overdue_days?: number;
  avatar?: string;
}

export interface KPIStat {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: 'Users' | 'DollarSign' | 'TrendingDown' | 'UserPlus';
  description: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  type: 'checkin' | 'payment' | 'signup' | 'alert';
}

export interface ChartData {
  label: string;
  value: number;
}

export type SortDirection = 'asc' | 'desc' | null;
export type SortField = 'name' | 'status' | 'plan' | 'score' | 'lastVisit';
