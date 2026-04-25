'use client';

import React, { useState } from 'react';
import {
  Users,
  AlertTriangle,
  MessageCircle,
  HandHelping,
  ChevronDown,
  ChevronUp,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/components/ui/toast';
import type { ChurnPrediction, RiskLevel } from '@/types/churn';

/**
 * AtRiskStudentsTable — Tabular view of students ranked by churn probability.
 * 
 * Features:
 * - Color-coded risk badges (Verde/Amarelo/Vermelho)
 * - "Intervir" and "Enviar mensagem" action buttons
 * - Sortable by probability
 * - Search filter
 * - Expandable rows with detail
 */

interface AtRiskStudentsTableProps {
  predictions: ChurnPrediction[];
  className?: string;
}

const riskBadgeConfig: Record<RiskLevel, { label: string; bg: string; text: string; dot: string }> = {
  alto: {
    label: 'Alto',
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
  },
  medio: {
    label: 'Médio',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-400',
  },
  baixo: {
    label: 'Baixo',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-400',
  },
};

type SortDir = 'asc' | 'desc';

export function AtRiskStudentsTable({ predictions, className }: AtRiskStudentsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const { showToast } = useToast();

  // Filter and sort
  const filtered = predictions
    .filter((p) => {
      const matchesSearch = p.studentName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = riskFilter === 'all' || p.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    })
    .sort((a, b) => sortDir === 'desc' ? b.probability - a.probability : a.probability - b.probability);

  const handleIntervene = (name: string) => {
    showToast(`Intervenção iniciada para ${name}`, 'info', 'Intervenção');
  };

  const handleMessage = (name: string) => {
    showToast(`Mensagem enviada para ${name}`, 'info', 'Mensagem');
  };

  const toggleSort = () => {
    setSortDir((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-danger-50 dark:bg-red-900/20 rounded-xl">
              <Users className="w-5 h-5 text-danger-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white leading-none">
                Alunos em Risco
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Ranking por probabilidade de evasão • ML Random Forest
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-lg">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar aluno..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'alto', 'medio', 'baixo'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setRiskFilter(level)}
                className={cn(
                  "px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all",
                  riskFilter === level
                    ? "bg-primary-600 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                {level === 'all' ? 'Todos' : level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-[#1e2235]">
              <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                Aluno
              </th>
              <th
                className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest cursor-pointer hover:text-gray-600 transition-colors"
                onClick={toggleSort}
              >
                <span className="inline-flex items-center gap-1">
                  Probabilidade
                  {sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                </span>
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest hidden md:table-cell">
                Última Presença
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest hidden lg:table-cell">
                Status
              </th>
              <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 10).map((prediction, index) => {
              const badge = riskBadgeConfig[prediction.riskLevel];
              const isExpanded = expandedId === prediction.studentId;

              return (
                <React.Fragment key={prediction.studentId}>
                  <tr
                    className={cn(
                      "border-b border-gray-50 dark:border-[#1a1d27] hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors cursor-pointer",
                      isExpanded && "bg-gray-50/50 dark:bg-gray-800/20"
                    )}
                    onClick={() =>
                      setExpandedId(isExpanded ? null : prediction.studentId)
                    }
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'backwards',
                    }}
                  >
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0",
                            prediction.riskLevel === 'alto' ? 'bg-red-500'
                              : prediction.riskLevel === 'medio' ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          )}
                        >
                          {prediction.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {prediction.studentName}
                          </p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500">
                            {prediction.studentId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Probability */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20">
                          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-700",
                                prediction.riskLevel === 'alto' ? 'bg-red-500'
                                  : prediction.riskLevel === 'medio' ? 'bg-amber-400'
                                  : 'bg-emerald-400'
                              )}
                              style={{ width: `${prediction.probability}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">
                          {prediction.probability}%
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold",
                            badge.bg,
                            badge.text
                          )}
                        >
                          <span className={cn("w-1.5 h-1.5 rounded-full", badge.dot)} />
                          {badge.label}
                        </span>
                      </div>
                    </td>

                    {/* Last Visit */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {prediction.lastPresence}
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500">
                          {prediction.daysSinceLastVisit} dias atrás
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                          prediction.paymentStatus === 'overdue'
                            ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                            : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                        )}
                      >
                        {prediction.paymentStatus === 'overdue' ? 'Inadimplente' : 'Em dia'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIntervene(prediction.studentName);
                          }}
                          className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all"
                          title="Intervir"
                        >
                          <HandHelping className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMessage(prediction.studentName);
                          }}
                          className="p-2 rounded-lg bg-success-50 dark:bg-green-900/20 text-success-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all"
                          title="Enviar mensagem"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Detail Row */}
                  {isExpanded && (
                    <tr className="bg-gray-50/80 dark:bg-gray-800/30">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-scale-in">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Frequência Semanal</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{prediction.weeklyFrequency}x/semana</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Dias sem Treino</p>
                            <p className={cn(
                              "text-sm font-bold",
                              prediction.daysSinceLastVisit > 7 ? "text-red-500" : "text-gray-900 dark:text-white"
                            )}>{prediction.daysSinceLastVisit} dias</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Tempo de Matrícula</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{prediction.enrollmentMonths} meses</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Atualizado em</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{prediction.updatedAt}</p>
                          </div>
                        </div>

                        {/* IA Risk Factors (SHAP) */}
                        {prediction.impacts && (
                          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700/50">
                            <div className="flex items-center gap-2 mb-3">
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                              <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Fatores de Risco (IA - SHAP)</p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                              {Object.entries(prediction.impacts).sort(([, a], [, b]) => b - a).map(([feature, impact]) => (
                                <div key={feature} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#1a1d27] rounded-lg border border-gray-100 dark:border-gray-700">
                                  <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{feature.replace('_', ' ')}:</span>
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-12 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                      <div 
                                        className={cn(
                                          "h-full rounded-full",
                                          impact > 0 ? "bg-red-500" : "bg-emerald-500"
                                        )}
                                        style={{ width: `${Math.min(Math.abs(impact) * 100, 100)}%` }}
                                      />
                                    </div>
                                    <span className={cn(
                                      "text-[10px] font-bold tabular-nums",
                                      impact > 0 ? "text-red-500" : "text-emerald-500"
                                    )}>
                                      {impact > 0 ? '+' : ''}{(impact * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {filtered.length > 10 && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-[#1e2235]">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Mostrando 10 de {filtered.length} alunos • Ordene ou filtre para ver mais
          </p>
        </div>
      )}
    </div>
  );
}
