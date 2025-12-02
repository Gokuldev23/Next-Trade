import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/session";

export async function middleware(req: NextRequest) {
	const token = await getSession();

	if (!token) {
		return redirectToLogin(req);
	}

	return NextResponse.next();
}

function redirectToLogin(req: NextRequest) {
	return NextResponse.redirect(new URL("/sign-in", req.url));
}

export const config = {
	matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"],
};
