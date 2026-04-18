'use client';

import React, { useState } from 'react';
import { User, Camera, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types/auth';

interface ProfileFormProps {
  profile: UserProfile;
}

const roleLabelMap = { 
  admin: 'Administrador', 
  professor: 'Professor / Treinador', 
  recepcao: 'Recepção', 
  aluno: 'Aluno' 
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const { showToast } = useToast();
  const [form, setForm] = useState({ 
    nome: profile.nome || '', 
    email: profile.email || '',
    telefone: (profile as any).telefone || '',
    role: profile.role || 'aluno',
    avatar_url: profile.avatar_url || ''
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, avatar_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // 1. O e-mail fica no auth e o nome na tabela profiles + auth metadata
      const updates = [];
      
      if (form.email !== profile.email) {
        updates.push(supabase.auth.updateUser({ email: form.email }));
      }
      
      if (form.nome !== profile.nome || form.role !== profile.role || form.avatar_url !== profile.avatar_url) {
        updates.push(supabase.auth.updateUser({ 
          data: { nome: form.nome, role: form.role, avatar_url: form.avatar_url } 
        }));
        updates.push(supabase.from('profiles').update({ 
          nome: form.nome, 
          role: form.role,
          avatar_url: form.avatar_url 
        }).eq('id', profile.id));
      }

      await Promise.all(updates);
      
      // Update local profile ref to avoid false "success" without reload
      profile.nome = form.nome;
      profile.role = form.role;
      profile.avatar_url = form.avatar_url;

      if (form.email !== profile.email) {
        showToast('Confirme a alteração no seu novo e-mail.', 'warning', 'Verificação Enviada');
      } else {
        showToast('Perfil atualizado com sucesso!', 'success', 'Salvo');
      }
    } catch (error) {
      showToast('Erro ao atualizar perfil.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Perfil do Usuário</h2>
        <p className="text-xs text-gray-400 mt-0.5">Gerencie suas informações pessoais</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div className="relative group">
          {form.avatar_url ? (
            <img 
              src={form.avatar_url} 
              alt="Avatar" 
              className="w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-primary-500/20"
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {form.nome ? form.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'US'}
            </div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageUpload}
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Alterar foto de perfil"
            aria-label="Upload de nova foto de perfil"
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-[#1a1d27] rounded-full border-2 border-gray-200 dark:border-[#2d3348] flex items-center justify-center text-gray-400 hover:text-primary-600 transition-colors shadow-lg cursor-pointer"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{profile.nome}</p>
          <p className="text-xs text-gray-400">{profile.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[9px] font-bold uppercase tracking-widest rounded-md">
            {roleLabelMap[profile.role as keyof typeof roleLabelMap] || profile.role}
          </span>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">Nome Completo</label>
          <input 
            type="text" 
            value={form.nome} 
            onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}
            title="Seu nome completo"
            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
          />
        </div>
        <div>
          <label htmlFor="profile-email" className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">E-mail de Acesso</label>
          <input 
            id="profile-email"
            type="email" 
            value={form.email} 
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            title="Seu endereço de e-mail"
            placeholder="E-mail"
            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">Telefone</label>
          <input 
            type="text" 
            value={form.telefone} 
            onChange={e => setForm(p => ({ ...p, telefone: e.target.value }))}
            title="Seu número de telefone"
            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
          />
        </div>
        <div>
          <label htmlFor="profile-role" className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">Cargo / Vínculo</label>
          <select 
            id="profile-role"
            value={form.role} 
            disabled
            title="O cargo só pode ser alterado por um administrador"
            className="w-full pl-3 pr-8 py-2.5 bg-gray-100 dark:bg-[#151821] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-400 cursor-not-allowed appearance-none" 
          >
            <option value="admin">Administrador</option>
            <option value="recepcao">Recepção</option>
            <option value="professor">Professor / Treinador</option>
            <option value="aluno">Aluno / Cliente</option>
          </select>
          <p className="text-[9px] text-gray-400 mt-1.5 italic">* Caso precise alterar seu cargo, contate o administrador.</p>
        </div>
      </div>

      <button 
        onClick={handleSave} 
        disabled={loading}
        className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center gap-2 disabled:opacity-70"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
        {loading ? 'Salvando...' : 'Salvar Alterações'}
      </button>
    </div>
  );
}
