import { Suspense } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/lib/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card";
import TradeTable from "@/lib/components/custom/TradeTable"; // We will create this
import { getTrades } from "@/lib/actions/trade.action"; // We will create this

export default async function TradesPage() {
  const trades = await getTrades();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Trades</h2>
          <p className="text-muted-foreground">
            Manage and analyze your trading history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/trades/new">
            <Button className="shadow-lg shadow-primary/25">
              <Plus className="mr-2 size-4" />
              New Trade
            </Button>
          </Link>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Trade History</CardTitle>
          <CardDescription>
            A detailed list of all your executed trades.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="p-8 text-center">Loading trades...</div>}>
            <TradeTable trades={trades} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
