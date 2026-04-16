'use client';

import React from 'react';
import { Clock, User, Dumbbell, CheckCircle, XCircle, Calendar as CalIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { eventTypeConfig, eventStatusConfig } from '@/types/cronograma';
import type { CalendarEvent } from '@/types/cronograma';

interface DaySidebarProps {
  date: string; // YYYY-MM-DD
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onCheckIn: (eventId: string) => void;
}

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const WEEKDAYS_FULL = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];

function parseDate(s: string) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function DaySidebar({ date, events, onEventClick, onCheckIn }: DaySidebarProps) {
  const dt = parseDate(date);
  const dayName = WEEKDAYS_FULL[dt.getDay()];
  const dayNum = dt.getDate();
  const monthName = MONTHS[dt.getMonth()];

  const sorted = [...events].sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  return (
    <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] overflow-hidden h-fit lg:sticky lg:top-24">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 dark:border-[#1e2235] bg-gradient-to-br from-primary-600 to-indigo-700 text-white">
        <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">{dayName}</p>
        <p className="text-3xl font-black">{dayNum}</p>
        <p className="text-sm opacity-80">{monthName} {dt.getFullYear()}</p>
        <div className="mt-2 flex items-center gap-2">
          <CalIcon className="w-3.5 h-3.5 opacity-60" />
          <span className="text-xs font-bold opacity-80">{events.length} evento{events.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Events List */}
      <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="text-center py-8">
            <CalIcon className="w-8 h-8 text-gray-200 dark:text-gray-700 mx-auto mb-2" />
            <p className="text-xs text-gray-400 font-medium">Nenhum evento neste dia</p>
          </div>
        ) : sorted.map(ev => {
          const typeCfg = eventTypeConfig[ev.tipo];
          const statusCfg = eventStatusConfig[ev.status];
          return (
            <button
              key={ev.id}
              onClick={() => onEventClick(ev)}
              className={cn(
                "w-full p-3.5 rounded-xl border text-left transition-all hover:shadow-md group",
                typeCfg.border, typeCfg.bg
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2.5 h-2.5 rounded-full", typeCfg.dot)} />
                  <span className={cn("text-[9px] font-bold uppercase tracking-widest", typeCfg.color)}>{typeCfg.label}</span>
                </div>
                <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold uppercase", statusCfg.bg, statusCfg.color)}>
                  {statusCfg.label}
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-1.5 leading-tight">{ev.titulo}</p>
              <div className="flex items-center gap-3 text-[10px] text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ev.horaInicio} - {ev.horaFim}</span>
                <span className="flex items-center gap-1"><User className="w-3 h-3" />{ev.instrutorNome}</span>
              </div>

              {/* Quick Check-in */}
              {ev.status === 'agendado' && (
                <div className="mt-3 flex gap-2" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => onCheckIn(ev.id)}
                    className="flex-1 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3" /> Check-in
                  </button>
                  <button 
                    title="Remover evento"
                    aria-label="Remover evento da agenda rápida"
                    className="px-3 py-1.5 border border-gray-200 dark:border-[#2d3348] text-gray-400 rounded-lg text-[10px] font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-bold"
                  >
                    <XCircle className="w-3 h-3" />
                  </button>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
