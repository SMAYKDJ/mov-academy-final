'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, ArrowUpRight, ArrowDownRight, Wallet, History, Lock, Unlock, AlertCircle, CheckCircle2, Loader2, Shield } from 'lucide-react';
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
  const [report, setReport] = useState<any>(null);
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
    fetchCurrentSession();
  }, [user]);

  const handleOpenCash = async () => {
    if (!openingBalance || isNaN(parseFloat(openingBalance)) || !user) {
      showToast("Insira um valor de abertura válido.", "error");
      return;
    }
    setActionLoading(true);
    try {
      const response = await fetch('/api/cash/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          opening_balance: parseFloat(openingBalance),
          notes: "Abertura de caixa via Dashboard"
        })
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setSession(data.session);
        showToast("Caixa aberto com sucesso!", "success");
      } else {
        showToast(data.message || "Erro ao abrir caixa.", "error");
      }
    } catch (err) {
      showToast("Erro de conexão com o servidor.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransfer = async (amount: number, destination: string) => {
    if (!session || !amount) return;
    setActionLoading(true);
    try {
      const response = await fetch('/api/cash/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.id,
          amount: amount,
          destination: destination,
          description: "Sangria enviada para o financeiro via dashboard"
        })
      });
      
      if (response.ok) {
        showToast(`R$ ${amount} transferidos para ${destination}!`, "success");
      } else {
        showToast("Erro na transferência.", "error");
      }
    } catch (err) {
      showToast("Falha na comunicação com o servidor.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseCash = async () => {
    if (!session) return;
    const balance = prompt("Informe o saldo final contado no caixa (R$):");
    if (balance === null) return;

    setActionLoading(true);
    try {
      const response = await fetch('/api/cash/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.id,
          closing_balance: parseFloat(balance),
          notes: "Fechamento realizado via Dashboard"
        })
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setReport(data.report);
        setSession(null);
        showToast("Caixa fechado com sucesso!", "success");
      }
    } catch (err) {
      showToast("Erro ao fechar caixa.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransaction = async () => {
    if (!transactionAmount || !transactionDesc || !session) return;
    setActionLoading(true);
    try {
      const response = await fetch('/api/cash/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.id,
          type: transactionType,
          amount: parseFloat(transactionAmount),
          description: transactionDesc,
          payment_method: "dinheiro"
        })
      });
      
      if (response.ok) {
        showToast(`Movimentação de ${transactionType} registrada!`, "success");
        setTransactionAmount('');
        setTransactionDesc('');
      } else {
        const err = await response.json();
        showToast(err.detail || "Erro ao registrar transação.", "error");
      }
    } catch (err) {
      showToast("Erro ao processar transação.", "error");
    } finally {
      setActionLoading(false);
    }
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
                  onClick={handleCloseCash}
                  disabled={actionLoading}
                  className="w-full py-4 bg-white dark:bg-red-600/10 border border-red-200 dark:border-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-black hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
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

            {/* Nova Seção: Sangria/Transferência Estruturada */}
            {session?.status === 'aberto' && (
              <div className="pt-4 mt-6 border-t border-white/10 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDownRight className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Sangria Estruturada</h4>
                </div>
                <button
                  onClick={() => {
                    const amt = prompt("Valor para transferência (Sangria):");
                    const dest = prompt("Destino (financeiro, cofre, banco):", "financeiro");
                    if (amt && dest) {
                      handleTransfer(parseFloat(amt), dest);
                    }
                  }}
                  className="w-full py-3 bg-white/5 border border-amber-500/30 text-amber-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all"
                >
                  Transferir para Caixa Geral
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dicas de Segurança e Alerta de Sangria */}
        <div className="space-y-4">
          {session?.status === 'aberto' && (
            <div className={cn(
              "p-6 rounded-3xl border animate-pulse-subtle flex gap-4 transition-all",
              1250 > 1000 
                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30" 
                : "bg-primary-50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-900/20"
            )}>
              <AlertCircle className={cn("w-6 h-6 shrink-0", 1250 > 1000 ? "text-red-600" : "text-primary-600")} />
              <div>
                <p className={cn("text-xs font-black uppercase tracking-widest mb-1", 1250 > 1000 ? "text-red-600" : "text-primary-600")}>
                  {1250 > 1000 ? "⚠️ ALERTA DE SEGURANÇA" : "Dica de Gestão"}
                </p>
                <p className={cn("text-xs leading-relaxed font-medium", 1250 > 1000 ? "text-red-900 dark:text-red-300" : "text-primary-900 dark:text-primary-300")}>
                  {1250 > 1000 
                    ? "O saldo em dinheiro físico ultrapassou R$ 1.000,00. Realize uma SANGRIA para o cofre imediatamente."
                    : "Lembre-se de realizar sangrias periódicas se o volume de dinheiro físico no caixa ultrapassar o limite de segurança."
                  }
                </p>
              </div>
            </div>
          )}
          
          <div className="p-6 bg-primary-50 dark:bg-primary-900/10 rounded-3xl border border-primary-100 dark:border-primary-900/20 flex gap-4">
            <Shield className="w-6 h-6 text-primary-600 shrink-0" />
            <div>
              <p className="text-xs font-black text-primary-600 uppercase tracking-widest mb-1">Auditoria Ativa</p>
              <p className="text-xs leading-relaxed text-primary-900 dark:text-primary-300">
                Todas as movimentações deste caixa estão sendo registradas com seu ID de usuário para fins de auditoria.
              </p>
            </div>
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
        {report && <CashReceipt report={report} operatorName={user?.nome || 'Operador'} />}
      </div>
    </div>
  );
}

