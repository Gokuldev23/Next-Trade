import { Suspense } from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Activity, 
  Percent,
  TrendingUp 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/lib/components/ui/card";
import { Button } from "@/lib/components/ui/button";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success font-medium inline-flex items-center">
                +20.1% <ArrowUpRight className="ml-1 size-3" />
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">58.3%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success font-medium inline-flex items-center">
                +4% <ArrowUpRight className="ml-1 size-3" />
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+$12,234.00</div>
            <p className="text-xs text-muted-foreground">
              All time P&L
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trades</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              2 Long, 1 Short
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart Area */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Cumulative P&L over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-accent/20 rounded-lg border-2 border-dashed border-muted">
              <p className="text-muted-foreground font-medium">Chart Visualization Placeholder</p>
              {/* TODO: Integrate Chart.js or Recharts here */}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
            <CardDescription>
              You made 26 trades this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { symbol: "AAPL", type: "BUY", amount: "+$240.50", time: "2h ago", status: "success" },
                { symbol: "TSLA", type: "SELL", amount: "-$124.00", time: "5h ago", status: "destructive" },
                { symbol: "NVDA", type: "BUY", amount: "+$850.20", time: "1d ago", status: "success" },
                { symbol: "BTC", type: "BUY", amount: "+$1,200.00", time: "2d ago", status: "success" },
              ].map((trade, i) => (
                <div key={i} className="flex items-center">
                  <div className={`size-9 rounded-full flex items-center justify-center border ${trade.status === 'success' ? 'bg-success/10 border-success/20 text-success' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
                    {trade.status === 'success' ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{trade.symbol} {trade.type}</p>
                    <p className="text-xs text-muted-foreground">{trade.time}</p>
                  </div>
                  <div className={`ml-auto font-medium ${trade.status === 'success' ? 'text-success' : 'text-destructive'}`}>
                    {trade.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
