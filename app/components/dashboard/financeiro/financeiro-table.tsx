'use client';

import React, { useState, useMemo } from 'react';
import { Eye, ChevronUp, ChevronDown, ArrowUpRight, ArrowDownRight, RotateCcw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { EmptyState } from '@/components/ui/empty-state';
import type { Transaction, TransactionStatus, PaymentMethod } from '@/types/financeiro';

type SortField = 'descricao' | 'valor' | 'data' | 'status' | 'metodo';
type SortDir = 'asc' | 'desc' | null;

interface FinanceiroTableProps {
  data: Transaction[];
  onView: (txn: Transaction) => void;
}

const statusConfig: Record<TransactionStatus, { label: string; dot: string; bg: string; text: string }> = {
  pago:      { label: 'Pago',      dot: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-green-900/20 border-emerald-200 dark:border-green-800', text: 'text-emerald-700 dark:text-green-400' },
  pendente:  { label: 'Pendente',  dot: 'bg-amber-500',   bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',     text: 'text-amber-700 dark:text-amber-400' },
  atrasado:  { label: 'Atrasado',  dot: 'bg-red-500',     bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',              text: 'text-red-700 dark:text-red-400' },
  cancelado: { label: 'Cancelado', dot: 'bg-gray-400',    bg: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700',            text: 'text-gray-500 dark:text-gray-400' },
};

const metodoLabels: Record<PaymentMethod, string> = {
  pix: 'PIX',
  cartao: 'Cartão',
  boleto: 'Boleto',
  dinheiro: 'Dinheiro',
  debito: 'Débito',
};

export function FinanceiroTable({ data, onView }: FinanceiroTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const sorted = useMemo(() => {
    if (!sortField || !sortDir) return data;
    return [...data].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'descricao': cmp = a.descricao.localeCompare(b.descricao, 'pt-BR'); break;
        case 'valor': cmp = a.valor - b.valor; break;
        case 'status': cmp = a.status.localeCompare(b.status); break;
        case 'metodo': cmp = a.metodo.localeCompare(b.metodo); break;
        case 'data': {
          const parse = (d: string) => { const [dd, mm, yy] = d.split('/').map(Number); return new Date(yy, mm - 1, dd).getTime(); };
          cmp = parse(a.data) - parse(b.data);
          break;
        }
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortField, sortDir]);

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDir === 'asc') setSortDir('desc');
      else if (sortDir === 'desc') { setSortField(null); setSortDir(null); }
      else setSortDir('asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp className={cn("w-3 h-3 -mb-0.5", sortField === field && sortDir === 'asc' ? 'text-primary-600' : 'text-gray-300 dark:text-gray-600')} />
      <ChevronDown className={cn("w-3 h-3", sortField === field && sortDir === 'desc' ? 'text-primary-600' : 'text-gray-300 dark:text-gray-600')} />
    </span>
  );

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235]">
        <EmptyState
          icon={<Eye className="w-7 h-7 text-gray-400" />}
          title="Nenhuma transação encontrada"
          description="Ajuste os filtros ou registre uma nova transação."
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] overflow-hidden animate-slide-up">
      {/* Desktop Table */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-[#1a1d27]/50 border-b border-gray-100 dark:border-[#1e2235]">
              {(['descricao', 'valor', 'data', 'status', 'metodo'] as SortField[]).map(field => {
                const labels: Record<SortField, string> = {
                  descricao: 'Descrição',
                  valor: 'Valor',
                  data: 'Data',
                  status: 'Status',
                  metodo: 'Método',
                };
                return (
                  <th key={field} className="px-6 py-3.5 text-left">
                    <button
                      onClick={() => handleSort(field)}
                      className="flex items-center text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                    >
                      {labels[field]}
                      <SortIcon field={field} />
                    </button>
                  </th>
                );
              })}
              <th className="px-6 py-3.5 text-right">
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400">Ação</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-[#1e2235]">
            {paginated.map((txn) => {
              const isReceita = txn.tipo === 'receita';
              const statusCfg = statusConfig[txn.status];

              return (
                <tr
                  key={txn.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-[#1a1d27]/30 transition-colors cursor-pointer group"
                  onClick={() => onView(txn)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onView(txn)}
                >
                  {/* Descrição */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                        isReceita ? "bg-emerald-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
                      )}>
                        {isReceita
                          ? <ArrowDownRight className="w-4 h-4 text-emerald-600 dark:text-green-400" />
                          : <ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate max-w-[280px]">{txn.descricao}</p>
                        {txn.alunoNome && (
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold">{txn.categoria}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Valor */}
                  <td className="px-6 py-4">
                    <span className={cn(
                      "font-bold text-sm",
                      isReceita ? "text-emerald-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    )}>
                      {isReceita ? '+' : '-'} {formatCurrency(txn.valor)}
                    </span>
                  </td>

                  {/* Data */}
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {txn.data}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      statusCfg.bg,
                      statusCfg.text
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
                      {statusCfg.label}
                    </span>
                  </td>

                  {/* Método */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {metodoLabels[txn.metodo]}
                    </span>
                  </td>

                  {/* Ação */}
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onView(txn)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        aria-label={`Ver detalhes: ${txn.descricao}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-50 dark:divide-[#1e2235]">
        {paginated.map((txn) => {
          const isReceita = txn.tipo === 'receita';
          const statusCfg = statusConfig[txn.status];

          return (
            <div
              key={txn.id}
              className="p-4 hover:bg-gray-50/50 dark:hover:bg-[#1a1d27]/30 cursor-pointer active:bg-gray-100 dark:active:bg-[#1a1d27]"
              onClick={() => onView(txn)}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                    isReceita ? "bg-emerald-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
                  )}>
                    {isReceita
                      ? <ArrowDownRight className="w-4 h-4 text-emerald-600 dark:text-green-400" />
                      : <ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                    }
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white truncate text-sm">{txn.descricao}</p>
                </div>
                <span className={cn("font-bold text-sm whitespace-nowrap", isReceita ? "text-emerald-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                  {isReceita ? '+' : '-'}{formatCurrency(txn.valor)}
                </span>
              </div>
              <div className="flex items-center justify-between pl-12 text-xs text-gray-400">
                <span>{txn.data} · {metodoLabels[txn.metodo]}</span>
                <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border", statusCfg.bg, statusCfg.text)}>
                  <span className={cn("w-1 h-1 rounded-full", statusCfg.dot)} />
                  {statusCfg.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-[#1e2235] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Página <span className="font-bold text-gray-600 dark:text-gray-300">{page}</span> de{' '}
            <span className="font-bold text-gray-600 dark:text-gray-300">{totalPages}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 dark:border-[#2d3348] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1d27] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Anterior
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn("w-8 h-8 text-xs font-bold rounded-lg transition-all", p === page ? "bg-primary-600 text-white shadow-md" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1d27]")}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 dark:border-[#2d3348] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1d27] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
