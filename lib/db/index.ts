import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DB_CONNECT_STRING,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
});

export const query = async (text: string, params?: unknown[]) => {
  const res = await pool.query(text, params);
  return res;
};

export type TradeType = "BUY" | "SELL" | "SHORT" | "COVER";
export type TradeStatus = "OPEN" | "CLOSED" | "CANCELLED";

export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  name: string | null;
  profile_image_url: string | null;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface Trade {
  id: string;
  user_id: string;
  symbol: string;
  quantity: number;
  trade_type: TradeType;
  status: TradeStatus;
  entry_price: number;
  exit_price: number | null;
  stop_loss: number | null;
  target_price: number | null;
  entry_date: Date;
  exit_date: Date | null;
  gross_pnl: number;
  fees: number;
  net_pnl: number;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export default pool;
