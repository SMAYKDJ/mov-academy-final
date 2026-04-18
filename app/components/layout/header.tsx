'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, Sparkles, CreditCard, UserPlus, AlertTriangle, CalendarDays, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface HeaderProps {
  onMenuClick?: () => void;
}

interface Notification {
  id: string;
  titulo: string;
  descricao: string;
  tempo: string;
  lida: boolean;
  tipo: 'pagamento' | 'aluno' | 'alerta' | 'aula';
}

const initialNotifications: Notification[] = [
  { id: 'n1', titulo: 'Pagamento recebido', descricao: 'João Silva — Plano Mensal (R$ 129,90)', tempo: '5 min atrás', lida: false, tipo: 'pagamento' },
  { id: 'n2', titulo: 'Novo aluno cadastrado', descricao: 'Maria Oliveira completou o cadastro', tempo: '23 min atrás', lida: false, tipo: 'aluno' },
  { id: 'n3', titulo: 'Mensalidade vencida', descricao: 'Pedro Lima — vencida há 3 dias', tempo: '1h atrás', lida: false, tipo: 'alerta' },
  { id: 'n4', titulo: 'Aula de Spinning às 18h', descricao: '12 alunos confirmados — Turma 1', tempo: '2h atrás', lida: true, tipo: 'aula' },
];

const notifIconMap = {
  pagamento: CreditCard,
  aluno: UserPlus,
  alerta: AlertTriangle,
  aula: CalendarDays,
};
const notifColorMap = {
  pagamento: 'text-emerald-500 bg-emerald-50 dark:bg-green-900/20',
  aluno: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
  alerta: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
  aula: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20',
};

const roleLabel: Record<string, string> = {
  admin: 'Administrador',
  recepcao: 'Recepção',
  professor: 'Professor',
};

export function Header({ onMenuClick }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const unreadCount = notifications.filter(n => !n.lida).length;

  // ⌘K shortcut to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape' && searchFocused) {
        setSearchQuery('');
        searchRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [searchFocused]);

  // Close notification dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [notifOpen]);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, lida: true })));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/alunos?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
  };

  // User display info
  const displayName = user?.nome || 'Usuário';
  const displayRole = roleLabel[user?.role || ''] || user?.role || 'Gestor';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header
      className={cn(
        "sticky top-0 h-16 z-40 transition-all duration-300",
        "bg-white/80 dark:bg-[#0f1117]/80 backdrop-blur-xl",
        "border-b border-gray-100 dark:border-[#1e2235]"
      )}
      role="banner"
    >
      <div className="h-full px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Left: Mobile menu + dynamic page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-400 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 -mt-0.5">Visão geral da academia</p>
          </div>
        </div>

        {/* Center: Functional search bar */}
        <div className="flex-1 max-w-md mx-2 md:mx-6">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-primary-500 transition-colors" />
            <input
              ref={searchRef}
              type="search"
              id="header-search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Buscar alunos, relatórios... (⌘K)"
              className={cn(
                "w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all duration-200",
                "bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#1e2235]",
                "text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500",
                "focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-400 dark:focus:border-primary-600 focus:bg-white dark:focus:bg-[#0f1117]"
              )}
              aria-label="Campo de busca global"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Limpar campo de busca"
                title="Limpar busca"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="hidden lg:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded">
                ⌘K
              </kbd>
            )}
          </form>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* AI Insight button */}
          <button
            onClick={() => showToast('Analisando padrões de treino e churn...', 'info', 'IA Insights')}
            className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary-500 to-indigo-600 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-primary-200 dark:hover:shadow-none transition-all"
            aria-label="Insights da inteligência artificial"
          >
            <Sparkles className="w-3.5 h-3.5" />
            IA Insights
          </button>

          <ThemeToggle />

          {/* Notifications Bell + Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label={`Notificações — ${unreadCount} novas`}
              aria-expanded={notifOpen ? "true" : "false"}
            >
              <Bell className="w-[18px] h-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-danger-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-[#0f1117] animate-scale-in" aria-hidden="true">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-[#0f1117] border border-gray-100 dark:border-[#1e2235] rounded-2xl shadow-2xl overflow-hidden z-50 animate-scale-in">
                {/* Dropdown Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#1e2235]">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notificações</h3>
                    <p className="text-[10px] text-gray-400">{unreadCount} não lida{unreadCount !== 1 ? 's' : ''}</p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[10px] font-bold text-primary-600 dark:text-primary-400 hover:underline uppercase tracking-widest"
                    >
                      Marcar todas
                    </button>
                  )}
                </div>

                {/* Notification Items */}
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map(notif => {
                    const Icon = notifIconMap[notif.tipo];
                    const colors = notifColorMap[notif.tipo];
                    return (
                      <button
                        key={notif.id}
                        onClick={() => markRead(notif.id)}
                        className={cn(
                          "w-full flex items-start gap-3 px-4 py-3 text-left transition-all hover:bg-gray-50 dark:hover:bg-[#1a1d27]",
                          !notif.lida && "bg-primary-50/50 dark:bg-primary-900/5"
                        )}
                      >
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5", colors)}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={cn("text-xs font-semibold truncate", notif.lida ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white")}>
                              {notif.titulo}
                            </p>
                            {!notif.lida && <div className="w-1.5 h-1.5 bg-primary-500 rounded-full shrink-0" />}
                          </div>
                          <p className="text-[10px] text-gray-400 truncate mt-0.5">{notif.descricao}</p>
                          <p className="text-[9px] text-gray-300 dark:text-gray-600 mt-0.5">{notif.tempo}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Dropdown Footer — now navigates */}
                <div className="px-4 py-2.5 border-t border-gray-100 dark:border-[#1e2235] text-center">
                  <Link
                    href="/relatorios"
                    onClick={() => setNotifOpen(false)}
                    className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest hover:underline"
                  >
                    Ver histórico de atividades →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-100 dark:bg-[#1e2235] mx-1 hidden sm:block" aria-hidden="true" />

          {/* User avatar — clickable, goes to /configuracoes */}
          <Link
            href="/configuracoes"
            className="flex items-center gap-3 pl-2 pr-1 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-all focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="Ir para configurações de perfil"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{displayName.split(' ')[0]}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">{displayRole}</p>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200 dark:shadow-none ring-2 ring-white dark:ring-[#0f1117] overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{initials}</span>
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
