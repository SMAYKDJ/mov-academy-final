/**
 * Types for the Configurações (Settings) module.
 */

export type UserRole = 'admin' | 'instrutor' | 'recepcao';

export interface SystemUser {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  ativo: boolean;
  ultimoAcesso: string;
}

export interface GymSettings {
  nome: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  logoUrl?: string;
  horarioAbertura: string;
  horarioFechamento: string;
}

export interface UserProfile {
  nome: string;
  email: string;
  telefone: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface IntegrationConfig {
  id: string;
  nome: string;
  tipo: 'webhook' | 'api' | 'whatsapp' | 'email';
  status: 'ativo' | 'inativo';
  url?: string;
  apiKey?: string;
}

export type SettingsTab = 'perfil' | 'academia' | 'seguranca' | 'usuarios' | 'integracoes' | 'preferencias';
