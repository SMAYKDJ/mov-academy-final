'use client';

import React from 'react';
import { UserCheck, CreditCard, UserPlus, AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { ActivityItem } from '@/types';

/**
 * Configuração de ícone e cor para cada tipo de atividade.
 */
const activityConfig: Record<ActivityItem['type'], {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}> = {
  checkin: {
    icon: UserCheck,
    iconBg: 'bg-success-50 dark:bg-green-900/20',
    iconColor: 'text-success-600 dark:text-green-400',
  },
  payment: {
    icon: CreditCard,
    iconBg: 'bg-primary-50 dark:bg-primary-900/20',
    iconColor: 'text-primary-600 dark:text-primary-400',
  },
  signup: {
    icon: UserPlus,
    iconBg: 'bg-warning-50 dark:bg-amber-900/20',
    iconColor: 'text-warning-600 dark:text-amber-400',
  },
  alert: {
    icon: AlertTriangle,
    iconBg: 'bg-danger-50 dark:bg-red-900/20',
    iconColor: 'text-danger-600 dark:text-red-400',
  },
};

interface ActivityFeedProps {
  activities: ActivityItem[];
  className?: string;
  onShowAll?: () => void;
}

/**
 * Feed de atividades em tempo real mostrando eventos recentes.
 * Exibe check-ins, pagamentos, cadastros e alertas.
 */
export function ActivityFeed({ activities, className, onShowAll }: ActivityFeedProps) {
  const [showAll, setShowAll] = React.useState(false);
  const displayedActivities = showAll ? activities : activities.slice(0, 6);
  return (
    <div className={cn(
      "bg-white dark:bg-[#0f1117] p-6 rounded-2xl border border-gray-100 dark:border-[#1e2235] shadow-sm hover:shadow-md transition-all duration-300",
      className
    )}>
      {/* Cabeçalho */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white leading-none">Atividade Recente</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Últimas ações registradas</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-success-50 dark:bg-green-900/20 rounded-lg">
          <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse" aria-hidden="true" />
          <span className="text-[10px] font-bold text-success-700 dark:text-green-400 uppercase tracking-wider">Ao vivo</span>
        </div>
      </div>

      {/* Lista de Atividades */}
      <div className="space-y-4">
        {displayedActivities.map((activity, index) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 group animate-fade-in"
              style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
            >
              {/* Ícone */}
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                config.iconBg
              )}>
                <Icon className={cn("w-4 h-4", config.iconColor)} />
              </div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-900 dark:text-white">{activity.user}</span>
                  {' '}
                  {activity.action}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-gray-300 dark:text-gray-600" />
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ver Tudo */}
      <button 
        onClick={onShowAll || (() => setShowAll(!showAll))}
        className="w-full mt-6 py-2.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-xl transition-all"
      >
        {onShowAll ? 'Ver todas as atividades →' : (showAll ? '↑ Recolher atividades' : 'Ver todas as atividades →')}
      </button>
    </div>
  );
}
