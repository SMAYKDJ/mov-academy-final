'use client';

import React, { useState, useMemo } from 'react';
import { Eye, Pencil, Trash2, ChevronUp, ChevronDown, MoreHorizontal, MessageCircle, UserX } from 'lucide-react';
import { cn } from '@/utils/cn';
import { StatusBadge, PlanBadge, RiskIndicator } from './status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import type { Aluno } from '@/types/aluno';
import { openWhatsApp } from '@/utils/whatsapp-helper';

type SortField = 'nome' | 'plano' | 'status' | 'risco' | 'ultimoPagamento' | 'telefone' | 'cpf';
type SortDir = 'asc' | 'desc' | null;

interface AlunosTableProps {
  data: Aluno[];
  loading?: boolean;
  onView: (aluno: Aluno) => void;
  onEdit: (aluno: Aluno) => void;
  onDelete: (aluno: Aluno) => void;
  expandedLayout?: boolean;
}

export function AlunosTable({ data, loading, onView, onEdit, onDelete, expandedLayout }: AlunosTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Ordenação
  const sorted = useMemo(() => {
    if (!sortField || !sortDir) return data;
    return [...data].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'nome':
          comparison = a.nome.localeCompare(b.nome, 'pt-BR');
          break;
        case 'plano':
          comparison = a.plano.localeCompare(b.plano, 'pt-BR');
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'risco':
          comparison = a.risco - b.risco;
          break;
        case 'ultimoPagamento': {
          const parseDate = (d: string) => {
            if (!d || typeof d !== 'string' || !d.includes('/')) return 0;
            const parts = d.split('/');
            if (parts.length < 3) return 0;
            const [day, month, year] = parts.map(Number);
            return new Date(year, month - 1, day).getTime();
          };
          comparison = parseDate(a.ultimoPagamento) - parseDate(b.ultimoPagamento);
          break;
        }
        case 'telefone':
          comparison = a.telefone.localeCompare(b.telefone);
          break;
        case 'cpf':
          comparison = a.cpf.localeCompare(b.cpf);
          break;
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });
  }, [data, sortField, sortDir]);

  // Paginação
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

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] overflow-hidden">
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="flex-1 h-4" />
              <Skeleton className="w-20 h-6 rounded-full" />
              <Skeleton className="w-20 h-6 rounded-lg" />
              <Skeleton className="w-16 h-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235]">
        <EmptyState
          icon={<Eye className="w-7 h-7 text-gray-400" />}
          title="Nenhum aluno encontrado"
          description="Tente ajustar seus filtros ou cadastre um novo aluno."
          action={{ label: 'Cadastrar Aluno', onClick: () => {} }}
        />
      </div>
    );
  }

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return (parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '');
  };

  const avatarColors = [
    'from-primary-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-pink-500 to-rose-600',
    'from-violet-500 to-purple-600',
    'from-sky-500 to-blue-600',
    'from-red-500 to-rose-600',
    'from-lime-500 to-green-600',
  ];

  return (
    <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] overflow-hidden animate-slide-up">
      {/* Tabela Desktop */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-[#1a1d27]/50 border-b border-gray-100 dark:border-[#1e2235]">
              {(() => {
                const labels: Record<string, string> = {
                  nome: 'Aluno',
                  status: 'Status',
                  plano: 'Plano',
                  risco: 'Risco',
                  ultimoPagamento: 'Último Pag.',
                  telefone: 'Telefone',
                  cpf: 'CPF',
                };
                
                const visibleFields = ['nome', 'status', 'plano', 'risco'];
                if (expandedLayout) {
                  visibleFields.push('telefone', 'cpf');
                }
                visibleFields.push('ultimoPagamento');

                return visibleFields.map(field => (
                  <th key={field} className="px-6 py-3.5 text-left">
                    <button
                      onClick={() => handleSort(field as SortField)}
                      className="flex items-center text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                      aria-label={`Ordenar por ${labels[field]}`}
                    >
                      {labels[field]}
                      <SortIcon field={field as SortField} />
                    </button>
                  </th>
                ));
              })()}
              <th className="px-6 py-3.5 text-right">
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-[#1e2235]">
            {paginated.map((aluno, idx) => (
              <tr
                key={aluno.id}
                className="hover:bg-gray-50/50 dark:hover:bg-[#1a1d27]/30 transition-colors cursor-pointer group"
                onClick={() => onView(aluno)}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onView(aluno)}
                aria-label={`Ver detalhes de ${aluno.nome}`}
              >
                {/* Aluno */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-xs shrink-0",
                      avatarColors[aluno.id % avatarColors.length]
                    )}>
                      {getInitials(aluno.nome)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{aluno.nome}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{aluno.email}</p>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <StatusBadge status={aluno.status} />
                </td>

                {/* Plano */}
                <td className="px-6 py-4">
                  <PlanBadge plan={aluno.plano} />
                </td>

                {/* Risco */}
                <td className="px-6 py-4 w-36">
                  <RiskIndicator risk={aluno.risco} />
                </td>

                {/* Telefone (Expandido) */}
                {expandedLayout && (
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap tabular-nums">
                    {aluno.telefone}
                  </td>
                )}

                {/* CPF (Expandido) */}
                {expandedLayout && (
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap tabular-nums">
                    {aluno.cpf}
                  </td>
                )}

                {/* Último Pagamento */}
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {aluno.ultimoPagamento}
                </td>

                {/* Ações */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onView(aluno)}
                      title="Ver detalhes"
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      aria-label={`Ver ${aluno.nome}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(aluno)}
                      title="Editar aluno"
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                      aria-label={`Editar ${aluno.nome}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(aluno)}
                      title="Inativar aluno"
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-gray-400 hover:text-danger-600 dark:hover:text-red-400 transition-colors"
                      aria-label={`Inativar ${aluno.nome}`}
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openWhatsApp(aluno.telefone)}
                      title="Enviar WhatsApp"
                      className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/10 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      aria-label={`WhatsApp ${aluno.nome}`}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cartões Mobile */}
      <div className="md:hidden divide-y divide-gray-50 dark:divide-[#1e2235]">
        {paginated.map((aluno) => (
          <div
            key={aluno.id}
            className="p-4 hover:bg-gray-50/50 dark:hover:bg-[#1a1d27]/30 transition-colors cursor-pointer active:bg-gray-100 dark:active:bg-[#1a1d27]"
            onClick={() => onView(aluno)}
            role="button"
            tabIndex={0}
            aria-label={`Ver detalhes de ${aluno.nome}`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={cn(
                "w-11 h-11 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-xs shrink-0",
                avatarColors[aluno.id % avatarColors.length]
              )}>
                {getInitials(aluno.nome)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{aluno.nome}</p>
                  <StatusBadge status={aluno.status} />
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{aluno.email}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); openWhatsApp(aluno.telefone); }}
                className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400"
                aria-label={`WhatsApp ${aluno.nome}`}
              >
                <MessageCircle className="w-5 h-5 fill-current opacity-20" />
                <MessageCircle className="w-5 h-5 absolute inset-2.5" />
              </button>
            </div>
            <div className="flex items-center justify-between pl-14">
              <PlanBadge plan={aluno.plano} />
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <RiskIndicator risk={aluno.risco} compact />
                <span>Pag: {aluno.ultimoPagamento}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-[#1e2235] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Página <span className="font-bold text-gray-600 dark:text-gray-300">{page}</span> de{' '}
            <span className="font-bold text-gray-600 dark:text-gray-300">{totalPages}</span> ·{' '}
            {sorted.length} resultado{sorted.length !== 1 ? 's' : ''}
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
                className={cn(
                  "w-8 h-8 text-xs font-bold rounded-lg transition-all",
                  p === page
                    ? "bg-primary-600 text-white shadow-md"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1d27]"
                )}
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
