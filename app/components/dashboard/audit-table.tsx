'use client';

import React, { useState } from 'react';
import { Search, Shield, User, Clock, Terminal, ArrowRight, Eye, Filter } from 'lucide-react';
import { cn } from "@/utils/cn";

const mockLogs = [
  { id: 1, user: 'Smayk Dornelles', action: 'OPEN_CASH', table: 'cash_sessions', time: '2026-05-02 08:30:12', details: 'Caixa aberto com R$ 100,00' },
  { id: 2, user: 'Ana Silva', action: 'UPDATE_STUDENT', table: 'students', time: '2026-05-02 09:15:45', details: 'Alteração de plano para Platinum' },
  { id: 3, user: 'Sistema', action: 'GENERATE_PREDICTION', table: 'churn_predictions', time: '2026-05-02 10:00:00', details: 'Previsões em lote concluídas' },
  { id: 4, user: 'Smayk Dornelles', action: 'ADD_TRANSACTION', table: 'cash_transactions', time: '2026-05-02 10:22:10', details: 'Venda de água (Entrada: R$ 5,00)' },
  { id: 5, user: 'Roberto Santos', action: 'DELETE_PAYMENT', table: 'payments', time: '2026-05-02 11:45:30', details: 'Estorno de mensalidade duplicada' },
];

export function AuditTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/audit/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error("Erro ao buscar logs");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = (logs.length > 0 ? logs : mockLogs).filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white dark:bg-[#0f1117] rounded-[32px] border border-gray-100 dark:border-[#1e2235] shadow-xl overflow-hidden">
      {/* Header com Busca */}
      <div className="p-8 border-b border-gray-100 dark:border-[#1e2235] bg-gray-50/50 dark:bg-white/5 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Logs de Auditoria</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rastreamento Completo de Ações</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar por ação ou usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>
            <button className="p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 transition-all">
              <Filter className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Logs */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/30 dark:bg-white/[0.02] border-b border-gray-100 dark:border-[#1e2235]">
              <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Ação / Usuário</th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Tabela / Módulo</th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Detalhes</th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Data/Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-[#1e2235]">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                      <Terminal className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                        {log.action}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <User className="w-3 h-3 text-primary-500" />
                        <span className="text-[10px] font-bold text-gray-500">{log.user}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 rounded-lg text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase border border-gray-200/50 dark:border-white/5">
                    {log.table || log.table_name || 'Geral'}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <p className="text-[11px] font-medium text-gray-600 dark:text-gray-300 line-clamp-1 group-hover:line-clamp-none transition-all">
                    {log.details}
                  </p>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                      <Clock className="w-3 h-3" />
                      {log.time ? log.time.split(' ')[1] : new Date(log.created_at).toLocaleTimeString('pt-BR')}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1">{log.time ? log.time.split(' ')[0] : new Date(log.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer da Auditoria */}
      <div className="p-8 bg-gray-50/30 dark:bg-white/[0.02] border-t border-gray-100 dark:border-[#1e2235] flex justify-between items-center">
        <p className="text-xs font-bold text-gray-400">
          Mostrando os últimos 100 eventos do sistema
        </p>
        <button className="flex items-center gap-2 text-xs font-black text-primary-600 hover:gap-3 transition-all">
          Ver Relatório Completo
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
