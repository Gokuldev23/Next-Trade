-- Trade Journal Database Schema
-- Production-ready PostgreSQL schema for trade management system

-- Enable UUID extension for better primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types for better data consistency
CREATE TYPE trade_type AS ENUM ('BUY', 'SELL', 'SHORT', 'COVER');

CREATE TYPE trade_status AS ENUM ('OPEN', 'CLOSED', 'CANCELLED');

CREATE TYPE portfolio_type AS ENUM ('MONTHLY', 'CUSTOM', 'ALL');

-- Users table (for multi-user support if needed)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
);

-- Strategies table for predefined trading strategies
CREATE TABLE strategies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color code for UI
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id, name)
);

-- Portfolios table for grouping trades
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    portfolio_type portfolio_type NOT NULL DEFAULT 'CUSTOM',
    month INTEGER CHECK (
        month >= 1
        AND month <= 12
    ), -- For monthly portfolios
    year INTEGER CHECK (year >= 2000), -- For monthly portfolios
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        UNIQUE (user_id, name),
        -- Ensure month/year are set for monthly portfolios
        CONSTRAINT monthly_portfolio_check CHECK (
            (
                portfolio_type = 'MONTHLY'
                AND month IS NOT NULL
                AND year IS NOT NULL
            )
            OR (portfolio_type != 'MONTHLY')
        )
);

-- Main trades table
CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE SET NULL,
    strategy_id UUID REFERENCES strategies(id) ON DELETE SET NULL,

-- Basic trade information
symbol VARCHAR(20) NOT NULL,
quantity DECIMAL(15, 4) NOT NULL CHECK (quantity > 0),
trade_type trade_type NOT NULL,
status trade_status NOT NULL DEFAULT 'OPEN',

-- Pricing information
entry_price DECIMAL(15, 4) NOT NULL CHECK (entry_price > 0),
exit_price DECIMAL(15, 4) CHECK (exit_price > 0),
stop_loss DECIMAL(15, 4) CHECK (stop_loss > 0),
target_price DECIMAL(15, 4) CHECK (target_price > 0),

-- Dates
entry_date TIMESTAMP
WITH
    TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    exit_date TIMESTAMP
WITH
    TIME ZONE,

-- Calculated fields (can be computed)
gross_pnl DECIMAL(15, 4) DEFAULT 0,
fees DECIMAL(15, 4) DEFAULT 0,
net_pnl DECIMAL(15, 4) DEFAULT 0,

-- Additional information
notes TEXT,
    tags TEXT[], -- Array of tags for flexible categorization
    broker VARCHAR(50),
    commission DECIMAL(15, 4) DEFAULT 0,

-- Metadata
created_at TIMESTAMP
WITH
    TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
WITH
    TIME ZONE DEFAULT CURRENT_TIMESTAMP,

-- Constraints
CONSTRAINT exit_data_consistency CHECK (
        (status = 'CLOSED' AND exit_price IS NOT NULL AND exit_date IS NOT NULL) OR
        (status != 'CLOSED' AND (exit_price IS NULL OR exit_date IS NULL))
    )
);

