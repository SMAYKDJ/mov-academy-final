'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, CreditCard, User, Home, QrCode } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Layout mobile-first para o App do Aluno.
 * Possui uma barra de navegação inferior fixa e cabeçalho condensado.
 */
export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Início', href: '/app-aluno' },
    { icon: Dumbbell, label: 'Treinos', href: '/app-aluno/treinos' },
    { icon: QrCode, label: 'Check-in', href: '/app-aluno/checkin', primary: true },
    { icon: CreditCard, label: 'Contas', href: '/app-aluno/financeiro' },
    { icon: User, label: 'Perfil', href: '/app-aluno/perfil' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#080a0f] pb-24 md:max-w-md md:mx-auto md:shadow-2xl md:border-x md:border-gray-100 dark:md:border-[#1e2235]">
      {/* Cabeçalho do App */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f1117]/80 backdrop-blur-xl border-b border-gray-100 dark:border-[#1e2235] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white tracking-tight">Moviment</span>
        </div>
        <button className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
           <span className="text-[10px] font-bold text-gray-500">JS</span>
        </button>
      </header>

      {/* Conteúdo da Página */}
      <main className="p-6 pb-12 animate-fade-in">
        {children}
      </main>

      {/* Barra de Navegação Inferior */}
      <nav className="fixed bottom-0 left-0 right-0 md:max-w-md md:left-1/2 md:-translate-x-1/2 bg-white/90 dark:bg-[#0f1117]/90 backdrop-blur-xl border-t border-gray-100 dark:border-[#1e2235] px-4 py-3 flex items-center justify-between z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          if (item.primary) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="relative -top-8 w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-200 dark:shadow-none ring-4 ring-white dark:ring-[#080a0f] transition-transform active:scale-95"
              >
                <item.icon className="w-7 h-7" />
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 min-w-[60px] transition-all",
                isActive ? "text-primary-600 dark:text-primary-400 scale-110" : "text-gray-400 dark:text-gray-500"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
              <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
