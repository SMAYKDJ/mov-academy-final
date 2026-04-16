'use client';

import React, { useEffect, useRef } from 'react';
import { 
  X, Calendar, CreditCard, User, FileText, RotateCcw, 
  ArrowDownRight, ArrowUpRight, Tag, Clock, AlertCircle,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { openWhatsApp, generateWAMessage, notifyManager } from '@/utils/whatsapp-helper';
import { alunosData } from '@/utils/alunos-data';
import type { Transaction, TransactionStatus, PaymentMethod } from '@/types/financeiro';

interface TransactionDrawerProps {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
}

const statusConfig: Record<TransactionStatus, { label: string; color: string }> = {
  pago:      { label: 'Pago',      color: 'bg-emerald-50 dark:bg-green-900/20 text-emerald-700 dark:text-green-400 border-emerald-200 dark:border-green-800' },
  pendente:  { label: 'Pendente',  color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
  atrasado:  { label: 'Atrasado',  color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' },
  cancelado: { label: 'Cancelado', color: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700' },
};

const metodoLabels: Record<PaymentMethod, string> = {
  pix: 'PIX',
  cartao: 'Cartão de Crédito',
  boleto: 'Boleto Bancário',
  dinheiro: 'Dinheiro',
  debito: 'Cartão de Débito',
};

const categoryLabels: Record<string, string> = {
  mensalidade: 'Mensalidade',
  matricula: 'Matrícula',
  personal: 'Personal Trainer',
  avulso: 'Day Use / Avulso',
  produto: 'Venda de Produto',
  evento: 'Evento',
  aluguel: 'Aluguel',
  equipamento: 'Equipamento',
  salario: 'Folha de Pagamento',
  marketing: 'Marketing',
  manutencao: 'Manutenção',
  agua_luz: 'Água e Energia',
  sistema: 'Sistema / Software',
  outros: 'Outros',
};

export function TransactionDrawer({ transaction, open, onClose }: TransactionDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [open, onClose]);

  useEffect(() => {
    if (open && drawerRef.current) drawerRef.current.focus();
  }, [open]);

  if (!open || !transaction) return null;

  const txn = transaction;
  const isReceita = txn.tipo === 'receita';
  const statusCfg = statusConfig[txn.status];
  const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const details = [
    { icon: Tag, label: 'Categoria', value: categoryLabels[txn.categoria] || txn.categoria },
    { icon: CreditCard, label: 'Método', value: metodoLabels[txn.metodo] },
    { icon: Calendar, label: 'Data', value: txn.data },
    { icon: Clock, label: 'Vencimento', value: txn.vencimento },
    ...(txn.alunoNome ? [{ icon: User, label: 'Aluno', value: txn.alunoNome }] : []),
    { icon: RotateCcw, label: 'Recorrente', value: txn.recorrente ? 'Sim — cobrança automática' : 'Não — pagamento único' },
  ];

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={`Detalhes: ${txn.descricao}`}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden="true" />

      <div
        ref={drawerRef}
        tabIndex={-1}
        className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-white dark:bg-[#0f1117] shadow-2xl flex flex-col animate-slide-in-right"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-[#1e2235]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                isReceita ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-red-500 to-rose-600"
              )}>
                {isReceita
                  ? <ArrowDownRight className="w-7 h-7 text-white" />
                  : <ArrowUpRight className="w-7 h-7 text-white" />
                }
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">
                  {isReceita ? 'Receita' : 'Despesa'}
                </p>
                <p className={cn(
                  "text-2xl font-bold tracking-tight",
                  isReceita ? "text-emerald-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {isReceita ? '+' : '-'} {formatCurrency(txn.valor)}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400" aria-label="Fechar">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status + Description */}
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{txn.descricao}</p>
            <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", statusCfg.color)}>
              {statusCfg.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Overdue alert */}
          {txn.status === 'atrasado' && (
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-red-700 dark:text-red-400">Pagamento Atrasado</p>
                <p className="text-xs text-red-600 dark:text-red-400/70 mt-0.5">
                  O vencimento era em {txn.vencimento}. Considere entrar em contato com o aluno.
                </p>
              </div>
            </div>
          )}

          {/* Details list */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-3">
              Detalhes da Transação
            </h3>
            <div className="space-y-3">
              {details.map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-50 dark:bg-[#1a1d27] rounded-lg flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="min-w-0 pt-1">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">{item.label}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Observação */}
          {txn.observacao && (
            <div>
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-2">Observação</h3>
              <div className="p-4 bg-gray-50 dark:bg-[#1a1d27] rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400">{txn.observacao}</p>
              </div>
            </div>
          )}

          {/* Transaction ID */}
          <div className="pt-4 border-t border-gray-100 dark:border-[#1e2235]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">ID Transação</span>
              <code className="text-[10px] font-mono text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-[#1a1d27] px-2 py-1 rounded">{txn.id}</code>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 dark:border-[#1e2235] flex gap-3">
          {txn.status === 'pendente' || txn.status === 'atrasado' ? (
            <>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 dark:shadow-none">
                <CreditCard className="w-4 h-4" />
                Marcar como Pago
              </button>
              <button 
                onClick={() => {
                  const student = alunosData.find(s => s.id === txn.alunoId);
                  const phone = student?.telefone || '5521999999999';
                  const msg = generateWAMessage(txn.status === 'atrasado' ? 'cobranca' : 'lembrete', txn.alunoNome || 'Aluno', txn.valor, txn.vencimento);
                  openWhatsApp(phone, msg);
                }}
                className="px-4 py-3 border border-emerald-200 dark:border-green-800 text-emerald-600 dark:text-green-400 rounded-xl text-sm font-semibold hover:bg-emerald-50 dark:hover:bg-green-900/10 transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Lembrete WhatsApp
              </button>
            </>
          ) : (
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none">
              <FileText className="w-4 h-4" />
              Gerar Recibo
            </button>
          )}

          {/* New Confirmation Action */}
          {txn.status === 'pago' && txn.alunoId && (
            <button 
              onClick={() => {
                const student = alunosData.find(s => s.id === txn.alunoId);
                const phone = student?.telefone || '5521999999999';
                const msgStudent = generateWAMessage('pagamento_confirmado', txn.alunoNome || 'Aluno', txn.valor);
                
                // Open student confirmation
                openWhatsApp(phone, msgStudent);
                
                // Then notify manager (after a small delay to not block browsers)
                setTimeout(() => {
                  notifyManager(txn.alunoNome || 'Aluno', txn.valor);
                }, 1000);
              }}
              className="px-4 py-3 border border-emerald-200 dark:border-green-800 text-emerald-600 dark:text-green-400 rounded-xl text-sm font-semibold hover:bg-emerald-50 dark:hover:bg-green-900/10 transition-all flex items-center gap-2"
              title="Notificar Aluno e Gestor"
            >
              <MessageCircle className="w-4 h-4" />
              Notificar Recebimento
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
