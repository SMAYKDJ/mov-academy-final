-- =============================================================================
-- ERP MODULES MIGRATION: Finance, Cash, Inventory, and Audit
-- =============================================================================

-- 1. ESTRUTURA FINANCEIRA (DRE & Plano de Contas)
CREATE TABLE IF NOT EXISTS finance_categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
  parent_id   UUID REFERENCES finance_categories(id), -- Para hierarquia (ex: Despesas Fixas > Aluguel)
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CONTROLE DE CAIXA (PDV)
CREATE TABLE IF NOT EXISTS cash_sessions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL, -- Referência ao admin/recepcionista
  opening_time  TIMESTAMPTZ DEFAULT NOW(),
  closing_time  TIMESTAMPTZ,
  opening_balance DECIMAL(12, 2) NOT NULL,
  closing_balance DECIMAL(12, 2),
  status        TEXT DEFAULT 'aberto' CHECK (status IN ('aberto', 'fechado')),
  notes         TEXT
);

CREATE TABLE IF NOT EXISTS cash_transactions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id      UUID REFERENCES cash_sessions(id) ON DELETE CASCADE,
  type            TEXT NOT NULL CHECK (type IN ('entrada', 'saida', 'sangria', 'reforco')),
  amount          DECIMAL(12, 2) NOT NULL,
  description     TEXT,
  payment_method  TEXT CHECK (payment_method IN ('dinheiro', 'cartao', 'pix')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ESTOQUE & SUPRIMENTOS
CREATE TABLE IF NOT EXISTS suppliers (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  cnpj        TEXT UNIQUE,
  contact     TEXT,
  email       TEXT,
  category    TEXT -- ex: Limpeza, Equipamentos, Suplementos
);

CREATE TABLE IF NOT EXISTS products (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT NOT NULL,
  sku             TEXT UNIQUE,
  category        TEXT,
  min_stock       INTEGER DEFAULT 0,
  current_stock   INTEGER DEFAULT 0,
  unit_price      DECIMAL(12, 2),
  supplier_id     UUID REFERENCES suppliers(id)
);

CREATE TABLE IF NOT EXISTS inventory_movements (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id      UUID REFERENCES products(id),
  type            TEXT CHECK (type IN ('entrada', 'saida', 'ajuste')),
  quantity        INTEGER NOT NULL,
  reason          TEXT, -- ex: Compra, Consumo Interno, Perda
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LOG DE AUDITORIA (Rastreabilidade Total)
CREATE TABLE IF NOT EXISTS audit_logs (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID, -- Quem fez
  action        TEXT NOT NULL, -- ex: 'DELETE_STUDENT', 'UPDATE_PAYMENT'
  table_name    TEXT,
  record_id     TEXT,
  old_data      JSONB, -- Snapshot antes
  new_data      JSONB, -- Snapshot depois
  ip_address    TEXT,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory_movements(product_id);
