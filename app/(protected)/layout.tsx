import { RedirectType, redirect } from "next/navigation";
import type React from "react";
import { getSession } from "@/lib/auth/session";
import Navbar from "@/lib/components/custom/Navbar";

export default async function layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getSession();
	console.log({user})
	if (!user) {
		redirect("/", RedirectType.replace);
	}
	return (
		<div>
			<Navbar />
			{children}
		</div>
	);
}
