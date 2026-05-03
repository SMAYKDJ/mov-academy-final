'use client';

import React from 'react';
import { BrainCircuit, Info, FileText, AlertCircle, CheckCircle2, UploadCloud, Zap } from 'lucide-react';
import { ReportUpload } from "@/components/dashboard/report-upload";

export function ChurnUpdateSettings() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-primary-600" />
            Atualização da IA de Churn
          </h2>
          <p className="text-gray-500 text-sm">Alimente a Inteligência Artificial com os dados mais recentes.</p>
        </div>
      </div>

      {/* Manual de Instruções - O Trio Essencial */}
      <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/10 dark:to-transparent p-6 sm:p-8 rounded-[32px] border border-indigo-100 dark:border-indigo-500/20 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <Info className="w-32 h-32 text-indigo-600" />
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full w-fit">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Guia de Atualização Perfeita</span>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-2xl">
            Para que a atualização seja perfeita e o modelo de IA consiga prever o Churn com precisão, a cliente não precisa subir todos os 6 PDFs toda vez. O <strong>"Kit Essencial"</strong> de atualização é composto por apenas <strong>3 relatórios</strong>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1a1d27] p-5 rounded-2xl border border-indigo-50 dark:border-white/5 space-y-3 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                    <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black dark:text-white">Alunos Mais Frequentes</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">Diz para a IA quem está parando de treinar. Essencial para medir o engajamento.</p>
            </div>

            <div className="bg-white dark:bg-[#1a1d27] p-5 rounded-2xl border border-indigo-50 dark:border-white/5 space-y-3 shadow-sm">
                <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center text-red-600">
                    <AlertCircle className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black dark:text-white">Relação de Devedores</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">Inadimplência é o maior "alerta vermelho". IA usa isso para o risco crítico.</p>
            </div>

            <div className="bg-white dark:bg-[#1a1d27] p-5 rounded-2xl border border-indigo-50 dark:border-white/5 space-y-3 shadow-sm">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black dark:text-white">Listagem de Alunos</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">Fornece o básico: idade, plano e tempo de casa. (Ou Listagem de Matrículas).</p>
            </div>
          </div>

          <div className="pt-4 border-t border-indigo-100 dark:border-white/5">
            <h5 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-2 flex items-center gap-2">
                <UploadCloud className="w-4 h-4" /> Como ela deve fazer?
            </h5>
            <p className="text-[11px] text-gray-500 leading-relaxed italic">
                Todo mês, ela exporta esses 3 relatórios do sistema antigo dela e faz o upload de uma vez só abaixo. 
                O sistema vai ler os 3, cruzar as informações pelo Nome do Aluno e atualizar o Dashboard automaticamente.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Component */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Área de Upload dos Relatórios</h3>
        <ReportUpload onUploadSuccess={() => window.location.reload()} />
      </div>

      <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl">
          <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed flex gap-3">
              <Info className="w-5 h-5 shrink-0" />
              Os outros relatórios (Recebimentos, Modalidade) são mais para auditoria financeira, mas para a IA de Churn, esses 3 acima são os que realmente importam para manter a precisão das previsões.
          </p>
      </div>
    </div>
  );
}
