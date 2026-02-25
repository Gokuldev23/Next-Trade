import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card";
import TradeTable from "@/lib/components/custom/TradeTable"; // We will create this
import { getTrades } from "@/lib/actions/trade.action"; // We will create this
import AddTradeModal from "@/lib/components/custom/AddTradeModal";

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
        <AddTradeModal />
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
