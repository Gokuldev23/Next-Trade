"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { createTrade, getStrategies } from "@/lib/actions/trade.action";
import { Button } from "@/lib/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/lib/components/ui/dialog";
import { Input } from "@/lib/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/lib/components/ui/select";
import { Textarea } from "@/lib/components/ui/textarea";
import type { Strategy } from "@/lib/types/trade.type";
import AddStrategyModal from "./AddStrategyModal";
import StrategyMultiSelect from "./StrategyMultiSelect";

export default function AddTradeModal() {
	const [open, setOpen] = useState(false);
	const [strategyModalOpen, setStrategyModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const [strategies, setStrategies] = useState<Strategy[]>([]);
	const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
	const [tradeType, setTradeType] = useState<string>("BUY");
	const [status, setStatus] = useState<string>("OPEN");

	useEffect(() => {
		if (open) {
			getStrategies().then(setStrategies);
		}
	}, [open]);

	function handleStrategyCreated(strategy: Strategy) {
		setStrategies((prev) =>
			[...prev, strategy].sort((a, b) => a.name.localeCompare(b.name)),
		);
		setSelectedStrategies((prev) => [...prev, strategy.id]);
	}

	function handleOpenChange(next: boolean) {
		setOpen(next);
		if (!next) {
			// reset controlled fields on close
			setTradeType("BUY");
			setStatus("OPEN");
			setSelectedStrategies([]);
		}
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		// inject controlled select values
		formData.set("trade_type", tradeType);
		formData.set("status", status);
		formData.delete("strategy");
		for (const id of selectedStrategies) formData.append("strategy", id);

		const res = await createTrade(formData);
		setLoading(false);

		if (res.success) {
			toast.success("Trade logged successfully");
			handleOpenChange(false);
			(e.target as HTMLFormElement).reset();
		} else {
			toast.error(res.error ?? "Failed to log trade");
		}
	}

	const isClosed = status === "CLOSED";

	return (
		<>
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogTrigger asChild>
					<Button className="shadow-lg shadow-primary/25">
						<Plus className="mr-2 size-4" />
						New Trade
					</Button>
				</DialogTrigger>

				<DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Log Trade</DialogTitle>
						<DialogDescription>
							Record a new trade entry with full execution details.
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* ── Core ─────────────────────────────────────── */}
						<section className="space-y-3">
							<h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								Execution
							</h3>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<label className="text-sm font-medium">Symbol</label>
									<Input
										name="symbol"
										placeholder="e.g. AAPL"
										className="uppercase"
										required
									/>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium">Trade Type</label>
									<Select value={tradeType} onValueChange={setTradeType}>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="BUY">BUY</SelectItem>
											<SelectItem value="SELL">SELL</SelectItem>
											<SelectItem value="SHORT">SHORT</SelectItem>
											<SelectItem value="COVER">COVER</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<label className="text-sm font-medium">Entry Price</label>
									<Input
										name="entry_price"
										type="number"
										placeholder="0.00"
										step="0.0001"
										min="0.0001"
										required
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Quantity</label>
									<Input
										name="quantity"
										type="number"
										placeholder="0"
										step="0.0001"
										min="0.0001"
										required
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<label className="text-sm font-medium">Entry Date</label>
									<Input
										name="entry_date"
										type="datetime-local"
										defaultValue={new Date().toISOString().slice(0, 16)}
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Status</label>
									<Select value={status} onValueChange={setStatus}>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="OPEN">OPEN</SelectItem>
											<SelectItem value="CLOSED">CLOSED</SelectItem>
											<SelectItem value="CANCELLED">CANCELLED</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</section>

						{/* ── Risk Management ───────────────────────────── */}
						<section className="space-y-3">
							<h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								Risk Management
							</h3>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Stop Loss{" "}
										<span className="text-muted-foreground font-normal">
											(optional)
										</span>
									</label>
									<Input
										name="stop_loss"
										type="number"
										placeholder="0.00"
										step="0.0001"
										min="0.0001"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Target Price{" "}
										<span className="text-muted-foreground font-normal">
											(optional)
										</span>
									</label>
									<Input
										name="target_price"
										type="number"
										placeholder="0.00"
										step="0.0001"
										min="0.0001"
									/>
								</div>
							</div>
						</section>

						{/* ── Closing (only when CLOSED) ────────────────── */}
						{isClosed && (
							<section className="space-y-3">
								<h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Closing Details
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<label className="text-sm font-medium">Exit Price</label>
										<Input
											name="exit_price"
											type="number"
											placeholder="0.00"
											step="0.0001"
											min="0.0001"
										/>
									</div>
									<div className="space-y-2">
										<label className="text-sm font-medium">Exit Date</label>
										<Input
											name="exit_date"
											type="datetime-local"
											defaultValue={new Date().toISOString().slice(0, 16)}
										/>
									</div>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Fees{" "}
										<span className="text-muted-foreground font-normal">
											(optional)
										</span>
									</label>
									<Input
										name="fees"
										type="number"
										placeholder="0.00"
										step="0.01"
										min="0"
										defaultValue="0"
									/>
								</div>
							</section>
						)}

						{/* ── Meta ─────────────────────────────────────── */}
						<section className="space-y-3">
							<h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								Meta
							</h3>

							<div className="space-y-2">
								<label className="text-sm font-medium">
									Strategy{" "}
									<span className="text-muted-foreground font-normal">
										(optional)
									</span>
								</label>
								<StrategyMultiSelect
								strategies={strategies}
								selected={selectedStrategies}
								onChange={setSelectedStrategies}
								onAddClick={() => setStrategyModalOpen(true)}
							/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">
									Notes{" "}
									<span className="text-muted-foreground font-normal">
										(optional)
									</span>
								</label>
								<Textarea
									name="notes"
									placeholder="Trade rationale, observations, lessons learned..."
									className="min-h-20 resize-none"
								/>
							</div>
						</section>

						<DialogFooter>
							<Button
								variant="ghost"
								type="button"
								onClick={() => handleOpenChange(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={loading}>
								{loading ? "Saving..." : "Log Trade"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<AddStrategyModal
				open={strategyModalOpen}
				onOpenChange={setStrategyModalOpen}
				onCreated={handleStrategyCreated}
			/>
		</>
	);
}
