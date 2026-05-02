'use client';

import React, { useState } from 'react';
import { Cpu, Globe, Lock, Bell, Save, Loader2, Info } from 'lucide-react';
import { useToast } from "@/components/ui/toast";

export function CatracaSettings() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Mock de estados (Em produção, viria do banco de dados)
  const [config, setConfig] = useState({
    hardwareIp: '192.168.1.100',
    hardwarePort: '4000',
    localAgentUrl: 'http://localhost:5000',
    commandBuffer: '\\x02\\x00\\x01\\x03',
    alertSound: true,
    autoNotification: true
  });

  const handleSave = async () => {
    setLoading(true);
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    showToast("Configurações da Catraca salvas com sucesso!", "success");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Configurações da Catraca</h2>
        <p className="text-gray-500 text-sm">Gerencie a comunicação entre o hardware Toletus e a plataforma.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hardware & Rede */}
        <div className="space-y-6 bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary-600 flex items-center gap-2">
             <Globe className="w-4 h-4" /> Comunicação de Rede
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">IP da Catraca (Físico)</label>
              <input 
                type="text" 
                value={config.hardwareIp}
                onChange={e => setConfig({...config, hardwareIp: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Porta de Comando (TCP)</label>
              <input 
                type="text" 
                value={config.hardwarePort}
                onChange={e => setConfig({...config, hardwarePort: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">IP do Agente Local</label>
              <input 
                type="text" 
                value={config.localAgentUrl}
                onChange={e => setConfig({...config, localAgentUrl: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Protocolo & Comportamento */}
        <div className="space-y-6 bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary-600 flex items-center gap-2">
             <Cpu className="w-4 h-4" /> Protocolo de Acesso
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Buffer de Liberação (Hex)</label>
              <input 
                type="text" 
                value={config.commandBuffer}
                onChange={e => setConfig({...config, commandBuffer: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-white dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5">
               <div>
                  <p className="text-sm font-bold">Alerta Sonoro</p>
                  <p className="text-[10px] text-gray-400">Disparar som em acessos negados</p>
               </div>
               <button 
                onClick={() => setConfig({...config, alertSound: !config.alertSound})}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative",
                  config.alertSound ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"
                )}
               >
                 <div className={cn(
                   "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                   config.alertSound ? "right-1" : "left-1"
                 )} />
               </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5">
               <div>
                  <p className="text-sm font-bold">Notificação Proprietário</p>
                  <p className="text-[10px] text-gray-400">Avisar acessos suspeitos/bloqueados</p>
               </div>
               <button 
                onClick={() => setConfig({...config, autoNotification: !config.autoNotification})}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative",
                  config.autoNotification ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"
                )}
               >
                 <div className={cn(
                   "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                   config.autoNotification ? "right-1" : "left-1"
                 )} />
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="p-6 bg-primary-50 dark:bg-primary-900/10 rounded-3xl border border-primary-100 dark:border-primary-900/20 flex gap-4">
        <Info className="w-6 h-6 text-primary-600 shrink-0" />
        <div className="text-xs font-medium text-primary-700 leading-relaxed">
          Para que a integração funcione, o <b>Agente Local Moviment</b> deve estar em execução no computador da recepção, configurado com a mesma chave de API e apontando para o IP da catraca definido acima.
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 flex items-center gap-3"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar Configurações
        </button>
      </div>
    </div>
  );
}
