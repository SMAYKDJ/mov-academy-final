import type { CalendarEvent } from '@/types/cronograma';

/**
 * Eventos simulados do calendário para abril de 2026.
 * Abrange treinos, aulas coletivas e avaliações.
 */
export const calendarEventsData: CalendarEvent[] = [
  // Semana 1
  { id: 'ev-01', titulo: 'Treino A — João Silva', tipo: 'treino', alunoNome: 'João Silva', instrutorNome: 'Carlos Personal', data: '2026-04-06', horaInicio: '07:00', horaFim: '08:00', status: 'concluido' },
  { id: 'ev-02', titulo: 'Aula de Spinning', tipo: 'aula', alunoNome: 'Turma 1', instrutorNome: 'Maria Instrutora', data: '2026-04-06', horaInicio: '09:00', horaFim: '10:00', status: 'concluido' },
  { id: 'ev-03', titulo: 'Treino B — Ana Santos', tipo: 'treino', alunoNome: 'Ana Santos', instrutorNome: 'Carlos Personal', data: '2026-04-07', horaInicio: '08:00', horaFim: '09:00', status: 'concluido' },
  { id: 'ev-04', titulo: 'Avaliação Física — Pedro Lima', tipo: 'avaliacao', alunoNome: 'Pedro Lima', instrutorNome: 'Dr. Marcos', data: '2026-04-07', horaInicio: '14:00', horaFim: '14:45', status: 'concluido' },
  { id: 'ev-05', titulo: 'Aula de Yoga', tipo: 'aula', alunoNome: 'Turma 2', instrutorNome: 'Juliana Yoga', data: '2026-04-08', horaInicio: '18:00', horaFim: '19:00', status: 'concluido' },

  // Semana 2
  { id: 'ev-06', titulo: 'Treino C — Lucas Oliveira', tipo: 'treino', alunoNome: 'Lucas Oliveira', instrutorNome: 'Carlos Personal', data: '2026-04-09', horaInicio: '06:00', horaFim: '07:00', status: 'concluido' },
  { id: 'ev-07', titulo: 'Aula Funcional', tipo: 'aula', alunoNome: 'Turma 3', instrutorNome: 'Maria Instrutora', data: '2026-04-10', horaInicio: '07:00', horaFim: '08:00', status: 'concluido' },
  { id: 'ev-08', titulo: 'Treino A — Maria Costa', tipo: 'treino', alunoNome: 'Maria Costa', instrutorNome: 'João Personal', data: '2026-04-10', horaInicio: '10:00', horaFim: '11:00', status: 'concluido' },
  { id: 'ev-09', titulo: 'Avaliação Física — Carla Dias', tipo: 'avaliacao', alunoNome: 'Carla Dias', instrutorNome: 'Dr. Marcos', data: '2026-04-11', horaInicio: '15:00', horaFim: '15:45', status: 'concluido' },

  // Semana atual (por volta de 13 de abr)
  { id: 'ev-10', titulo: 'Treino B — João Silva', tipo: 'treino', alunoNome: 'João Silva', instrutorNome: 'Carlos Personal', data: '2026-04-13', horaInicio: '07:00', horaFim: '08:00', status: 'agendado' },
  { id: 'ev-11', titulo: 'Aula de Pilates', tipo: 'aula', alunoNome: 'Turma 4', instrutorNome: 'Juliana Yoga', data: '2026-04-13', horaInicio: '09:00', horaFim: '10:00', status: 'agendado' },
  { id: 'ev-12', titulo: 'Treino A — Ana Santos', tipo: 'treino', alunoNome: 'Ana Santos', instrutorNome: 'Carlos Personal', data: '2026-04-13', horaInicio: '16:00', horaFim: '17:00', status: 'agendado' },
  { id: 'ev-13', titulo: 'Treino C — Pedro Lima', tipo: 'treino', alunoNome: 'Pedro Lima', instrutorNome: 'João Personal', data: '2026-04-14', horaInicio: '08:00', horaFim: '09:00', status: 'agendado' },
  { id: 'ev-14', titulo: 'Aula de HIIT', tipo: 'aula', alunoNome: 'Turma 1', instrutorNome: 'Maria Instrutora', data: '2026-04-14', horaInicio: '18:00', horaFim: '19:00', status: 'agendado' },
  { id: 'ev-15', titulo: 'Avaliação Física — Lucas Oliveira', tipo: 'avaliacao', alunoNome: 'Lucas Oliveira', instrutorNome: 'Dr. Marcos', data: '2026-04-15', horaInicio: '10:00', horaFim: '10:45', status: 'agendado' },

  // Futuro
  { id: 'ev-16', titulo: 'Treino A — Maria Costa', tipo: 'treino', alunoNome: 'Maria Costa', instrutorNome: 'João Personal', data: '2026-04-16', horaInicio: '07:00', horaFim: '08:00', status: 'agendado' },
  { id: 'ev-17', titulo: 'Aula de Zumba', tipo: 'aula', alunoNome: 'Turma 2', instrutorNome: 'Maria Instrutora', data: '2026-04-17', horaInicio: '19:00', horaFim: '20:00', status: 'agendado' },
  { id: 'ev-18', titulo: 'Treino B — Carla Dias', tipo: 'treino', alunoNome: 'Carla Dias', instrutorNome: 'Carlos Personal', data: '2026-04-18', horaInicio: '08:00', horaFim: '09:00', status: 'agendado' },
  { id: 'ev-19', titulo: 'Treino C — João Silva', tipo: 'treino', alunoNome: 'João Silva', instrutorNome: 'Carlos Personal', data: '2026-04-20', horaInicio: '07:00', horaFim: '08:00', status: 'agendado' },
  { id: 'ev-20', titulo: 'Aula Funcional', tipo: 'aula', alunoNome: 'Turma 3', instrutorNome: 'Maria Instrutora', data: '2026-04-22', horaInicio: '07:00', horaFim: '08:00', status: 'agendado' },
  { id: 'ev-21', titulo: 'Avaliação Física — Ana Santos', tipo: 'avaliacao', alunoNome: 'Ana Santos', instrutorNome: 'Dr. Marcos', data: '2026-04-25', horaInicio: '14:00', horaFim: '14:45', status: 'agendado' },
  { id: 'ev-22', titulo: 'Aula de Spinning', tipo: 'aula', alunoNome: 'Turma 1', instrutorNome: 'Maria Instrutora', data: '2026-04-28', horaInicio: '09:00', horaFim: '10:00', status: 'agendado' },
  { id: 'ev-23', titulo: 'Treino A — Pedro Lima', tipo: 'treino', alunoNome: 'Pedro Lima', instrutorNome: 'Carlos Personal', data: '2026-04-30', horaInicio: '07:00', horaFim: '08:00', status: 'agendado', observacao: 'Foco em pernas — preparar leg press' },
];
