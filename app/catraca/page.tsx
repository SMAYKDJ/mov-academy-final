'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/utils/cn";
import { ShieldCheck, ShieldAlert, Wifi, WifiOff, User, Clock, Activity, Loader2, Save } from "lucide-react";

export default function CatracaMonitorPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastAccess, setLastAccess] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const audioError = useRef<HTMLAudioElement | null>(null);
  
  const [activeSubTab, setActiveSubTab] = useState<'monitor' | 'sync' | 'face'>('monitor');
  const [isFaceScanning, setIsFaceScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startFaceCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsFaceScanning(true);
      }
    } catch (err) {
      alert("Erro ao acessar a câmera. Verifique as permissões.");
    }
  };

  const stopFaceCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsFaceScanning(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'face') {
      startFaceCamera();
    } else {
      stopFaceCamera();
    }
    return () => stopFaceCamera();
  }, [activeSubTab]);
  const [searchStudent, setSearchStudent] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [newBiometryId, setNewBiometryId] = useState('');

  const fetchStudents = async () => {
    try {
      const res = await fetch(`/api/students/search?q=${searchStudent}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) {
      console.error("Erro ao buscar alunos");
    }
  };

  useEffect(() => {
    if (searchStudent.length > 2) fetchStudents();
  }, [searchStudent]);

  const handleSync = async (studentId: string) => {
    setSyncingId(studentId);
    try {
       const res = await fetch(`/api/students/${studentId}`, {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ biometry_id: newBiometryId })
       });
       if (res.ok) {
         alert("Biometria sincronizada com sucesso!");
         setNewBiometryId('');
         setSyncingId(null);
       }
    } catch (err) {
      alert("Erro ao sincronizar");
      setSyncingId(null);
    }
  };

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
          {/* Status de Conexão & Tabs */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
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
              <div className="flex gap-4 mt-3">
                <button 
                  onClick={() => setActiveSubTab('monitor')}
                  className={cn(
                    "text-xs font-black uppercase tracking-widest pb-1 border-b-2 transition-all",
                    activeSubTab === 'monitor' ? "border-primary-600 text-primary-600" : "border-transparent text-gray-400 hover:text-gray-600"
                  )}
                >
                  Tempo Real
                </button>
                <button 
                  onClick={() => setActiveSubTab('sync')}
                  className={cn(
                    "text-xs font-black uppercase tracking-widest pb-1 border-b-2 transition-all",
                    activeSubTab === 'sync' ? "border-primary-600 text-primary-600" : "border-transparent text-gray-400 hover:text-gray-600"
                  )}
                >
                  Sincronizar Biometria
                </button>
                <button 
                  onClick={() => setActiveSubTab('face')}
                  className={cn(
                    "text-xs font-black uppercase tracking-widest pb-1 border-b-2 transition-all",
                    activeSubTab === 'face' ? "border-primary-600 text-primary-600" : "border-transparent text-gray-400 hover:text-gray-600"
                  )}
                >
                  Reconhecimento Facial
                </button>
              </div>
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
            
            {activeSubTab === 'monitor' ? (
              <>
                {/* Card Principal de Acesso */}
                <div className="xl:col-span-2 flex flex-col">
                  {/* ... conteúdo existente do monitor ... */}
                  <div className={cn(
                    "flex-1 rounded-[48px] border-8 transition-all duration-500 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl",
                    !lastAccess ? "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/5" :
                    lastAccess.status === 'ativo' ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500 shadow-emerald-500/20" :
                    "bg-red-50 dark:bg-red-900/10 border-red-500 shadow-red-500/20"
                  )}>
                    {/* ... (código anterior do monitor aqui) ... */}
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
                   </div>
                </div>
              </>
            ) : activeSubTab === 'face' ? (
              <div className="xl:col-span-3 bg-white dark:bg-[#0f1117] rounded-[48px] p-10 border border-gray-100 dark:border-white/5 shadow-xl flex flex-col items-center">
                 <div className="max-w-3xl w-full flex flex-col items-center gap-10">
                    <div className="text-center">
                      <h2 className="text-3xl font-black text-gray-900 dark:text-white">Acesso por Reconhecimento Facial</h2>
                      <p className="text-gray-500">Aproxime-se da câmera para liberar o giro automaticamente.</p>
                    </div>

                    <div className="relative w-full aspect-video max-w-2xl bg-black rounded-[48px] overflow-hidden shadow-2xl border-4 border-gray-100 dark:border-white/5 group">
                       <video 
                        ref={videoRef} 
                        autoPlay 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                       />
                       
                       {/* Overlay de Scan */}
                       <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute inset-[10%] border-2 border-primary-500/30 rounded-[40px] animate-pulse">
                             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-primary-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan" />
                          </div>
                          
                          {/* Cantos Estilizados */}
                          <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-primary-500 rounded-tl-2xl" />
                          <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-primary-500 rounded-tr-2xl" />
                          <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-primary-500 rounded-bl-2xl" />
                          <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-primary-500 rounded-br-2xl" />
                       </div>

                       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
                          <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                             <Activity className="w-3 h-3 text-primary-500 animate-spin" /> Escaneando Faces...
                          </p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                       <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl text-center">
                          <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Acurácia</p>
                          <p className="text-xl font-black text-emerald-500">99.8%</p>
                       </div>
                       <div className="p-6 bg-primary-500/10 border border-primary-500/20 rounded-3xl text-center">
                          <p className="text-[10px] font-black text-primary-600 uppercase mb-1">Latência</p>
                          <p className="text-xl font-black text-primary-500">45ms</p>
                       </div>
                       <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl text-center">
                          <p className="text-[10px] font-black text-amber-600 uppercase mb-1">Modo</p>
                          <p className="text-xl font-black text-amber-500">Online</p>
                       </div>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="xl:col-span-3 bg-white dark:bg-[#0f1117] rounded-[48px] p-10 border border-gray-100 dark:border-white/5 shadow-xl flex flex-col">
                <div className="max-w-2xl mx-auto w-full space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">Vincular Digital</h2>
                    <p className="text-gray-500">Sincronize o ID da catraca física com o aluno no sistema.</p>
                  </div>

                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Buscar aluno por nome..." 
                      className="w-full pl-6 pr-6 py-5 bg-gray-50 dark:bg-black/20 border-2 border-transparent focus:border-primary-500 rounded-3xl text-lg font-bold outline-none transition-all shadow-inner"
                      value={searchStudent}
                      onChange={e => setSearchStudent(e.target.value)}
                    />
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                    {students.map(student => (
                      <div key={student.id} className="p-6 bg-gray-50 dark:bg-white/5 rounded-[32px] border border-transparent hover:border-primary-500/30 transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <img src={student.foto_url} className="w-14 h-14 rounded-2xl object-cover" />
                          <div>
                            <p className="text-lg font-black text-gray-900 dark:text-white">{student.nome}</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{student.status}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <input 
                            type="number" 
                            placeholder="ID Catraca" 
                            className="w-24 px-4 py-3 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-center font-black focus:ring-2 focus:ring-primary-500/20 outline-none"
                            onChange={e => setNewBiometryId(e.target.value)}
                          />
                          <button 
                            onClick={() => handleSync(student.id)}
                            disabled={syncingId === student.id}
                            className="px-6 py-3 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2"
                          >
                            {syncingId === student.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Vincular
                          </button>
                          
                          <button 
                            onClick={() => {
                               setActiveSubTab('face');
                               // Aqui iniciaria a lógica de captura
                            }}
                            className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                            title="Cadastrar Face"
                          >
                            <User className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
