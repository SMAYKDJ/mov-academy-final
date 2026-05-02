'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/utils/cn";
import { ShieldCheck, ShieldAlert, Wifi, WifiOff, User, Clock, Activity } from "lucide-react";

export default function CatracaMonitorPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastAccess, setLastAccess] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  
  const audioError = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Inicializar áudio de erro
    audioError.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const wsUrl = backendUrl.replace('http', 'ws') + '/ws/catraca';
    
    const connectWS = () => {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => setIsConnected(true);
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setLastAccess(data);
        setHistory(prev => [data, ...prev].slice(0, 5));

        if (data.status === 'vencido' || data.status === 'erro') {
          audioError.current?.play().catch(e => console.error("Erro ao tocar áudio:", e));
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setTimeout(connectWS, 3000); // Tentar reconectar
      };

      ws.onerror = () => setIsConnected(false);
    };

    connectWS();
  }, []);

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

        <main className="px-4 md:px-8 py-8 w-full h-[calc(100vh-80px)] flex flex-col">
          {/* Status de Conexão */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                Monitoramento de Catraca
                {isConnected ? (
                  <span className="flex items-center gap-1.5 text-[10px] bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20 animate-pulse">
                    <Wifi className="w-3 h-3" /> ONLINE
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[10px] bg-red-500/10 text-red-500 px-3 py-1 rounded-full border border-red-500/20">
                    <WifiOff className="w-3 h-3" /> OFFLINE
                  </span>
                )}
              </h1>
              <p className="text-gray-500 text-sm font-medium">Toletus Actuar - Recepção Principal</p>
            </div>
            
            <div className="hidden md:flex gap-4">
               <div className="p-4 bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm text-center min-w-[120px]">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Acessos Hoje</p>
                  <p className="text-xl font-black text-primary-600">142</p>
               </div>
               <div className="p-4 bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm text-center min-w-[120px]">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Ativos Agora</p>
                  <p className="text-xl font-black text-emerald-500">18</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 flex-1 overflow-hidden">
            
            {/* Card Principal de Acesso */}
            <div className="xl:col-span-2 flex flex-col">
              <div className={cn(
                "flex-1 rounded-[48px] border-8 transition-all duration-500 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl",
                !lastAccess ? "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/5" :
                lastAccess.status === 'ativo' ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500 shadow-emerald-500/20" :
                "bg-red-50 dark:bg-red-900/10 border-red-500 shadow-red-500/20"
              )}>
                
                {!lastAccess ? (
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 bg-gray-200 dark:bg-white/10 rounded-full mx-auto flex items-center justify-center">
                       <Activity className="w-16 h-16 text-gray-400 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-gray-400">Aguardando Leitura</h2>
                      <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mt-2">Aproxime a Tag na Catraca</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-8 animate-in zoom-in-95 duration-300">
                    <div className="relative">
                      <div className={cn(
                        "w-64 h-64 rounded-full border-8 p-2",
                        lastAccess.status === 'ativo' ? "border-emerald-500" : "border-red-500"
                      )}>
                        <img 
                          src={lastAccess.foto} 
                          alt="Foto Aluno" 
                          className="w-full h-full object-cover rounded-full shadow-2xl"
                        />
                      </div>
                      <div className={cn(
                        "absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-black text-white text-xs shadow-lg uppercase tracking-widest",
                        lastAccess.status === 'ativo' ? "bg-emerald-500" : "bg-red-500"
                      )}>
                        {lastAccess.status === 'ativo' ? <ShieldCheck className="w-4 h-4 inline mr-2" /> : <ShieldAlert className="w-4 h-4 inline mr-2" />}
                        {lastAccess.status}
                      </div>
                    </div>

                    <div className="text-center">
                      <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-2">{lastAccess.nome}</h2>
                      <p className={cn(
                        "text-2xl font-black uppercase tracking-tighter",
                        lastAccess.status === 'ativo' ? "text-emerald-600" : "text-red-600"
                      )}>
                        {lastAccess.mensagem}
                      </p>
                    </div>

                    <div className="bg-white/80 dark:bg-black/40 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/20 shadow-xl flex items-center gap-6">
                       <div className="text-center">
                          <p className="text-[10px] font-black text-gray-400 uppercase">Horário</p>
                          <p className="font-bold">{new Date(lastAccess.timestamp).toLocaleTimeString()}</p>
                       </div>
                       <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
                       <div className="text-center">
                          <p className="text-[10px] font-black text-gray-400 uppercase">Frequência</p>
                          <p className="font-bold text-primary-600">4x na semana</p>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Histórico Lateral */}
            <div className="flex flex-col gap-6 overflow-hidden">
               <h3 className="text-lg font-black text-gray-900 dark:text-white px-2">Últimos Acessos</h3>
               <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                  {history.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white dark:bg-[#0f1117] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm flex items-center gap-4 animate-slide-in-right">
                       <div className="relative">
                          <img src={item.foto} className="w-12 h-12 rounded-2xl object-cover" />
                          <div className={cn(
                            "absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#0f1117]",
                            item.status === 'ativo' ? "bg-emerald-500" : "bg-red-500"
                          )} />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-gray-900 dark:text-white truncate">{item.nome}</p>
                          <p className="text-[10px] font-bold text-gray-400">{new Date(item.timestamp).toLocaleTimeString()}</p>
                       </div>
                    </div>
                  ))}
                  {history.length === 0 && (
                    <div className="py-20 text-center opacity-30">
                       <User className="w-12 h-12 mx-auto mb-4" />
                       <p className="text-xs font-bold uppercase tracking-widest">Nenhum acesso registrado</p>
                    </div>
                  )}
               </div>

               {/* Alerta Técnico (Sugerido no Prompt) */}
               {!isConnected && (
                  <div className="p-5 bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-500/20 rounded-3xl">
                    <p className="text-xs font-black text-amber-600 uppercase mb-2 flex items-center gap-2">
                       <ShieldAlert className="w-4 h-4" /> Alerta de Conexão
                    </p>
                    <p className="text-[10px] text-amber-700/80 leading-relaxed font-medium">
                      Toletus usa UDP para busca e TCP para comandos. Verifique se o Firewall permite conexões na porta do Agente Local.
                    </p>
                  </div>
               )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
