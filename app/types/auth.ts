export type UserRole = 'admin' | 'recepcao' | 'professor';

export interface UserProfile {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  avatar_url?: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}
