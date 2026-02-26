"use client";

import { Check, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Strategy } from "@/lib/types/trade.type";

interface StrategyMultiSelectProps {
	strategies: Strategy[];
	selected: string[];
	onChange: (ids: string[]) => void;
	onAddClick: () => void;
}

export default function StrategyMultiSelect({
	strategies,
	selected,
	onChange,
	onAddClick,
}: StrategyMultiSelectProps) {
	function toggle(id: string) {
		onChange(
			selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id],
		);
	}

	const label = (() => {
		if (selected.length === 0) return "Select strategies...";
		if (selected.length === 1) {
			return strategies.find((s) => s.id === selected[0])?.name ?? "1 selected";
		}
		return `${selected.length} strategies`;
	})();

	return (
		<div className="flex gap-2">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						type="button"
						variant="outline"
						className="flex-1 justify-between font-normal"
					>
						<span className="flex items-center gap-1.5 flex-wrap min-w-0">
							{selected.length > 0 && selected.length <= 3 ? (
								selected.map((id) => {
									const s = strategies.find((s) => s.id === id);
									if (!s) return null;
									return (
										<span key={id} className="flex items-center gap-1">
											<span
												className="inline-block size-2 rounded-full shrink-0"
												style={{ backgroundColor: s.color ?? "#888" }}
											/>
											<span className="text-sm">{s.name}</span>
										</span>
									);
								})
							) : (
								<span className="text-muted-foreground">{label}</span>
							)}
						</span>
						<ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="start">
					{strategies.length === 0 ? (
						<div className="px-2 py-3 text-sm text-muted-foreground text-center">
							No strategies yet
						</div>
					) : (
						strategies.map((s) => (
							<DropdownMenuItem
								key={s.id}
								onSelect={(e) => {
									e.preventDefault();
									toggle(s.id);
								}}
								className="flex items-center gap-2 cursor-pointer"
							>
								<span
									className="inline-block size-2.5 rounded-full shrink-0"
									style={{ backgroundColor: s.color ?? "#888" }}
								/>
								<span className="flex-1">{s.name}</span>
								<Check
									className={cn(
										"size-4 shrink-0",
										selected.includes(s.id) ? "opacity-100" : "opacity-0",
									)}
								/>
							</DropdownMenuItem>
						))
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			<Button
				type="button"
				variant="outline"
				size="icon"
				onClick={onAddClick}
				title="Create new strategy"
			>
				<Plus className="size-4" />
			</Button>
		</div>
	);
}
