'use client';

import React, { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { BiometriaKPI } from '@/components/dashboard/biometria/biometria-kpi';
import { BiometriaChart } from '@/components/dashboard/biometria/biometria-chart';
import { BodyComposition } from '@/components/dashboard/biometria/body-composition';
import { BiometriaHistory } from '@/components/dashboard/biometria/biometria-history';
import { BiometriaForm } from '@/components/dashboard/biometria/biometria-form';
import { biometriaKPIData, evaluationHistory, evolutionData } from '@/utils/biometria-data';
import { StudentSelector, mockStudents } from '@/components/dashboard/student-selector';
import { Plus, FileDown, Sparkles, AlertTriangle, TrendingDown, UserCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/components/ui/toast';

export default function BiometriaPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(mockStudents[0].id);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { showToast } = useToast();

  // Integração de Dados Reais (filtrando dados simulados por enquanto com base no aluno selecionado)
  const currentHistory = useMemo(() => {
    return evaluationHistory.filter(h => h.alunoId === selectedStudentId);
  }, [selectedStudentId]);

  const currentStats = useMemo(() => {
    const seed = parseInt(String(selectedStudentId).replace(/\D/g, '')) || 0;
    return {
      ...biometriaKPIData,
      pesoAtual: biometriaKPIData.pesoAtual + (seed % 5),
      gorduraAtual: parseFloat((18.5 + (seed % 10)).toFixed(1)),
      imcAtual: parseFloat((22.3 + (seed % 5)).toFixed(1)),
      massaMuscularAtual: parseFloat((35.0 + (seed % 8)).toFixed(1))
    };
  }, [selectedStudentId]);

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

        {/* Seletor de Contexto Global - Sticky */}
        <div className="bg-white/80 dark:bg-[#0f1117]/80 backdrop-blur-md border-b border-gray-100 dark:border-[#1e2235] px-4 md:px-8 py-3 flex items-center justify-between sticky top-16 z-40 animate-fade-in shadow-sm">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
              <UserCircle2 className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Modo Individual</span>
            </div>
            <div className="w-full sm:w-auto">
              <StudentSelector 
                selectedId={selectedStudentId}
                onSelect={(s) => {
                  setSelectedStudentId(s.id);
                  showToast(`Carregando histórico biométrico de ${s.name}...`, 'info');
                }}
              />
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-[10px] text-gray-400 uppercase font-black italic tracking-tighter">Sincronizado com o Banco Central</p>
          </div>
        </div>

        <main className="px-4 md:px-8 py-8 w-full max-w-full overflow-x-hidden space-y-8">
          {/* Cabeçalho da Página */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 animate-fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 bg-emerald-100 dark:bg-green-900/30 text-emerald-600 dark:text-green-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">
                  Avaliação Física
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Biometria
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                Composição corporal, evolução e histórico de avaliações
              </p>
            </div>
            <div className="grid grid-cols-2 sm:flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={() => showToast('Gerando laudo antropométrico em PDF...', 'info', 'Biometria')}
                className="px-4 py-3 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-xl text-xs font-black text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <FileDown className="w-4 h-4" />
                Exportar
              </button>
              <button
                onClick={() => setFormOpen(true)}
                className="px-4 py-3 bg-primary-600 text-white rounded-xl text-xs font-black hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 dark:shadow-none flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nova Avaliação
              </button>
            </div>
          </div>

          {/* KPIs + Score de Saúde */}
          <div className="w-full overflow-hidden">
            <BiometriaKPI stats={currentStats} />
          </div>

          {/* Linha de Gráficos */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full overflow-hidden">
            <div className="min-w-0">
              <BiometriaChart data={evolutionData} />
            </div>
            <div className="min-w-0">
              <BodyComposition stats={currentStats} />
            </div>
          </div>

          {/* Banner de Insights de IA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-green-900/10 dark:to-teal-900/10 border border-emerald-100 dark:border-green-800/30 rounded-3xl p-6 flex items-start gap-5 shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                <TrendingDown className="w-6 h-6 text-emerald-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="text-base font-black text-gray-900 dark:text-white mb-2 tracking-tight">Progresso Positivo</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Você perdeu <span className="font-bold text-emerald-600 dark:text-green-400">7 kg</span> e reduziu <span className="font-bold text-emerald-600 dark:text-green-400">8.2% de gordura</span> nos últimos 6 meses. 
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-100 dark:border-amber-800/30 rounded-3xl p-6 flex items-start gap-5 shadow-sm">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h4 className="text-base font-black text-gray-900 dark:text-white mb-2 tracking-tight">Recomendação IA</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Sua relação cintura/quadril (<span className="font-bold text-amber-600">0.85</span>) está ótima. Aumente o volume de treino de pernas.
                </p>
              </div>
            </div>
          </div>

          {/* Histórico de Avaliações */}
          <div className="w-full overflow-hidden">
            <BiometriaHistory evaluations={currentHistory} />
          </div>
        </main>
      </div>

      <BiometriaForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
