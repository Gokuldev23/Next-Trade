import { RedirectType, redirect } from "next/navigation";
import type React from "react";
import { getSession } from "@/lib/auth/session";

export default async function layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getSession();
	if (user) {
		redirect("/dashboard/trades", RedirectType.replace);
	}
}
