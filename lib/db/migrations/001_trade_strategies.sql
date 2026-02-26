-- Migration: move single-strategy FK to trade_strategies join table

-- 1. Create join table if it doesn't exist yet
CREATE TABLE IF NOT EXISTS trade_strategies (
    trade_id   UUID NOT NULL REFERENCES trades(id) ON DELETE CASCADE,
    strategy_id UUID NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
    PRIMARY KEY (trade_id, strategy_id)
);

-- 2. Migrate existing single-strategy values into the join table
INSERT INTO trade_strategies (trade_id, strategy_id)
SELECT id, strategy
FROM trades
WHERE strategy IS NOT NULL
ON CONFLICT DO NOTHING;

-- 3. Drop the old single-strategy column
ALTER TABLE trades DROP COLUMN IF EXISTS strategy;
