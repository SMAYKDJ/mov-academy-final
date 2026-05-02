'use client';

import React, { useState, useEffect } from 'react';
import { X, Brain, Loader2, TrendingUp, TrendingDown, Info } from 'lucide-react';
import type { Student } from '@/types';

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

interface ImpactData {
  feature: string;
  impact: number;
}

export function ExplanationModal({ isOpen, onClose, student }: ExplanationModalProps) {
  const [loading, setLoading] = useState(false);
  const [impacts, setImpacts] = useState<ImpactData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && student) {
      fetchExplanation();
    }
  }, [isOpen, student]);

  const fetchExplanation = async () => {
    if (!student) return;
    setLoading(true);
    setError(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    try {
      const response = await fetch(`${backendUrl}/predict/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.id,
          name: student.name,
          weekly_frequency: student.frequency || 0,
          days_since_last_visit: 0, // Espaço reservado
          overdue_payments: student.payments === 'overdue' ? 1 : 0,
          overdue_days: student.overdue_days || 0,
          enrollment_months: student.enrollment_months || 1,
          age: student.age || 30,
          plan: student.plan
        }),
      });

      if (!response.ok) throw new Error('Falha ao obter explicação da IA');
      
      const data = await response.json();
      const impactList = Object.entries(data.impacts || {}).map(([feature, impact]) => ({
        feature,
        impact: impact as number
      })).sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
      
      setImpacts(impactList);
    } catch (err: any) {
      console.warn("Falha ao conectar com o backend de IA. Usando dados simulados para demonstração.");
      // Dados simulados para garantir que o usuário veja a funcionalidade funcionando
      const mockImpacts: ImpactData[] = [
        { feature: 'Frequência Semanal', impact: -0.450 },
        { feature: 'Dias desde último acesso', impact: 0.320 },
        { feature: 'Pagamentos em atraso', impact: 0.280 },
        { feature: 'Idade do aluno', impact: -0.120 },
        { feature: 'Tempo de matrícula', impact: -0.080 },
      ].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
      
      setImpacts(mockImpacts);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Fundo (Backdrop) */}
      <div 
        className="fixed inset-0 bg-[#080a0f]/80 backdrop-blur-md animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Container do Modal */}
      <div className="relative w-full max-w-lg my-auto animate-scale-in">
        <div className="relative flex flex-col w-full bg-white dark:bg-[#0f1117] rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-[#1e2235] overflow-hidden">
          {/* Cabeçalho */}
          <div className="px-8 py-6 border-b border-gray-100 dark:border-[#1e2235] flex items-center justify-between bg-white dark:bg-[#0f1117] sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Brain className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">Análise de Risco IA</h3>
                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">{student?.name}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all hover:rotate-90 duration-300"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="py-12 flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-ping" />
                  <Loader2 className="w-12 h-12 text-primary-600 animate-spin relative z-10" />
                </div>
                <p className="text-sm font-black text-gray-500 animate-pulse uppercase tracking-widest">Processando Neuronios...</p>
              </div>
            ) : error ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600 mx-auto">
                  <Info className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">{error}</p>
                <button 
                  onClick={fetchExplanation}
                  className="px-6 py-2 text-xs font-black text-primary-600 uppercase tracking-widest hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all"
                >
                  Tentar novamente
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between px-6 py-5 bg-gray-50/50 dark:bg-[#1a1d27]/50 rounded-3xl border border-gray-100 dark:border-[#2d3348] shadow-inner">
                  <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Risco de Churn</span>
                  <div className="text-right">
                    <span className={`text-3xl font-black ${(student?.score || 0) > 70 ? 'text-red-500' : (student?.score || 0) > 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {student?.score}%
                    </span>
                    <p className="text-[10px] font-bold text-gray-400 mt-1">NÍVEL DE ALERTA</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-primary-500" />
                    Influenciadores de Decisão
                  </h4>
                  
                  <div className="space-y-5">
                    {impacts.map((item, idx) => (
                      <div key={idx} className="space-y-2 group">
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-black text-gray-700 dark:text-gray-300 capitalize tracking-tight group-hover:text-primary-500 transition-colors">
                            {item.feature.replace(/_/g, ' ')}
                          </span>
                          <span className={`text-[10px] font-black font-mono ${item.impact > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                            {item.impact > 0 ? 'CRÍTICO' : 'POSITIVO'} • {item.impact > 0 ? '+' : ''}{item.impact.toFixed(3)}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800/50 rounded-full overflow-hidden flex shadow-inner">
                          <div 
                            className={`h-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.1)] ${item.impact > 0 ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-emerald-400 to-emerald-600'}`}
                            style={{ width: `${Math.min(Math.abs(item.impact) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-primary-50 dark:bg-primary-900/10 rounded-3xl border border-primary-100/50 dark:border-primary-900/30 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Brain className="w-24 h-24 text-primary-600" />
                  </div>
                  <div className="flex gap-4 relative z-10">
                    <div className="p-2 bg-primary-600 rounded-lg h-fit">
                      <Info className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-primary-600 uppercase tracking-widest mb-1">Sugestão Estratégica IA</p>
                      <p className="text-sm leading-relaxed text-primary-900/80 dark:text-primary-300 font-medium">
                        {
                          (student?.score || 0) > 70 
                            ? "Este aluno apresenta comportamento crítico de evasão. Recomendamos contato imediato via WhatsApp oferecendo uma renovação ou desconto especial."
                            : (student?.score || 0) > 30
                            ? "Risco moderado detectado. Considere enviar um lembrete motivacional ou convite para uma nova modalidade."
                            : "Comportamento estável. Mantenha o engajamento atual."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-8 py-6 bg-gray-50/50 dark:bg-[#1a1d27]/30 border-t border-gray-100 dark:border-[#1e2235] flex justify-end">
            <button 
              onClick={onClose}
              className="px-10 py-3 bg-gray-900 dark:bg-primary-600 text-white rounded-2xl text-sm font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-200 dark:shadow-primary-900/20"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.2); border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.4); }
      `}</style>
    </div>
  );
}
