export type TradeWithJoins = {
	id: string;
	symbol: string;
	quantity: number;
	trade_type: "BUY" | "SELL";
	status: "OPEN" | "CLOSED" | "CANCELLED";

	entry_price: number;
	exit_price: number | null;
	stop_loss: number | null;
	target_price: number | null;

	entry_date: string;
	exit_date: string | null;

	gross_pnl: number; // comes from DB default 0
	fees: number; // default 0
	net_pnl: number; // default 0

	notes: string | null;
	tags: string[] | null;
	broker: string | null;
	commission: number;

	strategy_id: string | null;
	portfolio_id: string | null;

	strategy_name: string | null;
	portfolio_name: string | null;

	created_at: string;
	updated_at: string;
};
