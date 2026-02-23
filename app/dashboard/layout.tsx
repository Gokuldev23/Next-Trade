import { RedirectType, redirect } from "next/navigation";
import type React from "react";
import { getSession } from "@/lib/auth/session";
import Navbar from "@/lib/components/custom/Navbar";
import { Sidebar } from "@/lib/components/custom/Sidebar";

export default async function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getSession();
	if (!user) {
		redirect("/sign-in", RedirectType.replace);
	}
	return (
		<div className="flex min-h-screen">
			<Sidebar />
			<main className="flex-1 flex flex-col min-h-screen bg-muted/20">
				<header className="h-16 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10 px-6 flex items-center justify-between">
					<h1 className="font-semibold text-lg">Dashboard</h1>
					<Navbar user={user} />
				</header>
				<div className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
					{children}
				</div>
			</main>
		</div>
	);
}
