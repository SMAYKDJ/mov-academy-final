'use client';

import React, { useState } from 'react';
import { Globe, Key, MessageCircle, Mail, Copy, ExternalLink } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/components/ui/toast';
import type { IntegrationConfig } from '@/types/configuracoes';

import { WhatsAppSettings } from './whatsapp-settings';
import { StripeSettings } from './stripe-settings';

interface IntegrationsProps { integrations: IntegrationConfig[]; }

const iconMap = { webhook: Globe, api: Key, whatsapp: MessageCircle, email: Mail };
const colorMap = {
  webhook: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
  api: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20',
  whatsapp: 'text-emerald-600 dark:text-green-400 bg-emerald-50 dark:bg-green-900/20',
  email: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
};

export function Integrations({ integrations }: IntegrationsProps) {
  const { showToast } = useToast();
  const [configuringId, setConfiguringId] = useState<string | null>(null);

  if (configuringId === 'int-2') {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setConfiguringId(null)}
          className="text-xs font-black text-gray-400 hover:text-primary-600 flex items-center gap-2 mb-4 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Voltar para Integrações
        </button>
        <StripeSettings />
      </div>
    );
  }

  if (configuringId === 'int-3') {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setConfiguringId(null)}
          className="text-xs font-black text-gray-400 hover:text-primary-600 flex items-center gap-2 mb-4 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Voltar para Integrações
        </button>
        <WhatsAppSettings />
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copiado para a área de transferência', 'success', 'Copiado');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Integrações</h2>
        <p className="text-xs text-gray-400 mt-0.5">Conecte seu sistema a serviços externos</p>
      </div>

      <div className="space-y-4">
        {integrations.map(int => {
          const Icon = iconMap[int.tipo];
          const colors = colorMap[int.tipo];
          return (
            <div key={int.id} className="bg-gray-50 dark:bg-[#1a1d27] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{int.nome}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{int.tipo}</p>
                  </div>
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest",
                  int.status === 'ativo' ? "bg-emerald-50 dark:bg-green-900/20 text-emerald-700 dark:text-green-400" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                )}>
                  {int.status}
                </span>
              </div>

              {int.url && (
                <div className="flex items-center gap-2 bg-white dark:bg-[#0f1117] rounded-xl px-3 py-2 border border-gray-200 dark:border-[#2d3348] mb-2">
                  <code className="flex-1 text-[11px] text-gray-600 dark:text-gray-300 truncate font-mono">{int.url}</code>
                  <button 
                    onClick={() => copyToClipboard(int.url!)} 
                    title="Copiar URL"
                    aria-label="Copiar URL para área de transferência"
                    className="text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {int.apiKey && (
                <div className="flex items-center gap-2 bg-white dark:bg-[#0f1117] rounded-xl px-3 py-2 border border-gray-200 dark:border-[#2d3348]">
                  <code className="flex-1 text-[11px] text-gray-600 dark:text-gray-300 truncate font-mono">
                    {int.apiKey.slice(0, 12)}{'•'.repeat(20)}
                  </code>
                  <button 
                    onClick={() => copyToClipboard(int.apiKey!)} 
                    title="Copiar segredo"
                    aria-label="Copiar segredo para área de transferência"
                    className="text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {int.status === 'inativo' && (
                <button onClick={() => setConfiguringId(int.id)}
                  className="mt-3 px-4 py-2 border border-gray-200 dark:border-[#2d3348] text-gray-600 dark:text-gray-400 rounded-xl text-xs font-bold hover:bg-gray-100 dark:hover:bg-[#0f1117] transition-all flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5" /> Configurar
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
