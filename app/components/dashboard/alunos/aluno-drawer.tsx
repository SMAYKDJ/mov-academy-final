'use client';

import React, { useEffect, useRef } from 'react';
import {
  X, Phone, Mail, MapPin, Calendar, CreditCard, Target,
  TrendingUp, Activity, ShieldAlert, Edit3, UserX, MessageCircle, Trash2
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { StatusBadge, PlanBadge, RiskIndicator } from './status-badge';
import type { Aluno, AlunoStatus } from '@/types/aluno';
import { openWhatsApp, generateWAMessage } from '@/utils/whatsapp-helper';

interface AlunoDrawerProps {
  aluno: Aluno | null;
  open: boolean;
  onClose: () => void;
  onEdit: (aluno: Aluno) => void;
  onDelete: (aluno: Aluno) => void;
  onStatusChange?: (aluno: Aluno, status: AlunoStatus) => void;
}

export function AlunoDrawer({ aluno, open, onClose, onEdit, onDelete, onStatusChange }: AlunoDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Fechar ao pressionar a tecla Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // Armadilha de foco (Focus trap)
  useEffect(() => {
    if (open && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [open]);

  if (!open || !aluno) return null;

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return (parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '');
  };

  const avatarColors = [
    'from-primary-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-pink-500 to-rose-600',
    'from-violet-500 to-purple-600',
    'from-sky-500 to-blue-600',
  ];

  const infoItems = [
    { icon: Phone, label: 'Telefone', value: aluno.telefone },
    { icon: Mail, label: 'Email', value: aluno.email },
    { icon: MapPin, label: 'Endereço', value: aluno.endereco },
    { icon: Calendar, label: 'Nascimento', value: aluno.dataNascimento },
    { icon: Calendar, label: 'Matrícula', value: aluno.dataMatricula },
    { icon: Target, label: 'Objetivo', value: aluno.objetivo },
    { icon: CreditCard, label: 'ID Catraca', value: aluno.biometry_id || 'Não vinculado' },
  ];

  const paymentMethodLabels: Record<string, string> = {
    pix: 'PIX',
    cartao: 'Cartão',
    boleto: 'Boleto',
    dinheiro: 'Dinheiro',
  };

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={`Detalhes de ${aluno.nome}`}>
      {/* Fundo (Backdrop) */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Painel do Drawer */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        className={cn(
          "absolute right-0 top-0 h-full w-full sm:w-[480px] bg-white dark:bg-[#0f1117] shadow-2xl flex flex-col",
          "animate-slide-in-right"
        )}
      >
        {/* Cabeçalho */}
        <div className="p-6 border-b border-gray-100 dark:border-[#1e2235] flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg",
              avatarColors[aluno.id % avatarColors.length]
            )}>
              {getInitials(aluno.nome)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{aluno.nome}</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">CPF: {aluno.cpf}</p>
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge status={aluno.status} />
                <PlanBadge plan={aluno.plano} />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-[#1a1d27] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Frequência</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{aluno.frequencia}x</p>
              <p className="text-[10px] text-gray-400">por semana</p>
            </div>
            <div className="bg-gray-50 dark:bg-[#1a1d27] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Risco Churn</span>
              </div>
              <RiskIndicator risk={aluno.risco} />
            </div>
          </div>

          {/* Lista de Informações */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-3">
              Informações Pessoais
            </h3>
            <div className="space-y-3">
              {infoItems.map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-50 dark:bg-[#1a1d27] rounded-lg flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="min-w-0 pt-1">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">{item.label}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 break-words">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Histórico de Pagamentos */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-3">
              Histórico de Pagamentos
            </h3>
            <div className="space-y-2">
              {(aluno.historicoPagamentos || []).length > 0 ? (
                aluno.historicoPagamentos.map(pag => (
                  <div
                    key={pag.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1a1d27] rounded-xl"
                  >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      pag.status === 'pago' ? "bg-emerald-50 dark:bg-green-900/20" : "bg-amber-50 dark:bg-amber-900/20"
                    )}>
                      <CreditCard className={cn(
                        "w-4 h-4",
                        pag.status === 'pago' ? "text-emerald-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                      )} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        R$ {pag.amount.toFixed(2).replace('.', ',')}
                      </p>
                      <p className="text-[10px] text-gray-400">{pag.date} · {paymentMethodLabels[pag.method] || pag.method}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                    pag.status === 'pago'
                      ? "bg-emerald-50 dark:bg-green-900/20 text-emerald-700 dark:text-green-400"
                      : pag.status === 'pendente'
                      ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                      : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                  )}>
                    {pag.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-xs text-gray-400 italic bg-gray-50 dark:bg-[#1a1d27] rounded-xl border border-dashed border-gray-200 dark:border-[#2d3348]">
                Nenhum histórico disponível
              </p>
            )}
            </div>
          </div>

          {/* Ações do WhatsApp */}
          <div className="pt-2">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-3">
              Comunicação WhatsApp
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => openWhatsApp(aluno.telefone)}
                className="flex items-center justify-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-all border border-emerald-100 dark:border-emerald-800"
              >
                <MessageCircle className="w-4 h-4" />
                Conversar
              </button>
              <button
                onClick={() => {
                  const msg = generateWAMessage('boas_vindas', aluno.nome);
                  openWhatsApp(aluno.telefone, msg);
                }}
                className="flex items-center justify-center gap-2 p-3 bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400 rounded-xl text-xs font-bold hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-all border border-primary-100 dark:border-primary-800"
              >
                <MessageCircle className="w-4 h-4" />
                Boas-vindas
              </button>
            </div>
          </div>
        </div>

        {/* Ações de Rodapé */}
        <div className="p-6 border-t border-gray-100 dark:border-[#1e2235] flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              onClick={() => { onEdit(aluno); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              <Edit3 className="w-4 h-4" />
              Editar Aluno
            </button>
          <button
            onClick={() => onDelete(aluno)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-amber-100 dark:border-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl text-sm font-bold hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all"
          >
            <UserX className="w-4 h-4" />
            Inativar Cadastro (Arquivar)
          </button>
        </div>
      </div>
    </div>
  );
}
