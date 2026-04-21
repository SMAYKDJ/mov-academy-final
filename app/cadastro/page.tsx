'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Dumbbell, Lock, Mail, User, Loader2, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import Link from 'next/link';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Verificar se o e-mail já está cadastrado no sistema
      const { data: existingProfile, error: searchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingProfile) {
        throw new Error('Este e-mail já está cadastrado no sistema. Tente fazer login.');
      }

      // 2. Criar conta (Apenas como 'aluno' para cadastros públicos)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome,
            telefone,
            role: 'aluno'
          }
        }
      });

      if (error) throw error;

      showToast('Conta criada com sucesso! Verifique seu e-mail se necessário.', 'success', 'Bem-vindo!');
      router.push('/login');
    } catch (error: any) {
      showToast(error.message || 'Falha ao criar conta.', 'error', 'Erro no Cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#080a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 dark:shadow-none mb-4 transform hover:rotate-6 transition-transform">
            <Dumbbell className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            Moviment <span className="text-primary-600 dark:text-primary-400">Academy</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1 max-w-[250px]">Entre para o time e comece sua jornada fitness.</p>
        </div>

        {/* Formulário */}
        <div className="bg-white dark:bg-[#12141c] p-8 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-[#1e2235]">
          <form onSubmit={handleCadastro} className="space-y-5">
            <div>
              <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-2">
                Como devemos te chamar?
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-2">
                Seu melhor e-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="exemplo@email.com"
                />
              </div>
            </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-2">
              WhatsApp / Contato
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                required
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-2">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Mínimo de 6 caracteres.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Começar Agora'}
            </button>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-center space-y-3">
              <Link href="/login" className="block text-xs font-semibold text-gray-500 hover:text-primary-600 dark:text-gray-400 transition-colors">
                Já tem conta? <span className="text-primary-600 dark:text-primary-400">Entrar no sistema</span>
              </Link>
              
              <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
                <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                  <strong>Aviso:</strong> Professores, recepcionistas e administradores devem ser cadastrados manualmente pelo Suporte Técnico.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
