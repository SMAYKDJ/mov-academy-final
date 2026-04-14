/**
 * Type definitions for the Alunos (Students) module.
 * Comprehensive interfaces for CRUD operations, filtering, and display.
 */

export type AlunoStatus = 'ativo' | 'inativo' | 'pendente';
export type AlunoPlan = 'Mensal' | 'Trimestral' | 'Semestral' | 'Anual' | 'Black VIP';
export type PaymentStatus = 'em_dia' | 'atrasado' | 'vencido';

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: 'pix' | 'cartao' | 'boleto' | 'dinheiro';
  status: 'pago' | 'pendente' | 'cancelado';
}

export interface Aluno {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  plano: AlunoPlan;
  status: AlunoStatus;
  ultimoPagamento: string;
  dataMatricula: string;
  dataNascimento: string;
  endereco: string;
  objetivo: string;
  risco: number; // 0–100 churn risk
  frequencia: number; // avg visits/week
  avatar?: string;
  historicoPagamentos: PaymentRecord[];
}

export interface AlunoFormData {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  plano: AlunoPlan;
  status: AlunoStatus;
  dataNascimento: string;
  endereco: string;
  objetivo: string;
}

export interface AlunosFilterState {
  search: string;
  status: AlunoStatus | 'todos';
  plano: AlunoPlan | 'todos';
  periodo: string;
}
