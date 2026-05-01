import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Hook aprimorado para gerenciar o estado persistido no Supabase com localStorage como fallback.
 */
export function useLocalStorage<T>(key: string, initialValue: T, tableName?: string) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // Tentar o Supabase primeiro se uma tabela for fornecida
        if (tableName && process.env.NEXT_PUBLIC_SUPABASE_URL) {
          const { data, error } = await supabase.from(tableName).select('*');
          if (!error && data && data.length > 0) {
            // Mapear snake_case do Banco de Dados para camelCase para o Frontend
            const mappedData = data.map((item: any) => {
              if (tableName === 'alunos') {
                return {
                  ...item,
                  ultimoPagamento: item.ultimo_pagamento || item.ultimoPagamento,
                  dataMatricula: item.data_matricula || item.dataMatricula,
                  dataNascimento: item.data_nascimento || item.dataNascimento,
                  historicoPagamentos: item.historico_pagamentos || item.historicoPagamentos || [],
                  endereco: item.endereco || 'Não informado',
                  objetivo: item.objetivo || 'Treino geral',
                };
              }
              return item;
            });
            setStoredValue(mappedData as any);
            setIsLoaded(true);
            return;
          }
        }

        // Fallback para localStorage
        const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error('Erro ao carregar dados', error);
      } finally {
        setIsLoaded(true);
      }
    }
    loadData();
  }, [key, tableName]);

  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // Salvar localmente
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }

      // Sincronizar com o Supabase se aplicável
      if (tableName && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        // Esta é uma sincronização simples (substituir tudo ou fazer upsert individualmente)
        // Para um projeto desta escala, fazer upsert de todo o array geralmente é aceitável para demonstração
        await supabase.from(tableName).upsert(valueToStore as any);
      }
    } catch (error) {
      console.error('Erro ao salvar dados', error);
    }
  };

  return [storedValue, setValue, isLoaded] as const;
}

/**
 * Utilitário para exportar dados para CSV e disparar o download.
 */
export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const cell = row[header] === null || row[header] === undefined ? '' : row[header];
      return `"${String(cell).replace(/"/g, '""')}"`;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
