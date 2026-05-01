'use client';

import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/use-auth';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    nome: string;
    email: string;
  } | null;
}

export function ResetPasswordModal({ isOpen, onClose, user }: ResetPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();

  if (!isOpen || !user) return null;

  const handleReset = async () => {
    if (password.length < 6) {
      showToast('A senha deve ter pelo menos 6 caracteres.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          newPassword: password,
          adminId: currentUser?.id
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao resetar senha');
      }

      showToast(`Senha de ${user.nome} atualizada com sucesso!`, 'success');
      setPassword('');
      onClose();
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white dark:bg-[#0f1117] w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 dark:border-[#1e2235] overflow-hidden animate-scale-in">
        <div className="p-6 border-b border-gray-50 dark:border-[#1e2235] flex items-center justify-between bg-gray-50/50 dark:bg-[#1a1d27]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Redefinir Senha</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Modo Administrador</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-900/30">
            <p className="text-xs text-primary-700 dark:text-primary-300 leading-relaxed">
              Você está definindo uma nova senha para <strong>{user.nome}</strong> ({user.email}). 
              O usuário poderá fazer login imediatamente com a nova credencial.
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-2">
                Nova Senha Temporária
              </label>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="No mínimo 6 caracteres"
                className="w-full pl-4 pr-12 py-3.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-2xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleReset}
              disabled={loading || password.length < 6}
              className="w-full py-4 bg-primary-600 text-white rounded-2xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              {loading ? 'Processando...' : 'Confirmar Nova Senha'}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-4">
              Esta ação será registrada nos logs de auditoria do sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
