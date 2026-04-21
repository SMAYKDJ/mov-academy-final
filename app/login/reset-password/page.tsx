'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Dumbbell, Lock, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    // Check if we are actually in a reset session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // Supabase sets the session automatically when clicking the link
      if (!session) {
        // showToast('Sessão de recuperação inválida ou expirada.', 'error');
        // router.push('/login');
      }
    };
    checkSession();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      showToast('As senhas não coincidem.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('A senha deve ter pelo menos 6 caracteres.', 'warning');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      showToast('Senha redefinida com sucesso!', 'success');
      
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      showToast(error.message || 'Falha ao redefinir senha.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#080a0f] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white dark:bg-[#12141c] p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-[#1e2235] flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Senha Alterada!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Sua senha foi atualizada com sucesso. Você será redirecionado para o login em instantes.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all"
            >
              Ir para o Login Agora
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#080a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Dumbbell className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            Moviment <span className="text-primary-600 dark:text-primary-400">Academy</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Crie sua nova senha de acesso</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#12141c] p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-[#1e2235]">
          <div className="flex items-center gap-3 mb-8 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-2xl">
            <ShieldCheck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 leading-tight">
              Sua sessão de recuperação está ativa. Escolha uma senha forte.
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-2">
                Nova Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-2">
                Confirme a Nova Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Redefinir Senha'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
