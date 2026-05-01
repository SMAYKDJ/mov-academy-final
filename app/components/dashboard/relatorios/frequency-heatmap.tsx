'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import type { FrequenciaHoraria } from '@/types/relatorios';

interface FrequencyHeatmapProps {
  data: FrequenciaHoraria[];
}

const dias = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];

/**
 * Mapa de calor mostrando a frequência de uso da academia por hora e dia da semana.
 * Células coloridas indicam densidade.
 */
export function FrequencyHeatmap({ data }: FrequencyHeatmapProps) {
  const getIntensityClass = (value: number) => {
    if (value >= 90) return 'bg-primary-600 text-white';
    if (value >= 75) return 'bg-primary-500 text-white';
    if (value >= 50) return 'bg-primary-400 text-white/90';
    if (value >= 25) return 'bg-primary-200 dark:bg-primary-900/40 text-primary-900 dark:text-primary-100';
    if (value >= 10) return 'bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300';
    return 'bg-gray-50 dark:bg-[#1a1d27] text-gray-300 dark:text-gray-600';
  };

  return (
    <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Frequência por Horário</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Média de acessos na semana</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary-100" />
            <span className="text-[10px] text-gray-400 uppercase font-bold">Vazio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary-600" />
            <span className="text-[10px] text-gray-400 uppercase font-bold">Lotação</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="w-12"></th>
              {dias.map(dia => (
                <th key={dia} className="text-[10px] font-bold text-gray-400 dark:text-gray-500 pb-2">
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.hora}>
                <td className="text-[10px] font-bold text-gray-500 dark:text-gray-400 py-1 pr-2 text-right">
                  {row.hora}
                </td>
                <td className={cn("rounded-md text-[9px] font-bold h-10 w-10 text-center transition-all hover:scale-105", getIntensityClass(row.seg))}>{row.seg}%</td>
                <td className={cn("rounded-md text-[9px] font-bold h-10 w-10 text-center transition-all hover:scale-105", getIntensityClass(row.ter))}>{row.ter}%</td>
                <td className={cn("rounded-md text-[9px] font-bold h-10 w-10 text-center transition-all hover:scale-105", getIntensityClass(row.qua))}>{row.qua}%</td>
                <td className={cn("rounded-md text-[9px] font-bold h-10 w-10 text-center transition-all hover:scale-105", getIntensityClass(row.qui))}>{row.qui}%</td>
                <td className={cn("rounded-md text-[9px] font-bold h-10 w-10 text-center transition-all hover:scale-105", getIntensityClass(row.sex))}>{row.sex}%</td>
                <td className={cn("rounded-md text-[9px] font-bold h-10 w-10 text-center transition-all hover:scale-105", getIntensityClass(row.sab))}>{row.sab}%</td>
                <td className={cn("rounded-md text-[9px] font-bold h-10 w-10 text-center transition-all hover:scale-105", getIntensityClass(row.dom))}>{row.dom}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
