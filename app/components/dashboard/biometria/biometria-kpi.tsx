'use client';

import React from 'react';
import { Scale, Activity, Flame, Dumbbell, Heart, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/utils/cn';
import { getIMCCategory } from '@/types/biometria';
import type { BiometriaKPIData } from '@/types/biometria';

interface BiometriaKPIProps {
  stats: BiometriaKPIData;
}

export function BiometriaKPI({ stats }: BiometriaKPIProps) {
  const pesoChange = stats.pesoAtual - stats.pesoAnterior;
  const gorduraChange = stats.gorduraAtual - stats.gorduraAnterior;
  const massaChange = stats.massaMuscularAtual - stats.massaMuscularAnterior;
  const imcCat = getIMCCategory(stats.imcAtual);

  const cards = [
    {
      label: 'Peso Atual',
      value: `${stats.pesoAtual} kg`,
      change: `${pesoChange > 0 ? '+' : ''}${pesoChange.toFixed(1)} kg`,
      positive: pesoChange <= 0,
      icon: Scale,
      color: 'text-primary-600 dark:text-primary-400',
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      gradient: 'from-primary-500 to-indigo-600',
    },
    {
      label: 'IMC',
      value: stats.imcAtual.toFixed(1),
      change: imcCat.label,
      positive: stats.imcAtual >= 18.5 && stats.imcAtual < 25,
      icon: Activity,
      color: imcCat.color,
      bg: imcCat.bg,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      label: 'Gordura Corporal',
      value: `${stats.gorduraAtual}%`,
      change: `${gorduraChange > 0 ? '+' : ''}${gorduraChange.toFixed(1)}%`,
      positive: gorduraChange <= 0,
      icon: Flame,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      label: 'Massa Muscular',
      value: `${stats.massaMuscularAtual}%`,
      change: `${massaChange > 0 ? '+' : ''}${massaChange.toFixed(1)}%`,
      positive: massaChange >= 0,
      icon: Dumbbell,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      gradient: 'from-violet-500 to-purple-600',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Cartões de KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-[#0f1117] rounded-2xl p-5 border border-gray-100 dark:border-[#1e2235] hover:shadow-lg transition-all relative overflow-hidden">
            <div className={cn("absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r", card.gradient)} />
            <div className="flex items-center justify-between mb-3">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", card.bg)}>
                <card.icon className={cn("w-4 h-4", card.color)} />
              </div>
              <div className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
                card.positive
                  ? "bg-emerald-50 dark:bg-green-900/20 text-emerald-700 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
              )}>
                {card.positive ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                {card.change}
              </div>
            </div>
            <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-0.5">{card.label}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Barra de Pontuação de Saúde */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-[#0f1117] dark:to-[#1a1d27] rounded-2xl p-5 border border-gray-700 dark:border-[#2d3348] flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Score de Saúde</p>
            <p className="text-2xl font-black text-white">{stats.healthScore}<span className="text-sm text-gray-400 font-medium">/100</span></p>
          </div>
        </div>
        <div className="flex-1 w-full">
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Composição Corporal</span>
            <span className="text-[10px] font-bold text-emerald-400">Bom</span>
          </div>
          <div className="h-3 bg-gray-700 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000"
              style={{ width: `${stats.healthScore}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-gray-500">Idade metabólica: {stats.idadeMetabolica} anos</span>
            <span className="text-[9px] text-gray-500">Meta: 90+</span>
          </div>
        </div>
      </div>
    </div>
  );
}
