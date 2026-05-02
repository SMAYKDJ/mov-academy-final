'use client';

import React, { useState, useMemo } from 'react';
import { X, Save, AlertCircle, Search, User } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Transaction, TransactionType, TransactionStatus, PaymentMethod, RevenueCategory, ExpenseCategory } from '@/types/financeiro';
import { useAlunos } from '@/hooks/use-alunos';

interface TransactionFormProps {
  open: boolean;
  transaction?: Transaction | null;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function TransactionForm({ open, transaction, onClose, onSave }: TransactionFormProps) {
  // Dados reais via Hook
  const { alunos } = useAlunos();

  const [formData, setFormData] = useState({
    tipo: 'receita' as TransactionType,
    descricao: '',
    valor: '',
    categoria: 'mensalidade',
    metodo: 'pix' as PaymentMethod,
    status: 'pago' as TransactionStatus,
    vencimento: new Date().toLocaleDateString('pt-BR'),
    alunoNome: '',
    alunoId: undefined as number | undefined,
  });

  const [studentSearch, setStudentSearch] = useState('');
  const [showStudentList, setShowStudentList] = useState(false);

  // Formatação de moeda (BRL)
  const formatCurrency = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    const numberValue = (Number(cleanValue) / 100).toLocaleString('pt-BR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return numberValue;
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setFormData(prev => ({ ...prev, valor: formatted }));
  };

  // Filtragem de alunos (usando dados reais)
  const filteredStudents = useMemo(() => {
    if (!studentSearch) return [];
    return (alunos || []).filter(s => 
      s.nome.toLowerCase().includes(studentSearch.toLowerCase())
    ).slice(0, 5);
  }, [studentSearch, alunos]);

  // Carregar dados ao editar
  React.useEffect(() => {
    if (transaction) {
      setFormData({
        tipo: transaction.tipo,
        descricao: transaction.descricao,
        valor: transaction.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
        categoria: transaction.categoria,
        metodo: transaction.metodo,
        status: transaction.status,
        vencimento: transaction.vencimento || new Date().toLocaleDateString('pt-BR'),
        alunoNome: transaction.alunoNome || '',
        alunoId: transaction.alunoId,
      });
    } else {
      setFormData({
        tipo: 'receita',
        descricao: '',
        valor: '',
        categoria: 'mensalidade',
        metodo: 'pix',
        status: 'pago',
        vencimento: new Date().toLocaleDateString('pt-BR'),
        alunoNome: '',
        alunoId: undefined,
      });
    }
    setStudentSearch('');
    setShowStudentList(false);
  }, [transaction, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericValue = parseFloat(formData.valor.replace(/\./g, '').replace(',', '.'));
    
    onSave({
      ...formData,
      valor: numericValue,
      data: transaction?.data || new Date().toLocaleDateString('pt-BR'),
      id: transaction?.id || `txn-${Math.random().toString(36).substr(2, 9)}`,
      recorrente: transaction?.recorrente || false
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white dark:bg-[#0f1117] rounded-2xl shadow-2xl border border-gray-100 dark:border-[#1e2235] overflow-hidden animate-scale-in">
        <div className="p-6 border-b border-gray-100 dark:border-[#1e2235] flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {transaction ? 'Editar Transação' : 'Nova Transação'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Tipo</label>
            <div className="grid grid-cols-2 gap-2">
              {(['receita', 'despesa'] as TransactionType[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tipo: t, categoria: t === 'receita' ? 'mensalidade' : 'aluguel' }))}
                  className={cn(
                    "py-2 rounded-xl text-xs font-bold border transition-all",
                    formData.tipo === t 
                      ? "bg-primary-600 border-primary-600 text-white" 
                      : "border-gray-200 dark:border-[#2d3348] text-gray-500"
                  )}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {/* Campo Aluno (se for Receita) */}
            {formData.tipo === 'receita' && (
              <div className="relative">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <User className="w-3 h-3" />
                  Vincular Aluno
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Digite o nome do aluno..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#1e2235] text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    value={studentSearch || formData.alunoNome}
                    onChange={(e) => {
                      setStudentSearch(e.target.value);
                      setShowStudentList(true);
                    }}
                    onFocus={() => setShowStudentList(true)}
                  />
                  {showStudentList && filteredStudents.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1a1d27] border border-gray-100 dark:border-[#2d3348] rounded-xl shadow-xl overflow-hidden animate-slide-up">
                      {filteredStudents.map(student => (
                        <button
                          key={student.id}
                          type="button"
                          className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between border-b last:border-0 border-gray-100 dark:border-[#2d3348]"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, alunoNome: student.nome, alunoId: student.id }));
                            setStudentSearch('');
                            setShowStudentList(false);
                          }}
                        >
                          <span className="font-semibold text-gray-900 dark:text-white">{student.nome}</span>
                          <span className="text-[10px] text-gray-400 uppercase font-bold">{student.plano}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <input
              required
              placeholder="Descrição (ex: Mensalidade João)"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#1e2235] text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              value={formData.descricao}
              onChange={e => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
            />
            
            <div className="grid grid-cols-2 gap-4">
               <input
                required
                type="text"
                placeholder="Valor (R$)"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#1e2235] text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.valor}
                onChange={handleValueChange}
              />
              <select
                aria-label="Plano de Contas"
                title="Plano de Contas"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#1e2235] text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.categoria}
                onChange={e => setFormData(prev => ({ ...prev, categoria: e.target.value as any }))}
              >
                {formData.tipo === 'receita' ? (
                  <>
                    <option value="mensalidade">Mensalidade</option>
                    <option value="matricula">Matrícula</option>
                    <option value="personal">Personal Trainer</option>
                    <option value="avulso">Aula Avulsa</option>
                    <option value="produto">Venda de Produtos</option>
                    <option value="evento">Eventos / Workshops</option>
                  </>
                ) : (
                  <>
                    <option value="aluguel">Aluguel / IPTU</option>
                    <option value="salario">Salários / Comissões</option>
                    <option value="agua_luz">Água / Luz / Internet</option>
                    <option value="marketing">Marketing / Social Media</option>
                    <option value="manutencao">Manutenção Geral</option>
                    <option value="equipamento">Equipamentos / Insumos</option>
                    <option value="sistema">Sistemas / Software</option>
                    <option value="outros">Outros Diversos</option>
                  </>
                )}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select
                aria-label="Método de pagamento"
                title="Método"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#1e2235] text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.metodo}
                onChange={e => setFormData(prev => ({ ...prev, metodo: e.target.value as PaymentMethod }))}
              >
                <option value="pix">PIX</option>
                <option value="cartao">Cartão</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="boleto">Boleto</option>
                <option value="debito">Débito</option>
              </select>

              <select
                aria-label="Status da transação"
                title="Status"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#1e2235] text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.status}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as TransactionStatus }))}
              >
                <option value="pago">Pago</option>
                <option value="pendente">Pendente</option>
                <option value="atrasado">Atrasado</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-primary-600 text-white rounded-xl text-sm font-bold shadow-xl shadow-primary-200 dark:shadow-none hover:bg-primary-700 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Save className="w-4 h-4" />
            Salvar Transação
          </button>
        </form>
      </div>
    </div>
  );
}
