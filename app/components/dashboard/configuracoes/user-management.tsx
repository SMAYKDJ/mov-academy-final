'use client';

import React, { useState } from 'react';
import { UserPlus, MoreVertical, ShieldCheck, ShieldAlert, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/components/ui/toast';
import type { SystemUser, UserRole } from '@/types/configuracoes';

interface UserManagementProps { users: SystemUser[]; }

const roleConfig: Record<UserRole, { label: string; color: string; bg: string }> = {
  admin: { label: 'Admin', color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-900/20' },
  instrutor: { label: 'Instrutor', color: 'text-emerald-600 dark:text-green-400', bg: 'bg-emerald-50 dark:bg-green-900/20' },
  recepcao: { label: 'Recepção', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
};

export function UserManagement({ users: initialUsers }: UserManagementProps) {
  const { showToast } = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ nome: '', email: '', role: 'instrutor' as UserRole });

  const addUser = () => {
    if (!newUser.nome || !newUser.email) return;
    setUsers(prev => [...prev, { ...newUser, id: `u${Date.now()}`, ativo: true, ultimoAcesso: 'Agora' }]);
    setNewUser({ nome: '', email: '', role: 'instrutor' });
    setShowForm(false);
    showToast(`Usuário "${newUser.nome}" criado com sucesso!`, 'success', 'Criado');
  };

  const toggleUser = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ativo: !u.ativo } : u));
    showToast('Status do usuário atualizado', 'info', 'Usuários');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Permissões e Usuários</h2>
          <p className="text-xs text-gray-400 mt-0.5">{users.filter(u => u.ativo).length} ativos de {users.length} cadastrados</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition-all flex items-center gap-2">
          <UserPlus className="w-3.5 h-3.5" /> Novo Usuário
        </button>
      </div>

      {/* New User Form */}
      {showForm && (
        <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/30 rounded-2xl p-5 space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Cadastrar Novo Usuário</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input type="text" placeholder="Nome" value={newUser.nome} onChange={e => setNewUser(p => ({ ...p, nome: e.target.value }))}
              className="px-3 py-2.5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white" />
            <input type="email" placeholder="E-mail" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))}
              className="px-3 py-2.5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white" />
              <select 
                title="Novo cargo"
                aria-label="Cargo do novo usuário"
                value={newUser.role} 
                onChange={e => setNewUser(p => ({ ...p, role: e.target.value as UserRole }))}
                className="px-3 py-2.5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white"
              >
              <option value="instrutor">Instrutor</option>
              <option value="recepcao">Recepção</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={addUser} className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition-all">Criar Usuário</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 dark:border-[#2d3348] text-gray-600 dark:text-gray-400 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-[#1a1d27] transition-all">Cancelar</button>
          </div>
        </div>
      )}

      {/* User Table */}
      <div className="space-y-2">
        {users.map(user => {
          const cfg = roleConfig[user.role];
          return (
            <div key={user.id} className={cn(
              "flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1a1d27] rounded-xl transition-all",
              !user.ativo && "opacity-50"
            )}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
                  {user.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{user.nome}</p>
                  <p className="text-[10px] text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn("hidden sm:inline-flex px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest", cfg.bg, cfg.color)}>
                  {cfg.label}
                </span>
                <span className="hidden md:flex items-center gap-1 text-[10px] text-gray-400">
                  <Clock className="w-3 h-3" /> {user.ultimoAcesso}
                </span>
                <button 
                  onClick={() => toggleUser(user.id)} 
                  title={user.ativo ? "Desativar usuário" : "Ativar usuário"}
                  aria-label={user.ativo ? "Desativar usuário" : "Ativar usuário"}
                  className={cn(
                    "relative w-10 h-5 rounded-full transition-all",
                    user.ativo ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"
                  )}
                >
                  <div className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform", user.ativo ? "translate-x-5" : "translate-x-0.5")} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
