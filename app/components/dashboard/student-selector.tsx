'use client';

import React, { useState } from 'react';
import { Search, User, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Student {
  id: string;
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
  selectedId?: string;
}

export function StudentSelector({ onSelect, selectedId }: StudentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selected = mockStudents.find(s => s.id === selectedId) || mockStudents[0];

  const filtered = mockStudents.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (student: Student) => {
    if (onSelect) onSelect(student);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative z-[50]">
      {/* Selector Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pl-3 pr-4 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2235] rounded-2xl hover:border-primary-400 dark:hover:border-primary-900/50 transition-all group"
      >
        <div className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xs">
          {selected.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 group-hover:text-primary-500 transition-colors">Visualizando Aluno</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-gray-900 dark:text-white">{selected.name}</p>
            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/5 text-[9px] font-bold text-gray-500 uppercase rounded tracking-tighter italic">
              {selected.plan}
            </span>
          </div>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown Menu */}
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
                      selected.id === student.id 
                        ? "bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30" 
                        : "hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                      selected.id === student.id
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
                    )}>
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className={cn(
                        "text-xs font-bold truncate",
                        selected.id === student.id ? "text-primary-700 dark:text-primary-400" : "text-gray-900 dark:text-white"
                      )}>
                        {student.name}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">{student.id} · {student.plan}</p>
                    </div>
                    {selected.id === student.id && <Check className="w-4 h-4 text-primary-600 shrink-0" />}
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
