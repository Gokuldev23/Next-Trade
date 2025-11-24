"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createTrade } from "@/lib/actions/trade.action";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

interface TradeFormProps {
	closeModal: () => void;
}

export default function TradeForm({ closeModal }: TradeFormProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const [formState, setFormState] = useState({
		symbol: "",
		quantity: "",
		trade_type: "",
		entry_price: "",
		exit_price: "",
		stop_loss: "",
		target_price: "",
		status: "",
		strategy_id: "",
		portfolio_id: "",
	});

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) {
		setFormState({ ...formState, [e.target.name]: e.target.value });
	}

	function handleSelectChange(formName: string, value: string) {
		setFormState({ ...formState, [formName]: value });
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		startTransition(async () => {
			await createTrade(new FormData(e.target as HTMLFormElement));
			router.refresh();
			closeModal();
		});
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-2 gap-4">
			{/* Symbol */}
			<div>
				<Label className="mb-2" htmlFor="symbol">
					Symbol
				</Label>
				<Input
					name="symbol"
					value={formState.symbol}
					onChange={handleChange}
					required
				/>
			</div>

			{/* Quantity */}
			<div>
				<Label className="mb-2" htmlFor="quantity">
					Quantity
				</Label>
				<Input
					name="quantity"
					type="number"
					value={formState.quantity}
					onChange={handleChange}
					required
				/>
			</div>

			{/* Trade Type */}
			<div>
				<Label className="mb-2">Type</Label>
				<Select
					value={formState.trade_type}
					onValueChange={(val) => handleSelectChange("trade_type", val)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Direction" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="BUY">LONG</SelectItem>
						<SelectItem value="SELL">SHORT</SelectItem>
					</SelectContent>
				</Select>

				{/* Hidden input to submit value */}
				<input type="hidden" name="trade_type" value={formState.trade_type} />
			</div>

			{/* Entry Price */}
			<div>
				<Label className="mb-2" htmlFor="entry_price">
					Entry Price
				</Label>
				<Input
					type="number"
					name="entry_price"
					value={formState.entry_price}
					onChange={handleChange}
					required
				/>
			</div>

			{/* Exit Price */}
			<div>
				<Label className="mb-2" htmlFor="exit_price">
					Exit Price
				</Label>
				<Input
					type="number"
					name="exit_price"
					value={formState.exit_price}
					onChange={handleChange}
					placeholder="Optional"
				/>
			</div>

			{/* Stop Loss */}
			<div>
				<Label className="mb-2" htmlFor="stop_loss">
					Stop Loss
				</Label>
				<Input
					type="number"
					name="stop_loss"
					value={formState.stop_loss}
					onChange={handleChange}
					placeholder="Optional"
				/>
			</div>

			{/* Target Price */}
			<div>
				<Label className="mb-2" htmlFor="target_price">
					Target Price
				</Label>
				<Input
					type="number"
					name="target_price"
					value={formState.target_price}
					onChange={handleChange}
					placeholder="Optional"
				/>
			</div>

			{/* Status */}
			<div>
				<Label className="mb-2" htmlFor="status">
					Status
				</Label>
				<select
					name="status"
					value={formState.status}
					onChange={handleChange}
					className="border p-2 rounded w-full"
					required
				>
					<option value="">Select</option>
					<option value="OPEN">Open</option>
					<option value="CLOSED">Closed</option>
					<option value="CANCELLED">Cancelled</option>
				</select>
			</div>

			{/* Strategy */}
			<div>
				<Label className="mb-2" htmlFor="strategy_id">
					Strategy (Optional)
				</Label>
				<Input
					name="strategy_id"
					value={formState.strategy_id}
					onChange={handleChange}
					placeholder="strategy uuid"
				/>
			</div>

			{/* Portfolio */}
			<div>
				<Label className="mb-2" htmlFor="portfolio_id">
					Portfolio (Optional)
				</Label>
				<Input
					name="portfolio_id"
					value={formState.portfolio_id}
					onChange={handleChange}
					placeholder="portfolio uuid"
				/>
			</div>

			<Button disabled={isPending} className="w-full col-span-2">
				{isPending ? "Saving..." : "Create Trade"}
			</Button>
		</form>
	);
}
