import type { SystemUser, GymSettings, UserProfile, IntegrationConfig } from '@/types/configuracoes';

export const currentProfile: UserProfile = {
  nome: 'Admin Master',
  email: 'admin@movimentacademy.com',
  telefone: '(11) 99999-0001',
  role: 'admin',
};

export const gymSettingsData: GymSettings = {
  nome: 'Moviment Academy',
  cnpj: '12.345.678/0001-90',
  endereco: 'Av. Paulista, 1000 - São Paulo, SP',
  telefone: '(11) 3456-7890',
  email: 'contato@movimentacademy.com',
  horarioAbertura: '06:00',
  horarioFechamento: '23:00',
};

export const systemUsersData: SystemUser[] = [
  { id: 'u1', nome: 'Admin Master', email: 'admin@movimentacademy.com', role: 'admin', ativo: true, ultimoAcesso: '13/04/2026 21:30' },
  { id: 'u2', nome: 'Carlos Professor', email: 'carlos@movimentacademy.com', role: 'professor', ativo: true, ultimoAcesso: '13/04/2026 18:45' },
  { id: 'u3', nome: 'Maria Recepção', email: 'maria@movimentacademy.com', role: 'recepcao', ativo: true, ultimoAcesso: '13/04/2026 20:10' },
  { id: 'u4', nome: 'João Professor', email: 'joao@movimentacademy.com', role: 'professor', ativo: true, ultimoAcesso: '12/04/2026 14:22' },
  { id: 'u5', nome: 'Ana Suporte', email: 'ana@movimentacademy.com', role: 'recepcao', ativo: false, ultimoAcesso: '05/04/2026 09:00' },
];

export const integrationsData: IntegrationConfig[] = [
  { id: 'int-1', nome: 'Webhook de Pagamentos', tipo: 'webhook', status: 'ativo', url: 'https://academiamoviment.vercel.app/api/webhooks/stripe' },
  { id: 'int-2', nome: 'Stripe (PIX & Cartão)', tipo: 'api', status: 'inativo' },
  { id: 'int-3', nome: 'WhatsApp Business', tipo: 'whatsapp', status: 'inativo' },
  { id: 'int-4', nome: 'Notificações E-mail', tipo: 'email', status: 'ativo' },
];
