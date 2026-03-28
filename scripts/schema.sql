-- ============================================================
-- 提案・見積管理MVP スキーマ定義
-- 実行: psql $DATABASE_URL -f scripts/schema.sql
-- ============================================================

-- 顧客テーブル
CREATE TABLE IF NOT EXISTS customers (
  id            SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  company_name  VARCHAR(255),
  email         VARCHAR(255),
  phone         VARCHAR(50),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 案件テーブル
CREATE TABLE IF NOT EXISTS projects (
  id                  SERIAL PRIMARY KEY,
  customer_id         INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  project_name        VARCHAR(255) NOT NULL,
  project_description TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 見積テーブル
CREATE TABLE IF NOT EXISTS estimates (
  id           SERIAL PRIMARY KEY,
  project_id   INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  total_amount NUMERIC(12, 0) NOT NULL DEFAULT 0,
  status       VARCHAR(20) NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft', 'sent', 'approved', 'rejected')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 見積項目テーブル
CREATE TABLE IF NOT EXISTS estimate_items (
  id          SERIAL PRIMARY KEY,
  estimate_id INTEGER NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
  item_name   VARCHAR(255) NOT NULL,
  unit_price  NUMERIC(12, 0) NOT NULL,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  subtotal    NUMERIC(12, 0) NOT NULL,
  note        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
