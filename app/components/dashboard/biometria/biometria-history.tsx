'use client';

import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Ruler } from 'lucide-react';
import { cn } from '@/utils/cn';
import { getIMCCategory } from '@/types/biometria';
import type { BiometricEvaluation } from '@/types/biometria';

interface BiometriaHistoryProps {
  evaluations: BiometricEvaluation[];
}

export function BiometriaHistory({ evaluations }: BiometriaHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Histórico de Avaliações</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{evaluations.length} avaliações registradas</p>
        </div>
      </div>

      <div className="space-y-3">
        {evaluations.map((ev, idx) => {
          const isExpanded = expandedId === ev.id;
          const imcCat = getIMCCategory(ev.imc);
          const prev = evaluations[idx + 1];
          const pesoChange = prev ? ev.peso - prev.peso : 0;

          return (
            <div key={ev.id} className="border border-gray-100 dark:border-[#1e2235] rounded-xl overflow-hidden transition-all">
              {/* Linha de Resumo */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : ev.id)}
                className="w-full p-4 flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-[#1a1d27] transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-50 dark:bg-[#1a1d27] rounded-xl flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{ev.data}</p>
                    <p className="text-[10px] text-gray-400">Avaliação #{evaluations.length - idx}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{ev.peso} kg</p>
                    {pesoChange !== 0 && (
                      <span className={cn("text-[10px] font-bold", pesoChange < 0 ? "text-emerald-600" : "text-red-500")}>
                        {pesoChange > 0 ? '+' : ''}{pesoChange.toFixed(1)} kg
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{ev.gordura}%</p>
                    <span className="text-[10px] text-gray-400">Gordura</span>
                  </div>
                  <div className="hidden md:block">
                    <span className={cn("px-2 py-0.5 rounded-md text-[9px] font-bold uppercase", imcCat.bg, imcCat.color)}>
                      IMC {ev.imc.toFixed(1)}
                    </span>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {/* Detalhes Expandidos */}
              {isExpanded && (
                <div className="p-4 pt-0 border-t border-gray-50 dark:border-[#1e2235] animate-fade-in">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="bg-gray-50 dark:bg-[#1a1d27] p-3 rounded-xl">
                      <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">Peso</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{ev.peso} kg</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#1a1d27] p-3 rounded-xl">
                      <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">IMC</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{ev.imc.toFixed(1)}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#1a1d27] p-3 rounded-xl">
                      <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">Gordura</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{ev.gordura}%</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#1a1d27] p-3 rounded-xl">
                      <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">Massa Musc.</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{ev.massaMuscular}%</p>
                    </div>
                  </div>

                  {/* Circumferences */}
                  <div className="flex items-center gap-2 mb-3">
                    <Ruler className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Circunferências (cm)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries({
                      'Peito': ev.circunferencias.peito,
                      'Cintura': ev.circunferencias.cintura,
                      'Quadril': ev.circunferencias.quadril,
                      'Braço D': ev.circunferencias.bracoD,
                      'Braço E': ev.circunferencias.bracoE,
                      'Coxa D': ev.circunferencias.coxaD,
                      'Coxa E': ev.circunferencias.coxaE,
                      'Panturrilha': ev.circunferencias.panturrilha,
                    }).map(([label, val]) => (
                      <div key={label} className="flex items-center justify-between bg-gray-50 dark:bg-[#1a1d27] px-3 py-2 rounded-lg">
                        <span className="text-[10px] text-gray-500 font-medium">{label}</span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
