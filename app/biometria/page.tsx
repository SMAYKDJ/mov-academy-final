'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { BiometriaKPI } from '@/components/dashboard/biometria/biometria-kpi';
import { BiometriaChart } from '@/components/dashboard/biometria/biometria-chart';
import { BodyComposition } from '@/components/dashboard/biometria/body-composition';
import { BiometriaHistory } from '@/components/dashboard/biometria/biometria-history';
import { BiometriaForm } from '@/components/dashboard/biometria/biometria-form';
import { biometriaKPIData, evaluationHistory, evolutionData } from '@/utils/biometria-data';
import { StudentSelector } from '@/components/dashboard/student-selector';
import { Plus, FileDown, Sparkles, AlertTriangle, TrendingDown, UserCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function BiometriaPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const { showToast } = useToast();

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#080a0f]">
      <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      <div className="flex-1 md:ml-64 transition-all duration-300">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Global Context Selector */}
        <div className="bg-white dark:bg-[#0f1117] border-b border-gray-100 dark:border-[#1e2235] px-4 md:px-8 py-3 flex items-center justify-between sticky top-16 z-30 animate-fade-in shadow-sm">
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
              <UserCircle2 className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Modo Individual</span>
            </div>
            <StudentSelector />
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-[10px] text-gray-400 uppercase font-black italic tracking-tighter">Sincronizado com o Banco Central</p>
          </div>
        </div>

        <main className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-fade-in">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-green-900/30 text-emerald-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-widest rounded-md">
                  Avaliação Física
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Biometria
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                Composição corporal, evolução e histórico de avaliações
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => showToast('Gerando laudo antropométrico em PDF...', 'info', 'Biometria')}
                className="px-4 py-2.5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                Exportar PDF
              </button>
              <button
                onClick={() => setFormOpen(true)}
                className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nova Avaliação
              </button>
            </div>
          </div>

          {/* KPIs + Health Score */}
          <BiometriaKPI stats={biometriaKPIData} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <BiometriaChart data={evolutionData} />
            <BodyComposition stats={biometriaKPIData} />
          </div>

          {/* AI Insights Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-green-900/10 dark:to-teal-900/10 border border-emerald-100 dark:border-green-800/30 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center shrink-0">
                <TrendingDown className="w-5 h-5 text-emerald-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Progresso Positivo</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Você perdeu <span className="font-bold">7 kg</span> e reduziu <span className="font-bold">8.2% de gordura</span> nos últimos 6 meses. 
                  Mantendo essa taxa, você atingirá 12% de gordura em <span className="font-bold">~2 meses</span>.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-100 dark:border-amber-800/30 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Recomendação IA</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Sua relação cintura/quadril (<span className="font-bold">0.85</span>) está dentro da zona saudável. 
                  Aumente o volume de treino de pernas para equilibrar o desenvolvimento entre membros superiores e inferiores.
                </p>
              </div>
            </div>
          </div>

          {/* Evaluation History */}
          <BiometriaHistory evaluations={evaluationHistory} />
        </main>
      </div>

      {/* New Evaluation Form */}
      <BiometriaForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
