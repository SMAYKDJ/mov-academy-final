import React, { useState } from 'react';
import { FileUp, FileText, Loader2, CheckCircle2, AlertCircle, X, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { ImportReportsModal } from '@/components/dashboard/import-reports-modal';

interface Prediction {
  student_id: string;
  name: string;
  probability: number;
  risk_level: string;
  impacts?: Record<string, number>;
}

interface UploadResult {
  processed_files: { filename: string; students_found: number }[];
  students_found: number;
  predictions: Prediction[];
  summary: {
    total: number;
    alto: number;
    medio: number;
    baixo: number;
    avg_probability: number;
  };
}

export function ReportUpload({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setError(null);
    setResult(null);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    try {
      const response = await fetch('/api/upload-report', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao processar o PDF');
      }
      const data = await response.json();
      setResult(data);
      showToast(`Relatório processado: ${data.students_found} alunos encontrados.`, 'success');
      if (onUploadSuccess) {
        setTimeout(() => onUploadSuccess(), 2000);
      }
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 bg-gray-50/50 dark:bg-white/5 p-4 rounded-[24px] border border-gray-100 dark:border-white/5">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-md animate-pulse" />
              <div className="relative p-3 bg-white dark:bg-[#1a1c26] rounded-2xl shadow-sm shrink-0 border border-gray-100 dark:border-white/10">
                <FileUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-tight">Análise em Lote</h3>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Importar Relatórios PDF</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={() => setShowModal(true)}
              className="flex flex-col items-center justify-center gap-3 p-5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[28px] hover:border-primary-500/50 hover:bg-gray-50 dark:hover:bg-white/[0.07] transition-all duration-300 group shadow-sm active:scale-95"
            >
              <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
                <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-primary-500 transition-colors" />
              </div>
              <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 uppercase tracking-[0.2em] transition-colors">Histórico</span>
            </button>
            
            <button
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-3 p-5 bg-primary-600 dark:bg-primary-600 border border-primary-500 rounded-[28px] hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 group shadow-lg shadow-primary-500/10 active:scale-95 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl" />
              <div className="p-3 bg-white/10 dark:bg-white/20 rounded-2xl group-hover:bg-white/20 transition-colors relative z-10">
                {isUploading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Plus className="w-5 h-5 text-white" />
                )}
              </div>
              <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.2em] relative z-10">
                {isUploading ? 'Subindo' : 'Novo PDF'}
              </span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              multiple
              className="hidden"
            />
          </div>
        </div>

        {isUploading && (
          <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 dark:border-[#1e2235] rounded-xl">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-3" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Processando documento...</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 italic">Isso pode levar alguns segundos dependendo do tamanho do PDF</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-700 dark:text-red-300">Erro na Importação</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-xl">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Sucesso: {result.students_found} alunos processados</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-white dark:bg-[#080a0f] rounded-lg border border-green-200 dark:border-green-900/30">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Risco Alto</p>
                  <p className="text-lg font-black text-red-600 dark:text-red-400">{result.summary.alto}</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#080a0f] rounded-lg border border-green-200 dark:border-green-900/30">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Risco Médio</p>
                  <p className="text-lg font-black text-amber-500 dark:text-amber-400">{result.summary.medio}</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#080a0f] rounded-lg border border-green-200 dark:border-green-900/30">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Prob. Média</p>
                  <p className="text-lg font-black text-primary-600">{(result.summary.avg_probability * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {result.predictions.map((pred, i) => (
                <div key={i} className="group">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1a1c26] rounded-t-xl border border-transparent group-hover:border-gray-200 dark:group-hover:border-[#2e334d] transition-all">
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">{pred.name}</p>
                      <p className="text-[10px] text-gray-500">{pred.student_id}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter ${
                      pred.risk_level === 'alto' ? 'bg-red-100 text-red-700' :
                      pred.risk_level === 'medio' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {pred.risk_level} • {(pred.probability * 100).toFixed(0)}%
                    </div>
                  </div>
                  {pred.impacts && (
                    <div className="px-3 pb-3 pt-1 space-y-1 bg-gray-50/50 dark:bg-[#1a1c26]/50 rounded-b-xl border-x border-b border-transparent group-hover:border-gray-200 dark:group-hover:border-[#2e334d] transition-all">
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Motivos (SHAP):</p>
                      {Object.entries(pred.impacts)
                        .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                        .slice(0, 3)
                        .map(([feature, impact], idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-[8px] text-gray-500 w-24 truncate">{feature}</span>
                            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex">
                              <div className={`h-full ${impact > 0 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(Math.abs(impact) * 200, 100)}%` }} />
                            </div>
                            <span className={`text-[8px] font-mono ${impact > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{impact > 0 ? '+' : ''}{impact.toFixed(3)}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setResult(null)} className="w-full py-2 text-[10px] font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors uppercase tracking-widest">
              Limpar Resultados
            </button>
          </div>
        )}
      </div>
      {showModal && <ImportReportsModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
