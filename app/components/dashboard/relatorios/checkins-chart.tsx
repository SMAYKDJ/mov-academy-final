'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import type { DailyCheckins } from '@/types/relatorios';

interface CheckinsChartProps {
  data: DailyCheckins[];
}

export function CheckinsChart({ data }: CheckinsChartProps) {
  const maxVal = Math.max(...data.map(d => d.quantidade));

  return (
    <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Check-ins Diários</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Últimos 7 dias</p>
        </div>
        <div className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
            {data[data.length - 1].quantidade} hoje
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between h-40 gap-3">
        {data.map((day) => {
          const height = (day.quantidade / maxVal) * 100;
          return (
            <div key={day.data} className="flex-1 flex flex-col items-center group">
              <div className="w-full relative">
                <div 
                  className="w-full bg-primary-100 dark:bg-primary-900/10 rounded-t-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-900/20 transition-all flex items-end justify-center overflow-hidden"
                  style={{ height: '140px' }}
                >
                  <div 
                    className="w-full bg-primary-500 transition-all duration-1000 ease-out rounded-t-lg"
                    style={{ height: `${height}%` }}
                  />
                  {/* Tooltip */}
                  <div className="absolute -top-8 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.quantidade} pts
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-2">
                {day.data}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
