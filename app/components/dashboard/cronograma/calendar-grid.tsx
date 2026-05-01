'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import { eventTypeConfig } from '@/types/cronograma';
import type { CalendarEvent } from '@/types/cronograma';

interface CalendarGridProps {
  year: number;
  month: number; // Base zero (0 = Janeiro)
  events: CalendarEvent[];
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Grade de calendário mensal com pontos de evento.
 */
export function CalendarGrid({ year, month, events, selectedDate, onSelectDate }: CalendarGridProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const today = new Date();
  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

  // Construir as células da grade do calendário
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const getEventsForDay = (day: number): CalendarEvent[] => {
    const dateStr = formatDate(year, month, day);
    return events.filter(e => e.data === dateStr);
  };

  return (
    <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] overflow-hidden">
      {/* Cabeçalhos dos Dias da Semana */}
      <div className="grid grid-cols-7 border-b border-gray-100 dark:border-[#1e2235]">
        {WEEKDAYS.map(wd => (
          <div key={wd} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            {wd}
          </div>
        ))}
      </div>

      {/* Células de Dias */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="min-h-[80px] md:min-h-[100px] border-b border-r border-gray-50 dark:border-[#1a1d27] bg-gray-50/50 dark:bg-[#0a0c12]" />;
          }

          const dateStr = formatDate(year, month, day);
          const dayEvents = getEventsForDay(day);
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={cn(
                "min-h-[80px] md:min-h-[100px] p-1.5 md:p-2 border-b border-r border-gray-50 dark:border-[#1a1d27] text-left transition-all hover:bg-primary-50/50 dark:hover:bg-primary-900/5 relative group",
                isSelected && "bg-primary-50 dark:bg-primary-900/10 ring-2 ring-inset ring-primary-500/30"
              )}
            >
              {/* Número do Dia */}
              <div className={cn(
                "w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold mb-1 transition-all",
                isToday
                  ? "bg-primary-600 text-white shadow-sm"
                  : isSelected
                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                  : "text-gray-600 dark:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-gray-800"
              )}>
                {day}
              </div>

              {/* Pontos / Chips de Evento */}
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map(ev => {
                  const cfg = eventTypeConfig[ev.tipo];
                  return (
                    <div key={ev.id} className={cn("hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold truncate", cfg.bg, cfg.color)}>
                      <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
                      <span className="truncate">{ev.horaInicio}</span>
                    </div>
                  );
                })}
                {/* Mobile: apenas pontos */}
                <div className="flex md:hidden gap-0.5 flex-wrap">
                  {dayEvents.slice(0, 4).map(ev => (
                    <div key={ev.id} className={cn("w-2 h-2 rounded-full", eventTypeConfig[ev.tipo].dot)} />
                  ))}
                </div>
                {dayEvents.length > 3 && (
                  <span className="hidden md:block text-[8px] text-gray-400 font-bold">+{dayEvents.length - 3} mais</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
