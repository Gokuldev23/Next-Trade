import type { ColumnDef } from "@tanstack/react-table";
import type { TradeWithJoins } from "@/lib/types/trade.type";
import { Checkbox } from "../ui/checkbox";

export const tradeColumns: ColumnDef<TradeWithJoins>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},

	{
		accessorKey: "symbol",
		header: "Symbol",
		cell: ({ row }) => row.original.symbol,
	},
	{
		accessorKey: "trade_type",
		header: "Type",
	},
	{
		accessorKey: "quantity",
		header: "Qty",
	},
	{
		accessorKey: "entry_price",
		header: "Entry",
	},
	{
		accessorKey: "exit_price",
		header: "Exit",
		cell: ({ row }) => row.original.exit_price ?? "-",
	},
	{
		accessorKey: "net_pnl",
		header: "PnL",
		cell: ({ row }) => {
			const v = row.original.net_pnl;
			return (
				<span
					className={
						v > 0 ? "text-green-600" : v < 0 ? "text-red-600" : "text-gray-600"
					}
				>
					{v}
				</span>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Status",
	},
	{
		accessorKey: "entry_date",
		header: "Entry Date",
		cell: ({ row }) => new Date(row.original.entry_date).toLocaleDateString(),
	},
	{
		accessorKey: "exit_date",
		header: "Exit Date",
		cell: ({ row }) =>
			row.original.exit_date
				? new Date(row.original.exit_date).toLocaleDateString()
				: "-",
	},
];
