export type StrategyRef = {
  id: string;
  name: string;
  color: string;
};

export type TradeWithJoins = {
  id: string;
  user_id: string;
  symbol: string;
  quantity: number;
  trade_type: "BUY" | "SELL" | "SHORT" | "COVER";
  status: "OPEN" | "CLOSED" | "CANCELLED";

  entry_price: number;
  exit_price: number | null;
  stop_loss: number | null;
  target_price: number | null;

  entry_date: string;
  exit_date: string | null;

  gross_pnl: number;
  fees: number;
  net_pnl: number;

  notes: string | null;
  strategies: StrategyRef[];

  created_at: string;
  updated_at: string;
};

export type Strategy = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
};
