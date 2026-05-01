'use client';

import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Camera, LogOut, ChevronRight, Shield, Bell, Moon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/utils/cn';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (confirm('Deseja realmente sair?')) {
      await signOut();
      window.location.href = '/login';
    }
  };

  const handleUpdatePhoto = () => {
    showToast('Funcionalidade de upload em breve!', 'info');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <section>
        <h2 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">Meu Perfil</h2>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Configurações</h1>
      </section>

      {/* Cartão do Usuário */}
      <div className="flex flex-col items-center">
        <div className="relative group">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-[32px] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-primary-200 dark:shadow-none overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.nome?.charAt(0).toUpperCase() || 'A'
            )}
          </div>
          <button 
            onClick={handleUpdatePhoto}
            className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-[#1a1d27] rounded-xl shadow-lg flex items-center justify-center text-primary-600 border border-gray-100 dark:border-[#2e334d] active:scale-90 transition-transform"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">{user?.nome || 'Atleta'}</h3>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Membro desde Abr 2024</p>
      </div>

      {/* Lista de Informações */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Dados Pessoais</h4>
        <div className="bg-white dark:bg-[#0f1117] rounded-3xl border border-gray-100 dark:border-[#1e2235] overflow-hidden">
          <div className="p-4 flex items-center gap-4 border-b border-gray-50 dark:border-[#1e2235]">
            <div className="w-9 h-9 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600">
              <Mail className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">E-mail</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{user?.email}</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-4 border-b border-gray-50 dark:border-[#1e2235]">
            <div className="w-9 h-9 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600">
              <Phone className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Telefone</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">(91) 98345-7028</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-4">
            <div className="w-9 h-9 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Endereço</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Belém, PA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Menu */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Preferências</h4>
        <div className="bg-white dark:bg-[#0f1117] rounded-3xl border border-gray-100 dark:border-[#1e2235] overflow-hidden">
          {[
            { icon: Bell, label: 'Notificações', color: 'text-amber-500' },
            { icon: Shield, label: 'Privacidade', color: 'text-emerald-500' },
            { icon: Moon, label: 'Modo Escuro', color: 'text-violet-500' },
          ].map((item, i) => (
            <button 
              key={i}
              className={cn(
                "w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                i !== 2 && "border-b border-gray-50 dark:border-[#1e2235]"
              )}
            >
              <div className="flex items-center gap-4">
                <item.icon className={cn("w-5 h-5", item.color)} />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Sair */}
      <button 
        onClick={handleLogout}
        className="w-full p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl flex items-center justify-center gap-3 text-red-600 dark:text-red-400 font-bold active:scale-95 transition-all"
      >
        <LogOut className="w-5 h-5" />
        Sair da Conta
      </button>

      <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
        Moviment Academy v2.1.0
      </p>
    </div>
  );
}
