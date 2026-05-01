'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Clock, User, Dumbbell, Calendar, MessageSquare, CheckCircle, Save, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { eventTypeConfig, eventStatusConfig } from '@/types/cronograma';
import { useToast } from '@/components/ui/toast';
import type { CalendarEvent, EventType, EventStatus } from '@/types/cronograma';

interface EventDrawerProps {
  event: CalendarEvent | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  mode: 'view' | 'create';
}

export function EventDrawer({ event, open, onClose, onSave, mode }: EventDrawerProps) {
  const { showToast } = useToast();
  const drawerRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    titulo: '', tipo: 'treino' as EventType, alunoNome: '', instrutorNome: '',
    data: '', horaInicio: '', horaFim: '', observacao: '',
  });

  useEffect(() => {
    if (event && mode === 'view') {
      setForm({ titulo: event.titulo, tipo: event.tipo, alunoNome: event.alunoNome, instrutorNome: event.instrutorNome, data: event.data, horaInicio: event.horaInicio, horaFim: event.horaFim, observacao: event.observacao || '' });
    } else if (mode === 'create') {
      setForm({ titulo: '', tipo: 'treino', alunoNome: '', instrutorNome: '', data: new Date().toISOString().split('T')[0], horaInicio: '08:00', horaFim: '09:00', observacao: '' });
    }
  }, [event, mode, open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) { document.addEventListener('keydown', handler); document.body.style.overflow = 'hidden'; }
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;

  const typeCfg = eventTypeConfig[form.tipo];
  const statusCfg = event ? eventStatusConfig[event.status] : null;

  const handleSave = () => {
    if (!form.titulo || !form.alunoNome || !form.data) {
      showToast('Por favor, preencha os campos obrigatórios.', 'warning');
      return;
    }

    const eventData = {
      ...form,
      id: event?.id || `ev-${Date.now()}`,
      status: event?.status || 'pendente' as EventStatus,
    };

    onSave(eventData);
    showToast(mode === 'create' ? 'Evento criado com sucesso!' : 'Evento atualizado!', 'success', 'Agenda');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div ref={drawerRef} className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-white dark:bg-[#0f1117] shadow-2xl flex flex-col animate-slide-in-right">
        {/* Cabeçalho */}
        <div className={cn("p-6 text-white relative overflow-hidden bg-gradient-to-r", form.tipo === 'treino' ? 'from-blue-500 to-blue-700' : form.tipo === 'aula' ? 'from-emerald-500 to-teal-700' : 'from-violet-500 to-purple-700')}>
          <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-white/20 rounded-md text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">{typeCfg.label}</span>
                  {statusCfg && <span className="px-2 py-0.5 bg-white/20 rounded-md text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">{statusCfg.label}</span>}
                </div>
                <h2 className="text-lg font-bold">{mode === 'create' ? 'Novo Evento' : form.titulo}</h2>
              </div>
              <button 
                onClick={onClose} 
                title="Fechar"
                aria-label="Fechar detalhes do evento"
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor="event-title" className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">Título</label>
              <input 
                id="event-title"
                type="text" 
                value={form.titulo} 
                onChange={e => setForm(p => ({...p, titulo: e.target.value}))} 
                placeholder="Ex: Treino A — João"
                title="Título do evento"
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
              />
            </div>
            <div>
              <label htmlFor="event-type" className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">Tipo</label>
              <select 
                id="event-type"
                value={form.tipo} 
                onChange={e => setForm(p => ({...p, tipo: e.target.value as EventType}))}
                title="Selecionar tipo de evento"
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              >
                <option value="treino">🏋️ Treino</option>
                <option value="aula">🧘 Aula</option>
                <option value="avaliacao">📋 Avaliação</option>
              </select>
            </div>
            <div>
              <label htmlFor="event-student" className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">Aluno / Turma</label>
              <div className="relative">
                <input
                  id="event-student"
                  type="text"
                  list="students-list"
                  value={form.alunoNome}
                  onChange={e => setForm(p => ({ ...p, alunoNome: e.target.value }))}
                  placeholder="Nome do aluno ou código"
                  title="Nome do aluno ou código"
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                />
                <datalist id="students-list">
                  <option value="João Victor Silva" />
                  <option value="Maria Clara Oliveira" />
                  <option value="Pedro Lima" />
                  <option value="ALUNO001" />
                  <option value="ALUNO002" />
                </datalist>
              </div>
            </div>
            <div>
              <label htmlFor="event-instructor" className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">Instrutor</label>
              <div className="flex items-center space-x-2">
                <select
                  id="event-instructor"
                  value={form.instrutorNome}
                  onChange={e => setForm(p => ({ ...p, instrutorNome: e.target.value }))}
                  className="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  title="Selecione o instrutor"
                >
                  <option value="">Selecione...</option>
                  {['Ana Silva', 'Carlos Souza', 'Mariana Lima'].map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const newInstr = window.prompt('Nome do novo instrutor:');
                    if (newInstr) {
                      setForm(p => ({ ...p, instrutorNome: newInstr }));
                      showToast(`Instrutor "${newInstr}" adicionado.`, 'success');
                    }
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  aria-label="Adicionar novo instrutor"
                  title="Adicionar novo instrutor"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="event-date" className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">Data</label>
              <input 
                id="event-date"
                type="date" 
                value={form.data} 
                onChange={e => setForm(p => ({...p, data: e.target.value}))}
                title="Data do evento"
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
              />
            </div>
            <div>
              <label htmlFor="event-start" className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">Início</label>
              <input 
                id="event-start"
                type="time" 
                value={form.horaInicio} 
                onChange={e => setForm(p => ({...p, horaInicio: e.target.value}))}
                title="Hora de início"
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
              />
            </div>
            <div>
              <label htmlFor="event-end" className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">Fim</label>
              <input 
                id="event-end"
                type="time" 
                value={form.horaFim} 
                onChange={e => setForm(p => ({...p, horaFim: e.target.value}))}
                title="Hora de término"
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">Observações</label>
              <textarea rows={3} value={form.observacao} onChange={e => setForm(p => ({...p, observacao: e.target.value}))} placeholder="Notas adicionais..."
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none" />
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-6 border-t border-gray-100 dark:border-[#1e2235] flex gap-3">
          <button onClick={handleSave} className="flex-1 py-3 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> {mode === 'create' ? 'Criar Evento' : 'Salvar'}
          </button>
          <button onClick={onClose} className="px-4 py-3 border border-gray-200 dark:border-[#2d3348] text-gray-600 dark:text-gray-400 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-[#1a1d27] transition-all">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
