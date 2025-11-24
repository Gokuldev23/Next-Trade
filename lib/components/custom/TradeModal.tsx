"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import TradeForm from "./TradeForm";

export default function TradeModal() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="mb-4">+ New Trade</Button>
			</DialogTrigger>
			<DialogContent className="w-full" style={{ maxWidth: "800px" }}>
				<DialogHeader>
					<DialogTitle>Create New Trade</DialogTitle>
				</DialogHeader>
				<TradeForm closeModal={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}
