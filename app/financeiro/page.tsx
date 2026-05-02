'use client';

import React, { useState, useEffect } from 'react';
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { CashManagement } from "@/components/dashboard/cash-management";
import { InventoryManagement } from "@/components/dashboard/inventory-management";
import { AuditTable } from "@/components/dashboard/audit-table";
import { cn } from "@/utils/cn";
import { DollarSign, ShieldCheck, History, ArrowUpCircle, ArrowDownCircle, TrendingUp } from "lucide-react";
import { DRESummary } from "@/components/dashboard/dre-summary";

export default function FinanceiroPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'caixa' | 'auditoria' | 'estoque' | 'dre'>('caixa');

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#080a0f]">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        onCollapse={setIsSidebarCollapsed}
      />

      <div className={cn(
        "flex-1 w-full min-w-0 transition-all duration-300",
        isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
      )}>
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="px-4 md:px-8 py-8 w-full space-y-8">
          {/* Cabeçalho da Página */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Gestão Financeira & ERP
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Controle de caixa, fluxo diário, estoque e auditoria.
              </p>
            </div>
            
            {/* Tabs de Navegação */}
            <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
              <button
                onClick={() => setActiveTab('caixa')}
                className={cn(
                  "px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2",
                  activeTab === 'caixa' 
                    ? "bg-white dark:bg-primary-600 text-primary-600 dark:text-white shadow-sm" 
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                <DollarSign className="w-4 h-4" />
                Caixa
              </button>
              <button
                onClick={() => setActiveTab('estoque')}
                className={cn(
                  "px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2",
                  activeTab === 'estoque' 
                    ? "bg-white dark:bg-primary-600 text-primary-600 dark:text-white shadow-sm" 
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                <History className="w-4 h-4" />
                Estoque
              </button>
              <button
                onClick={() => setActiveTab('auditoria')}
                className={cn(
                  "px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2",
                  activeTab === 'auditoria' 
                    ? "bg-white dark:bg-primary-600 text-primary-600 dark:text-white shadow-sm" 
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                <ShieldCheck className="w-4 h-4" />
                Auditoria
              </button>
              <button
                onClick={() => setActiveTab('dre')}
                className={cn(
                  "px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2",
                  activeTab === 'dre' 
                    ? "bg-white dark:bg-primary-600 text-primary-600 dark:text-white shadow-sm" 
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                <TrendingUp className="w-4 h-4" />
                DRE / Lucro
              </button>
            </div>
          </div>

          <div className="animate-fade-in">
            {activeTab === 'caixa' ? (
              <CashManagement />
            ) : activeTab === 'estoque' ? (
              <InventoryManagement />
            ) : activeTab === 'auditoria' ? (
              <AuditTable />
            ) : (
              <DRESummary />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
