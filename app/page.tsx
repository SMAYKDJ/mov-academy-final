'use client';

import React, { useState, useEffect } from 'react';
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { DataTable } from "@/components/dashboard/data-table";
import { DashboardFilters } from "@/components/dashboard/filters";
import { WeeklyChart, RetentionInsightCard } from "@/components/dashboard/charts";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { StatsBar } from "@/components/dashboard/stats-bar";
import { ChurnCard, ChurnChart, ChurnTrend, AtRiskStudentsTable, ChurnInsights } from "@/components/dashboard/churn";
import { stats, weeklyChartData, recentActivity } from "@/utils/mock-data";
import { generateRealChurnSummary } from "@/utils/churn-engine";
import { alunosData } from "@/utils/alunos-data";
import { useLocalStorage } from "@/utils/persistence";
import { Calendar as CalendarIcon, Plus, ArrowUpRight, Brain, ShieldAlert } from "lucide-react";
import { useToast } from "@/components/ui/toast";

/**
 * Main Dashboard Page.
 *
 * Architecture:
 * - Sidebar (fixed left, collapsible) + Mobile drawer
 * - Sticky header with search and actions
 * - Scrollable main content with responsive grid
 * - [NEW] Churn Analytics Module (ML-powered predictions)
 */
export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showChurnModule, setShowChurnModule] = useState(true);
  const { showToast } = useToast();

  // Real Data Persistence
  const [alunos] = useLocalStorage('moviment-alunos', alunosData);
  
  // Real-time Churn Prediction from local data
  const churnSummary = generateRealChurnSummary(alunos);

  useEffect(() => setMounted(true), []);

  const handleNewStudent = () => {
    showToast('Formulário de matrícula aberto', 'info', 'Nova Matrícula');
  };

  const formattedDate = mounted
    ? new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
    : '';

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#080a0f]">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area — pushed right by sidebar width on desktop */}
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Page Content */}
        <main className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-fade-in">
            <div>
              <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-1">Bem-vindo de volta,</p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Professor Andre 👋
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

          {/* Filters */}
          <DashboardFilters />

          {/* KPI Cards */}
          <KPICards stats={stats} />

          {/* Quick Stats Bar */}
          <StatsBar />

          {/* ═══════════════════════════════════════════════════════════
              🧠 CHURN ANALYTICS MODULE — ML-Powered Predictions
              Pipeline: Supabase → FastAPI (Python) → Random Forest → Dashboard
              ═══════════════════════════════════════════════════════════ */}
          <section id="churn-analytics" aria-label="Módulo de Análise de Churn">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-red-500/10 to-orange-500/10 dark:from-red-900/30 dark:to-orange-900/30 rounded-xl">
                  <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                      Análise de Churn
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                      <Brain className="w-3 h-3" />
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
                {/* Row 1: Churn KPI Card + Distribution Chart + Trend Chart */}
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

                {/* Row 2: At-Risk Students Table (full width) */}
                <AtRiskStudentsTable predictions={churnSummary.predictions} />

                {/* Row 3: Insights Panel */}
                <ChurnInsights insights={churnSummary.insights} />
              </div>
            )}
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column — Table (spans 2 columns) */}
            <div className="lg:col-span-2 space-y-8">
              <DataTable 
                data={alunos.map(a => ({
                  id: String(a.id),
                  name: a.nome,
                  email: a.email,
                  status: a.status === 'em_dia' ? 'active' : a.status === 'pendente' ? 'at_risk' : 'inactive',
                  plan: a.plano,
                  score: Math.round(generateRealChurnSummary(alunos).predictions.find(p => p.studentName === a.nome)?.probability || a.risco || 0),
                  lastVisit: a.ultimoPagamento
                }))} 
              />
            </div>

            {/* Right Column — Charts & Activity */}
            <div className="space-y-6">
              <WeeklyChart data={weeklyChartData} />
              <RetentionInsightCard />
              <ActivityFeed activities={recentActivity} />
            </div>
          </div>

          {/* Footer */}
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
