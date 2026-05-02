'use client';

import React from 'react';
import { X, Clock, User, Zap, CreditCard, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ActivityHistoryProps {
  onClose: () => void;
}

const iconMap = {
  checkin: User,
  payment: CreditCard,
  signup: Zap,
  alert: Zap,
};

export function ActivityHistory({ onClose }: ActivityHistoryProps) {
  const activities: any[] = []; // Viria do banco de dados

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Fundo (Backdrop) */}
      <div 
        className="fixed inset-0 bg-[#080a0f]/80 backdrop-blur-md animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Container do Modal para garantir centralização vertical em telas pequenas */}
      <div className="relative w-full max-w-3xl my-auto animate-scale-in">
        {/* Modal Content */}
        <div className="relative flex flex-col w-full bg-white dark:bg-[#0f1117] rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-[#1e2235] overflow-hidden">
          {/* Cabeçalho */}
          <div className="px-8 py-6 border-b border-gray-100 dark:border-[#1e2235] flex items-center justify-between bg-white dark:bg-[#0f1117] sticky top-0 z-10">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Histórico de Atividades</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Log detalhado de todas as ações recentes no sistema</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all hover:rotate-90 duration-300"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
   
          {/* Conteúdo */}
          <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {activities.length > 0 ? (
              <div className="space-y-6">
                {activities.map((item, idx) => {
                  const Icon = iconMap[item.type as keyof typeof iconMap] || Clock;
                  return (
                    <div 
                      key={item.id} 
                      className="flex items-start gap-5 p-5 bg-gray-50/50 dark:bg-[#1a1d27]/50 rounded-[24px] hover:bg-white dark:hover:bg-[#1e2235] border border-transparent hover:border-gray-200 dark:hover:border-primary-500/30 transition-all duration-300 group"
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform duration-500 group-hover:scale-110",
                        item.type === 'payment' ? "bg-emerald-500 text-white shadow-emerald-500/20" :
                        item.type === 'checkin' ? "bg-blue-500 text-white shadow-blue-500/20" :
                        item.type === 'signup' ? "bg-amber-500 text-white shadow-amber-500/20" :
                        "bg-primary-600 text-white shadow-primary-600/20"
                      )}>
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="text-base font-bold text-gray-900 dark:text-white truncate">
                            {item.user}
                          </h4>
                          <span className="text-xs font-black text-gray-400 dark:text-gray-500 whitespace-nowrap bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-primary-600 dark:text-primary-400 mt-1">
                          {item.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                          Evento capturado pelo kernel do sistema e sincronizado com o banco de dados.
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                          <span className="text-[10px] font-black px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 uppercase tracking-[0.1em]">
                            {item.type}
                          </span>
                          <div className="h-1 w-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
                          <span className="text-[10px] font-bold text-gray-400">ID: {item.id}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-700 group-hover:text-primary-500 transition-all group-hover:translate-x-1 self-center" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                 <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-10 h-10 text-gray-300" />
                 </div>
                 <p className="text-gray-500 font-bold">Nenhuma atividade registrada ainda.</p>
                 <p className="text-xs text-gray-400 mt-1">Ações aparecerão aqui conforme o sistema for utilizado.</p>
              </div>
            )}
          </div>
   
          {/* Rodapé */}
          <div className="px-8 py-6 bg-gray-50/50 dark:bg-[#1a1d27]/30 border-t border-gray-100 dark:border-[#1e2235] flex justify-between items-center">
            <p className="text-xs text-gray-400 font-medium italic">Exibindo {activities.length} atividades recentes</p>
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-gray-900 dark:bg-primary-600 text-white rounded-2xl text-sm font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-200 dark:shadow-primary-900/20"
            >
              Fechar Visualização
            </button>
          </div>
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
