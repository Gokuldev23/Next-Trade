"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getStrategies, updateTrade } from "@/lib/actions/trade.action";
import { Button } from "@/lib/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
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
import type { Strategy, TradeWithJoins } from "@/lib/types/trade.type";
import AddStrategyModal from "./AddStrategyModal";

interface EditTradeModalProps {
	trade: TradeWithJoins;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

function toDateTimeLocal(isoString: string | null | undefined): string {
	if (!isoString) return "";
	const date = new Date(isoString);
	const offset = date.getTimezoneOffset();
	const local = new Date(date.getTime() - offset * 60000);
	return local.toISOString().slice(0, 16);
}

export default function EditTradeModal({
	trade,
	open,
	onOpenChange,
}: EditTradeModalProps) {
	const [strategyModalOpen, setStrategyModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const [strategies, setStrategies] = useState<Strategy[]>([]);
	const [selectedStrategy, setSelectedStrategy] = useState<string>(
		trade.strategy ?? "",
	);
	const [tradeType, setTradeType] = useState<string>(trade.trade_type);
	const [status, setStatus] = useState<string>(trade.status);

	useEffect(() => {
		if (open) {
			setTradeType(trade.trade_type);
			setStatus(trade.status);
			setSelectedStrategy(trade.strategy ?? "");
			getStrategies().then(setStrategies);
		}
	}, [open, trade]);

	function handleStrategyCreated(strategy: Strategy) {
		setStrategies((prev) =>
			[...prev, strategy].sort((a, b) => a.name.localeCompare(b.name)),
		);
		setSelectedStrategy(strategy.id);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		formData.set("trade_type", tradeType);
		formData.set("status", status);
		if (selectedStrategy) {
			formData.set("strategy", selectedStrategy);
		} else {
			formData.delete("strategy");
		}

		const res = await updateTrade(trade.id, formData);
		setLoading(false);

		if (res.success) {
			toast.success("Trade updated successfully");
			onOpenChange(false);
		} else {
			toast.error(res.error ?? "Failed to update trade");
		}
	}

	const isClosed = status === "CLOSED";

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Edit Trade — {trade.symbol}</DialogTitle>
						<DialogDescription>
							Update execution details for this trade.
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
										defaultValue={trade.symbol}
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
										defaultValue={trade.entry_price}
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
										defaultValue={trade.quantity}
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
										defaultValue={toDateTimeLocal(trade.entry_date)}
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
										defaultValue={trade.stop_loss ?? ""}
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
										defaultValue={trade.target_price ?? ""}
									/>
								</div>
							</div>
						</section>

						{/* ── Closing Details ────────────────────────────── */}
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
											defaultValue={trade.exit_price ?? ""}
										/>
									</div>
									<div className="space-y-2">
										<label className="text-sm font-medium">Exit Date</label>
										<Input
											name="exit_date"
											type="datetime-local"
											defaultValue={toDateTimeLocal(trade.exit_date)}
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
										defaultValue={trade.fees ?? 0}
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
								<div className="flex gap-2">
									<Select
										value={selectedStrategy}
										onValueChange={setSelectedStrategy}
									>
										<SelectTrigger className="flex-1">
											<SelectValue placeholder="Select a strategy..." />
										</SelectTrigger>
										<SelectContent>
											{strategies.length === 0 ? (
												<div className="px-2 py-3 text-sm text-muted-foreground text-center">
													No strategies yet
												</div>
											) : (
												strategies.map((s) => (
													<SelectItem key={s.id} value={s.id}>
														<span className="flex items-center gap-2">
															<span
																className="inline-block size-2.5 rounded-full shrink-0"
																style={{ backgroundColor: s.color ?? "#000" }}
															/>
															{s.name}
														</span>
													</SelectItem>
												))
											)}
										</SelectContent>
									</Select>

									<Button
										type="button"
										variant="outline"
										size="icon"
										onClick={() => setStrategyModalOpen(true)}
										title="Create new strategy"
									>
										<Plus className="size-4" />
									</Button>
								</div>
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
									defaultValue={trade.notes ?? ""}
								/>
							</div>
						</section>

						<DialogFooter>
							<Button
								variant="ghost"
								type="button"
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={loading}>
								{loading ? "Saving..." : "Save Changes"}
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
