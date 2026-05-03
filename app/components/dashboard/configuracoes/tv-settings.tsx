'use client';

import React, { useState } from 'react';
import { Monitor, Save, Loader2, Info, Layout, Eye, MessageSquare, Trophy, ExternalLink } from 'lucide-react';
import { useToast } from "@/components/ui/toast";
import { cn } from "@/utils/cn";

export function TVSettings() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [config, setConfig] = useState({
    showRanking: true,
    showWeather: true,
    welcomeTime: 8, // segundos
    primaryColor: '#2563eb',
    announcement: 'Lembre-se: O treino de hoje é o que constrói o resultado de amanhã. Mantenha o foco!',
    showBirthdays: true,
    tvUrl: 'https://academiamoviment.vercel.app/tv'
  });

  const handleSave = async () => {
    setLoading(true);
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1200));
    setLoading(false);
    showToast("Configurações do Painel TV salvas com sucesso!", "success");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Monitor className="w-8 h-8 text-primary-600" />
            Configuração do Painel TV
          </h2>
          <p className="text-gray-500 text-sm">Controle o que os alunos veem no lobby da academia.</p>
        </div>
        <a 
          href="/tv" 
          target="_blank"
          className="px-4 py-2 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Abrir Painel TV
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Layout & Exibição */}
        <div className="space-y-6 bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary-600 flex items-center gap-2">
             <Layout className="w-4 h-4" /> Módulos Ativos
          </h3>
          
          <div className="space-y-4">
            {[
              { id: 'showRanking', label: 'Ranking de Assiduidade', icon: Trophy },
              { id: 'showWeather', label: 'Clima e Temperatura', icon: Globe },
              { id: 'showBirthdays', label: 'Aniversariantes do Dia', icon: GiftIcon },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-gray-400" />
                  <p className="text-sm font-bold">{item.label}</p>
                </div>
                <button 
                  onClick={() => setConfig({...config, [item.id]: !config[item.id as keyof typeof config]})}
                  className={cn(
                    "w-10 h-5 rounded-full transition-all relative",
                    config[item.id as keyof typeof config] ? "bg-primary-600" : "bg-gray-300 dark:bg-gray-700"
                  )}
                >
                  <div className={cn(
                    "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all",
                    config[item.id as keyof typeof config] ? "right-0.5" : "left-0.5"
                  )} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Conteúdo & Tempos */}
        <div className="space-y-6 bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary-600 flex items-center gap-2">
             <MessageSquare className="w-4 h-4" /> Conteúdo Personalizado
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Aviso Central / WOD</label>
              <textarea 
                value={config.announcement}
                onChange={e => setConfig({...config, announcement: e.target.value})}
                className="w-full h-24 px-4 py-3 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500/20 transition-all outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tempo de Boas-vindas (segundos)</label>
              <input 
                type="number" 
                value={config.welcomeTime}
                onChange={e => setConfig({...config, welcomeTime: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* URL do Painel */}
      <div className="p-6 bg-white dark:bg-[#1a1d27] rounded-3xl border border-gray-100 dark:border-[#1e2235]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Link para abrir na TV</p>
          <button 
            onClick={() => { navigator.clipboard.writeText(config.tvUrl); showToast("URL copiada!", "success"); }}
            className="text-[10px] font-bold text-primary-600 hover:underline"
          >
            Copiar Link
          </button>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-black/40 rounded-2xl border border-gray-100 dark:border-white/5 font-mono text-sm text-primary-600 break-all">
          {config.tvUrl}
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 flex items-center gap-3"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar Configurações da TV
        </button>
      </div>
    </div>
  );
}

// Mock de ícone que faltou
function Globe({ className }: { className?: string }) { return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.065M15 20.354V19a2 2 0 012-2h1M8 11a4 4 0 110 8 4 4 0 010-8zm5 5a3 3 0 100-6 3 3 0 000 6z" /></svg>; }
function GiftIcon({ className }: { className?: string }) { return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 0H5m7 0h7M5 8v11a2 2 0 002 2h10a2 2 0 002-2V8M5 8a2 2 0 012-2h10a2 2 0 012 2" /></svg>; }
