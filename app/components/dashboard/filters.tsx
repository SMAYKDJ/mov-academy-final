'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Barra de filtros do dashboard com busca, filtro de status e filtro de plano.
 * Usa chips em estilo pill que são táteis e alternáveis.
 */

import { useDebounce } from '@/hooks/use-debounce';

const statusOptions = ['Todos', 'Ativo', 'Em Risco', 'Inativo'];
const planOptions = ['Todos', 'Black VIP', 'Platinum', 'Basic Fit'];

export function DashboardFilters({ onSearch }: { onSearch?: (term: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [planFilter, setPlanFilter] = useState('Todos');
  const [showAdvanced, setShowAdvanced] = useState(false);

  React.useEffect(() => {
    onSearch?.(debouncedSearch);
  }, [debouncedSearch, onSearch]);


  const hasActiveFilters = statusFilter !== 'Todos' || planFilter !== 'Todos';

  return (
    <div 
      className="space-y-3 animate-slide-up" 
      style={{ '--delay': '200ms', animationFillMode: 'backwards', animationDelay: 'var(--delay)' } as React.CSSProperties}
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white dark:bg-[#0f1117] border border-gray-100 dark:border-[#1e2235] p-2.5 rounded-2xl shadow-sm">
        {/* Busca */}
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            id="filter-search"
            placeholder="Filtrar por nome ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            aria-label="Filtrar alunos"
          />
        </div>

        <div className="h-px sm:h-7 sm:w-px bg-gray-100 dark:bg-[#1e2235]" aria-hidden="true" />

        {/* Chips de filtro */}
        <div className="flex items-center gap-2 overflow-x-auto scroll-hide py-1 sm:py-0">
          {/* Dropdown de status */}
          <div className="relative group/dropdown">
            <button
              title="Filtrar por status"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                statusFilter !== 'Todos'
                  ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
              )}
              aria-haspopup="listbox"
              aria-label="Filtrar por status"
            >
              Status: {statusFilter}
              <ChevronDown className="w-3 h-3" />
            </button>
            <div 
              role="listbox"
              title="Opções de Status"
              className="absolute top-full left-0 mt-1 bg-white dark:bg-[#1a1d27] border border-gray-100 dark:border-[#1e2235] rounded-xl shadow-xl py-1 min-w-[140px] hidden group-hover/dropdown:block z-20"
            >
              {statusOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setStatusFilter(opt)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-xs font-medium transition-colors",
                    statusFilter === opt
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                  role="option"
                  {...(statusFilter === opt ? { 'aria-selected': 'true' } : { 'aria-selected': 'false' })}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Dropdown de plano */}
          <div className="relative group/dropdown">
            <button
              title="Filtrar por plano"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                planFilter !== 'Todos'
                  ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
              )}
              aria-haspopup="listbox"
              aria-label="Filtrar por plano"
            >
              Plano: {planFilter}
              <ChevronDown className="w-3 h-3" />
            </button>
            <div 
              role="listbox"
              title="Opções de Plano"
              className="absolute top-full left-0 mt-1 bg-white dark:bg-[#1a1d27] border border-gray-100 dark:border-[#1e2235] rounded-xl shadow-xl py-1 min-w-[140px] hidden group-hover/dropdown:block z-20"
            >
              {planOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setPlanFilter(opt)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-xs font-medium transition-colors",
                    planFilter === opt
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                  role="option"
                  {...(planFilter === opt ? { 'aria-selected': 'true' } : { 'aria-selected': 'false' })}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Alternar filtro avançado */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
              showAdvanced
                ? "bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-none"
                : "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30"
            )}
          >
            <SlidersHorizontal className="w-3 h-3" />
            Avançado
          </button>

          {/* Limpar filtros */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                setStatusFilter('Todos');
                setPlanFilter('Todos');
              }}
              className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-danger-600 dark:text-red-400 hover:bg-danger-50 dark:hover:bg-red-900/10 rounded-xl transition-all whitespace-nowrap"
            >
              <X className="w-3 h-3" />
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Painel de filtros avançados */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-[#0f1117] border border-gray-100 dark:border-[#1e2235] p-5 rounded-2xl shadow-sm animate-scale-in">
          <div>
            <label htmlFor="date-from" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Data início</label>
            <input
              id="date-from"
              type="date"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#1e2235] rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-400 text-gray-900 dark:text-gray-100 transition-all"
            />
          </div>
          <div>
            <label htmlFor="date-to" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Data fim</label>
            <input
              id="date-to"
              type="date"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#1e2235] rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-400 text-gray-900 dark:text-gray-100 transition-all"
            />
          </div>
          <div>
            <label htmlFor="risk-range" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Risco mínimo (%)</label>
            <input
              id="risk-range"
              type="number"
              min={0}
              max={100}
              placeholder="0"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#1e2235] rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-400 text-gray-900 dark:text-gray-100 transition-all"
            />
          </div>
        </div>
      )}
    </div>
  );
}
