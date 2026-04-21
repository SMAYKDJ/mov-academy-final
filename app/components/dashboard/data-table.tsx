'use client';

import React, { useState, useMemo } from 'react';
import { MoreHorizontal, Filter, Download, Search, ChevronUp, ChevronDown, ChevronsUpDown, Eye, Brain } from 'lucide-react';
import { ExplanationModal } from './explanation-modal';
import { cn } from '@/utils/cn';
import type { Student, SortDirection, SortField } from '@/types';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';

/**
 * Status display configuration.
 */
const statusConfig: Record<Student['status'], { label: string; variant: 'success' | 'danger' | 'neutral' }> = {
  active: { label: 'Ativo', variant: 'success' },
  at_risk: { label: 'Em Risco', variant: 'danger' },
  inactive: { label: 'Inativo', variant: 'neutral' },
};

/**
 * Plan badge colors.
 */
const planColors: Record<string, string> = {
  'Black VIP': 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900',
  'Platinum': 'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 text-gray-800 dark:text-gray-100',
  'Basic Fit': 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400',
};

const ITEMS_PER_PAGE = 10;

/**
 * Sortable column header component.
 */
function SortableHeader({
  label,
  field,
  currentSort,
  currentDirection,
  onSort,
}: {
  label: string;
  field: SortField;
  currentSort: SortField | null;
  currentDirection: SortDirection;
  onSort: (field: SortField) => void;
}) {
  const isActive = currentSort === field;

  return (
    <button
      className="flex items-center gap-1.5 group"
      onClick={() => onSort(field)}
      aria-label={`Ordenar por ${label}`}
    >
      <span>{label}</span>
      <span className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors">
        {isActive && currentDirection === 'asc' ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : isActive && currentDirection === 'desc' ? (
          <ChevronDown className="w-3.5 h-3.5" />
        ) : (
          <ChevronsUpDown className="w-3.5 h-3.5" />
        )}
      </span>
    </button>
  );
}

/**
 * Skeleton loader for data table.
 */
