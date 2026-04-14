'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Aluno, AlunoFormData, AlunoPlan, AlunoStatus } from '@/types/aluno';

interface AlunoFormProps {
  aluno?: Aluno | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: AlunoFormData) => void;
}

const planOptions: AlunoPlan[] = ['Mensal', 'Trimestral', 'Semestral', 'Anual', 'Black VIP'];
const statusOptions: AlunoStatus[] = ['ativo', 'inativo', 'pendente'];
const statusLabels: Record<AlunoStatus, string> = { ativo: 'Ativo', inativo: 'Inativo', pendente: 'Pendente' };

/**
 * CPF mask: 000.000.000-00
 */
function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

/**
 * Phone mask: (00) 00000-0000
 */
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
};

export function AlunoForm({ aluno, open, onClose, onSave }: AlunoFormProps) {
  const [form, setForm] = useState<AlunoFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof AlunoFormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!aluno;

  // Populate form on edit
  useEffect(() => {
    if (aluno) {
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
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [aluno, open]);

  // Focus first field on open
  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 200);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

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
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));
    onSave(form);
    setSaving(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={isEditing ? 'Editar aluno' : 'Cadastrar aluno'}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white dark:bg-[#0f1117] shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-[#1e2235] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Editar Aluno' : 'Novo Aluno'}
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {isEditing ? `Editando ${aluno?.nome}` : 'Preencha os dados do novo aluno'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400" aria-label="Fechar">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5">
              Nome completo <span className="text-danger-500">*</span>
            </label>
            <input
              ref={firstInputRef}
              type="text"
              value={form.nome}
              onChange={(e) => updateField('nome', e.target.value)}
              className={cn(
                "w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all",
                errors.nome ? "border-danger-500" : "border-gray-200 dark:border-[#2d3348]"
              )}
              placeholder="João Victor Silva"
            />
            {errors.nome && <p className="mt-1 text-xs text-danger-600 dark:text-red-400">{errors.nome}</p>}
          </div>

          {/* CPF + Telefone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5">
                CPF <span className="text-danger-500">*</span>
              </label>
              <input
                type="text"
                value={form.cpf}
                onChange={(e) => updateField('cpf', e.target.value)}
                className={cn(
                  "w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                  errors.cpf ? "border-danger-500" : "border-gray-200 dark:border-[#2d3348]"
                )}
                placeholder="000.000.000-00"
              />
              {errors.cpf && <p className="mt-1 text-xs text-danger-600 dark:text-red-400">{errors.cpf}</p>}
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5">
                Telefone <span className="text-danger-500">*</span>
              </label>
              <input
                type="text"
                value={form.telefone}
                onChange={(e) => updateField('telefone', e.target.value)}
                className={cn(
                  "w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                  errors.telefone ? "border-danger-500" : "border-gray-200 dark:border-[#2d3348]"
                )}
                placeholder="(21) 99999-9999"
              />
              {errors.telefone && <p className="mt-1 text-xs text-danger-600 dark:text-red-400">{errors.telefone}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5">
              Email <span className="text-danger-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={cn(
                "w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                errors.email ? "border-danger-500" : "border-gray-200 dark:border-[#2d3348]"
              )}
              placeholder="joao@email.com"
            />
            {errors.email && <p className="mt-1 text-xs text-danger-600 dark:text-red-400">{errors.email}</p>}
          </div>

          {/* Plano + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5">Plano</label>
              <select
                value={form.plano}
                onChange={(e) => updateField('plano', e.target.value)}
                className="w-full appearance-none px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                {planOptions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField('status', e.target.value)}
                className="w-full appearance-none px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                {statusOptions.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
              </select>
            </div>
          </div>

          {/* Data Nascimento */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5">
              Data de Nascimento
            </label>
            <input
              type="text"
              value={form.dataNascimento}
              onChange={(e) => updateField('dataNascimento', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="DD/MM/AAAA"
            />
          </div>

          {/* Endereço */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5">
              Endereço
            </label>
            <input
              type="text"
              value={form.endereco}
              onChange={(e) => updateField('endereco', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Rua Exemplo, 123 — Bairro"
            />
          </div>

          {/* Objetivo */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1.5">
              Objetivo
            </label>
            <select
              value={form.objetivo}
              onChange={(e) => updateField('objetivo', e.target.value)}
              className="w-full appearance-none px-4 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              <option value="">Selecionar...</option>
              <option value="Hipertrofia">Hipertrofia</option>
              <option value="Emagrecimento">Emagrecimento</option>
              <option value="Condicionamento">Condicionamento</option>
              <option value="Funcional">Funcional</option>
              <option value="Performance">Performance</option>
              <option value="Qualidade de vida">Qualidade de vida</option>
              <option value="Reabilitação">Reabilitação</option>
              <option value="Musculação">Musculação</option>
            </select>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-[#1e2235] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 dark:border-[#2d3348] text-gray-600 dark:text-gray-400 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-[#1a1d27] transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit as any}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditing ? 'Salvar Alterações' : 'Cadastrar Aluno'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
