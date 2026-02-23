import { Button } from "@/lib/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import TradeForm from "@/lib/components/custom/TradeForm";

export default function NewTradePage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/trades">
            <Button variant="ghost" size="icon">
                <ChevronLeft className="size-4" />
            </Button>
        </Link>
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Log Trade</h2>
            <p className="text-muted-foreground">Record a new trade entry.</p>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Trade Details</CardTitle>
          <CardDescription>Enter the execution details of your trade.</CardDescription>
        </CardHeader>
        <CardContent>
            <TradeForm />
        </CardContent>
      </Card>
    </div>
  );
}
