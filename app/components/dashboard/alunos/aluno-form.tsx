'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Aluno, AlunoFormData, AlunoPlan, AlunoStatus } from '@/types/aluno';
import { supabase } from '@/lib/supabase';

interface AlunoFormProps {
  aluno?: Aluno | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: AlunoFormData) => void;
}

const planOptions: AlunoPlan[] = ['Mensal', 'Trimestral', 'Semestral', 'Anual', 'Black VIP'];
const statusOptions: AlunoStatus[] = ['ativo', 'inativo', 'pendente'];
const statusLabels: Record<AlunoStatus, string> = { ativo: 'Ativo', inativo: 'Inativo', pendente: 'Pendente' };

function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

const emptyForm: AlunoFormData = {
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
  plano: 'Mensal',
  status: 'ativo',
  dataNascimento: '',
  endereco: '',
  objetivo: '',
  senha: '',
};

export function AlunoForm({ aluno, open, onClose, onSave }: AlunoFormProps) {
  const [form, setForm] = useState<AlunoFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof AlunoFormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!aluno;

  useEffect(() => {
    if (aluno && open) {
      setForm({
        nome: aluno.nome,
        cpf: aluno.cpf,
        telefone: aluno.telefone,
        email: aluno.email,
        plano: aluno.plano,
        status: aluno.status,
        dataNascimento: aluno.dataNascimento,
        endereco: aluno.endereco,
        objetivo: aluno.objetivo,
        senha: '',
      });
    } else if (open) {
      setForm(emptyForm);
    }
    setErrors({});
  }, [aluno, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 200);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const updateField = (key: keyof AlunoFormData, value: string) => {
    let processed = value;
    if (key === 'cpf') processed = maskCPF(value);
    if (key === 'telefone') processed = maskPhone(value);
    setForm(prev => ({ ...prev, [key]: processed }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof AlunoFormData, string>> = {};
    if (!form.nome.trim()) errs.nome = 'Nome é obrigatório';
    if (form.cpf.replace(/\D/g, '').length !== 11) errs.cpf = 'CPF inválido';
    if (form.telefone.replace(/\D/g, '').length < 10) errs.telefone = 'Telefone inválido';
    if (!form.email.includes('@')) errs.email = 'Email inválido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    
    try {
      if (!isEditing) {
        const { data } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', form.email)
          .maybeSingle();

        if (data) {
          setErrors(prev => ({ ...prev, email: 'Este e-mail já está em uso.' }));
          setSaving(false);
          return;
        }

        // Criar usuário no Auth (bypass sem deslogar o admin através do persistSession: false)
        const customAuth = supabase; // Usamos a instância importada
        // A melhor forma de criar sem afetar sessão no browser sem backend é criar um cliente fake
        const isolatedSupabase = (await import('@supabase/supabase-js')).createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          { auth: { autoRefreshToken: false, persistSession: false } }
        );

        if (form.senha && form.senha.length >= 6) {
          const { error: authError } = await isolatedSupabase.auth.signUp({
            email: form.email,
            password: form.senha,
            options: {
              data: {
                nome: form.nome,
                telefone: form.telefone,
                role: 'aluno'
              }
            }
          });
          if (authError) {
             setErrors(prev => ({ ...prev, email: 'Erro ao criar conta de acesso: ' + authError.message }));
             setSaving(false);
             return;
          }
        }
      }
      onSave(form);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white dark:bg-[#0f1117] shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-6 border-b border-gray-100 dark:border-[#1e2235] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{isEditing ? 'Editar Aluno' : 'Novo Aluno'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{isEditing ? `Editando ${aluno?.nome}` : 'Preencha os dados do novo aluno'}</p>
          </div>
          <button onClick={onClose} aria-label="Fechar janela" title="Fechar" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label htmlFor="aluno-nome" className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5">Nome completo *</label>
            <input id="aluno-nome" ref={firstInputRef} type="text" value={form.nome} onChange={(e) => updateField('nome', e.target.value)}
              title="Nome completo" aria-label="Nome completo do aluno" placeholder="Ex: João da Silva"
              className={cn("w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none transition-all", errors.nome ? "border-danger-500" : "border-gray-200 dark:border-[#2d3348]")} />
            {errors.nome && <p className="mt-1 text-xs text-danger-600">{errors.nome}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5">CPF *</label>
              <input type="text" value={form.cpf} onChange={(e) => updateField('cpf', e.target.value)}
                className={cn("w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none", errors.cpf ? "border-danger-500" : "border-gray-200 dark:border-[#2d3348]")} placeholder="000.000.000-00" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5">Telefone *</label>
              <input type="text" value={form.telefone} onChange={(e) => updateField('telefone', e.target.value)}
                className={cn("w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none", errors.telefone ? "border-danger-500" : "border-gray-200 dark:border-[#2d3348]")} placeholder="(11) 99999-9999" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="aluno-email" className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5">Email *</label>
              <input id="aluno-email" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)}
                title="E-mail de Cadastro" aria-label="E-mail principal" placeholder="joao@exemplo.com"
                className={cn("w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none", errors.email ? "border-danger-500" : "border-gray-200 dark:border-[#2d3348]")} />
              {errors.email && <p className="mt-1 text-xs text-danger-600">{errors.email}</p>}
            </div>
            
            {!isEditing && (
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5">Senha de Acesso (Login)</label>
                <input type="text" value={form.senha || ''} onChange={(e) => updateField('senha', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Min. 6 caracteres" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5">Plano</label>
              <select value={form.plano} aria-label="Plano do Aluno" title="Plano" onChange={(e) => updateField('plano', e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm">
                {planOptions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5">Status</label>
              <select value={form.status} aria-label="Status do Aluno" title="Status" onChange={(e) => updateField('status', e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm">
                {statusOptions.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5">Objetivo</label>
            <input type="text" value={form.objetivo} onChange={(e) => updateField('objetivo', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Ex: Hipertrofia" />
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 dark:border-[#1e2235] flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 border border-gray-100 rounded-xl text-sm font-semibold">Cancelar</button>
          <button onClick={handleSubmit} disabled={saving} className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEditing ? 'Salvar' : 'Cadastrar'}
          </button>
        </div>
      </div>
    </div>
  );
}
