'use client';

import React, { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { BIOverviewKPI } from '@/components/dashboard/relatorios/bi-overview-kpi';
import { RetentionChart } from '@/components/dashboard/relatorios/retention-chart';
import { FrequencyHeatmap } from '@/components/dashboard/relatorios/frequency-heatmap';
import { CheckinsChart } from '@/components/dashboard/relatorios/checkins-chart';
import { useBI } from '@/hooks/use-bi';
import { 
  retentionHistoryData, 
  frequencyHeatmapData, 
  dailyCheckinsData,
  planDistributionData
} from '@/utils/relatorios-data';
import { 
  FileDown, 
  Calendar, 
  Filter, 
  Sparkles, 
  X, 
  CheckCircle2, 
  MessageSquare, 
  ArrowRight,
  TrendingUp,
  Users2,
  CalendarClock,
  Loader2
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/utils/cn';

export default function RelatoriosPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Abril');
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [showActionPlan, setShowActionPlan] = useState(false);
  const { showToast } = useToast();

  const { stats, loading } = useBI();

  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'];

  // Dados para exibição (Mistura de reais e auxiliares para gráficos)
  const biData = stats ? [
    { label: 'Total de Alunos', value: stats.totalAlunos.toString(), change: '+12%', trend: 'up' as const, icon: Users2, color: 'text-blue-600 bg-blue-50' },
    { label: 'Faturamento Mensal', value: `R$ ${stats.faturamentoMensal.toLocaleString('pt-BR')}`, change: '+8.2%', trend: 'up' as const, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Taxa de Retenção', value: `${stats.retentionRate}%`, change: '+0.5%', trend: 'up' as const, icon: CheckCircle2, color: 'text-violet-600 bg-violet-50' },
    { label: 'Risco de Churn Médio', value: `${stats.riscoMedio}%`, change: '-2%', trend: 'down' as const, icon: CalendarClock, color: 'text-amber-600 bg-amber-50' },
  ] : [];

  const handleExportBI = () => {
    if (!stats) return;
    showToast(`Preparando dados reais de ${selectedMonth}...`, 'info', 'Exportar BI');
    
    setTimeout(() => {
      const content = `Relatorio BI Moviment Academy - ${selectedMonth}\n` +
                      `Total Alunos: ${stats.totalAlunos}\n` +
                      `Alunos Ativos: ${stats.alunosAtivos}\n` +
                      `Faturamento: R$ ${stats.faturamentoMensal}\n` +
                      `Risco Medio: ${stats.riscoMedio}%`;
      
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `bi_moviment_real_${selectedMonth.toLowerCase()}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast(`Relatório exportado com sucesso!`, 'success', 'Download Concluído');
    }, 800);
  };

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
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-fade-in">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-bold uppercase tracking-widest rounded-md">
                   Dados Reais de Produção
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Análise Estratégica
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                Métricas de retenção, churn e inteligência baseadas no banco de dados.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleExportBI}
                disabled={loading}
                className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                Exportar BI
              </button>
            </div>
          </div>

          {/* Core Stats */}
          <section className="animate-fade-in">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-32 bg-white dark:bg-[#0f1117] rounded-2xl animate-pulse border border-gray-100 dark:border-white/5" />
                ))}
              </div>
            ) : (
              <BIOverviewKPI stats={biData} />
            )}
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
             {/* Weekly Frequency */}
             <div className="h-full">
               <FrequencyHeatmap data={dynamicData.heatmap} />
             </div>
             
             <div className="space-y-6">
                {/* Retention History */}
                <RetentionChart data={retentionHistoryData} />
                
                {/* Daily Checkins */}
                <CheckinsChart data={dynamicData.checkins} />
             </div>
          </div>

          {/* AI Strategy Advice Placeholder */}
          <div className="bg-gradient-to-r from-primary-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden group mt-4">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform pointer-events-none">
               <Sparkles className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary-200" />
                <h3 className="text-xl font-bold">Insights da IA — Estratégia de Retenção</h3>
              </div>
              <p className="text-primary-100 text-base max-w-2xl leading-relaxed">
                Detectamos uma queda de 4% na frequência de alunos do plano &quot;Trimestral&quot; nas segundas-feiras. 
                Recomendamos uma campanha de reengajamento via WhatsApp para 42 alunos identificados com alto risco de churn.
              </p>
              <button 
                onClick={() => setShowActionPlan(true)}
                className="mt-8 px-8 py-3 bg-white text-primary-700 rounded-xl text-sm font-bold hover:bg-primary-50 transition-all shadow-lg hover:shadow-primary-500/20 active:scale-95"
              >
                Ver Plano de Ação
              </button>
            </div>
          </div>

          {/* Action Plan Modal */}
          {showActionPlan && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-[#0f1117] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                <div className="p-6 border-b border-gray-100 dark:border-[#1e2235] flex items-center justify-between bg-primary-600 text-white">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    <div>
                      <h2 className="text-lg font-bold">Plano de Ação Estratégico</h2>
                      <p className="text-primary-100 text-xs">Gerado pela IA Moviment em {selectedMonth}, 2026</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowActionPlan(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      Próximos Passos Recomendados
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { title: 'Reengajamento WhatsApp', desc: 'Enviar mensagens para os 42 alunos com risco alto.', icon: MessageSquare },
                        { title: 'Oferta de Upgrade', desc: 'Converter alunos Mensais para o Trimestral com 15% OFF.', icon: TrendingUp },
                        { title: 'Evento de Integração', desc: 'Realizar aulão aos sábados para aumentar retenção.', icon: Users2 },
                        { title: 'Auditoria de Treinos', desc: 'Verificar alunos sem troca de treino há > 45 dias.', icon: CalendarClock },
                      ].map((step, i) => (
                        <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-[#1e2235] flex gap-3">
                          <div className="p-2 bg-white dark:bg-[#1a1d27] rounded-lg h-fit shadow-sm">
                            <step.icon className="w-4 h-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{step.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-primary-50 dark:bg-primary-900/10 p-4 rounded-xl border border-primary-100 dark:border-primary-900/30">
                    <h4 className="text-xs font-bold text-primary-700 dark:text-primary-400 uppercase tracking-widest mb-2">Meta de Crescimento</h4>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-black text-primary-600 tracking-tighter">+12%</span>
                      <span className="text-xs text-primary-600/70 mb-1.5 font-medium">previsão para Junho</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-[#151821] border-t border-gray-100 dark:border-[#1e2235] flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => {
                      showToast('Plano enviado para o time comercial via WhatsApp', 'success');
                      setShowActionPlan(false);
                    }}
                    className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Enviar para Equipe
                  </button>
                  <button 
                    onClick={() => setShowActionPlan(false)}
                    className="px-6 py-3 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] text-gray-600 dark:text-gray-400 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
