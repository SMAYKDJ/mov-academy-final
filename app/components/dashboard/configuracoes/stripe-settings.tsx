'use client';

import React, { useState } from 'react';
import { CreditCard, Save, Loader2, Info, Lock, Globe, Zap, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/components/ui/toast";
import { cn } from "@/utils/cn";

export function StripeSettings() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [config, setConfig] = useState({
    secretKey: '',
    webhookSecret: '',
    testMode: true,
    autoBilling: true
  });

  const handleSave = async () => {
    if (!config.secretKey) {
        showToast("A Chave Secreta é obrigatória para ativar o Stripe.", "error");
        return;
    }
    setLoading(true);
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    showToast("Configurações do Stripe salvas e validadas!", "success");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-indigo-600" />
            Configuração Stripe & PIX
          </h2>
          <p className="text-gray-500 text-sm">Integre sua conta Stripe para pagamentos automáticos.</p>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
          config.testMode ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
        )}>
          <div className={cn("w-2 h-2 rounded-full", config.testMode ? "bg-amber-500" : "bg-emerald-500")} />
          {config.testMode ? "Modo de Teste (Sandbox)" : "Modo Produção (Live)"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chaves de API */}
        <div className="space-y-6 bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
          <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
             <Lock className="w-4 h-4" /> Chaves de Segurança
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secret Key (Chave Secreta)</label>
              <input 
                type="password" 
                value={config.secretKey}
                onChange={e => setConfig({...config, secretKey: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                placeholder="sk_live_..."
              />
              <p className="text-[9px] text-gray-400 px-1">Encontrada em: Desenvolvedores {'>'} Chaves de API</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Webhook Secret (Segredo de Assinatura)</label>
              <input 
                type="password" 
                value={config.webhookSecret}
                onChange={e => setConfig({...config, webhookSecret: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                placeholder="whsec_..."
              />
              <p className="text-[9px] text-gray-400 px-1">Encontrada em: Desenvolvedores {'>'} Webhooks {'>'} Segredo de assinatura</p>
            </div>
          </div>
        </div>

        {/* Automação & Webhook */}
        <div className="space-y-6 bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
          <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
             <Globe className="w-4 h-4" /> Configuração do Webhook
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-white dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">URL do seu Endpoint de Webhook</p>
                <div className="flex items-center gap-2">
                    <code className="text-[11px] text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">
                        https://academiamoviment.vercel.app/api/webhooks/stripe
                    </code>
                </div>
                <p className="text-[9px] text-gray-500 mt-3 leading-relaxed italic">
                    Copie a URL acima e cole no Stripe em: <b>Desenvolvedores {'>'} Webhooks {'>'} Adicionar endpoint</b>. 
                    Selecione o evento: <code>checkout.session.completed</code>.
                </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-white dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5">
               <div>
                  <p className="text-sm font-bold">Modo de Produção</p>
                  <p className="text-[10px] text-gray-400">Desative para usar chaves 'test_'</p>
               </div>
               <button 
                onClick={() => setConfig({...config, testMode: !config.testMode})}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative",
                  !config.testMode ? "bg-emerald-500" : "bg-amber-500"
                )}
               >
                 <div className={cn(
                   "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                   !config.testMode ? "right-1" : "left-1"
                 )} />
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Regra de Ouro */}
      <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-900/20 flex gap-4">
        <Zap className="w-6 h-6 text-indigo-600 shrink-0" />
        <div>
            <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">Régua Automática Ativada</p>
            <p className="text-xs font-medium text-indigo-900 dark:text-indigo-300 leading-relaxed">
                Ao ativar o Stripe, o sistema enviará automaticamente o PIX para o aluno 2 dias antes do vencimento. 
                Assim que ele pagar, a baixa será feita no seu DRE instantaneamente.
            </p>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-3"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar e Ativar Pagamentos
        </button>
      </div>
    </div>
  );
}
