-- ========================================
-- Supabase Migration: churn_predictions
-- ========================================
-- Stores ML-predicted churn probabilities
-- for each student, updated daily.
-- 
-- Risk Classification:
--   Alto:  > 70%
--   Médio: 40–70%
--   Baixo: < 40%
-- ========================================

CREATE TABLE IF NOT EXISTS churn_predictions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id    TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  probability   DECIMAL(5, 4) NOT NULL CHECK (probability >= 0 AND probability <= 1),
  risk_level    TEXT NOT NULL CHECK (risk_level IN ('alto', 'medio', 'baixo')),
  
  -- Feature snapshot at prediction time
  weekly_frequency      INTEGER,
  days_since_last_visit INTEGER,
  overdue_payments      BOOLEAN DEFAULT FALSE,
  enrollment_months     INTEGER,
  
  -- Metadata
  model_version   TEXT DEFAULT '1.0.0',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one prediction per student (upsert on refresh)
  CONSTRAINT unique_student_prediction UNIQUE (student_id)
);

-- Index for fast risk-level queries
CREATE INDEX IF NOT EXISTS idx_churn_risk_level ON churn_predictions(risk_level);
CREATE INDEX IF NOT EXISTS idx_churn_probability ON churn_predictions(probability DESC);
CREATE INDEX IF NOT EXISTS idx_churn_updated ON churn_predictions(updated_at DESC);

-- Row-Level Security (Admin & Gerente only)
ALTER TABLE churn_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and managers can view churn predictions"
  ON churn_predictions
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' IN ('admin', 'gerente')
  );

CREATE POLICY "Only system can insert/update predictions"
  ON churn_predictions
  FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- ========================================
-- Churn History (for trend tracking)
-- ========================================
CREATE TABLE IF NOT EXISTS churn_history (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month       DATE NOT NULL,
  churn_rate  DECIMAL(5, 2) NOT NULL,
  total_students   INTEGER NOT NULL,
  churned_students INTEGER NOT NULL,
  alto_count  INTEGER DEFAULT 0,
  medio_count INTEGER DEFAULT 0,
  baixo_count INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_month UNIQUE (month)
);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_churn_updated_at
  BEFORE UPDATE ON churn_predictions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ========================================
-- Sample seed data for churn_history
-- ========================================
INSERT INTO churn_history (month, churn_rate, total_students, churned_students, alto_count, medio_count, baixo_count)
VALUES
  ('2025-11-01', 4.2, 2650, 111, 45, 89, 2516),
  ('2025-12-01', 3.8, 2700, 103, 38, 82, 2580),
  ('2026-01-01', 5.1, 2720, 139, 52, 95, 2573),
  ('2026-02-01', 3.5, 2780, 97, 35, 78, 2667),
  ('2026-03-01', 2.9, 2810, 81, 28, 72, 2710),
  ('2026-04-01', 2.4, 2840, 68, 22, 65, 2753)
ON CONFLICT (month) DO NOTHING;
