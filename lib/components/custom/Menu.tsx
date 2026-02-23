"use client";

import { createContext, useContext, useId } from "react";

const MenuContext = createContext<{ popoverId: string } | null>(null);

/* ------------------ Root Component ------------------ */
function Menu({ children }: { children: React.ReactNode }) {
	const popoverId = useId();

	return (
		<MenuContext.Provider value={{ popoverId }}>
			<div className="relative inline-block">{children}</div>
		</MenuContext.Provider>
	);
}

/* ------------------ Button ------------------ */
function Trigger({ children }: { children: React.ReactNode }) {
	const ctx = useContext(MenuContext);
	if (!ctx) throw new Error("Menu.Button must be inside <Menu>");

	return (
		<button
			type="button"
			popoverTarget={ctx.popoverId}
			className="cursor-pointer menu-trigger-css"
		>
			{children}
		</button>
	);
}

/* ------------------ Items (popover body) ------------------ */
function MenuItems({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const ctx = useContext(MenuContext);
	if (!ctx) throw new Error("Menu.Items must be inside <Menu>");

	return (
		<div
			id={ctx.popoverId}
			popover="auto"
			className={`rounded-xl border bg-popover/80 backdrop-blur-xl shadow-xl min-w-48 p-1 ${className} menu-items-css`}
		>
			{children}
		</div>
	);
}

/* ------------------ Item ------------------ */
function MenuItem({
	children,
	onClick,
}: {
	children: React.ReactNode;
	onClick?: () => void;
}) {
	return (
		<button
			type="button"
			className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-accent/50 hover:text-accent-foreground transition-colors text-sm font-medium"
			onClick={onClick}
		>
			{children}
		</button>
	);
}

/* ------------------ Attach subcomponents ------------------ */

export { Menu, MenuItem, MenuItems, Trigger };
