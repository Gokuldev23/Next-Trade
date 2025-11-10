import { Card, CardContent } from "../ui/card";

export default function TradeTable() {
	// Temporary static data (replace with server data)
	const trades = [
		{ id: 1, pair: "BTC/USDT", type: "Buy", result: "Win", profit: "+120" },
		{ id: 2, pair: "ETH/USDT", type: "Sell", result: "Loss", profit: "-80" },
	];

	return (
		<Card>
			<CardContent className="overflow-x-auto">
				<table className="min-w-full text-sm border-collapse">
					<thead>
						<tr className="border-b bg-gray-50 text-left">
							<th className="p-2">#</th>
							<th className="p-2">Pair</th>
							<th className="p-2">Type</th>
							<th className="p-2">Result</th>
							<th className="p-2">Profit</th>
						</tr>
					</thead>
					<tbody>
						{trades.map((t) => (
							<tr key={t.id} className="border-b hover:bg-gray-50">
								<td className="p-2">{t.id}</td>
								<td className="p-2">{t.pair}</td>
								<td className="p-2">{t.type}</td>
								<td
									className={`p-2 ${t.result === "Win" ? "text-green-600" : "text-red-600"}`}
								>
									{t.result}
								</td>
								<td className="p-2">{t.profit}</td>
							</tr>
						))}
					</tbody>
				</table>
			</CardContent>
		</Card>
	);
}
