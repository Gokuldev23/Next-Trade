import type { TradeWithJoins } from "@/lib/types/trade.type";

const CSV_COLUMNS = [
	"symbol",
	"trade_type",
	"status",
	"quantity",
	"entry_price",
	"exit_price",
	"stop_loss",
	"target_price",
	"entry_date",
	"exit_date",
	"gross_pnl",
	"fees",
	"net_pnl",
	"strategies",
	"notes",
] as const;

type CsvColumn = (typeof CSV_COLUMNS)[number];

const CSV_HEADERS: Record<CsvColumn, string> = {
	symbol: "Symbol",
	trade_type: "Type",
	status: "Status",
	quantity: "Quantity",
	entry_price: "Entry Price",
	exit_price: "Exit Price",
	stop_loss: "Stop Loss",
	target_price: "Target Price",
	entry_date: "Entry Date",
	exit_date: "Exit Date",
	gross_pnl: "Gross P&L",
	fees: "Fees",
	net_pnl: "Net P&L",
	strategies: "Strategies",
	notes: "Notes",
};

function escapeCSVCell(value: unknown): string {
	if (value === null || value === undefined) return "";
	const str = String(value);
	if (str.includes(",") || str.includes('"') || str.includes("\n")) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

function getCellValue(trade: TradeWithJoins, col: CsvColumn): unknown {
	if (col === "strategies") {
		return trade.strategies.map((s) => s.name).join("; ") || null;
	}
	return trade[col];
}

export function tradesToCSV(trades: TradeWithJoins[]): string {
	const header = CSV_COLUMNS.map((col) => CSV_HEADERS[col]).join(",");
	const rows = trades.map((trade) =>
		CSV_COLUMNS.map((col) => escapeCSVCell(getCellValue(trade, col))).join(","),
	);
	return [header, ...rows].join("\n");
}

export function tradesToJSON(trades: TradeWithJoins[]): string {
	const data = trades.map((trade) => {
		const row: Partial<Record<string, unknown>> = {};
		for (const col of CSV_COLUMNS) {
			row[col] = col === "strategies"
				? trade.strategies.map((s) => ({ id: s.id, name: s.name, color: s.color }))
				: (trade[col] ?? null);
		}
		return row;
	});
	return JSON.stringify(data, null, 2);
}

export function downloadFile(
	content: string,
	filename: string,
	mimeType: string,
): void {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

export function exportTrades(
	trades: TradeWithJoins[],
	format: "csv" | "json",
): void {
	const timestamp = new Date().toISOString().slice(0, 10);
	if (format === "csv") {
		downloadFile(tradesToCSV(trades), `trades-${timestamp}.csv`, "text/csv");
	} else {
		downloadFile(
			tradesToJSON(trades),
			`trades-${timestamp}.json`,
			"application/json",
		);
	}
}