export function DataTableSkeleton() {
  return (
    <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-[#1e2235] flex justify-between">
        <div>
          <Skeleton className="w-32 h-5 rounded mb-2" />
          <Skeleton className="w-48 h-3 rounded" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-24 h-9 rounded-xl" />
          <Skeleton className="w-24 h-9 rounded-xl" />
        </div>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-[#1e2235]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex items-center gap-6">
            <Skeleton className="w-9 h-9 rounded-full" />
            <Skeleton className="w-32 h-4 rounded flex-1" />
            <Skeleton className="w-16 h-6 rounded-full" />
            <Skeleton className="w-20 h-4 rounded" />
            <Skeleton className="w-24 h-2 rounded-full" />
            <Skeleton className="w-20 h-4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DataTable({ data }: { data: Student[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  const handleOpenAnalysis = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  /**
   * Handle column sort toggle (null → asc → desc → null).
   */
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  /**
   * Filter, sort, and paginate data.
   */
  const processedData = useMemo(() => {
    let filtered = data;

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = data.filter(
        (s) => s.name.toLowerCase().includes(term) || s.id.toLowerCase().includes(term) || s.plan.toLowerCase().includes(term)
      );
    }

    // Apply sort
    if (sortField && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        const aStr = String(aVal);
        const bStr = String(bVal);
        return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
    }

    return filtered;
  }, [data, searchTerm, sortField, sortDirection]);

  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  const pageData = processedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleExport = () => {
    showToast('Relatório exportado com sucesso!', 'success', 'Exportação');
  };

  return (
    <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
      {/* Table Header */}
      <div className="p-5 md:p-6 border-b border-gray-100 dark:border-[#1e2235] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-none">Base de Alunos</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {processedData.length} aluno{processedData.length !== 1 ? 's' : ''} encontrado{processedData.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Inline search */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-4 py-2 border border-gray-200 dark:border-[#1e2235] rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-400 bg-white dark:bg-[#0f1117] text-gray-900 dark:text-gray-100 w-full sm:w-48 transition-all"
              aria-label="Pesquisar na tabela"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white dark:text-gray-900 border border-gray-900 dark:border-white rounded-xl text-sm font-medium text-white hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg shadow-gray-200 dark:shadow-none shrink-0"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left" role="table">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-[#1a1d27]/50">
              <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                <SortableHeader label="Aluno" field="name" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort} />
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                <SortableHeader label="Status" field="status" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort} />
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                <SortableHeader label="Plano" field="plan" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort} />
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">
                <SortableHeader label="Risco IA" field="score" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort} />
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                Último Acesso
              </th>
              <th className="px-6 py-3.5" aria-label="Ações" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-[#1e2235]">
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    icon={<Search className="w-6 h-6 text-gray-300 dark:text-gray-600" />}
                    title="Nenhum aluno encontrado"
                    description="Tente ajustar os filtros ou termos de busca para encontrar os alunos desejados."
                    action={{
                      label: 'Limpar busca',
                      onClick: () => setSearchTerm(''),
                    }}
                  />
                </td>
              </tr>
            ) : (
              pageData.map((student) => {
                const statusCfg = statusConfig[student.status];
                return (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-[#1a1d27]/30 transition-colors group"
                  >
                    {/* Student Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-white dark:ring-[#0f1117] shrink-0",
                          student.status === 'active'
                            ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                            : student.status === 'at_risk'
                              ? "bg-danger-50 dark:bg-red-900/30 text-danger-700 dark:text-red-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                        )}>
                          {student.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{student.name}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{student.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <Badge variant={statusCfg.variant} dot>{statusCfg.label}</Badge>
                    </td>

                    {/* Plan */}
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold",
                        planColors[student.plan] || planColors['Basic Fit']
                      )}>
                        {student.plan}
                      </span>
                    </td>

                    {/* AI Risk Score */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1.5 min-w-[100px]">
                        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              student.score > 70 ? "bg-danger-500" : student.score > 30 ? "bg-warning-500" : "bg-success-500"
                            )}
                            style={{ width: `var(--risk-w, ${student.score}%)` } as React.CSSProperties}
                            role="progressbar"
                            {...({
                              'aria-valuenow': student.score,
                              'aria-valuemin': 0,
                              'aria-valuemax': 100
                            })}
                            aria-label={`Risco de churn: ${student.score}%`}
                          />
                        </div>
                        <span className={cn(
                          "text-[10px] font-bold",
                          student.score > 70 ? "text-danger-600 dark:text-red-400" : student.score > 30 ? "text-warning-600 dark:text-amber-400" : "text-success-600 dark:text-green-400"
                        )}>
                          {student.score}%
                        </span>
                      </div>
                    </td>

                    {/* Last Visit */}
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                      {student.lastVisit}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenAnalysis(student)}
                          className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors text-primary-600 dark:text-primary-400"
                          title="Análise Inteligente IA"
                        >
                          <Brain className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                          aria-label={`Ver perfil de ${student.name}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                          aria-label={`Mais ações para ${student.name}`}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {processedData.length > 0 && (
        <div className="p-4 border-t border-gray-100 dark:border-[#1e2235] bg-gray-50/30 dark:bg-[#0d0f15] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Página <span className="text-gray-900 dark:text-white font-bold">{currentPage}</span> de{' '}
            <span className="text-gray-900 dark:text-white font-bold">{totalPages}</span>
            {' · '}
            <span className="text-gray-400">{processedData.length} resultados</span>
          </p>
          <div className="flex gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 border border-gray-200 dark:border-[#1e2235] bg-white dark:bg-[#0f1117] rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Anterior
            </button>
            {/* Page numbers */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                    currentPage === pageNum
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-none"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3.5 py-1.5 border border-gray-200 dark:border-[#1e2235] bg-white dark:bg-[#0f1117] rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
      <ExplanationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
}
