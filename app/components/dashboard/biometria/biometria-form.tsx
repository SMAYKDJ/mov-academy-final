'use client';

import React, { useState } from 'react';
import { Scale, Ruler, Activity, Save, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/components/ui/toast';

interface BiometriaFormProps {
  open: boolean;
  onClose: () => void;
}

export function BiometriaForm({ open, onClose }: BiometriaFormProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    peso: '', altura: '', gordura: '', massaMuscular: '', idadeMetabolica: '',
    peito: '', cintura: '', quadril: '', bracoD: '', bracoE: '', coxaD: '', coxaE: '', panturrilha: '',
  });

  const imc = formData.peso && formData.altura
    ? (parseFloat(formData.peso) / Math.pow(parseFloat(formData.altura) / 100, 2)).toFixed(1)
    : '—';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Avaliação biométrica registrada com sucesso!', 'success', 'Salvo');
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white dark:bg-[#0f1117] shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-[#1e2235] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Nova Avaliação</h2>
            <p className="text-xs text-gray-400 mt-0.5">Registre os dados biométricos do aluno</p>
          </div>
          <button 
            onClick={onClose} 
            title="Fechar"
            aria-label="Fechar formulário de avaliação"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Métricas Principais */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-2">
              <Scale className="w-3.5 h-3.5" /> Medidas Principais
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { field: 'peso', label: 'Peso (kg)', placeholder: '78.5' },
                { field: 'altura', label: 'Altura (cm)', placeholder: '178' },
                { field: 'gordura', label: 'Gordura (%)', placeholder: '14.2' },
                { field: 'massaMuscular', label: 'Massa Muscular (%)', placeholder: '42.8' },
                { field: 'idadeMetabolica', label: 'Idade Metabólica', placeholder: '26' },
              ].map(input => (
                <div key={input.field}>
                  <label htmlFor={input.field} className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">
                    {input.label}
                  </label>
                  <input
                    id={input.field}
                    type="number"
                    step="0.1"
                    placeholder={input.placeholder}
                    value={formData[input.field as keyof typeof formData]}
                    onChange={(e) => handleChange(input.field, e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
              ))}
              {/* IMC Calculado Automaticamente */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">
                  IMC (calculado)
                </label>
                <div className="px-3 py-2.5 bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800/30 rounded-xl text-sm font-bold text-primary-700 dark:text-primary-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  {imc}
                </div>
              </div>
            </div>
          </div>

          {/* Circunferências */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-2">
              <Ruler className="w-3.5 h-3.5" /> Circunferências (cm)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { field: 'peito', label: 'Peito', placeholder: '102' },
                { field: 'cintura', label: 'Cintura', placeholder: '82' },
                { field: 'quadril', label: 'Quadril', placeholder: '96' },
                { field: 'bracoD', label: 'Braço Direito', placeholder: '36' },
                { field: 'bracoE', label: 'Braço Esquerdo', placeholder: '35.5' },
                { field: 'coxaD', label: 'Coxa Direita', placeholder: '58' },
                { field: 'coxaE', label: 'Coxa Esquerda', placeholder: '57.5' },
                { field: 'panturrilha', label: 'Panturrilha', placeholder: '38' },
              ].map(input => (
                <div key={input.field}>
                  <label htmlFor={input.field} className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-1.5">
                    {input.label}
                  </label>
                  <input
                    id={input.field}
                    type="number"
                    step="0.1"
                    placeholder={input.placeholder}
                    value={formData[input.field as keyof typeof formData]}
                    onChange={(e) => handleChange(input.field, e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3348] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-[#1e2235] flex gap-3">
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 py-3 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Avaliação
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 border border-gray-200 dark:border-[#2d3348] text-gray-600 dark:text-gray-400 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-[#1a1d27] transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