-- Trade attachments (for screenshots, charts, etc.)
CREATE TABLE trade_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    trade_id UUID NOT NULL REFERENCES trades (id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trade journal entries (detailed analysis per trade)
CREATE TABLE trade_journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    trade_id UUID NOT NULL REFERENCES trades (id) ON DELETE CASCADE,
    entry_type VARCHAR(50) NOT NULL, -- 'PRE_TRADE', 'POST_TRADE', 'REVIEW'
    title VARCHAR(200),
    content TEXT NOT NULL,
    mood_rating INTEGER CHECK (
        mood_rating >= 1
        AND mood_rating <= 5
    ),
    confidence_rating INTEGER CHECK (
        confidence_rating >= 1
        AND confidence_rating <= 5
    ),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_trades_user_id ON trades (user_id);

CREATE INDEX idx_trades_symbol ON trades (symbol);

CREATE INDEX idx_trades_entry_date ON trades (entry_date);

CREATE INDEX idx_trades_status ON trades (status);

CREATE INDEX idx_trades_portfolio_id ON trades (portfolio_id);

CREATE INDEX idx_trades_strategy_id ON trades (strategy_id);

CREATE INDEX idx_trades_symbol_entry_date ON trades (symbol, entry_date);

CREATE INDEX idx_trades_user_entry_date ON trades (user_id, entry_date);

CREATE INDEX idx_portfolios_user_id ON portfolios (user_id);

CREATE INDEX idx_portfolios_type_month_year ON portfolios (portfolio_type, month, year);

CREATE INDEX idx_strategies_user_id ON strategies (user_id);

CREATE INDEX idx_trade_attachments_trade_id ON trade_attachments (trade_id);

CREATE INDEX idx_trade_journal_entries_trade_id ON trade_journal_entries (trade_id);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_strategies_updated_at BEFORE UPDATE ON strategies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trades_updated_at BEFORE UPDATE ON trades 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trade_journal_entries_updated_at BEFORE UPDATE ON trade_journal_entries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate P&L automatically
CREATE OR REPLACE FUNCTION calculate_pnl()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.exit_price IS NOT NULL THEN
        -- Calculate gross P&L based on trade type
        CASE NEW.trade_type
            WHEN 'BUY' THEN
                NEW.gross_pnl = (NEW.exit_price - NEW.entry_price) * NEW.quantity;
            WHEN 'SELL' THEN
                NEW.gross_pnl = (NEW.exit_price - NEW.entry_price) * NEW.quantity;
            WHEN 'SHORT' THEN
                NEW.gross_pnl = (NEW.entry_price - NEW.exit_price) * NEW.quantity;
            WHEN 'COVER' THEN
                NEW.gross_pnl = (NEW.entry_price - NEW.exit_price) * NEW.quantity;
        END CASE;
        
        -- Calculate net P&L (gross - fees - commission)
        NEW.net_pnl = NEW.gross_pnl - COALESCE(NEW.fees, 0) - COALESCE(NEW.commission, 0);
        
        -- Auto-set status to CLOSED if exit_price is provided
        IF NEW.status = 'OPEN' THEN
            NEW.status = 'CLOSED';
        END IF;
        
        -- Auto-set exit_date if not provided
        IF NEW.exit_date IS NULL THEN
            NEW.exit_date = CURRENT_TIMESTAMP;
        END IF;
    ELSE
        -- Reset P&L if exit_price is removed
        NEW.gross_pnl = 0;
        NEW.net_pnl = 0;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic P&L calculation
CREATE TRIGGER calculate_trade_pnl 
    BEFORE INSERT OR UPDATE ON trades 
    FOR EACH ROW EXECUTE FUNCTION calculate_pnl();

-- Function to auto-assign trades to monthly portfolios
CREATE OR REPLACE FUNCTION auto_assign_monthly_portfolio()
RETURNS TRIGGER AS $$
DECLARE
    monthly_portfolio_id UUID;
    trade_month INTEGER;
    trade_year INTEGER;
BEGIN
    -- Extract month and year from entry_date
    trade_month = EXTRACT(MONTH FROM NEW.entry_date);
    trade_year = EXTRACT(YEAR FROM NEW.entry_date);
    
    -- If no portfolio is assigned, try to find or create monthly portfolio
    IF NEW.portfolio_id IS NULL THEN
        -- Look for existing monthly portfolio
        SELECT id INTO monthly_portfolio_id 
        FROM portfolios 
        WHERE user_id = NEW.user_id 
        AND portfolio_type = 'MONTHLY' 
        AND month = trade_month 
        AND year = trade_year 
        AND is_active = TRUE;
        
        -- Create monthly portfolio if it doesn't exist
        IF monthly_portfolio_id IS NULL THEN
            INSERT INTO portfolios (user_id, name, portfolio_type, month, year)
            VALUES (
                NEW.user_id, 
                TO_CHAR(DATE_TRUNC('MONTH', NEW.entry_date), 'Month YYYY') || ' Portfolio',
                'MONTHLY',
                trade_month,
                trade_year
            ) RETURNING id INTO monthly_portfolio_id;
        END IF;
        
        NEW.portfolio_id = monthly_portfolio_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for auto-assigning monthly portfolios
CREATE TRIGGER auto_assign_portfolio 
    BEFORE INSERT ON trades 
    FOR EACH ROW EXECUTE FUNCTION auto_assign_monthly_portfolio();

-- Create view for trade summary statistics
CREATE VIEW trade_summary_view AS
SELECT 
    t.user_id,
    t.portfolio_id,
    p.name as portfolio_name,
    t.symbol,
    t.strategy_id,
    s.name as strategy_name,
    COUNT(*) as total_trades,
    COUNT(*) FILTER (WHERE t.status = 'CLOSED' AND t.net_pnl > 0) as winning_trades,
    COUNT(*) FILTER (WHERE t.status = 'CLOSED' AND t.net_pnl < 0) as losing_trades,
    COUNT(*) FILTER (WHERE t.status = 'CLOSED' AND t.net_pnl = 0) as breakeven_trades,
    ROUND(
        (COUNT(*) FILTER (WHERE t.status = 'CLOSED' AND t.net_pnl > 0)::DECIMAL / 
         NULLIF(COUNT(*) FILTER (WHERE t.status = 'CLOSED'), 0) * 100), 2
    ) as win_rate,
    SUM(t.net_pnl) FILTER (WHERE t.status = 'CLOSED') as total_pnl,
    AVG(t.net_pnl) FILTER (WHERE t.status = 'CLOSED') as avg_pnl,
    MAX(t.net_pnl) FILTER (WHERE t.status = 'CLOSED') as best_trade,
    MIN(t.net_pnl) FILTER (WHERE t.status = 'CLOSED') as worst_trade,
    SUM(t.quantity * t.entry_price) as total_volume
FROM trades t
LEFT JOIN portfolios p ON t.portfolio_id = p.id
LEFT JOIN strategies s ON t.strategy_id = s.id
WHERE t.status != 'CANCELLED'
GROUP BY t.user_id, t.portfolio_id, p.name, t.symbol, t.strategy_id, s.name;

-- Insert default data
INSERT INTO
    users (
        username,
        email,
        password_hash,
        first_name,
        last_name
    )
VALUES (
        'demo_user',
        'demo@example.com',
        'hashed_password_here',
        'Demo',
        'User'
    );

-- Get the demo user ID for default data
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    SELECT id INTO demo_user_id FROM users WHERE username = 'demo_user';
    
    -- Insert default strategies
    INSERT INTO strategies (user_id, name, description, color) VALUES 
    (demo_user_id, 'Scalping', 'Quick trades with small profits', '#FF5733'),
    (demo_user_id, 'Swing Trading', 'Medium-term trades', '#33FF57'),
    (demo_user_id, 'Day Trading', 'Intraday trades', '#3357FF'),
    (demo_user_id, 'Breakout', 'Trading breakouts', '#FF33F1');
    
    -- Insert an "All Trades" portfolio
    INSERT INTO portfolios (user_id, name, description, portfolio_type) VALUES 
    (demo_user_id, 'All Trades', 'All trades combined', 'ALL');
END $$;