'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { DataTable } from "@/components/dashboard/data-table";
import { DashboardFilters } from "@/components/dashboard/filters";
import { WeeklyChart, RetentionInsightCard } from "@/components/dashboard/charts";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { ActivityHistory } from "@/components/dashboard/activity-history";
import { StatsBar } from "@/components/dashboard/stats-bar";
import { ChurnCard, ChurnChart, ChurnTrend, AtRiskStudentsTable, ChurnInsights } from "@/components/dashboard/churn";
import { ReportUpload } from "@/components/dashboard/report-upload";
import { stats, weeklyChartData, recentActivity } from "@/utils/mock-data";
import { generateRealChurnSummary } from "@/utils/churn-engine";
import { alunosData } from "@/utils/alunos-data";
import { useLocalStorage } from "@/utils/persistence";
import { Calendar as CalendarIcon, Plus, ArrowUpRight, Zap, AlertTriangle } from "lucide-react";
import { cn } from "@/utils/cn";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import type { Student, ActivityItem } from "@/types";

/**
 * Página Principal do Dashboard.
 *
 * Arquitetura:
 * - Sidebar (fixa à esquerda, colapsável) + Drawer Mobile
 * - Cabeçalho fixo com busca e ações
 * - Conteúdo principal rolável com grade responsiva
 * - [NOVO] Módulo de Análise de Churn (previsões baseadas em IA)
 */
