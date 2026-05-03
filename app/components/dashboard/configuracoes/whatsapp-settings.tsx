'use client';

import React, { useState } from 'react';
import { MessageCircle, Save, Loader2, Info, Smartphone, MessageSquare, Zap } from 'lucide-react';
import { useToast } from "@/components/ui/toast";
import { cn } from "@/utils/cn";

export function WhatsAppSettings() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [config, setConfig] = useState({
    managerPhone: '5591983457028',
    integrationMode: 'manual', // 'manual' (wa.me) or 'automatic' (API)
    apiUrl: '',
    apiKey: '',
    welcomeMessage: 'Seja muito bem-vindo(a), *{nome}*! 🎉 Ficamos felizes em ter você na equipe *Moviment Academy*. Vamos pra cima? 💪',
    reminderMessage: 'Olá, *{nome}*! 👋 Passando para lembrar que sua mensalidade no valor de *R$ {valor}* vence no dia *{vencimento}*. 🏋️‍♂️',
    autoConfirmPayment: true
  });

  const handleSave = async () => {
    setLoading(true);
    // Simular salvamento no Supabase
    await new Promise(resolve => setTimeout(resolve, 1200));
    setLoading(false);
    showToast("Configurações do WhatsApp salvas com sucesso!", "success");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-emerald-500" />
            Configuração WhatsApp
          </h2>
          <p className="text-gray-500 text-sm">Gerencie o envio de mensagens automáticas e notificações.</p>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
          config.integrationMode === 'automatic' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-gray-100 text-gray-500 border border-gray-200"
        )}>
          Modo: {config.integrationMode}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configurações de Conexão */}
        <div className="space-y-6 bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
          <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
             <Smartphone className="w-4 h-4" /> Conexão & Envio
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Telefone do Gestor (Recebe Avisos)</label>
              <input 
                type="text" 
                value={config.managerPhone}
                onChange={e => setConfig({...config, managerPhone: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                placeholder="Ex: 5591988887777"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Modo de Integração</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-white dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5">
                <button 
                  onClick={() => setConfig({...config, integrationMode: 'manual'})}
                  className={cn(
                    "py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                    config.integrationMode === 'manual' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  Manual (Link)
                </button>
                <button 
                  onClick={() => setConfig({...config, integrationMode: 'automatic'})}
                  className={cn(
                    "py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                    config.integrationMode === 'automatic' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  Automático (API)
                </button>
              </div>
            </div>

            {config.integrationMode === 'automatic' && (
              <div className="space-y-4 animate-slide-down">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">URL da API (Evolution/Z-API)</label>
                  <input 
                    type="text" 
                    value={config.apiUrl}
                    onChange={e => setConfig({...config, apiUrl: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                    placeholder="https://sua-api.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">API Key / Token</label>
                  <input 
                    type="password" 
                    value={config.apiKey}
                    onChange={e => setConfig({...config, apiKey: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                    placeholder="••••••••••••••••"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Templates de Mensagem */}
        <div className="space-y-6 bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
          <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
             <MessageSquare className="w-4 h-4" /> Templates de Mensagens
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Boas-vindas (Novo Aluno)</label>
              <textarea 
                value={config.welcomeMessage}
                onChange={e => setConfig({...config, welcomeMessage: e.target.value})}
                className="w-full h-24 px-4 py-3 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Lembrete de Vencimento</label>
              <textarea 
                value={config.reminderMessage}
                onChange={e => setConfig({...config, reminderMessage: e.target.value})}
                className="w-full h-24 px-4 py-3 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none resize-none"
              />
              <p className="text-[9px] text-gray-400 px-1 italic">Use tags: {"{nome}"}, {"{valor}"}, {"{vencimento}"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Automação */}
      <div className="p-6 bg-white dark:bg-[#1a1d27] rounded-3xl border border-gray-100 dark:border-[#1e2235] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-bold">Confirmação de Pagamento Automática</p>
            <p className="text-xs text-gray-400">Enviar recibo por WhatsApp assim que a baixa for dada no sistema.</p>
          </div>
        </div>
        <button 
          onClick={() => setConfig({...config, autoConfirmPayment: !config.autoConfirmPayment})}
          className={cn(
            "w-12 h-6 rounded-full transition-all relative",
            config.autoConfirmPayment ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"
          )}
        >
          <div className={cn(
            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
            config.autoConfirmPayment ? "right-1" : "left-1"
          )} />
        </button>
      </div>

      {/* Info Card */}
      <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/20 flex gap-4">
        <Info className="w-6 h-6 text-emerald-600 shrink-0" />
        <div className="text-xs font-medium text-emerald-700 leading-relaxed">
          <b>Dica:</b> No modo Manual, o sistema gera links para você clicar e enviar pelo seu próprio WhatsApp. No modo Automático, o sistema envia as mensagens sozinho através da sua conta conectada em uma API.
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-3"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar Configurações
        </button>
      </div>
    </div>
  );
}
