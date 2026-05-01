'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  title?: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastConfig: Record<ToastType, {
  icon: React.ComponentType<{ className?: string }>;
  containerClass: string;
  iconClass: string;
}> = {
  success: {
    icon: CheckCircle,
    containerClass: 'bg-white dark:bg-gray-900 border-green-200 dark:border-green-800',
    iconClass: 'text-success-500',
  },
  error: {
    icon: AlertCircle,
    containerClass: 'bg-white dark:bg-gray-900 border-red-200 dark:border-red-800',
    iconClass: 'text-danger-500',
  },
  warning: {
    icon: AlertTriangle,
    containerClass: 'bg-white dark:bg-gray-900 border-amber-200 dark:border-amber-800',
    iconClass: 'text-warning-500',
  },
  info: {
    icon: Info,
    containerClass: 'bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-800',
    iconClass: 'text-primary-500',
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', title?: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none"
        role="region"
        aria-label="Notificações"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const config = toastConfig[toast.type];
          const Icon = config.icon;
          return (
            <div
              key={toast.id}
              className={cn(
                "pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-2xl shadow-xl border animate-slide-in-right min-w-[320px] max-w-[420px]",
                config.containerClass
              )}
              role="alert"
            >
              <Icon className={cn("w-5 h-5 mt-0.5 shrink-0", config.iconClass)} />
              <div className="flex-1 min-w-0">
                {toast.title && (
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{toast.title}</p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors shrink-0"
                aria-label="Fechar notificação"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast deve ser usado dentro de um ToastProvider');
  return context;
};
