'use client';

import React, { useState } from 'react';
import { User, Camera, Save } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import type { UserProfile } from '@/types/configuracoes';

interface ProfileFormProps {
  profile: UserProfile;
}

const roleLabelMap = { admin: 'Administrador', instrutor: 'Instrutor', recepcao: 'Recepção' };

export function ProfileForm({ profile }: ProfileFormProps) {
  const { showToast } = useToast();
  const [form, setForm] = useState({ nome: profile.nome, telefone: profile.telefone });

  const handleSave = () => showToast('Perfil atualizado com sucesso!', 'success', 'Salvo');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Perfil do Usuário</h2>
        <p className="text-xs text-gray-400 mt-0.5">Gerencie suas informações pessoais</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
            {form.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-[#1a1d27] rounded-full border-2 border-gray-200 dark:border-[#2d3348] flex items-center justify-center text-gray-400 hover:text-primary-600 transition-colors shadow-sm">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{form.nome}</p>
          <p className="text-xs text-gray-400">{profile.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[9px] font-bold uppercase tracking-widest rounded-md">
            {roleLabelMap[profile.role]}
          </span>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">Nome Completo</label>
          <input type="text" value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}
            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">E-mail</label>
          <input type="email" value={profile.email} readOnly
            className="w-full px-3 py-2.5 bg-gray-100 dark:bg-[#0f1117] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-400 cursor-not-allowed" />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">Telefone</label>
          <input type="text" value={form.telefone} onChange={e => setForm(p => ({ ...p, telefone: e.target.value }))}
            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">Cargo</label>
          <input type="text" value={roleLabelMap[profile.role]} readOnly
            className="w-full px-3 py-2.5 bg-gray-100 dark:bg-[#0f1117] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-400 cursor-not-allowed" />
        </div>
      </div>

      <button onClick={handleSave} className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center gap-2">
        <Save className="w-4 h-4" /> Salvar Alterações
      </button>
    </div>
  );
}
