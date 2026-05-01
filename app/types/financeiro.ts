/**
 * Definições de tipos para o módulo Financeiro.
 * Abrange transações, categorias, KPIs e estados de filtro.
 */

export type TransactionType = 'receita' | 'despesa';
export type TransactionStatus = 'pago' | 'pendente' | 'atrasado' | 'cancelado';
export type PaymentMethod = 'pix' | 'cartao' | 'boleto' | 'dinheiro' | 'debito';

export type RevenueCategory =
  | 'mensalidade'
  | 'matricula'
  | 'personal'
  | 'avulso'
  | 'produto'
  | 'evento';

export type ExpenseCategory =
  | 'aluguel'
  | 'equipamento'
  | 'salario'
  | 'marketing'
  | 'manutencao'
  | 'agua_luz'
  | 'sistema'
  | 'outros';

export interface Transaction {
  id: string;
  tipo: TransactionType;
  descricao: string;
  categoria: RevenueCategory | ExpenseCategory;
  valor: number;
  data: string; // DD/MM/YYYY
  vencimento: string; // DD/MM/YYYY
  status: TransactionStatus;
  metodo: PaymentMethod;
  alunoNome?: string; // nome do aluno vinculado
  alunoId?: number;
  observacao?: string;
  recorrente: boolean;
}

export interface FinanceiroKPIData {
  receitaMensal: number;
  despesaMensal: number;
  lucroLiquido: number;
  inadimplencia: number;
  ticketMedio: number;
  totalTransacoes: number;
}

export interface MonthlyRevenue {
  mes: string; // "Jan", "Fev", etc.
  receita: number;
  despesa: number;
}

export interface FinanceiroFilterState {
  search: string;
  tipo: TransactionType | 'todos';
  status: TransactionStatus | 'todos';
  metodo: PaymentMethod | 'todos';
  periodo: string; // YYYY-MM
}
