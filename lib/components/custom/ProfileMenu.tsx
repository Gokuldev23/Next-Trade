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
        <button popoverTarget={ctx.popoverId} className="cursor-pointer menu-trigger-css">
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
            className={`rounded-xl border bg-white shadow-lg min-w-40 ${className} menu-items-css`}
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
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={onClick}
        >
            {children}
        </button>
    );
}

/* ------------------ Attach subcomponents ------------------ */


export {Menu,MenuItem,MenuItems,Trigger}