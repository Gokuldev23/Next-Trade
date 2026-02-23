"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/lib/components/ui/table";
import { Button } from "@/lib/components/ui/button";
import { ArrowUpDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Trade = {
  id: string;
  symbol: string;
  trade_type: "BUY" | "SELL" | "SHORT" | "COVER";
  status: "OPEN" | "CLOSED" | "CANCELLED";
  entry_price: number;
  exit_price?: number;
  quantity: number;
  net_pnl?: number;
  entry_date: string;
};

const columnHelper = createColumnHelper<Trade>();

const columns = [
  columnHelper.accessor("symbol", {
    header: "Symbol",
    cell: (info) => <span className="font-bold">{info.getValue()}</span>,
  }),
  columnHelper.accessor("trade_type", {
    header: "Type",
    cell: (info) => {
      const type = info.getValue();
      return (
        <span className={cn(
          "px-2 py-1 rounded-md text-xs font-medium",
          type === "BUY" || type === "COVER" 
            ? "bg-success/10 text-success border border-success/20" 
            : "bg-destructive/10 text-destructive border border-destructive/20"
        )}>
          {type}
        </span>
      );
    },
  }),
  columnHelper.accessor("entry_price", {
    header: "Entry",
    cell: (info) => `$${Number(info.getValue()).toFixed(2)}`,
  }),
  columnHelper.accessor("quantity", {
    header: "Qty",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("net_pnl", {
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Net P&L
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },
    cell: (info) => {
      const pnl = Number(info.getValue() || 0);
      return (
        <span className={cn(
          "font-medium",
          pnl > 0 ? "text-success" : pnl < 0 ? "text-destructive" : "text-muted-foreground"
        )}>
          {pnl > 0 ? "+" : ""}{pnl !== 0 ? `$${pnl.toFixed(2)}` : "-"}
        </span>
      );
    },
  }),
  columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => <span className="text-xs text-muted-foreground">{info.getValue()}</span>
  }),
  columnHelper.accessor("entry_date", {
      header: "Date",
      cell: (info) => new Date(info.getValue()).toLocaleDateString()
  })
];

export default function TradeTable({ trades }: { trades: any[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: trades,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No trades found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
