-- Trade Journal Database Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE trade_type AS ENUM ('BUY', 'SELL', 'SHORT', 'COVER');
CREATE TYPE trade_status AS ENUM ('OPEN', 'CLOSED', 'CANCELLED');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    quantity DECIMAL(15, 4) NOT NULL CHECK (quantity > 0),
    trade_type trade_type NOT NULL,
    status trade_status NOT NULL DEFAULT 'OPEN',
    entry_price DECIMAL(15, 4) NOT NULL CHECK (entry_price > 0),
    exit_price DECIMAL(15, 4) CHECK (exit_price > 0),
    stop_loss DECIMAL(15, 4) CHECK (stop_loss > 0),
    target_price DECIMAL(15, 4) CHECK (target_price > 0),
    entry_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    exit_date TIMESTAMP WITH TIME ZONE,
    gross_pnl DECIMAL(15, 4) DEFAULT 0,
    fees DECIMAL(15, 4) DEFAULT 0,
    net_pnl DECIMAL(15, 4) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trades_user_id ON trades (user_id);
CREATE INDEX idx_trades_symbol ON trades (symbol);
CREATE INDEX idx_trades_entry_date ON trades (entry_date);
CREATE INDEX idx_trades_status ON trades (status);

CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trades_updated_at BEFORE UPDATE ON trades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
