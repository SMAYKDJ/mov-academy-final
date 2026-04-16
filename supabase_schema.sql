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

-- 4. TABELA DE PERFIS (LOGIN E CARGOS)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'professor', -- 'admin', 'recepcao', 'professor'
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Habilitar RLS para perfis
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Perfis visiveis para todos autenticados" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Proprio usuario pode editar perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger para criar perfil automaticamente no SignUp (Opcional, mas util)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'nome', new.email, COALESCE(new.raw_user_meta_data->>'role', 'professor'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

