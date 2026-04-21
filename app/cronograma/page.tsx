'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { CalendarGrid } from '@/components/dashboard/cronograma/calendar-grid';
import { DaySidebar } from '@/components/dashboard/cronograma/day-sidebar';
import { EventDrawer } from '@/components/dashboard/cronograma/event-drawer';
import { calendarEventsData } from '@/utils/cronograma-data';
import { Plus, ChevronLeft, ChevronRight, CalendarDays, Dumbbell, GraduationCap, ClipboardCheck, Filter } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/components/ui/toast';
import { eventTypeConfig } from '@/types/cronograma';
import type { CalendarEvent, EventType } from '@/types/cronograma';

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

export default function CronogramaPage() {
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calendar state
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Filter
  const [typeFilter, setTypeFilter] = useState<EventType | 'todos'>('todos');

  // Drawer
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'view' | 'create'>('view');

  // Events with local state for check-in
  const [events, setEvents] = useState(calendarEventsData);

  const filteredEvents = useMemo(() => {
    if (typeFilter === 'todos') return events;
    return events.filter(e => e.tipo === typeFilter);
  }, [events, typeFilter]);

  const dayEvents = useMemo(() => {
    return filteredEvents.filter(e => e.data === selectedDate);
  }, [filteredEvents, selectedDate]);

  // KPI counts
  const kpis = useMemo(() => {
    const monthEvents = events.filter(e => {
      const [ey, em] = e.data.split('-').map(Number);
      return ey === year && em === month + 1;
    });
    return {
      total: monthEvents.length,
      treinos: monthEvents.filter(e => e.tipo === 'treino').length,
      aulas: monthEvents.filter(e => e.tipo === 'aula').length,
      avaliacoes: monthEvents.filter(e => e.tipo === 'avaliacao').length,
      concluidos: monthEvents.filter(e => e.status === 'concluido').length,
    };
  }, [events, year, month]);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelectedDate(todayStr);
  };

  const handleEventClick = useCallback((ev: CalendarEvent) => {
    setSelectedEvent(ev);
    setDrawerMode('view');
    setDrawerOpen(true);
  }, []);

  const handleCheckIn = useCallback((eventId: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'concluido' as const } : e));
    showToast('Check-in realizado com sucesso! ✅', 'success', 'Presença');
  }, [showToast]);

  const handleNewEvent = () => {
    setSelectedEvent(null);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#080a0f]">
      <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      <div className="flex-1 md:ml-64 transition-all duration-300">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-fade-in">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-bold uppercase tracking-widest rounded-md">Agenda</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Cronograma</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Gerencie treinos, aulas e avaliações</p>
            </div>
            <button onClick={handleNewEvent} className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center gap-2">
              <Plus className="w-4 h-4" /> Novo Evento
            </button>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Eventos', value: kpis.total, icon: CalendarDays, color: 'from-primary-500 to-indigo-600', text: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-900/20' },
              { label: 'Treinos', value: kpis.treinos, icon: Dumbbell, color: 'from-blue-500 to-blue-600', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { label: 'Aulas', value: kpis.aulas, icon: GraduationCap, color: 'from-emerald-500 to-teal-600', text: 'text-emerald-600 dark:text-green-400', bg: 'bg-emerald-50 dark:bg-green-900/20' },
              { label: 'Concluídos', value: kpis.concluidos, icon: ClipboardCheck, color: 'from-violet-500 to-purple-600', text: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
            ].map(kpi => (
              <div key={kpi.label} className="bg-white dark:bg-[#0f1117] rounded-2xl p-4 border border-gray-100 dark:border-[#1e2235] relative overflow-hidden">
                <div className={cn("absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r", kpi.color)} />
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", kpi.bg)}>
                  <kpi.icon className={cn("w-4 h-4", kpi.text)} />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* Calendar Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button 
                onClick={prevMonth} 
                title="Mês anterior"
                aria-label="Ir para o mês anterior"
                className="p-2 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a1d27] transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white min-w-[180px] text-center">
                {MONTHS[month]} {year}
              </h2>
              <button 
                onClick={nextMonth} 
                title="Próximo mês"
                aria-label="Ir para o próximo mês"
                className="p-2 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a1d27] transition-all"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button onClick={goToday} className="px-3 py-1.5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1d27] transition-all">
                Hoje
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1a1d27] rounded-xl p-1">
              {([['todos', 'Todos'], ['treino', '🏋️ Treinos'], ['aula', '🧘 Aulas'], ['avaliacao', '📋 Aval.']] as [EventType | 'todos', string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTypeFilter(key)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                    typeFilter === key ? "bg-white dark:bg-[#0f1117] text-gray-900 dark:text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid: Calendar + Day Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            <CalendarGrid
              year={year}
              month={month}
              events={filteredEvents}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
            <DaySidebar
              date={selectedDate}
              events={dayEvents}
              onEventClick={handleEventClick}
              onCheckIn={handleCheckIn}
            />
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 justify-center text-xs text-gray-400">
            {Object.entries(eventTypeConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={cn("w-2.5 h-2.5 rounded-full", cfg.dot)} />
                <span className="font-medium">{cfg.label}</span>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Event Drawer */}
      <EventDrawer event={selectedEvent} open={drawerOpen} onClose={() => setDrawerOpen(false)} mode={drawerMode} />
    </div>
  );
}
