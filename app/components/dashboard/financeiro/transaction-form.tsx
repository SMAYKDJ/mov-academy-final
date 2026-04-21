'use client';

import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Transaction, TransactionType, TransactionStatus, PaymentMethod, RevenueCategory, ExpenseCategory } from '@/types/financeiro';

interface TransactionFormProps {
  open: boolean;
  transaction?: Transaction | null;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function TransactionForm({ open, transaction, onClose, onSave }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    tipo: 'receita' as TransactionType,
    descricao: '',
    valor: '',
    categoria: 'mensalidade',
    metodo: 'pix' as PaymentMethod,
    status: 'pago' as TransactionStatus,
    vencimento: new Date().toLocaleDateString('pt-BR'),
    alunoNome: '',
  });

  // Load data when editing
  React.useEffect(() => {
    if (transaction) {
      setFormData({
        tipo: transaction.tipo,
        descricao: transaction.descricao,
        valor: transaction.valor.toString(),
        categoria: transaction.categoria,
        metodo: transaction.metodo,
        status: transaction.status,
        vencimento: transaction.vencimento || new Date().toLocaleDateString('pt-BR'),
        alunoNome: transaction.alunoNome || '',
      });
    } else {
      // Reset for new
      setFormData({
        tipo: 'receita',
        descricao: '',
        valor: '',
        categoria: 'mensalidade',
        metodo: 'pix',
        status: 'pago',
        vencimento: new Date().toLocaleDateString('pt-BR'),
        alunoNome: '',
      });
    }
  }, [transaction, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      valor: parseFloat(formData.valor),
      data: transaction?.data || new Date().toLocaleDateString('pt-BR'),
      id: transaction?.id || `txn-${Math.random().toString(36).substr(2, 9)}`,
      recorrente: transaction?.recorrente || false
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white dark:bg-[#0f1117] rounded-2xl shadow-2xl border border-gray-100 dark:border-[#1e2235] overflow-hidden animate-scale-in">
        <div className="p-6 border-b border-gray-100 dark:border-[#1e2235] flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Nova Transação</h2>
          <button onClick={onClose} aria-label="Fechar formulário" title="Fechar" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Tipo</label>
            <div className="grid grid-cols-2 gap-2">
              {(['receita', 'despesa'] as TransactionType[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tipo: t, categoria: t === 'receita' ? 'mensalidade' : 'aluguel' }))}
                  className={cn(
                    "py-2 rounded-xl text-xs font-bold border transition-all",
                    formData.tipo === t 
                      ? "bg-primary-600 border-primary-600 text-white" 
                      : "border-gray-200 dark:border-[#2d3348] text-gray-500"
                  )}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <input
              required
              placeholder="Descrição (ex: Mensalidade João)"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#1e2235] text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              value={formData.descricao}
              onChange={e => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
            />
            
            <div className="grid grid-cols-2 gap-4">
               <input
                required
                type="number"
                step="0.01"
                placeholder="Valor (R$)"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#1e2235] text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.valor}
                onChange={e => setFormData(prev => ({ ...prev, valor: e.target.value }))}
              />
              <select
                aria-label="Método de pagamento"
                title="Método"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#1e2235] text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.metodo}
                onChange={e => setFormData(prev => ({ ...prev, metodo: e.target.value as PaymentMethod }))}
              >
                <option value="pix">PIX</option>
                <option value="cartao">Cartão</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="boleto">Boleto</option>
              </select>
            </div>

            <select
              aria-label="Status da transação"
              title="Status"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#1e2235] text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              value={formData.status}
              onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as TransactionStatus }))}
            >
              <option value="pago">Pago</option>
              <option value="pendente">Pendente</option>
              <option value="atrasado">Atrasado</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-primary-600 text-white rounded-xl text-sm font-bold shadow-xl shadow-primary-200 dark:shadow-none hover:bg-primary-700 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Save className="w-4 h-4" />
            Salvar Transação
          </button>
        </form>
      </div>
    </div>
  );
}
