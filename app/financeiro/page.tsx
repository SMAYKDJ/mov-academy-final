'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { FinanceiroKPI } from '@/components/dashboard/financeiro/financeiro-kpi';
import { FinanceiroFilters } from '@/components/dashboard/financeiro/financeiro-filters';
import { FinanceiroTable } from '@/components/dashboard/financeiro/financeiro-table';
import { RevenueChart } from '@/components/dashboard/financeiro/revenue-chart';
import { ExpenseBreakdown } from '@/components/dashboard/financeiro/expense-breakdown';
import { TransactionDrawer } from '@/components/dashboard/financeiro/transaction-drawer';
import { transacoesData, monthlyRevenueData } from '@/utils/financeiro-data';
import { useToast } from '@/components/ui/toast';
import { Plus, Download, FileText } from 'lucide-react';
import type { Transaction, FinanceiroFilterState } from '@/types/financeiro';

/**
 * Financeiro (Financial) page — complete financial management module.
 * Features: KPIs, revenue chart, expense breakdown, transaction table, detail drawer.
 */
export default function FinanceiroPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { showToast } = useToast();

  // Data
  const [transacoes] = useState<Transaction[]>(transacoesData);

  // Filters
  const [filters, setFilters] = useState<FinanceiroFilterState>({
    search: '',
    tipo: 'todos',
    status: 'todos',
    metodo: 'todos',
    periodo: '',
  });

  // UI
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Filter logic
  const filtered = useMemo(() => {
    return transacoes.filter(t => {
      // Search
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (
          !t.descricao.toLowerCase().includes(q) &&
          !(t.alunoNome || '').toLowerCase().includes(q) &&
          !t.id.toLowerCase().includes(q)
        ) return false;
      }

      // Type
      if (filters.tipo !== 'todos' && t.tipo !== filters.tipo) return false;

      // Status
      if (filters.status !== 'todos' && t.status !== filters.status) return false;

      // Method
      if (filters.metodo !== 'todos' && t.metodo !== filters.metodo) return false;

      // Period
      if (filters.periodo) {
        const [filterYear, filterMonth] = filters.periodo.split('-').map(Number);
        const parts = t.data.split('/');
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        if (year !== filterYear || month !== filterMonth) return false;
      }

      return true;
    });
  }, [transacoes, debouncedSearch, filters.tipo, filters.status, filters.metodo, filters.periodo]);

  // Handlers
  const handleView = useCallback((txn: Transaction) => {
    setSelectedTxn(txn);
    setDrawerOpen(true);
  }, []);

  const handleExport = () => {
    showToast('Relatório financeiro exportado com sucesso', 'success', 'Exportação');
  };

  const handleReport = () => {
    showToast('Relatório DRE gerado com sucesso', 'success', 'Relatório');
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#080a0f]">
      <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      <div className="flex-1 md:ml-64 transition-all duration-300">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-fade-in">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Financeiro
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                Controle de receitas, despesas e fluxo de caixa da academia
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleReport}
                className="px-4 py-2.5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Relatório DRE
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2.5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <button className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                <Plus className="w-4 h-4" />
                Nova Transação
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <FinanceiroKPI transacoes={transacoes} />

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            <div className="xl:col-span-3">
              <RevenueChart data={monthlyRevenueData} />
            </div>
            <div className="xl:col-span-2">
              <ExpenseBreakdown transacoes={transacoes} />
            </div>
          </div>

          {/* Filters */}
          <FinanceiroFilters
            filters={filters}
            onChange={setFilters}
            resultCount={filtered.length}
          />

          {/* Transactions Table */}
          <FinanceiroTable
            data={filtered}
            onView={handleView}
          />
        </main>
      </div>

      {/* Transaction Detail Drawer */}
      <TransactionDrawer
        transaction={selectedTxn}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
