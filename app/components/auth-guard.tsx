'use client';

import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

// Rotas públicas que não exigem autenticação
const PUBLIC_ROUTES = ['/login', '/cadastro', '/login/reset-password'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const redirected = useRef(false);

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (loading) return; // Esperar até que o estado de autenticação seja resolvido
    if (redirected.current) return;

    if (!user && !isPublic) {
      redirected.current = true;
      router.replace('/login');
    } else if (user && isPublic) {
      redirected.current = true;
      router.replace('/');
    } else {
      redirected.current = false; // Redefinir para que a navegação futura funcione
    }
  }, [user, loading, isPublic, router]);

  // IMPORTANTE: Sempre renderizar os filhos para rotas públicas para que a página de /login nunca seja bloqueada pelo estado de carregamento
  if (isPublic) {
    return <>{children}</>;
  }

  // Mostrar carregamento enquanto o estado de autenticação está sendo resolvido para rotas PROTEGIDAS
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#080a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          <p className="text-sm font-medium text-gray-500">Autenticando...</p>
        </div>
      </div>
    );
  }

  // Para rotas protegidas: bloquear a renderização se não houver usuário (o redirecionamento está acontecendo)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#080a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          <p className="text-sm font-medium text-gray-500">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
