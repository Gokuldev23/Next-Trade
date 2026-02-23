import { RedirectType, redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export default async function Page() {
	const user = await getSession();
	if (!user) {
		redirect("/sign-in", RedirectType.replace);
	} else {
		redirect("/dashboard");
	}
}
