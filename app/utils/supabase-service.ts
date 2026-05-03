import { supabase } from '@/lib/supabase';

/**
 * Serviço para interagir com as tabelas do Supabase.
 */

export const SupabaseService = {
  // --- ALUNOS ---
  async getAlunos() {
    const { data, error } = await supabase
      .from('alunos')
      .select('*')
      .order('nome', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async upsertAluno(aluno: any) {
    const { data, error } = await supabase
      .from('alunos')
      .upsert(aluno)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async inactivateAluno(id: number) {
    const { error } = await supabase
      .from('alunos')
      .update({ status: 'inativo' })
      .eq('id', id);
    
    if (error) throw error;
  },

  async anonymizeAluno(id: number) {
    const { error } = await supabase
      .from('alunos')
      .update({ 
        nome: 'ALUNO ANONIMIZADO (LGPD)', 
        telefone: '00000000000',
        email: `anonimo_${id}@moviment.academy`,
        foto_url: null,
        biometry_id: null,
        status: 'inativo'
      })
      .eq('id', id);
    
    if (error) throw error;
  },

  // --- TRANSAÇÕES ---
  async getTransacoes() {
    const { data, error } = await supabase
      .from('transacoes')
      .select('*')
      .order('data', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async upsertTransacao(txn: any) {
    const { data, error } = await supabase
      .from('transacoes')
      .upsert(txn)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async cancelTransacao(id: string) {
    const { error } = await supabase
      .from('transacoes')
      .update({ status: 'cancelado' })
      .eq('id', id);
    
    if (error) throw error;
  }
};
