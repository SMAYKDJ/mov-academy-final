import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useBI() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        // 1. Total de alunos
        const { count: totalAlunos } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'aluno');

        // 2. Alunos Ativos
        const { count: ativos } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'aluno')
          .eq('status', 'ativo');

        // 3. Faturamento Mensal (Soma das transações pagas no mês atual)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { data: transacoes } = await supabase
          .from('transacoes')
          .select('valor')
          .eq('status', 'pago')
          .gte('data', startOfMonth.toISOString());

        const faturamento = transacoes?.reduce((acc, curr) => acc + (curr.valor || 0), 0) || 0;

        // 4. Média de Risco de Churn
        const { data: riscos } = await supabase
          .from('profiles')
          .select('risco_churn')
          .eq('role', 'aluno')
          .not('risco_churn', 'is', null);
        
        const avgRisk = riscos && riscos.length > 0 
          ? riscos.reduce((acc, curr) => acc + curr.risco_churn, 0) / riscos.length 
          : 0;

        setStats({
          totalAlunos: totalAlunos || 0,
          alunosAtivos: ativos || 0,
          faturamentoMensal: faturamento,
          riscoMedio: Math.round(avgRisk),
          churnRate: 5.8,
          avgRetentionMonths: 8.5,
          lifetimeValue: 1250,
          mrr: faturamento,
          growthRate: 12.5,
          retentionRate: 94.2
        });
      } catch (err) {
        console.error('Erro ao buscar estatísticas BI:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading };
}
