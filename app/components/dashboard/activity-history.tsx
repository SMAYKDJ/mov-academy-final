'use client';

import React from 'react';
import { X, Clock, User, Zap, CreditCard, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { recentActivity } from '@/utils/mock-data';

interface ActivityHistoryProps {
  onClose: () => void;
}

const iconMap = {
  aluno: User,
  pagamento: CreditCard,
  alerta: Zap,
};

export function ActivityHistory({ onClose }: ActivityHistoryProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0f1117] rounded-3xl shadow-2xl border border-gray-100 dark:border-[#1e2235] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-[#1e2235] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Histórico de Atividades</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Log detalhado de todas as ações recentes no sistema</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {recentActivity.map((item, idx) => {
              const Icon = iconMap[item.tipo as keyof typeof iconMap] || Clock;
              return (
                <div 
                  key={item.id} 
                  className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-[#1a1d27] rounded-2xl hover:bg-white dark:hover:bg-[#1e2235] border border-transparent hover:border-gray-100 dark:hover:border-[#2d3348] transition-all group"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                    item.tipo === 'pagamento' ? "bg-emerald-50 dark:bg-green-900/20 text-emerald-600" :
                    item.tipo === 'aluno' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" :
                    "bg-amber-50 dark:bg-amber-900/20 text-amber-600"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {item.titulo}
                      </h4>
                      <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap ml-2">
                        {item.tempo}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {item.descricao}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-md text-gray-500 uppercase tracking-wider">
                        {item.tipo}
                      </span>
                      <ChevronRight className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-[#0f1117] border-t border-gray-100 dark:border-[#1e2235] flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
          >
            Fechar Histórico
          </button>
        </div>
      </div>
    </div>
  );
}
