'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, ArrowUpRight, ArrowDownRight, Loader2, Calendar } from 'lucide-react';
import { cn } from "@/utils/cn";

interface DREReport {
  revenue: number;
  expenses: number;
  net_profit: number;
  margin: number;
  period: string;
}

export function DRESummary() {
  const [report, setReport] = useState<DREReport | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDRE = async () => {
    try {
      const res = await fetch('/api/finance/dre');
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (err) {
      console.error("Erro ao buscar DRE");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDRE();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* KPIs Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white dark:bg-[#0f1117] rounded-3xl border border-gray-100 dark:border-[#1e2235] shadow-xl">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Receita Total</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-emerald-600">R$ {report?.revenue.toLocaleString('pt-BR')}</p>
            <ArrowUpRight className="w-5 h-5 text-emerald-500" />
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-[#0f1117] rounded-3xl border border-gray-100 dark:border-[#1e2235] shadow-xl">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Despesas Operacionais</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-red-600">R$ {report?.expenses.toLocaleString('pt-BR')}</p>
            <ArrowDownRight className="w-5 h-5 text-red-500" />
          </div>
        </div>
        <div className="p-6 bg-primary-600 rounded-3xl shadow-xl shadow-primary-600/20 text-white">
          <p className="text-[10px] font-black opacity-80 uppercase tracking-widest mb-1">Lucro Líquido</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black">R$ {report?.net_profit.toLocaleString('pt-BR')}</p>
            <DollarSign className="w-5 h-5 opacity-80" />
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-[#0f1117] rounded-3xl border border-gray-100 dark:border-[#1e2235] shadow-xl">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Margem de Lucro</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-gray-900 dark:text-white">{report?.margin.toFixed(1)}%</p>
            <PieChart className="w-5 h-5 text-primary-500" />
          </div>
        </div>
      </div>

      {/* Estrutura DRE Detalhada */}
      <div className="bg-white dark:bg-[#0f1117] rounded-[32px] border border-gray-100 dark:border-[#1e2235] shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-[#1e2235] bg-gray-50/50 dark:bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white dark:bg-[#1a1c26] rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-white/10">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Demonstrativo de Resultados</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resumo Consolidado do Período</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-4">
          <div className="flex justify-between items-center py-4 border-b border-gray-50 dark:border-white/5">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">1. RECEITA BRUTA OPERACIONAL</span>
            <span className="text-sm font-black text-emerald-600">R$ {report?.revenue.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between items-center py-4 border-b border-gray-50 dark:border-white/5">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400 pl-4">(-) Mensalidades de Alunos</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white italic">R$ {(report?.revenue || 0 * 0.8).toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between items-center py-4 border-b border-gray-50 dark:border-white/5">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400 pl-4">(-) Vendas de Produtos</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white italic">R$ {(report?.revenue || 0 * 0.2).toLocaleString('pt-BR')}</span>
          </div>
          
          <div className="flex justify-between items-center py-4 border-b border-gray-50 dark:border-white/5 bg-red-50/20 dark:bg-red-900/5 px-2 rounded-xl">
            <span className="text-sm font-bold text-red-600 uppercase">2. CUSTOS E DESPESAS</span>
            <span className="text-sm font-black text-red-600">R$ {report?.expenses.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between items-center py-4 border-b border-gray-50 dark:border-white/5">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400 pl-4">(-) Compras de Estoque</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white italic">R$ {(report?.expenses || 0 * 0.4).toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between items-center py-4 border-b border-gray-50 dark:border-white/5">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400 pl-4">(-) Despesas Administrativas</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white italic">R$ {(report?.expenses || 0 * 0.6).toLocaleString('pt-BR')}</span>
          </div>

          <div className="flex justify-between items-center py-6 mt-4 bg-primary-50 dark:bg-primary-900/10 px-6 rounded-2xl border border-primary-100 dark:border-primary-900/20">
            <div>
              <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Resultado Líquido do Período</p>
              <h4 className="text-2xl font-black text-primary-600">LUCRO LÍQUIDO FINAL</h4>
            </div>
            <p className="text-3xl font-black text-primary-600">R$ {report?.net_profit.toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
