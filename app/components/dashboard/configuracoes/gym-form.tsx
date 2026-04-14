'use client';

import React, { useState } from 'react';
import { Building2, Camera, Save } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import type { GymSettings } from '@/types/configuracoes';

interface GymFormProps { settings: GymSettings; }

export function GymForm({ settings }: GymFormProps) {
  const { showToast } = useToast();
  const [form, setForm] = useState(settings);
  const set = (k: keyof GymSettings, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Configurações da Academia</h2>
        <p className="text-xs text-gray-400 mt-0.5">Dados cadastrais e informações do estabelecimento</p>
      </div>

      {/* Logo */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-[#1a1d27] rounded-full border-2 border-gray-200 dark:border-[#2d3348] flex items-center justify-center text-gray-400 hover:text-primary-600 transition-colors shadow-sm">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{form.nome}</p>
          <p className="text-xs text-gray-400">CNPJ: {form.cnpj}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {([
          ['nome', 'Nome da Academia', form.nome],
          ['cnpj', 'CNPJ', form.cnpj],
          ['endereco', 'Endereço', form.endereco],
          ['telefone', 'Telefone', form.telefone],
          ['email', 'E-mail', form.email],
          ['horarioAbertura', 'Horário de Abertura', form.horarioAbertura],
          ['horarioFechamento', 'Horário de Fechamento', form.horarioFechamento],
        ] as [keyof GymSettings, string, string][]).map(([key, label, val]) => (
          <div key={key} className={key === 'endereco' ? 'sm:col-span-2' : ''}>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">{label}</label>
            <input type={key.includes('horario') ? 'time' : 'text'} value={val} onChange={e => set(key, e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" />
          </div>
        ))}
      </div>

      <button onClick={() => showToast('Configurações da academia atualizadas!', 'success', 'Salvo')} className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center gap-2">
        <Save className="w-4 h-4" /> Salvar Configurações
      </button>
    </div>
  );
}
