'use client';

import React, { useState } from 'react';
import { Search, User, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useLocalStorage } from '@/utils/persistence';
import { alunosData as staticAlunos } from '@/utils/alunos-data';

interface Student {
  id: string | number;
  name: string;
  plan: string;
  avatar?: string;
}

export const mockStudents: Student[] = [
  { id: 'MOV-0001', name: 'Ana Silva', plan: 'Platinum VIP' },
  { id: 'MOV-0002', name: 'Bruno Costa', plan: 'Basic Fit' },
  { id: 'MOV-0003', name: 'Carla Souza', plan: 'Black Edition' },
  { id: 'MOV-0004', name: 'Daniel Alves', plan: 'Platinum VIP' },
  { id: 'MOV-0005', name: 'Elena Mendes', plan: 'Basic Fit' },
];

interface StudentSelectorProps {
  onSelect?: (student: Student) => void;
  selectedId?: string | number;
}

export function StudentSelector({ onSelect, selectedId }: StudentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  // Usar dados reais do localStorage/Supabase
  const [alunos] = useLocalStorage<any[]>('moviment-alunos', staticAlunos, 'alunos');

  // Mapear dados para o formato do seletor
  const studentsList = alunos.map(a => ({
    id: a.id,
    name: a.nome,
    plan: a.plano
  }));

  const selected = studentsList.find(s => String(s.id) === String(selectedId)) || studentsList[0];

  const filtered = studentsList.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    String(s.id).toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (student: Student) => {
    if (onSelect) onSelect(student);
    setIsOpen(false);
    setSearch('');
  };

  if (!selected) return null;

  return (
    <div className="relative z-[50]">
      {/* Gatilho do Seletor */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 pl-4 pr-5 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-2xl hover:border-primary-400 dark:hover:border-primary-900/50 transition-all group shadow-sm hover:shadow-md"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary-500/20">
          {selected.name ? selected.name.split(' ').map((n: string) => n[0]).join('') : 'U'}
        </div>
        <div className="text-left">
          <p className="text-[9px] uppercase tracking-[0.15em] font-black text-gray-400 group-hover:text-primary-500 transition-colors">Aluno Selecionado</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-black text-gray-900 dark:text-white tracking-tight">{selected.name}</p>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-[9px] font-black text-primary-600 dark:text-primary-400 uppercase rounded-lg tracking-wider border border-primary-100 dark:border-primary-900/30">
              {selected.plan}
            </span>
          </div>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-300 ml-1", isOpen && "rotate-180")} />
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-2xl shadow-2xl p-2 animate-scale-in origin-top-left">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                autoFocus
                placeholder="Buscar por nome ou ID..."
                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:ring-1 focus:ring-primary-500 transition-all dark:text-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="max-h-64 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
              <p className="px-3 pt-2 pb-1 text-[9px] font-bold uppercase tracking-widest text-gray-400">Resultados</p>
              {filtered.length > 0 ? (
                filtered.map(student => (
                  <button
                    key={student.id}
                    onClick={() => handleSelect(student)}
                    className={cn(
                      "w-full flex items-center gap-3 p-2 rounded-xl transition-all group",
                      String(selected.id) === String(student.id)
                        ? "bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30" 
                        : "hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                      String(selected.id) === String(student.id)
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
                    )}>
                      {student.name ? student.name.split(' ').map((n: string) => n[0]).join('') : 'U'}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className={cn(
                        "text-xs font-bold truncate",
                        String(selected.id) === String(student.id) ? "text-primary-700 dark:text-primary-400" : "text-gray-900 dark:text-white"
                      )}>
                        {student.name}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">{student.id} · {student.plan}</p>
                    </div>
                    {String(selected.id) === String(student.id) && <Check className="w-4 h-4 text-primary-600 shrink-0" />}
                  </button>
                ))
              ) : (
                <p className="text-center py-4 text-xs text-gray-500 italic">Nenhum aluno encontrado</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
