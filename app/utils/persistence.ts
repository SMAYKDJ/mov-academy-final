import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Enhanced hook to manage state persisted in Supabase with localStorage as fallback.
 */
export function useLocalStorage<T>(key: string, initialValue: T, tableName?: string) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // Try Supabase first if a table is provided
        if (tableName && process.env.NEXT_PUBLIC_SUPABASE_URL) {
          const { data, error } = await supabase.from(tableName).select('*');
          if (!error && data && data.length > 0) {
            // Map snake_case from DB to camelCase for Frontend
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

        // Fallback to localStorage
        const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error('Error loading data', error);
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
      
      // Save locally
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }

      // Sync with Supabase if applicable
      if (tableName && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        // This is a naive sync (replace all or upsert individually)
        // For a project of this scale, upserting the whole array is often okay for demo purposes
        await supabase.from(tableName).upsert(valueToStore as any);
      }
    } catch (error) {
      console.error('Error saving data', error);
    }
  };

  return [storedValue, setValue, isLoaded] as const;
}

/**
 * Utility to export data to CSV and trigger download.
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
