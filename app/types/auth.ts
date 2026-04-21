export type UserRole = 'admin' | 'ceo' | 'recepcao' | 'professor' | 'aluno';

export interface UserProfile {
  id: string;
  email: string;
  nome: string;
  telefone?: string;
  role: UserRole;
  avatar_url?: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}
