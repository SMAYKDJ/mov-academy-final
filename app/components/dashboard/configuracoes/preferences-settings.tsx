'use client';

import React from 'react';
import { Sun, Moon, Bell, BellOff, Globe } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTheme } from 'next-themes';
import { useToast } from '@/components/ui/toast';

export function PreferencesSettings() {
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const [notifications, setNotifications] = React.useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Preferências do Sistema</h2>
        <p className="text-xs text-gray-400 mt-0.5">Personalização visual e comportamental</p>
      </div>

      {/* Theme */}
      <div className="bg-gray-50 dark:bg-[#1a1d27] rounded-2xl p-5">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Tema</h3>
        <div className="grid grid-cols-3 gap-3">
          {(['light', 'dark', 'system'] as const).map(t => (
              <button 
              key={t} 
              onClick={() => { setTheme(t); showToast(`Tema alterado para ${t === 'light' ? 'Claro' : t === 'dark' ? 'Escuro' : 'Sistema'}`, 'info', 'Tema'); }}
              title={`Mudar para tema ${t === 'light' ? 'claro' : t === 'dark' ? 'escuro' : 'do sistema'}`}
              aria-label={`Mudar para tema ${t === 'light' ? 'claro' : t === 'dark' ? 'escuro' : 'do sistema'}`}
              className={cn(
                "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                theme === t ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10" : "border-gray-200 dark:border-[#2d3348] hover:border-gray-300"
              )}>
              {t === 'light' ? <Sun className="w-5 h-5 text-amber-500" /> : t === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Globe className="w-5 h-5 text-gray-400" />}
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300">
                {t === 'light' ? 'Claro' : t === 'dark' ? 'Escuro' : 'Sistema'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gray-50 dark:bg-[#1a1d27] rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", notifications ? "bg-emerald-50 dark:bg-green-900/20" : "bg-gray-200 dark:bg-gray-700")}>
              {notifications ? <Bell className="w-4 h-4 text-emerald-600 dark:text-green-400" /> : <BellOff className="w-4 h-4 text-gray-400" />}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Notificações</p>
              <p className="text-[10px] text-gray-400">Receber alertas do sistema</p>
            </div>
          </div>
          <button 
            onClick={() => { setNotifications(!notifications); showToast(notifications ? 'Notificações desativadas' : 'Notificações ativadas', 'info', 'Notificações'); }}
            title={notifications ? "Desativar notificações" : "Ativar notificações"}
            aria-label={notifications ? "Desativar notificações" : "Ativar notificações"}
            className={cn("relative w-12 h-6 rounded-full transition-all", notifications ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600")}
          >
            <div className={cn("absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform", notifications ? "translate-x-6" : "translate-x-0.5")} />
          </button>
        </div>
      </div>

      {/* Language */}
      <div className="bg-gray-50 dark:bg-[#1a1d27] rounded-2xl p-5">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Idioma</h3>
        <select 
          title="Selecionar idioma"
          aria-label="Idioma do sistema"
          className="w-full sm:w-auto px-4 py-2.5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
        >
          <option value="pt-BR">🇧🇷 Português (Brasil)</option>
          <option value="en">🇺🇸 English</option>
          <option value="es">🇪🇸 Español</option>
        </select>
      </div>
    </div>
  );
}
