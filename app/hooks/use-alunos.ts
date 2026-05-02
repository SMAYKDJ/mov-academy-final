import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/toast';
import type { Aluno, AlunoFormData } from '@/types/aluno';

export function useAlunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchAlunos = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'aluno')
        .order('nome', { ascending: true });

      if (error) throw error;
      
      // Mapear dados do banco para o tipo Aluno do frontend
      const mapped: Aluno[] = (data || []).map(p => ({
        id: p.id,
        nome: p.nome || p.full_name || 'Sem Nome',
        email: p.email || '',
        cpf: p.cpf || '',
        telefone: p.telefone || '',
        plano: p.plano || 'Mensal',
        status: p.status || 'ativo',
        dataMatricula: p.created_at ? new Date(p.created_at).toLocaleDateString('pt-BR') : '',
        ultimoPagamento: p.ultimo_pagamento || '',
        risco: p.risco_churn || 0,
        frequencia: p.frequencia_semanal || 0,
        historicoPagamentos: [] // Buscaríamos de outra tabela se necessário
      }));

      setAlunos(mapped);
    } catch (err: any) {
      console.error('Erro ao buscar alunos:', err);
      showToast('Falha ao carregar alunos do banco de dados.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAlunos();
  }, [fetchAlunos]);

  const saveAluno = async (data: AlunoFormData, id?: string | number) => {
    try {
      if (id) {
        const { error } = await supabase
          .from('profiles')
          .update({
            nome: data.nome,
            cpf: data.cpf,
            telefone: data.telefone,
            email: data.email,
            plano: data.plano,
            status: data.status,
            biometry_id: data.biometry_id
          })
          .eq('id', id);
        if (error) throw error;
        showToast('Aluno atualizado com sucesso!', 'success');
      } else {
        // Para novos alunos, o ideal é usar auth.signUp, mas aqui podemos apenas inserir o perfil
        // dependendo de como o sistema gerencia convites.
        const { error } = await supabase
          .from('profiles')
          .insert([{
            ...data,
            role: 'aluno'
          }]);
        if (error) throw error;
        showToast('Aluno cadastrado com sucesso!', 'success');
      }
      fetchAlunos();
      return true;
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar aluno.', 'error');
      return false;
    }
  };

  const inactivateAluno = async (id: string | number) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'inativo' })
        .eq('id', id);

      if (error) throw error;
      showToast('O aluno foi inativado com sucesso. Dados preservados.', 'success');
      fetchAlunos();
      return true;
    } catch (err: any) {
      showToast('Erro ao inativar aluno.', 'error');
      return false;
    }
  };

  return { alunos, loading, fetchAlunos, saveAluno, inactivateAluno };
}
