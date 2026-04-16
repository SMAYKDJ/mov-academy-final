-- EXECUTAR NO SQL EDITOR DO SUPABASE PARA CRIAR AS TABELAS

-- 1. TABELA DE ALUNOS
CREATE TABLE IF NOT EXISTS public.alunos (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    cpf TEXT,
    telefone TEXT,
    data_nascimento TEXT,
    endereco TEXT,
    plano TEXT DEFAULT 'Basic Fit',
    status TEXT DEFAULT 'em_dia',
    data_matricula TEXT DEFAULT CURRENT_DATE,
    ultimo_pagamento TEXT,
    risco INTEGER DEFAULT 0,
    frequencia INTEGER DEFAULT 0,
    biometria_facial FLOAT8[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. TABELA DE TRANSAÇÕES FINANCEIRAS
CREATE TABLE IF NOT EXISTS public.transacoes (
    id TEXT PRIMARY KEY,
    tipo TEXT NOT NULL, -- 'receita' ou 'despesa'
    descricao TEXT NOT NULL,
    categoria TEXT,
    valor DECIMAL(10,2) NOT NULL,
    data TEXT NOT NULL,
    vencimento TEXT,
    status TEXT NOT NULL, -- 'pago', 'pendente', 'atrasado', 'cancelado'
    metodo TEXT, -- 'pix', 'cartao', 'boleto', 'dinheiro', 'debito'
    aluno_id INTEGER REFERENCES public.alunos(id) ON DELETE SET NULL,
    aluno_nome TEXT,
    recorrente BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. TABELA DE PLANOS DE TREINO (Opcional, mas recomendado)
CREATE TABLE IF NOT EXISTS public.treinos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    tipo TEXT, -- 'A', 'B', 'C', 'D'
    objetivo TEXT,
    dias_semana TEXT[],
    tempo_estimado TEXT,
    nivel TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    aluno_id INTEGER REFERENCES public.alunos(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. HABILITAR RLS (Segurança) - Opcional para fins acadêmicos se as chaves forem anon
-- ALTER TABLE public.alunos ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Permitir leitura geral" ON public.alunos FOR SELECT USING (true);
-- CREATE POLICY "Permitir escrita geral" ON public.alunos FOR INSERT WITH CHECK (true);
