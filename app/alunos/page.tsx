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
import { Plus, Download, Upload, Trash2 } from 'lucide-react';
import { useLocalStorage, exportToCSV } from '@/utils/persistence';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/utils/cn';
import type { Aluno, AlunoStatus, AlunosFilterState, AlunoFormData } from '@/types/aluno';

/**
 * Página de Alunos — CRUD completo com KPIs, filtros, tabela, drawer e formulário.
 */
export default function AlunosPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading] = useState(false);
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  // Estado dos dados com persistência
  const [alunos, setAlunos, isLoaded] = useLocalStorage<Aluno[]>('moviment-alunos', alunosData, 'alunos');

  // Estado dos filtros
  const [filters, setFilters] = useState<AlunosFilterState>({
    search: '',
    status: 'todos',
    plano: 'todos',
    periodo: '',
  });

  // Estado da UI
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);

  // Filtro de busca com debounce
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Lógica de filtragem
  const filtered = useMemo(() => {
    return alunos.filter(a => {
      // Busca
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (
          !a.nome.toLowerCase().includes(q) &&
          !(a.cpf || '').includes(q) &&
          !(a.email || '').toLowerCase().includes(q)
        ) return false;
      }

      // Status
      if (filters.status !== 'todos' && a.status !== filters.status) return false;

      // Plano
      if (filters.plano !== 'todos' && a.plano !== filters.plano) return false;

      // Período (filtros pré-definidos)
      if (filters.periodo) {
        const parts = a.dataMatricula.split('/');
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);
        const matriculaDate = new Date(year, month, day);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - matriculaDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (filters.periodo === '7d' && diffDays > 7) return false;
        if (filters.periodo === '30d' && diffDays > 30) return false;
        if (filters.periodo === '90d' && diffDays > 90) return false;
        if (filters.periodo === '365d' && diffDays > 365) return false;
      }

      return true;
    });
  }, [alunos, debouncedSearch, filters.status, filters.plano, filters.periodo]);

  // Manipuladores
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
      setDrawerOpen(false);
      setSelectedAluno(null);
    }
  }, [setAlunos, showToast]);

  const handleStatusChange = useCallback((aluno: Aluno, status: AlunoStatus) => {
    setAlunos(prev => prev.map(a => a.id === aluno.id ? { ...a, status } : a));
    const label = status === 'inativo' ? 'inativado' : status === 'ativo' ? 'reativado' : 'atualizado';
    showToast(`${aluno.nome} foi ${label} com sucesso`, 'success', 'Status Alterado');
  }, [setAlunos, showToast]);

  const handleNewAluno = useCallback(() => {
    setEditingAluno(null);
    setFormOpen(true);
  }, []);

  // Deep linking para notificações e novos alunos
  useEffect(() => {
    if (!isLoaded) return;
    
    const q = searchParams.get('search');
    const id = searchParams.get('id');
    const isNew = searchParams.get('new') === 'true';
    
    if (q) {
      setFilters(prev => ({ ...prev, search: q }));
    }

    if (id) {
      const aluno = alunos.find(a => String(a.id) === id);
      if (aluno) {
        setSelectedAluno(aluno);
        setDrawerOpen(true);
      }
    }

    if (isNew) {
      handleNewAluno();
      // Limpar a URL sem recarregar a página (opcional, mas bom para UX)
      window.history.replaceState({}, '', '/alunos');
    }
  }, [searchParams, isLoaded, alunos, handleNewAluno]);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const rows = text.split('\n').filter(row => row.trim() !== '');
      if (rows.length < 2) throw new Error('Arquivo vazio ou inválido');

      const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
      const newAlunos: Aluno[] = rows.slice(1).map((row, index) => {
        const values = row.split(',').map(v => v.trim());
        const data: any = {};
        headers.forEach((h, i) => {
          data[h] = values[i];
        });

        return {
          id: Math.max(...alunos.map(a => a.id), 0) + index + 1,
          nome: data.nome || 'Novo Aluno',
          email: data.email || '',
          cpf: data.cpf || '',
          telefone: data.telefone || '',
          plano: data.plano || 'Mensal',
          status: data.status || 'ativo',
          dataMatricula: data.datamatricula || new Date().toLocaleDateString('pt-BR'),
          dataNascimento: data.datanascimento || '01/01/2000',
          endereco: data.endereco || 'Não informado',
          objetivo: data.objetivo || 'Treino Geral',
          ultimoPagamento: data.ultimopagamento || new Date().toLocaleDateString('pt-BR'),
          frequencia: Number(data.frequencia) || 0,
          risco: Number(data.risco) || 0,
          historicoPagamentos: [],
        };
      });

      setAlunos(prev => [...newAlunos, ...prev]);
      showToast(`${newAlunos.length} alunos importados com sucesso`, 'success', 'Importação Concluída');
    } catch (err) {
      showToast('Erro ao processar o arquivo CSV. Verifique o formato.', 'error', 'Erro na Importação');
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSave = useCallback((data: AlunoFormData) => {
    if (editingAluno) {
      // Atualizar
      setAlunos(prev => prev.map(a =>
        a.id === editingAluno.id
          ? { ...a, ...data }
          : a
      ));
      showToast(`${data.nome} atualizado com sucesso`, 'success', 'Aluno Atualizado');
    } else {
      // Criar
      const nextId = alunos.length > 0 ? Math.max(...alunos.map(a => a.id)) + 1 : 1;
      const newAluno: Aluno = {
        id: nextId,
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
      <Sidebar 
        mobileOpen={mobileMenuOpen} 
        onMobileClose={() => setMobileMenuOpen(false)} 
        onCollapse={setIsSidebarCollapsed}
      />

      <div className={cn(
        "flex-1 transition-all duration-300",
        isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
      )}>
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="px-4 md:px-8 py-8 w-full space-y-6">
          {/* Cabeçalho da Página */}
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
              <button 
                onClick={() => exportToCSV(alunos, 'alunos-moviment-academy')}
                className="px-4 py-2.5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Importar
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImport} 
                accept=".csv" 
                className="hidden" 
              />
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
          <AlunosKPI alunos={alunos} loading={!isLoaded} />

          {/* Filtros */}
          <AlunosFilters
            filters={filters}
            onChange={setFilters}
            resultCount={filtered.length}
          />

          {/* Tabela */}
          <AlunosTable
            data={filtered}
            loading={!isLoaded || loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            expandedLayout={isSidebarCollapsed}
          />
        </main>
      </div>

      {/* Drawer */}
      <AlunoDrawer
        aluno={selectedAluno}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      {/* Formulário */}
      <AlunoForm
        aluno={editingAluno}
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingAluno(null); }}
        onSave={handleSave}
        nextId={alunos.length > 0 ? Math.max(...alunos.map(a => a.id)) + 1 : 1}
      />
    </div>
  );
}
