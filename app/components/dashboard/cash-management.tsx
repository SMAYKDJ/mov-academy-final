'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, ArrowUpRight, ArrowDownRight, Wallet, History, Lock, Unlock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from "@/utils/cn";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/hooks/use-auth";

interface CashSession {
  id: string;
  status: 'aberto' | 'fechado';
  opening_balance: number;
  opening_time: string;
}

export function CashManagement() {
  const [session, setSession] = useState<CashSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [openingBalance, setOpeningBalance] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionDesc, setTransactionDesc] = useState('');
  const [transactionType, setTransactionType] = useState<'entrada' | 'saida' | 'sangria'>('entrada');
  const { showToast } = useToast();
  const { user } = useAuth();

  const fetchCurrentSession = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Nota: Em um sistema real, buscaríamos a sessão ativa do usuário atual
      const response = await fetch(`/api/cash/current?user_id=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setSession(data.session);
      }
    } catch (error) {
      console.error("Erro ao buscar caixa:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Simulação para fins de demonstração inicial
    setTimeout(() => setLoading(false), 800);
  }, []);

  const handleOpenCash = async () => {
    if (!openingBalance || isNaN(parseFloat(openingBalance))) {
      showToast("Insira um valor de abertura válido.", "error");
      return;
    }
    setActionLoading(true);
    try {
      // Mock de sucesso para demonstração
      setSession({
        id: 'mock-session-123',
        status: 'aberto',
        opening_balance: parseFloat(openingBalance),
        opening_time: new Date().toISOString()
      });
      showToast("Caixa aberto com sucesso!", "success");
    } catch (err) {
      showToast("Erro ao abrir caixa.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransaction = async () => {
    if (!transactionAmount || !transactionDesc) return;
    setActionLoading(true);
    setTimeout(() => {
      showToast(`Movimentação de ${transactionType} registrada!`, "success");
      setTransactionAmount('');
      setTransactionDesc('');
      setActionLoading(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Coluna de Status e Abertura/Fechamento */}
      <div className="xl:col-span-1 space-y-6">
        <div className={cn(
          "p-8 rounded-[32px] border shadow-xl transition-all duration-500 relative overflow-hidden group",
          session?.status === 'aberto' 
            ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20" 
            : "bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/20"
        )}>
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            {session?.status === 'aberto' ? <Unlock className="w-32 h-32" /> : <Lock className="w-32 h-32" />}
          </div>

          <div className="relative z-10 space-y-6">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
              session?.status === 'aberto' ? "bg-emerald-500" : "bg-amber-500"
            )}>
              {session?.status === 'aberto' ? <Unlock className="text-white w-7 h-7" /> : <Lock className="text-white w-7 h-7" />}
            </div>

            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Status do Caixa
              </h2>
              <p className="text-sm font-bold opacity-60 uppercase tracking-widest mt-1">
                {session?.status === 'aberto' ? 'Operacional - Pronto para vendas' : 'Fechado - Necessário abertura'}
              </p>
            </div>

            {session?.status === 'aberto' ? (
              <div className="space-y-4 pt-4">
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-white dark:border-white/5 shadow-inner">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Saldo de Abertura</p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    R$ {session.opening_balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <button
                  onClick={() => setSession(null)}
                  className="w-full py-4 bg-white dark:bg-red-600/10 border border-red-200 dark:border-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-black hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm"
                >
                  Fechar Caixa Agora
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                  <input
                    type="number"
                    placeholder="Saldo Inicial (R$)"
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-black/20 border border-amber-200 dark:border-amber-900/20 rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
                <button
                  onClick={handleOpenCash}
                  disabled={actionLoading}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-sm font-black transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
                  Abrir Caixa do Dia
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dicas de Segurança */}
        <div className="p-6 bg-primary-50 dark:bg-primary-900/10 rounded-3xl border border-primary-100 dark:border-primary-900/20 flex gap-4">
          <AlertCircle className="w-6 h-6 text-primary-600 shrink-0" />
          <div>
            <p className="text-xs font-black text-primary-600 uppercase tracking-widest mb-1">Dica de Gestão</p>
            <p className="text-xs leading-relaxed text-primary-900 dark:text-primary-300">
              Lembre-se de realizar **sangrias** periódicas se o volume de dinheiro físico no caixa ultrapassar o limite de segurança da sua academia.
            </p>
          </div>
        </div>
      </div>

      {/* Coluna de Movimentações */}
      <div className="xl:col-span-2 space-y-6">
        <div className={cn(
          "bg-white dark:bg-[#0f1117] rounded-[32px] border border-gray-100 dark:border-[#1e2235] shadow-xl overflow-hidden transition-all",
          session?.status !== 'aberto' && "opacity-50 grayscale pointer-events-none"
        )}>
          <div className="p-8 border-b border-gray-100 dark:border-[#1e2235] bg-gray-50/50 dark:bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white dark:bg-[#1a1c26] rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-white/10">
                <History className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Nova Movimentação</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Entradas, Saídas e Sangrias</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Seletor de Tipo */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'entrada', label: 'Entrada', icon: ArrowUpRight, color: 'emerald' },
                { id: 'saida', label: 'Saída', icon: ArrowDownRight, color: 'red' },
                { id: 'sangria', label: 'Sangria', icon: Wallet, color: 'amber' }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setTransactionType(type.id as any)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all duration-300 group",
                    transactionType === type.id 
                      ? `bg-${type.color}-50 dark:bg-${type.color}-900/10 border-${type.color}-500 shadow-lg shadow-${type.color}-500/5` 
                      : "bg-gray-50/50 dark:bg-white/5 border-transparent hover:border-gray-200 dark:hover:border-white/10"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    transactionType === type.id ? `bg-${type.color}-500 text-white` : "bg-gray-200 dark:bg-gray-800 text-gray-400"
                  )}>
                    <type.icon className="w-5 h-5" />
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em]",
                    transactionType === type.id ? `text-${type.color}-600 dark:text-${type.color}-400` : "text-gray-400"
                  )}>{type.label}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Valor da Operação</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-gray-400">R$</span>
                  <input
                    type="number"
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                    placeholder="0,00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Descrição / Motivo</label>
                <input
                  type="text"
                  value={transactionDesc}
                  onChange={(e) => setTransactionDesc(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="Ex: Venda de água, Troco, Manutenção..."
                />
              </div>
            </div>

            <button
              onClick={handleTransaction}
              disabled={actionLoading || !transactionAmount || !transactionDesc}
              className="w-full py-4 bg-gray-900 dark:bg-primary-600 text-white rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gray-200 dark:shadow-primary-900/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
            >
              {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              Registrar Movimentação de {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}
            </button>
          </div>
        </div>

        {/* Resumo Rápido do Caixa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-white dark:bg-[#0f1117] rounded-3xl border border-gray-100 dark:border-[#1e2235] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Entradas</p>
                <p className="text-lg font-black text-emerald-600">R$ 1.250,00</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-300">Hoje</span>
          </div>
          <div className="p-6 bg-white dark:bg-[#0f1117] rounded-3xl border border-gray-100 dark:border-[#1e2235] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <ArrowDownRight className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Saídas</p>
                <p className="text-lg font-black text-red-600">R$ 340,00</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-300">Hoje</span>
          </div>
        </div>
      </div>
    </div>
  );
}
