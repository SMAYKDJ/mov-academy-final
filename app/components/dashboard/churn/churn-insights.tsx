'use client';

import React from 'react';
import { Brain, Lightbulb, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { ChurnInsight } from '@/types/churn';

/**
 * ChurnInsights — AI-generated actionable insights from the ML model.
 * 
 * Displays data-driven findings such as:
 * - "Students inactive > 7 days have 3x higher churn"
 * - "Late payments increase risk by 45%"
 * 
 * Each insight shows severity, impact metric, and calls to action.
 */

interface ChurnInsightsProps {
  insights: ChurnInsight[];
  className?: string;
}

const severityConfig = {
  alto: {
    border: 'border-l-red-500',
    iconBg: 'bg-red-50 dark:bg-red-900/20',
    iconColor: 'text-red-500',
    impactBg: 'bg-red-50 dark:bg-red-900/20',
    impactText: 'text-red-600 dark:text-red-400',
  },
  medio: {
    border: 'border-l-amber-400',
    iconBg: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-500',
    impactBg: 'bg-amber-50 dark:bg-amber-900/20',
    impactText: 'text-amber-600 dark:text-amber-400',
  },
  baixo: {
    border: 'border-l-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-500',
    impactBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    impactText: 'text-emerald-600 dark:text-emerald-400',
  },
};

export function ChurnInsights({ insights, className }: ChurnInsightsProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-[#0f1117] p-6 rounded-2xl border border-gray-100 dark:border-[#1e2235] shadow-sm hover:shadow-md transition-all duration-300",
        className
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl">
            <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white leading-none">
              Insights Inteligentes
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Descobertas automáticas via KDD
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
          <Lightbulb className="w-3 h-3" />
          IA
        </span>
      </div>

      {/* Insights list */}
      <div className="space-y-3">
        {insights.map((insight, index) => {
          const config = severityConfig[insight.severity];

          return (
            <div
              key={insight.id}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl border-l-4 bg-gray-50/50 dark:bg-gray-800/20 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all group cursor-default animate-slide-up",
                config.border
              )}
              style={{
                animationDelay: `${index * 80}ms`,
                animationFillMode: 'backwards',
              }}
            >
              {/* Emoji Icon */}
              <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">
                {insight.icon}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {insight.text}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                      config.impactBg,
                      config.impactText
                    )}
                  >
                    {insight.impact}
                  </span>
                  <button className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver detalhes
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Model info bar */}
      <div className="mt-6 p-3 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/10 dark:via-purple-900/10 dark:to-pink-900/10 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Modelo: Random Forest • Acurácia: 92% • Última atualização: Hoje
            </span>
          </div>
          <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
            Scikit-learn
          </span>
        </div>
      </div>
    </div>
  );
}
