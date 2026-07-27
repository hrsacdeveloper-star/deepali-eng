ALTER TABLE products ADD COLUMN IF NOT EXISTS price numeric;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity integer DEFAULT 0;