'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserProfile, UserRole } from '@/types/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Tempo limite de segurança para evitar o estado de carregamento permanente
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn("A inicialização da autenticação expirou. Prosseguindo...");
        setLoading(false);
      }
    }, 3000);

    // Ouve mudanças e a sessão inicial
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      try {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile && mounted) {
            setUser(profile as UserProfile);
          } else if (mounted) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              nome: session.user.user_metadata?.nome || 'Usuário',
              role: (session.user.user_metadata?.role as UserRole) || 'admin'
            });
          }
        } else if (mounted) {
          setUser(null);
        }
      } catch (err) {
        console.error("Erro na mudança de estado da autenticação:", err);
      } finally {
        if (mounted) {
          setLoading(false);
          clearTimeout(timeoutId);
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const hasRole = (roles: UserRole[]) => {
    return user ? roles.includes(user.role) : false;
  };

  const refreshProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profile) {
        setUser(profile as UserProfile);
      } else {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          nome: session.user.user_metadata?.nome || 'Usuário',
          role: (session.user.user_metadata?.role as UserRole) || 'admin',
          avatar_url: session.user.user_metadata?.avatar_url
        });
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, hasRole, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
