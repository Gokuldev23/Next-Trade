import {
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Percent,
  TrendingUp,
  BarChart2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/lib/components/ui/card";
import { getTrades } from "@/lib/actions/trade.action";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function fmt(value: number): string {
  const abs = Math.abs(value);
  const sign = value >= 0 ? "+" : "-";
  return `${sign}$${abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function AnalyticsPage() {
  const trades = await getTrades();

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const closedTrades = trades.filter((t) => t.status === "CLOSED");
  const openTrades = trades.filter((t) => t.status === "OPEN");

  // All-time net PnL
  const totalNetPnl = closedTrades.reduce(
    (sum, t) => sum + Number(t.net_pnl),
    0,
  );

  // This month / last month PnL
  const thisMonthClosed = closedTrades.filter(
    (t) => new Date(t.entry_date) >= thisMonthStart,
  );
  const lastMonthClosed = closedTrades.filter((t) => {
    const d = new Date(t.entry_date);
    return d >= lastMonthStart && d <= lastMonthEnd;
  });
  const thisMonthPnl = thisMonthClosed.reduce(
    (sum, t) => sum + Number(t.net_pnl),
    0,
  );
  const lastMonthPnl = lastMonthClosed.reduce(
    (sum, t) => sum + Number(t.net_pnl),
    0,
  );
  const pnlDelta = lastMonthPnl !== 0 ? ((thisMonthPnl - lastMonthPnl) / Math.abs(lastMonthPnl)) * 100 : null;

  // Win rate (all time, closed trades only)
  const winners = closedTrades.filter((t) => Number(t.net_pnl) > 0);
  const winRate =
    closedTrades.length > 0
      ? (winners.length / closedTrades.length) * 100
      : 0;

  // Win rate delta vs last month
  const lastMonthWinners = lastMonthClosed.filter((t) => Number(t.net_pnl) > 0);
  const lastMonthWinRate =
    lastMonthClosed.length > 0
      ? (lastMonthWinners.length / lastMonthClosed.length) * 100
      : null;
  const winRateDelta =
    lastMonthWinRate !== null ? winRate - lastMonthWinRate : null;

  // Active trades breakdown
  const longOpen = openTrades.filter(
    (t) => t.trade_type === "BUY" || t.trade_type === "COVER",
  );
  const shortOpen = openTrades.filter(
    (t) => t.trade_type === "SELL" || t.trade_type === "SHORT",
  );

  // Avg win / avg loss
  const losers = closedTrades.filter((t) => Number(t.net_pnl) < 0);
  const avgWin =
    winners.length > 0
      ? winners.reduce((s, t) => s + Number(t.net_pnl), 0) / winners.length
      : 0;
  const avgLoss =
    losers.length > 0
      ? losers.reduce((s, t) => s + Number(t.net_pnl), 0) / losers.length
      : 0;

  // Recent 5 trades
  const recentTrades = trades.slice(0, 5);

  // This month trade count
  const thisMonthAll = trades.filter(
    (t) => new Date(t.entry_date) >= thisMonthStart,
  );

  return (
    <div className="space-y-6">
      {/* ── KPI Cards ─────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Net P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${totalNetPnl >= 0 ? "text-success" : "text-destructive"}`}
            >
              {fmt(totalNetPnl)}
            </div>
            {pnlDelta !== null ? (
              <p className="text-xs text-muted-foreground">
                <span
                  className={`font-medium inline-flex items-center ${pnlDelta >= 0 ? "text-success" : "text-destructive"}`}
                >
                  {pnlDelta >= 0 ? "+" : ""}
                  {pnlDelta.toFixed(1)}%
                  {pnlDelta >= 0 ? (
                    <ArrowUpRight className="ml-1 size-3" />
                  ) : (
                    <ArrowDownRight className="ml-1 size-3" />
                  )}
                </span>{" "}
                vs last month
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">All-time closed P&L</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
            {winRateDelta !== null ? (
              <p className="text-xs text-muted-foreground">
                <span
                  className={`font-medium inline-flex items-center ${winRateDelta >= 0 ? "text-success" : "text-destructive"}`}
                >
                  {winRateDelta >= 0 ? "+" : ""}
                  {winRateDelta.toFixed(1)}%
                  {winRateDelta >= 0 ? (
                    <ArrowUpRight className="ml-1 size-3" />
                  ) : (
                    <ArrowDownRight className="ml-1 size-3" />
                  )}
                </span>{" "}
                vs last month
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {winners.length}W / {losers.length}L of {closedTrades.length} closed
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Win / Loss</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avgLoss !== 0
                ? (Math.abs(avgWin) / Math.abs(avgLoss)).toFixed(2)
                : "—"}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                R:R
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">{fmt(avgWin)}</span>
              {" / "}
              <span className="text-destructive">{fmt(avgLoss)}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trades</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTrades.length}</div>
            <p className="text-xs text-muted-foreground">
              {longOpen.length} Long, {shortOpen.length} Short
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart placeholder */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Cumulative P&L</CardTitle>
            <CardDescription>
              Net P&L over time — charting coming soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex flex-col items-center justify-center bg-accent/20 rounded-lg border-2 border-dashed border-muted gap-2">
              <BarChart2 className="size-8 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm font-medium">
                Chart visualization coming soon
              </p>
              {closedTrades.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {closedTrades.length} closed trades · all-time{" "}
                  <span
                    className={
                      totalNetPnl >= 0 ? "text-success" : "text-destructive"
                    }
                  >
                    {fmt(totalNetPnl)}
                  </span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent trades */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
            <CardDescription>
              {thisMonthAll.length} trade{thisMonthAll.length !== 1 ? "s" : ""}{" "}
              this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentTrades.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No trades yet
              </p>
            ) : (
              <div className="space-y-4">
                {recentTrades.map((trade) => {
                  const pnl = Number(trade.net_pnl);
                  const isPositive = pnl > 0;
                  const isOpen = trade.status === "OPEN";
                  return (
                    <div key={trade.id} className="flex items-center">
                      <div
                        className={`size-9 rounded-full flex items-center justify-center border shrink-0 ${
                          isOpen
                            ? "bg-muted border-muted-foreground/20 text-muted-foreground"
                            : isPositive
                              ? "bg-success/10 border-success/20 text-success"
                              : "bg-destructive/10 border-destructive/20 text-destructive"
                        }`}
                      >
                        {isOpen ? (
                          <Activity className="size-4" />
                        ) : isPositive ? (
                          <ArrowUpRight className="size-4" />
                        ) : (
                          <ArrowDownRight className="size-4" />
                        )}
                      </div>
                      <div className="ml-4 space-y-0.5 min-w-0">
                        <p className="text-sm font-medium leading-none">
                          {trade.symbol}{" "}
                          <span className="text-muted-foreground font-normal">
                            {trade.trade_type}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {timeAgo(trade.entry_date)}
                        </p>
                      </div>
                      <div className="ml-auto text-sm font-medium shrink-0">
                        {isOpen ? (
                          <span className="text-muted-foreground text-xs">
                            OPEN
                          </span>
                        ) : (
                          <span
                            className={
                              isPositive ? "text-success" : "text-destructive"
                            }
                          >
                            {fmt(pnl)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Stats breakdown ───────────────────────── */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Best Trade</CardTitle>
          </CardHeader>
          <CardContent>
            {winners.length > 0 ? (() => {
              const best = winners.reduce((a, b) =>
                Number(a.net_pnl) > Number(b.net_pnl) ? a : b,
              );
              return (
                <>
                  <p className="text-2xl font-bold text-success">
                    {fmt(Number(best.net_pnl))}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {best.symbol} · {best.trade_type} ·{" "}
                    {new Date(best.entry_date).toLocaleDateString()}
                  </p>
                </>
              );
            })() : (
              <p className="text-muted-foreground text-sm">No closed trades yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Worst Trade</CardTitle>
          </CardHeader>
          <CardContent>
            {losers.length > 0 ? (() => {
              const worst = losers.reduce((a, b) =>
                Number(a.net_pnl) < Number(b.net_pnl) ? a : b,
              );
              return (
                <>
                  <p className="text-2xl font-bold text-destructive">
                    {fmt(Number(worst.net_pnl))}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {worst.symbol} · {worst.trade_type} ·{" "}
                    {new Date(worst.entry_date).toLocaleDateString()}
                  </p>
                </>
              );
            })() : (
              <p className="text-muted-foreground text-sm">No losing trades yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{trades.length}</p>
            <p className="text-xs text-muted-foreground">
              {openTrades.length} open · {closedTrades.length} closed ·{" "}
              {trades.filter((t) => t.status === "CANCELLED").length} cancelled
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