// Componente de Comprovante de Impressão
function CashReceipt({ report, operatorName }: { report: any, operatorName: string }) {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:p-0 print:static print:bg-white animate-fade-in">
      <div className="bg-white text-black p-8 rounded-[32px] w-full max-w-md shadow-2xl print:shadow-none print:w-full font-mono text-sm leading-tight border-4 border-dashed border-gray-200 print:border-none relative overflow-hidden">
        
        {/* Selo de Caixa Saudável */}
        {report.is_healthy && (
          <div className="absolute top-4 right-4 bg-emerald-500 text-white p-2 rounded-full shadow-lg print:border-2 print:border-emerald-500 print:text-emerald-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        )}

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-black rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-black text-xl">M</div>
          <h2 className="text-xl font-black uppercase tracking-tighter mb-1">MOVIMENT ACADEMY</h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Relatório de Fechamento PDV</p>
        </div>

        <div className="space-y-4 border-y py-4 border-gray-100 mb-6">
          <div className="flex justify-between">
            <span className="font-bold">DATA/HORA:</span>
            <span>{new Date(report.closed_at).toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">OPERADOR:</span>
            <span className="uppercase">{operatorName}</span>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>SESSÃO ID:</span>
            <span>{report.operator_id?.slice(0, 8)}...</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-black uppercase tracking-widest border-b pb-1 mb-2">Resumo Operacional</h4>
          <div className="flex justify-between">
            <span>Vendas Prod.:</span>
            <span className="font-bold">{report.products_sold} itens</span>
          </div>
          <div className="flex justify-between text-amber-600">
            <span>Total Sangrias:</span>
            <span className="font-bold">R$ {report.sangria_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="space-y-2 mb-6 bg-gray-50 p-4 rounded-2xl print:bg-white print:border">
          <h4 className="text-xs font-black uppercase tracking-widest border-b pb-1 mb-2">Resumo Financeiro</h4>
          <div className="flex justify-between">
            <span>Abertura:</span>
            <span>R$ {report.opening_balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span>PIX:</span>
            <span>R$ {report.totals_by_method.pix.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span>Cartão:</span>
            <span>R$ {report.totals_by_method.cartao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2 mt-2 text-base">
            <span>SALDO FINAL:</span>
            <span>R$ {report.closing_balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-xs italic">
            <span className="text-gray-500">Diferença de Caixa:</span>
            <span className={cn(report.difference < 0 ? "text-red-600" : "text-emerald-600")}>
              {report.difference >= 0 ? '+' : ''}R$ {report.difference.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* QR Code Simulado e Assinaturas */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
             <div className="grid grid-cols-3 gap-1 p-2 opacity-30">
               {[...Array(9)].map((_, i) => <div key={i} className="w-3 h-3 bg-black" />)}
             </div>
          </div>
          <p className="text-[8px] text-gray-400 uppercase font-bold">Escaneie para Auditoria Digital</p>

          <div className="w-full flex justify-between gap-4 mt-4">
            <div className="flex-1 border-t border-black pt-1 text-center">
              <p className="text-[8px] font-bold uppercase">Operador</p>
            </div>
            <div className="flex-1 border-t border-black pt-1 text-center">
              <p className="text-[8px] font-bold uppercase">Gerente</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3 print:hidden">
          <button 
            onClick={() => window.print()}
            className="flex-1 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-gray-200"
          >
            Imprimir Cupom
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
          >
            Sair
          </button>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * { visibility: hidden; }
            .print-area, .print-area * { visibility: visible; }
            .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          }
        ` }} />
      </div>
    </div>
  );
}
