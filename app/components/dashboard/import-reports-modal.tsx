'use client';
import React, { useEffect, useState } from 'react';
import { X, Loader2, FileUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { ReportFileList, ProcessReportResponse } from '@/types/report';

export function ImportReportsModal({ onClose }: { onClose: () => void }) {
  const [files, setFiles] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  // Load file list on mount
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
      // You could propagate result to parent if needed
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-[#0f1117] rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-fade-in">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" aria-label="Fechar">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FileUp className="w-5 h-5 text-primary-600" />
          Importar Relatórios
        </h3>
        {files.length === 0 && <p className="text-sm text-gray-500">Nenhum relatório encontrado.</p>}
        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto mb-4">
          {files.map((f) => (
            <button
              key={f}
              onClick={() => setSelected(f)}
              className={`p-2 text-left rounded-md border ${selected === f ? 'bg-primary-100 border-primary-300' : 'bg-gray-50 hover:bg-gray-100'} dark:bg-[#080a0f] dark:hover:bg-[#121418] dark:border-[#2e334d] text-sm`}
            >
              {f}
            </button>
          ))}
        </div>
        {error && (
          <div className="p-3 mb-3 bg-red-50 dark:bg-red-900/10 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:underline">
            Cancelar
          </button>
          <button
            onClick={handleSend}
            disabled={!selected || loading}
            className={`px-4 py-2 flex items-center gap-2 text-sm font-medium rounded-xl ${selected ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-400'} text-white disabled:opacity-50`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
