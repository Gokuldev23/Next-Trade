import { getTrades } from "@/lib/actions/trade.action";
import TradeModal from "@/lib/components/custom/TradeModal";
import TradeTable from "@/lib/components/custom/TradeTable";

export default async function TradesPage() {
	const trades = await getTrades();
	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-2xl font-semibold mb-6">Trade Journal</h1>
			<TradeModal />
			<TradeTable trades={trades} />
		</div>
	);
}
