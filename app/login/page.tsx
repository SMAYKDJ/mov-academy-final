'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Dumbbell, Lock, Mail, Loader2, MessageCircle, ArrowLeft, Send } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function LoginPage() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalEmail = loginId.trim();

      // Se não contiver '@', assumimos que é um número de telefone
      if (!finalEmail.includes('@')) {
        const phoneDigits = loginId.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
          throw new Error('Informe um e-mail válido ou um telefone com DDD.');
        }

        // Buscar e-mail na tabela profiles usando o telefone
        // Note: Em produção real isso poderia expor e-mails, mas como ele digitará a senha na sequência, a API do Supabase protegerá o acesso de qualquer forma.
        const { data: profilesData, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .like('telefone', `%${phoneDigits}%`)
          .limit(1);

        if (profileError || !profilesData || profilesData.length === 0) {
          throw new Error('Nenhuma conta encontrada com este número de telefone.');
        }
        finalEmail = profilesData[0].email;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: finalEmail,
        password,
      });

      if (error) throw error;

      if (data.user) {
        showToast('Login realizado com sucesso!', 'success');
        router.push('/');
      }
    } catch (error: any) {
      showToast(error.message || 'Falha ao realizar login.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverPassword = async (method: 'email' | 'whatsapp') => {
    if (!loginId || !loginId.includes('@')) {
      showToast('Por favor, insira o seu e-mail no campo acima para recuperar a senha.', 'warning');
      return;
    }
    const email = loginId.trim();

    setLoading(true);
    try {
      if (method === 'email') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login/reset-password`,
        });
        if (error) throw error;
        showToast('Link de recuperação enviado para seu e-mail!', 'success', 'E-mail Enviado');
        setIsRecovering(false);
      } else {
        // Buscar telefone do perfil pelo e-mail
        const { data, error } = await supabase
          .from('profiles')
          .select('telefone')
          .eq('email', email)
          .maybeSingle();

        if (error || !data?.telefone) {
          throw new Error('Número de WhatsApp não encontrado para este e-mail. Verifique o e-mail ou contate o administrador.');
        }

        const phone = data.telefone.replace(/\D/g, '');
        const message = `Olá! Gostaria de solicitar o link de redefinição de senha para minha conta:\n\n📧 E-mail: ${email}\n\nPor favor, me envie o link de acesso.`;
        
        // Em um sistema real com API de WA, o servidor dispararia. Aqui simulamos o redirecionamento.
        window.open(`https://wa.me/${phone.startsWith('55') ? phone : '55' + phone}?text=${encodeURIComponent(message)}`, '_blank');
        
        showToast('Abrindo WhatsApp para solicitar o link...', 'success', 'WhatsApp');
        setIsRecovering(false);
      }
    } catch (error: any) {
      showToast(error.message || 'Falha ao processar solicitação.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#080a0f] flex items-center justify-center p-4 transition-all duration-500">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 dark:shadow-none mb-4 transform hover:scale-105 transition-transform duration-300">
            <Dumbbell className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            Moviment <span className="text-primary-600 dark:text-primary-400">Academy</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isRecovering ? 'Recuperação de Acesso' : 'Acesso Restrito ao Sistema'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#12141c] p-8 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-[#1e2235] relative overflow-hidden">
          {!isRecovering ? (
            <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-2">
                  E-mail ou Celular
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="E-mail ou Telefone (ex: 11999990000)"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400">
                    Senha
                  </label>
                  <button 
                    type="button"
                    onClick={() => setIsRecovering(true)}
                    className="text-[10px] font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 uppercase tracking-wider"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-70 group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Entrar no Sistema</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <div className="text-center pt-2">
                <a href="/cadastro" className="text-xs font-semibold text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                  Precisa de acesso? Crie a conta da sua equipe
                </a>
              </div>
            </form>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <button 
                onClick={() => setIsRecovering(false)}
                className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para o Login
              </button>

              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recupere sua senha</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Escolha como deseja receber o link de redefinição.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-2">
                    Confirme seu E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={loginId.includes('@') ? loginId : ''}
                      onChange={(e) => setLoginId(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      placeholder="seu.nome@moviment.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  <button
                    onClick={() => handleRecoverPassword('email')}
                    disabled={loading}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-2xl hover:border-primary-500 hover:bg-white dark:hover:bg-[#1e2235] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Via E-mail</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Enviaremos em sua caixa de entrada</p>
                      </div>
                    </div>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-gray-300 group-hover:text-primary-500" />}
                  </button>

                  <button
                    onClick={() => handleRecoverPassword('whatsapp')}
                    disabled={loading}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-2xl hover:border-emerald-500 hover:bg-white dark:hover:bg-[#1e2235] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Via WhatsApp</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Receba no número cadastrado</p>
                      </div>
                    </div>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-gray-300 group-hover:text-emerald-500" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
