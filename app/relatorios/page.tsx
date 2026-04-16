'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { BIOverviewKPI } from '@/components/dashboard/relatorios/bi-overview-kpi';
import { RetentionChart } from '@/components/dashboard/relatorios/retention-chart';
import { FrequencyHeatmap } from '@/components/dashboard/relatorios/frequency-heatmap';
import { CheckinsChart } from '@/components/dashboard/relatorios/checkins-chart';
import { 
  biStatsData, 
  retentionHistoryData, 
  frequencyHeatmapData, 
  dailyCheckinsData 
} from '@/utils/relatorios-data';
import { FileDown, Calendar, Filter, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function RelatoriosPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { showToast } = useToast();

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#080a0f]">
      <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      <div className="flex-1 md:ml-64 transition-all duration-300">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-fade-in">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-bold uppercase tracking-widest rounded-md">
                  Business Intelligence
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Análise Estratégica
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                Métricas de retenção, churn e inteligência de crescimento
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => showToast('Seletor de meses aberto', 'info', 'Filtro Temporal')}
                className="px-4 py-2 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Abril, 2026
              </button>
              <button 
                onClick={() => showToast('Gerando relatório consolidado de BI...', 'success', 'Exportar BI')}
                className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg flex items-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                Exportar BI
              </button>
            </div>
          </div>

          {/* Core Stats */}
          <BIOverviewKPI stats={biStatsData} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
             {/* Weekly Frequency */}
             <FrequencyHeatmap data={frequencyHeatmapData} />
             
             <div className="space-y-6">
                {/* Retention History */}
                <RetentionChart data={retentionHistoryData} />
                
                {/* Daily Checkins */}
                <CheckinsChart data={dailyCheckinsData} />
             </div>
          </div>

          {/* AI Strategy Advice Placeholder */}
          <div className="bg-gradient-to-r from-primary-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
               <Sparkles className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-lg font-bold">Insights da IA — Estratégia de Retenção</h3>
              </div>
              <p className="text-primary-100 text-sm max-w-2xl leading-relaxed">
                Detectamos uma queda de 4% na frequência de alunos do plano "Trimestral" nas segundas-feiras. 
                Recomendamos uma campanha de reengajamento via WhatsApp para 42 alunos identificados com alto risco de churn.
              </p>
              <button 
                onClick={() => showToast('Plano de ação exportado para o WhatsApp do time comercial', 'success', 'IA Strategy')}
                className="mt-6 px-6 py-2.5 bg-white text-primary-700 rounded-xl text-sm font-bold hover:bg-primary-50 transition-all"
              >
                Ver Plano de Ação
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
