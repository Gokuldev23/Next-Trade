"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
	LayoutDashboard,
	LineChart,
	Wallet,
	History,
	Settings,
	LogOut,
	BookOpen
} from "lucide-react";

export function Sidebar() {
	const pathname = usePathname();

	const links = [
		{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
		{ href: "/dashboard/trades", label: "Trades", icon: History },
		{ href: "/dashboard/journal", label: "Journal", icon: BookOpen },
		{ href: "/dashboard/strategies", label: "Strategies", icon: LineChart },
		{ href: "/dashboard/portfolio", label: "Portfolio", icon: Wallet },
		{ href: "/dashboard/settings", label: "Settings", icon: Settings },
	];

	return (
		<aside className="hidden h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
			<div className="p-6">
				<div className="flex items-center gap-2">
					<div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
						<div className="size-4 bg-primary rounded-full animate-pulse" />
					</div>
					<span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">NextTrade</span>
				</div>
			</div>
			
			<div className="flex-1 px-4 py-4">
				<nav className="flex flex-col gap-2">
					{links.map((link) => {
						const Icon = link.icon;
						const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
						
						return (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
									isActive
										? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
										: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground"
								)}
							>
								<Icon className={cn("size-4", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
								{link.label}
							</Link>
						);
					})}
				</nav>
			</div>

			<div className="p-4 border-t border-sidebar-border">
				<div className="rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 p-4 border border-primary/5">
					<p className="text-xs font-medium text-primary mb-1">Pro Plan</p>
					<p className="text-[10px] text-muted-foreground mb-3">Get advanced analytics</p>
					<button className="w-full text-xs bg-background shadow-xs py-1.5 rounded-md text-foreground font-medium hover:bg-accent transition-colors">
						Upgrade
					</button>
				</div>
			</div>
		</aside>
	);
}
