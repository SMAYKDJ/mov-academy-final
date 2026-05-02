/**
 * Definições de tipos para o módulo de Alunos.
 * Interfaces abrangentes para operações de CRUD, filtragem e exibição.
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
  risco: number; // risco de churn 0–100
  frequencia: number; // média de visitas/semana
  avatar?: string;
  biometry_id?: string;
  face_encoding?: any;
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
  senha?: string;
  biometry_id?: string;
}

export interface AlunosFilterState {
  search: string;
  status: AlunoStatus | 'todos';
  plano: AlunoPlan | 'todos';
  periodo: string;
}
