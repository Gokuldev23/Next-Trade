"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createTrade } from "@/lib/actions/trade.action";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function TradeForm({ closeModal }: { closeModal: () => void }) {
	const [isPending, startTransition] = useTransition();
	const [formState, setFormState] = useState({
		pair: "",
		type: "",
		result: "",
		profit: "",
	});
	const router = useRouter();

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setFormState({ ...formState, [e.target.name]: e.target.value });
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
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Label htmlFor="pair">Pair</Label>
				<Input
					name="pair"
					value={formState.pair}
					onChange={handleChange}
					required
				/>
			</div>
			<div>
				<Label htmlFor="type">Type</Label>
				<Input
					name="type"
					value={formState.type}
					onChange={handleChange}
					required
					placeholder="Buy/Sell"
				/>
			</div>
			<div>
				<Label htmlFor="result">Result</Label>
				<Input
					name="result"
					value={formState.result}
					onChange={handleChange}
					required
					placeholder="Win/Loss"
				/>
			</div>
			<div>
				<Label htmlFor="profit">Profit</Label>
				<Input
					name="profit"
					value={formState.profit}
					onChange={handleChange}
					required
				/>
			</div>
			<Button type="submit" disabled={isPending} className="w-full">
				{isPending ? "Saving..." : "Create Trade"}
			</Button>
		</form>
	);
}