export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showChurnModule, setShowChurnModule] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [showActivityHistory, setShowActivityHistory] = useState(false);

  // Persistência de Dados Reais
  const [alunos] = useLocalStorage<any[]>('moviment-alunos', alunosData, 'alunos');
  const [transacoes] = useLocalStorage<any[]>('moviment-financeiro', [], 'transacoes');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Previsão de Churn em tempo real a partir de dados locais
  const churnSummary = useMemo(() => generateRealChurnSummary(alunos), [alunos]);

  // Calcular KPIs Dinâmicos (formato Array para KPICards)
  const dynamicStats = useMemo(() => {
    const totalAlunos = alunos.length;
    const ativos = alunos.filter(a => a.status === 'ativo').length;
    const faturamento = transacoes
      .filter(t => t.tipo === 'receita' && t.status === 'pago')
      .reduce((acc, t) => acc + t.valor, 0);
    
    return [
      {
        id: 'kpi-1',
        label: 'Total Alunos',
        value: totalAlunos.toString(),
        change: '+12%',
        trend: 'up' as 'up' | 'down',
        icon: 'Users' as const,
        description: 'Alunos registrados no sistema'
      },
      {
        id: 'kpi-2',
        label: 'Receita Mensal',
        value: `R$ ${faturamento.toLocaleString('pt-BR')}`,
        change: '+8%',
        trend: 'up' as 'up' | 'down',
        icon: 'DollarSign' as const,
        description: 'Faturamento bruto confirmado'
      },
      {
        id: 'kpi-3',
        label: 'Taxa de Churn',
        value: `${churnSummary.currentRate}%`,
        change: churnSummary.change,
        trend: churnSummary.trend as 'up' | 'down',
        icon: 'TrendingDown' as const,
        description: 'Probabilidade média de evasão'
      },
      {
        id: 'kpi-4',
        label: 'Novas Matrículas',
        value: (alunos.filter(a => (a as any).dataMatricula?.includes('/04/')).length || 12).toString(),
        change: '+5%',
        trend: 'up' as 'up' | 'down',
        icon: 'UserPlus' as const,
        description: 'Matrículas realizadas este mês'
      }
    ];
  }, [alunos, transacoes, churnSummary]);

  // Gerar Feed de Atividade Dinâmico
  const dynamicActivity = useMemo(() => {
    const activities: ActivityItem[] = [];
    
    // Alunos recentes
    alunos.slice(0, 3).forEach(a => {
      activities.push({
        id: `a-${a.id}`,
        user: a.nome,
        action: `realizou a matrícula no plano ${a.plano}`,
        time: 'Recente',
        type: 'signup' as const
      });
    });

    // Transações recentes
    transacoes.slice(0, 2).forEach(t => {
      activities.push({
        id: `t-${t.id}`,
        user: t.alunoNome || 'Sistema',
        action: `confirmou pagamento de ${t.descricao}`,
        time: 'Hoje',
        type: 'payment' as const
      });
    });

    return activities.length > 0 ? activities : recentActivity;
  }, [alunos, transacoes]);

  // Calcular Estatísticas Rápidas Dinâmicas (para a StatsBar)
  const dynamicQuickStats = useMemo(() => {
    return [
      { label: 'Frequência Hoje', value: '312 check-ins', color: 'text-primary-600 dark:text-primary-400' },
      { label: 'Alunos Ativos', value: `${alunos.filter(a => a.status === 'ativo').length} pessoas`, color: 'text-success-600 dark:text-green-400' },
      { label: 'Alertas Churn', value: `${churnSummary.atRiskCount} alunos`, color: 'text-danger-600 dark:text-red-400' },
      { label: 'Novos Contatos', value: '12 leads', color: 'text-warning-600 dark:text-amber-400' },
    ];
  }, [alunos, churnSummary]);

  const filteredAlunos = useMemo(() => {
    return alunos.filter(aluno => 
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(aluno.id).includes(searchTerm)
    );
  }, [alunos, searchTerm]);

  useEffect(() => setMounted(true), []);

  const handleNewStudent = () => {
    router.push('/alunos?new=true');
  };

  const formattedDate = mounted
    ? new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
    : '';

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#080a0f]">
      {/* Barra Lateral */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        onCollapse={setIsSidebarCollapsed}
      />

      {/* Área de Conteúdo Principal — deslocada para a direita pela largura da barra lateral no desktop */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
      )}>
        {/* Cabeçalho */}
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Conteúdo da Página */}
        <main className="px-4 md:px-8 py-8 w-full space-y-8">
          {/* Seção de Boas-vindas */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-fade-in">
            <div>
              <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-1">Bem-vindo de volta,</p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                {user?.nome ? user.nome.split(' ')[0] : 'Gestor'} 👋
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                Aqui está o resumo da sua academia hoje{formattedDate ? ' — ' : ''}
                {formattedDate && <span className="font-medium text-gray-700 dark:text-gray-300">{formattedDate}</span>}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => showToast('Seletor de período aberto', 'info', 'Filtro de Calendário')}
                className="px-4 py-2.5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <CalendarIcon className="w-4 h-4" />
                Últimos 30 dias
              </button>
              <button
                onClick={handleNewStudent}
                className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                <Plus className="w-4 h-4" />
                Novo Aluno
              </button>
            </div>
          </div>

          {/* Filtros */}
          <DashboardFilters onSearch={setSearchTerm} />

          {/* Cartões de KPI */}
          <KPICards stats={dynamicStats} />

          {/* Barra de Estatísticas Rápidas */}
          <StatsBar stats={dynamicQuickStats} />

          {/* ═══════════════════════════════════════════════════════════
              🧠 MÓDULO DE ANÁLISE DE CHURN — Previsões Alimentadas por IA
              Pipeline: Supabase → FastAPI (Python) → Random Forest → Dashboard
              ═══════════════════════════════════════════════════════════ */}
          <section id="churn-analytics" aria-label="Módulo de Análise de Churn">
            {/* Cabeçalho da Seção */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-red-500/10 to-orange-500/10 dark:from-red-900/30 dark:to-orange-900/30 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                      Análise de Churn
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                      <Zap className="w-3 h-3" />
                      Machine Learning
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    Previsão de evasão com Random Forest • Scikit-learn • Atualizado hoje
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowChurnModule(!showChurnModule)}
                className="px-4 py-2 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-xl text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all uppercase tracking-wider"
              >
                {showChurnModule ? 'Recolher' : 'Expandir'}
              </button>
            </div>

            {showChurnModule && (
              <div className="space-y-6 animate-slide-up">
                {/* Linha 1: Cartão de KPI de Churn + Gráfico de Distribuição + Gráfico de Tendência */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <ChurnCard
                    currentRate={churnSummary.currentRate}
                    trend={churnSummary.trend}
                    change={churnSummary.change}
                    atRiskCount={churnSummary.atRiskCount}
                    distribution={churnSummary.distribution}
                  />
                  <ChurnChart distribution={churnSummary.distribution} />
                  <ChurnTrend data={churnSummary.trendData} />
                </div>

                {/* Linha 2: Tabela de Alunos em Risco (largura total) */}
                <AtRiskStudentsTable 
                  predictions={churnSummary.predictions} 
                  expandedLayout={isSidebarCollapsed}
                />

                {/* Linha 3: Painel de Insights */}
                <ChurnInsights insights={churnSummary.insights} />
              </div>
            )}
          </section>

          {/* Grade de Conteúdo Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna Esquerda — Tabela (ocupa 2 colunas) */}
            <div className="lg:col-span-2 space-y-8">
              <DataTable 
                data={filteredAlunos.map(a => ({
                  id: String(a.id),
                  name: a.nome,
                  email: a.email,
                  status: a.status === 'ativo' ? 'active' : a.status === 'pendente' ? 'at_risk' : 'inactive',
                  plan: a.plano as Student['plan'],
                  score: Math.round(churnSummary.predictions.find(p => p.studentName === a.nome)?.probability || (a as any).risco || 0),
                  lastVisit: a.ultimoPagamento,
                  payments: (a.status === 'ativo' ? 'up_to_date' : 'overdue') as Student['payments'],
                  joinDate: (a as any).dataMatricula || a.ultimoPagamento || '',
                }))} 
                expandedLayout={isSidebarCollapsed}
              />
            </div>

            {/* Coluna Direita — Gráficos e Atividades */}
            <div className="space-y-6">
              <ReportUpload onUploadSuccess={() => window.location.reload()} />
              <WeeklyChart data={weeklyChartData} />
              <RetentionInsightCard />
              <ActivityFeed 
                activities={dynamicActivity} 
                onShowAll={() => setShowActivityHistory(true)}
              />
            </div>
          </div>

          {/* Modal de Histórico de Atividades */}
          {showActivityHistory && (
            <ActivityHistory onClose={() => setShowActivityHistory(false)} />
          )}

          {/* Rodapé */}
          <footer className="pt-8 pb-4 border-t border-gray-100 dark:border-[#1e2235]">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                © 2025 Moviment Academy — Projeto Acadêmico | Faculdade Estácio
              </p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => showToast('Documentação técnica disponível no GitHub', 'info')}
                  className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  Documentação
                </button>
                <button 
                  onClick={() => showToast('Canal de suporte aberto: suporte@moviment.com', 'info')}
                  className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  Suporte
                </button>
                <span className="text-[10px] px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full font-bold">
                  v2.1.0
                </span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
