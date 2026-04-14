'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Users,
  Settings,
  Calendar,
  CreditCard,
  Dumbbell,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  X,
  Shield,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useMediaQuery } from '@/hooks/use-media-query';

/**
 * Navigation menu items.
 * Active state is derived from the current pathname via Next.js router.
 */
const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Alunos', href: '/alunos' },
  { icon: BarChart3, label: 'Relatórios', href: '/relatorios' },
  { icon: Calendar, label: 'Cronograma', href: '/cronograma' },
  { icon: CreditCard, label: 'Financeiro', href: '/financeiro' },
  { icon: Dumbbell, label: 'Treinos', href: '/treinos' },
  { icon: Shield, label: 'Biometria', href: '/biometria' },
  { icon: Settings, label: 'Configurações', href: '/configuracoes' },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const pathname = usePathname();

  // Close mobile sidebar on desktop resize
  useEffect(() => {
    if (isDesktop && onMobileClose) {
      onMobileClose();
    }
  }, [isDesktop, onMobileClose]);

  const sidebarContent = (
    <aside
      className={cn(
        "h-screen bg-white dark:bg-[#0f1117] border-r border-gray-100 dark:border-[#1e2235] transition-all duration-300 flex flex-col",
        // Desktop: fixed sidebar with collapse
        "md:fixed md:left-0 md:top-0 md:z-50",
        isCollapsed ? "md:w-20" : "md:w-64",
        // Mobile: full-width inside drawer
        "w-72"
      )}
      role="navigation"
      aria-label="Menu principal"
    >
      {/* Logo / Brand */}
      <div className="p-5 flex items-center justify-between border-b border-gray-50 dark:border-[#1e2235]">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 overflow-hidden transition-all duration-300",
            isCollapsed && "md:opacity-0 md:w-0"
          )}
        >
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-200 dark:shadow-none">
            <Dumbbell className="text-white w-5 h-5" />
          </div>
          <div className="whitespace-nowrap">
            <span className="font-bold text-base tracking-tight text-gray-900 dark:text-white">
              Moviment
            </span>
            <span className="text-primary-600 dark:text-primary-400 font-bold">Academy</span>
          </div>
        </Link>

        {/* Desktop: Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <ChevronLeft className={cn("w-5 h-5 transition-transform duration-300", isCollapsed && "rotate-180")} />
        </button>

        {/* Mobile: Close button */}
        <button
          onClick={onMobileClose}
          className="md:hidden p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-gray-400"
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 mt-4 space-y-1 overflow-y-auto" aria-label="Navegação do dashboard">
        {menuItems.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => {
                // Close mobile sidebar on navigation
                if (!isDesktop && onMobileClose) onMobileClose();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100"
              )}
              aria-current={isActive ? 'page' : undefined}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className={cn(
                "w-5 h-5 shrink-0 transition-colors",
                isActive
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
              )} />

              <span className={cn(
                "text-sm font-medium whitespace-nowrap transition-all duration-300",
                isCollapsed && "md:hidden"
              )}>
                {item.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-primary-600 dark:bg-primary-400 rounded-r-full" />
              )}

              {/* Collapsed tooltip (desktop only) */}
              {isCollapsed && (
                <div className="hidden md:block absolute left-full ml-3 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-3 border-t border-gray-100 dark:border-[#1e2235] space-y-1">
        {/* Mini user card */}
        {!isCollapsed && (
          <div className="flex items-center gap-3 p-3 mb-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-primary-200 dark:shadow-none">
              AM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">Admin</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Gestor</p>
            </div>
          </div>
        )}

        <button className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-danger-600 dark:hover:text-red-400 transition-all group",
          isCollapsed && "md:justify-center"
        )}>
          <LogOut className="w-5 h-5" />
          <span className={cn(
            "text-sm font-medium",
            isCollapsed && "md:hidden"
          )}>Sair</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <div className="relative z-10 h-full w-fit animate-slide-in-right">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
