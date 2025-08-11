

CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY default gen_random_uuid(),
    email VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS session (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT NOT NULL UNIQUE,
    created_at DATE DEFAULT NOW()
);