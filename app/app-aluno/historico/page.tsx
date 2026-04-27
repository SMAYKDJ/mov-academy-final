'use client';

import React from 'react';
import { History, Calendar, Dumbbell, ArrowLeft, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const history = [
    { id: 1, type: 'treino', title: 'Treino A - Superiores', date: 'Hoje, 09:30', duration: '55min', calories: '320 kcal' },
    { id: 2, type: 'treino', title: 'Treino B - Inferiores', date: 'Ontem, 18:15', duration: '62min', calories: '410 kcal' },
    { id: 3, type: 'avaliacao', title: 'Avaliação Biométrica', date: '15 Abr, 10:00', result: '-2kg Gordura', important: true },
    { id: 4, type: 'treino', title: 'Treino C - Cardio', date: '14 Abr, 07:00', duration: '45min', calories: '500 kcal' },
    { id: 5, type: 'treino', title: 'Treino A - Superiores', date: '12 Abr, 19:00', duration: '50min', calories: '300 kcal' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center gap-4">
        <Link href="/app-aluno" className="p-2 bg-white dark:bg-[#0f1117] rounded-xl border border-gray-100 dark:border-[#1e2235] text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <section>
          <h2 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-0.5">Atividade</h2>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Meu Histórico</h1>
        </section>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-primary-600 rounded-3xl p-5 text-white shadow-lg shadow-primary-200 dark:shadow-none">
          <TrendingUp className="w-6 h-6 mb-3 opacity-60" />
          <p className="text-3xl font-black">24</p>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Treinos no mês</p>
        </div>
        <div className="bg-white dark:bg-[#0f1117] rounded-3xl p-5 border border-gray-100 dark:border-[#1e2235]">
          <Calendar className="w-6 h-6 mb-3 text-primary-600" />
          <p className="text-3xl font-black text-gray-900 dark:text-white">92%</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Frequência</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Atividades Recentes</h3>
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="bg-white dark:bg-[#0f1117] p-4 rounded-2xl border border-gray-100 dark:border-[#1e2235] flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                item.type === 'treino' ? 'bg-primary-50 text-primary-600' : 'bg-amber-50 text-amber-600'
              } dark:bg-opacity-10`}>
                {item.type === 'treino' ? <Dumbbell className="w-6 h-6" /> : <History className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.title}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-400 font-medium">{item.date}</span>
                  {item.duration && (
                    <>
                      <span className="w-1 h-1 bg-gray-200 rounded-full" />
                      <span className="text-[10px] text-gray-400 font-medium">{item.duration}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-black ${item.important ? 'text-amber-600' : 'text-gray-900 dark:text-white'}`}>
                  {item.calories || item.result}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full py-4 bg-gray-100 dark:bg-[#12141c] text-gray-500 dark:text-gray-400 rounded-2xl text-xs font-bold uppercase tracking-widest">
        Carregar mais atividades
      </button>
    </div>
  );
}
