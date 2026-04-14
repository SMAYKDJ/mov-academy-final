'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { AlunosKPI } from '@/components/dashboard/alunos/alunos-kpi';
import { AlunosFilters } from '@/components/dashboard/alunos/alunos-filters';
import { AlunosTable } from '@/components/dashboard/alunos/alunos-table';
import { AlunoDrawer } from '@/components/dashboard/alunos/aluno-drawer';
import { AlunoForm } from '@/components/dashboard/alunos/aluno-form';
import { alunosData } from '@/utils/alunos-data';
import { useToast } from '@/components/ui/toast';
import { Plus, Download, Upload } from 'lucide-react';
import type { Aluno, AlunosFilterState, AlunoFormData } from '@/types/aluno';

/**
 * Alunos (Students) page — full CRUD with KPIs, filters, table, drawer, and form.
 */
export default function AlunosPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading] = useState(false);
  const { showToast } = useToast();

  // Data state
  const [alunos, setAlunos] = useState<Aluno[]>(alunosData);

  // Filter state
  const [filters, setFilters] = useState<AlunosFilterState>({
    search: '',
    status: 'todos',
    plano: 'todos',
    periodo: '',
  });

  // UI state
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);

  // Debounced search filter
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Filter logic
  const filtered = useMemo(() => {
    return alunos.filter(a => {
      // Search
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (
          !a.nome.toLowerCase().includes(q) &&
          !a.cpf.includes(q) &&
          !a.email.toLowerCase().includes(q)
        ) return false;
      }

      // Status
      if (filters.status !== 'todos' && a.status !== filters.status) return false;

      // Plan
      if (filters.plano !== 'todos' && a.plano !== filters.plano) return false;

      // Period (month filter on dataMatricula)
      if (filters.periodo) {
        const [filterYear, filterMonth] = filters.periodo.split('-').map(Number);
        const parts = a.dataMatricula.split('/');
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        if (year !== filterYear || month !== filterMonth) return false;
      }

      return true;
    });
  }, [alunos, debouncedSearch, filters.status, filters.plano, filters.periodo]);

  // Handlers
  const handleView = useCallback((aluno: Aluno) => {
    setSelectedAluno(aluno);
    setDrawerOpen(true);
  }, []);

  const handleEdit = useCallback((aluno: Aluno) => {
    setEditingAluno(aluno);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback((aluno: Aluno) => {
    if (confirm(`Tem certeza que deseja excluir ${aluno.nome}?`)) {
      setAlunos(prev => prev.filter(a => a.id !== aluno.id));
      showToast(`${aluno.nome} foi removido com sucesso`, 'success', 'Aluno Excluído');
    }
  }, [showToast]);

  const handleNewAluno = () => {
    setEditingAluno(null);
    setFormOpen(true);
  };

  const handleSave = useCallback((data: AlunoFormData) => {
    if (editingAluno) {
      // Update
      setAlunos(prev => prev.map(a =>
        a.id === editingAluno.id
          ? { ...a, ...data }
          : a
      ));
      showToast(`${data.nome} atualizado com sucesso`, 'success', 'Aluno Atualizado');
    } else {
      // Create
      const newAluno: Aluno = {
        id: Math.max(...alunos.map(a => a.id)) + 1,
        ...data,
        ultimoPagamento: new Date().toLocaleDateString('pt-BR'),
        dataMatricula: new Date().toLocaleDateString('pt-BR'),
        risco: 0,
        frequencia: 0,
        historicoPagamentos: [],
      };
      setAlunos(prev => [newAluno, ...prev]);
      showToast(`${data.nome} cadastrado com sucesso`, 'success', 'Novo Aluno');
    }
    setFormOpen(false);
    setEditingAluno(null);
  }, [editingAluno, alunos, showToast]);

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
                Gestão de Alunos
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                Gerencie cadastros, planos e acompanhe o engajamento dos alunos
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2.5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <button className="px-4 py-2.5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Importar
              </button>
              <button
                onClick={handleNewAluno}
                className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                <Plus className="w-4 h-4" />
                Novo Aluno
              </button>
            </div>
          </div>

          {/* KPIs */}
          <AlunosKPI alunos={alunos} loading={loading} />

          {/* Filters */}
          <AlunosFilters
            filters={filters}
            onChange={setFilters}
            resultCount={filtered.length}
          />

          {/* Table */}
          <AlunosTable
            data={filtered}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </main>
      </div>

      {/* Drawer */}
      <AlunoDrawer
        aluno={selectedAluno}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={handleEdit}
      />

      {/* Form */}
      <AlunoForm
        aluno={editingAluno}
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingAluno(null); }}
        onSave={handleSave}
      />
    </div>
  );
}
