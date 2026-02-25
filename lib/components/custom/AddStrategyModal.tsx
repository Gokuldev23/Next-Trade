"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createStrategy } from "@/lib/actions/trade.action";
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
import { Textarea } from "@/lib/components/ui/textarea";
import type { Strategy } from "@/lib/types/trade.type";

interface AddStrategyModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreated: (strategy: Strategy) => void;
}

export default function AddStrategyModal({
	open,
	onOpenChange,
	onCreated,
}: AddStrategyModalProps) {
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		const res = await createStrategy(new FormData(e.currentTarget));
		setLoading(false);
		if (res.success && res.strategy) {
			toast.success("Strategy created");
			onCreated(res.strategy);
			onOpenChange(false);
			(e.target as HTMLFormElement).reset();
		} else {
			toast.error(res.error ?? "Failed to create strategy");
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>New Strategy</DialogTitle>
					<DialogDescription>
						Define a strategy to tag and group your trades.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<label className="text-sm font-medium">Name</label>
						<Input
							name="name"
							placeholder="e.g. Breakout, Mean Reversion"
							required
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">
							Description{" "}
							<span className="text-muted-foreground font-normal">
								(optional)
							</span>
						</label>
						<Textarea
							name="description"
							placeholder="Describe when and how you apply this strategy..."
							className="min-h-20 resize-none"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Color</label>
						<div className="flex items-center gap-3">
							<input
								type="color"
								name="color"
								defaultValue="#6366f1"
								className="h-9 w-14 cursor-pointer rounded-md border border-input bg-transparent p-1"
							/>
							<span className="text-sm text-muted-foreground">
								Used to visually identify this strategy in charts and tables.
							</span>
						</div>
					</div>

					<DialogFooter className="pt-2">
						<Button
							variant="ghost"
							type="button"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? "Saving..." : "Create Strategy"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
