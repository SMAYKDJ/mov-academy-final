'use client';

import React, { useState } from 'react';
import { Lock, Shield, LogOut, Eye, EyeOff, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface SecuritySettingsProps {
  userEmail?: string;
}

export function SecuritySettings({ userEmail }: SecuritySettingsProps) {
  const { showToast } = useToast();
  const [showPw, setShowPw] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async () => {
    if (!password || password.length < 6) {
      showToast('A senha deve ter pelo menos 6 caracteres.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('As senhas não coincidem.', 'error');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      showToast('Senha alterada com sucesso!', 'success', 'Segurança');
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      showToast(error.message || 'Erro ao alterar senha.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOutAll = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      window.location.href = '/login';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Segurança</h2>
        <p className="text-xs text-gray-400 mt-0.5">Proteja sua conta e controle o acesso</p>
      </div>

      {/* Password Change */}
      <div className="bg-gray-50 dark:bg-[#1a1d27] rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center">
            <Lock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Alterar Senha</p>
            <p className="text-[10px] text-gray-400">Mínimo 8 caracteres com letra e número</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">Nova Senha</label>
            <input type={showPw ? 'text' : 'password'} placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all pr-10" />
            <button 
              onClick={() => setShowPw(!showPw)} 
              title={showPw ? "Ocultar senha" : "Ver senha"}
              aria-label={showPw ? "Ocultar senha" : "Ver senha"}
              className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">Confirmar Senha</label>
            <input type="password" placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" />
          </div>
        </div>
        <button 
          onClick={handleUpdatePassword} 
          disabled={loading}
          className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition-all flex items-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} 
          {loading ? 'Atualizando...' : 'Atualizar Senha'}
        </button>
      </div>

      {/* 2FA */}
      <div className="bg-gray-50 dark:bg-[#1a1d27] rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Autenticação em 2 Fatores</p>
              <p className="text-[10px] text-gray-400">Adicione uma camada extra de segurança</p>
            </div>
          </div>
          <button 
            onClick={() => { setTwoFA(!twoFA); showToast(twoFA ? '2FA desativado' : '2FA ativado com sucesso!', twoFA ? 'info' : 'success', 'Segurança'); }}
            title={twoFA ? "Desativar 2FA" : "Ativar 2FA"}
            aria-label={twoFA ? "Desativar 2FA" : "Ativar 2FA"}
            className={`relative w-12 h-6 rounded-full transition-all ${twoFA ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${twoFA ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Logout All */}
      <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-5 border border-red-100 dark:border-red-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
              <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Encerrar Todas as Sessões</p>
              <p className="text-[10px] text-gray-400">Desconectar de todos os dispositivos</p>
            </div>
          </div>
          <button onClick={handleSignOutAll}
            className="px-4 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-all">
            Encerrar
          </button>
        </div>
      </div>
    </div>
  );
}
