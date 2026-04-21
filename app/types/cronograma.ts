/**
 * Types for the Cronograma (Schedule/Calendar) module.
 */

export type EventType = 'treino' | 'aula' | 'avaliacao';
export type EventStatus = 'agendado' | 'concluido' | 'cancelado';

export interface CalendarEvent {
  id: string;
  titulo: string;
  tipo: EventType;
  alunoNome: string;
  instrutorNome: string;
  data: string;         // YYYY-MM-DD
  horaInicio: string;   // HH:mm
  horaFim: string;      // HH:mm
  status: EventStatus;
  observacao?: string;
}

export interface AttendanceRecord {
  id: string;
  eventId: string;
  alunoNome: string;
  presente: boolean;
  checkinTime?: string;
}

export type CalendarViewMode = 'mes' | 'semana' | 'dia';

export const eventTypeConfig: Record<EventType, { label: string; color: string; bg: string; dot: string; border: string }> = {
  treino:    { label: 'Treino',    color: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-900/20',    dot: 'bg-blue-500',   border: 'border-blue-200 dark:border-blue-800' },
  aula:      { label: 'Aula',      color: 'text-emerald-600 dark:text-green-400', bg: 'bg-emerald-50 dark:bg-green-900/20', dot: 'bg-emerald-500', border: 'border-emerald-200 dark:border-green-800' },
  avaliacao: { label: 'Avaliação', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20', dot: 'bg-violet-500',  border: 'border-violet-200 dark:border-violet-800' },
};

export const eventStatusConfig: Record<EventStatus, { label: string; color: string; bg: string }> = {
  agendado:  { label: 'Agendado',  color: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-900/20' },
  concluido: { label: 'Concluído', color: 'text-emerald-600 dark:text-green-400', bg: 'bg-emerald-50 dark:bg-green-900/20' },
  cancelado: { label: 'Cancelado', color: 'text-red-600 dark:text-red-400',       bg: 'bg-red-50 dark:bg-red-900/20' },
};
