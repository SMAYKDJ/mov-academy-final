'use client';

import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/cadastro'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const redirected = useRef(false);

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (loading) return; // Wait until auth state is resolved
    if (redirected.current) return;

    if (!user && !isPublic) {
      redirected.current = true;
      router.replace('/login');
    } else if (user && isPublic) {
      redirected.current = true;
      router.replace('/');
    } else {
      redirected.current = false; // Reset so future navigation works
    }
  }, [user, loading, isPublic, router]);

  // IMPORTANT: Always render children for public routes so /login page is never blocked by loading state
  if (isPublic) {
    return <>{children}</>;
  }

  // Show loading while auth state is resolving for PROTECTED routes
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

  // For protected routes: block rendering if no user (redirect is happening)
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
