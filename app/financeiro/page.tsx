'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { Plus, Download, FileText, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorage, exportToCSV } from '@/utils/persistence';
import { TransactionForm } from '@/components/dashboard/financeiro/transaction-form';
import { notifyManager } from '@/utils/whatsapp-helper';
import type { Transaction, FinanceiroFilterState } from '@/types/financeiro';
import { cn } from '@/utils/cn';

/**
 * Página Financeiro — módulo completo de gestão financeira.
 * Funcionalidades: KPIs, gráfico de receitas, detalhamento de despesas, tabela de transações, gaveta de detalhes.
 */
export default function FinanceiroPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { showToast } = useToast();

  // Dados com persistência
  const [transacoes, setTransacoes, isLoaded] = useLocalStorage<Transaction[]>('moviment-financeiro', transacoesData, 'transacoes');

  // Filtros
  const [filters, setFilters] = useState<FinanceiroFilterState>({
    search: '',
    tipo: 'todos',
    status: 'todos',
    metodo: 'todos',
    periodo: '',
  });

  // Interface
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState<Transaction | null>(null);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const searchParams = useSearchParams();

  // Deep linking para notificações
  useEffect(() => {
    if (!isLoaded) return;
    
    const txnId = searchParams.get('id');
    const q = searchParams.get('search');
    
    if (txnId) {
      const txn = transacoes.find(t => t.id === txnId);
      if (txn) {
        setSelectedTxn(txn);
        setDrawerOpen(true);
      }
    }
    
    if (q) {
      setFilters(prev => ({ ...prev, search: q }));
    }
  }, [searchParams, isLoaded, transacoes]);

  // Busca com debounce
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Calcular dados dinâmicos do gráfico a partir das transações
  const dynamicMonthlyData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentYear = new Date().getFullYear();
    
    const dataMap = months.map(m => ({ mes: m, receita: 0, despesa: 0 }));

    transacoes.forEach(t => {
      const parts = t.data.split('/');
      const monthIdx = parseInt(parts[1]) - 1;
      const year = parseInt(parts[2]);

      if (year === currentYear && monthIdx >= 0 && monthIdx < 12) {
        if (t.tipo === 'receita' && t.status === 'pago') {
          dataMap[monthIdx].receita += t.valor;
        } else if (t.tipo === 'despesa' && t.status === 'pago') {
          dataMap[monthIdx].despesa += t.valor;
        }
      }
    });

    // Retornar apenas meses com dados ou os primeiros 6 meses para exibição
    return dataMap.slice(0, new Date().getMonth() + 1);
  }, [transacoes]);

  // Lógica de filtragem
  const filtered = useMemo(() => {
    return transacoes.filter(t => {
      // Busca
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (
          !t.descricao.toLowerCase().includes(q) &&
          !(t.alunoNome || '').toLowerCase().includes(q) &&
          !t.id.toLowerCase().includes(q)
        ) return false;
      }

      // Tipo
      if (filters.tipo !== 'todos' && t.tipo !== filters.tipo) return false;

      // Status
      if (filters.status !== 'todos' && t.status !== filters.status) return false;

      // Método
      if (filters.metodo !== 'todos' && t.metodo !== filters.metodo) return false;

      // Período
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

  // Manipuladores
  const handleView = useCallback((txn: Transaction) => {
    setSelectedTxn(txn);
    setDrawerOpen(true);
  }, []);

  const handleEdit = useCallback((txn: Transaction) => {
    setEditingTxn(txn);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback((txn: Transaction) => {
    if (confirm(`Deseja excluir a transação "${txn.descricao}"?`)) {
      setTransacoes(prev => prev.filter(t => t.id !== txn.id));
      showToast('Transação excluída com sucesso', 'success', 'Financeiro');
    }
  }, [setTransacoes, showToast]);

  const handleSave = useCallback((data: any) => {
    if (editingTxn) {
      setTransacoes(prev => prev.map(t => t.id === editingTxn.id ? { ...t, ...data } : t));
      showToast('Transação atualizada com sucesso', 'success');
    } else {
      setTransacoes(prev => [data, ...prev]);
      
      // Simulação Zero: Notificação Real
      if (data.tipo === 'receita' && data.status === 'pago') {
        notifyManager(data.alunoNome || 'Cliente Avulso', data.valor);
      }
      
      showToast('Nova transação registrada', 'success');
    }
    setFormOpen(false);
    setEditingTxn(null);
  }, [editingTxn, setTransacoes, showToast]);

  const handleExport = () => {
    showToast('Relatório financeiro exportado com sucesso', 'success', 'Exportação');
  };

  const handleReport = () => {
    showToast('Relatório DRE gerado com sucesso', 'success', 'Relatório');
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#080a0f]">
      <Sidebar 
        mobileOpen={mobileMenuOpen} 
        onMobileClose={() => setMobileMenuOpen(false)} 
        onCollapse={setIsSidebarCollapsed}
      />

      <div className={cn(
        "flex-1 w-full min-w-0 transition-all duration-300",
        isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
      )}>
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="px-4 md:px-8 py-8 w-full max-w-full overflow-x-hidden space-y-8">
          {/* Cabeçalho da Página */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 animate-fade-in">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Financeiro
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                Controle de receitas, despesas e fluxo de caixa da academia
              </p>
            </div>
            <div className="grid grid-cols-2 sm:flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleReport}
                className="px-4 py-2.5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-xl text-xs font-black text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <FileText className="w-4 h-4" />
                Relatório
              </button>
              <button
                onClick={() => exportToCSV(transacoes, 'financeiro-moviment-academy')}
                className="px-4 py-2.5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-xl text-xs font-black text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <button 
                onClick={() => setFormOpen(true)}
                className="col-span-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-black hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 dark:shadow-none flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nova Transação
              </button>
              <Link 
                href="/financeiro/pagamento"
                className="col-span-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-xs font-black hover:shadow-lg hover:shadow-orange-200 dark:hover:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Pagar Assinatura
              </Link>
            </div>
          </div>

          {/* Cartões de KPI */}
          <div className="w-full overflow-hidden">
            <FinanceiroKPI transacoes={transacoes} />
          </div>

          {/* Seção de Gráficos */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 w-full max-w-full overflow-hidden">
            <div className="xl:col-span-3 min-w-0">
              <RevenueChart data={dynamicMonthlyData} />
            </div>
            <div className="xl:col-span-2 min-w-0">
              <ExpenseBreakdown transacoes={transacoes} />
            </div>
          </div>

          {/* Filtros */}
          <div className="w-full">
            <FinanceiroFilters
              filters={filters}
              onChange={setFilters}
              resultCount={filtered.length}
            />
          </div>

          {/* Tabela de Transações */}
          <div className="w-full overflow-hidden">
            <FinanceiroTable
              data={filtered}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </main>
      </div>

      {/* Gaveta de Detalhes da Transação */}
      <TransactionDrawer
        transaction={selectedTxn}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Formulário de Transação */}
      <TransactionForm 
        open={formOpen}
        transaction={editingTxn}
        onClose={() => { setFormOpen(false); setEditingTxn(null); }}
        onSave={handleSave}
      />
    </div>
  );
}
