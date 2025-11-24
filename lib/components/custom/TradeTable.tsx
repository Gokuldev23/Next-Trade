"use client";

import type { TradeWithJoins } from "@/lib/types/trade.type";
import { DataTable } from "./DataTable";
import { tradeColumns } from "./TableColumns";

export default function TradeTable({ trades }: { trades: TradeWithJoins[] }) {
	return <DataTable columns={tradeColumns} data={trades} />;
}
