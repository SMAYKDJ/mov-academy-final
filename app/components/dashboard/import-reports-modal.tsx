'use client';
import React, { useEffect, useState } from 'react';
import { X, Loader2, FileUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/utils/cn';
import { ReportFileList, ProcessReportResponse } from '@/types/report';

export function ImportReportsModal({ onClose }: { onClose: () => void }) {
  const [files, setFiles] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  // Carregar lista de arquivos ao montar
  useEffect(() => {
    fetch('/api/reports')
      .then((res) => res.json())
      .then((data: ReportFileList) => setFiles(data.files))
      .catch(() => setFiles([]));
  }, []);

  const handleSend = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/process-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: selected }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.detail || 'Falha ao processar relatório');
      }
      const data: ProcessReportResponse = await resp.json();
      showToast(`Relatório "${selected}" processado com sucesso!`, 'success');
      // Você pode propagar o resultado para o pai, se necessário
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Fundo (Backdrop) */}
      <div 
        className="fixed inset-0 bg-[#080a0f]/80 backdrop-blur-md animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Container do Modal */}
      <div className="relative w-full max-w-lg my-auto animate-scale-in">
        <div className="relative flex flex-col w-full bg-white dark:bg-[#0f1117] rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-[#1e2235] overflow-hidden">
          {/* Cabeçalho */}
          <div className="px-8 py-6 border-b border-gray-100 dark:border-[#1e2235] flex items-center justify-between bg-white dark:bg-[#0f1117] sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <FileUp className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">Importar Relatórios</h3>
                <p className="text-xs font-bold text-gray-400 mt-1">Selecione um arquivo PDF para processar</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all hover:rotate-90 duration-300"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {files.length === 0 ? (
              <div className="py-12 flex flex-col items-center gap-4 text-center">
                <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-700" />
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Nenhum relatório encontrado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Arquivos Disponíveis</p>
                {files.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelected(f)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group",
                      selected === f 
                        ? "bg-primary-50 dark:bg-primary-900/10 border-primary-500 shadow-lg shadow-primary-500/5" 
                        : "bg-gray-50/50 dark:bg-[#1a1d27]/50 border-transparent hover:border-gray-200 dark:hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                        selected === f ? "bg-primary-600 text-white" : "bg-gray-200 dark:bg-gray-800 text-gray-400"
                      )}>
                        <FileUp className="w-4 h-4" />
                      </div>
                      <span className={cn(
                        "text-sm font-bold truncate max-w-[200px]",
                        selected === f ? "text-primary-900 dark:text-white" : "text-gray-600 dark:text-gray-400"
                      )}>{f}</span>
                    </div>
                    {selected === f && <CheckCircle2 className="w-5 h-5 text-primary-600 animate-in zoom-in" />}
                  </button>
                ))}
              </div>
            )}
            
            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl flex items-start gap-3 border border-red-100 dark:border-red-900/20">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <p className="text-sm font-bold text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Rodapé */}
          <div className="px-8 py-6 bg-gray-50/50 dark:bg-[#1a1d27]/30 border-t border-gray-100 dark:border-[#1e2235] flex justify-between items-center">
            <button 
              onClick={onClose}
              className="px-6 py-3 text-sm font-black text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors uppercase tracking-widest"
            >
              Cancelar
            </button>
            <button
              onClick={handleSend}
              disabled={!selected || loading}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-2xl text-sm font-black transition-all shadow-xl shadow-primary-900/20 flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              {loading ? 'Processando...' : 'Iniciar Importação'}
            </button>
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
