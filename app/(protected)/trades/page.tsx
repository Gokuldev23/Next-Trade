import TradeModal from "@/lib/components/custom/TradeModal";
import TradeTable from "@/lib/components/custom/TradeTable";

export default async function TradesPage() {
    // Placeholder for DB fetching (replace with actual data)
    // const trades = await db.query("SELECT * FROM trades ORDER BY created_at DESC")

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">Trade Journal</h1>
            <TradeModal />
            <TradeTable />
        </div>
    )
}
