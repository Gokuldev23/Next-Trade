"use client";

import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { createTrade } from "@/lib/actions/trade.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function TradeForm() {
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        const res = await createTrade(formData);
        if (res.success) {
            toast.success("Trade log created successfully");
            router.push("/dashboard/trades");
        } else {
            toast.error("Failed to create trade");
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Symbol</label>
                    <Input name="symbol" placeholder="e.g. AAPL" required />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <select name="type" className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                        <option value="SHORT">SHORT</option>
                        <option value="COVER">COVER</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Entry Price</label>
                    <Input name="entry_price" type="number" placeholder="0.00" step="0.01" required />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <Input name="quantity" type="number" placeholder="0" required />
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit">Save Trade</Button>
            </div>
        </form>
    );
}
