'use client';

import React, { useState, useCallback } from 'react';
import { Search, SlidersHorizontal, X, Calendar } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { AlunosFilterState, AlunoStatus, AlunoPlan } from '@/types/aluno';

interface AlunosFiltersProps {
  filters: AlunosFilterState;
  onChange: (filters: AlunosFilterState) => void;
  resultCount: number;
}

const statusOptions: { value: AlunoStatus | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' },
  { value: 'pendente', label: 'Pendente' },
];

const planOptions: { value: AlunoPlan | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'Mensal', label: 'Mensal' },
  { value: 'Trimestral', label: 'Trimestral' },
  { value: 'Semestral', label: 'Semestral' },
  { value: 'Anual', label: 'Anual' },
  { value: 'Black VIP', label: 'Black VIP' },
];

export function AlunosFilters({ filters, onChange, resultCount }: AlunosFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = useCallback((key: keyof AlunosFilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  }, [filters, onChange]);

  const clearFilters = () => {
    onChange({ search: '', status: 'todos', plano: 'todos', periodo: '' });
  };

  const hasActiveFilters = filters.search || filters.status !== 'todos' || filters.plano !== 'todos' || filters.periodo;

  return (
    <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] p-5 space-y-4 animate-fade-in">
      {/* Main Row */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou email..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            aria-label="Buscar alunos"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
              aria-label="Limpar busca"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Status Select */}
        <div className="relative min-w-[140px]">
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="w-full appearance-none px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer pr-8"
            aria-label="Filtrar por status"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                Status: {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Plan Select */}
        <div className="relative min-w-[150px]">
          <select
            value={filters.plano}
            onChange={(e) => updateFilter('plano', e.target.value)}
            className="w-full appearance-none px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer pr-8"
            aria-label="Filtrar por plano"
          >
            {planOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                Plano: {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Advanced Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all",
            showAdvanced
              ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border-primary-200 dark:border-primary-800"
              : "bg-gray-50 dark:bg-[#1a1d27] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-[#2d3348] hover:bg-gray-100 dark:hover:bg-[#242838]"
          )}
          aria-expanded={showAdvanced}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Avançado
        </button>
      </div>

      {/* Advanced Panel */}
      {showAdvanced && (
        <div className="pt-4 border-t border-gray-100 dark:border-[#1e2235] flex flex-col sm:flex-row gap-3 items-stretch sm:items-end animate-fade-in">
          <div className="flex-1">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5">
              Período de matrícula
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="month"
                value={filters.periodo}
                onChange={(e) => updateFilter('periodo', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                aria-label="Filtrar por período"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-danger-600 dark:text-red-400 hover:bg-danger-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
              aria-label="Limpar todos os filtros"
            >
              <X className="w-4 h-4" />
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          <span className="font-bold text-gray-600 dark:text-gray-300">{resultCount}</span> aluno{resultCount !== 1 ? 's' : ''} encontrado{resultCount !== 1 ? 's' : ''}
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline"
          >
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
}
