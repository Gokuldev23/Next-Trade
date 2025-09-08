import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// const publicRoutes = ["/login", "/register", "/about", "/"];
	const protectedRoutes = ["/", "/dashboard", "/profile", "/settings"];
	// Check for session
	const isAuthenticated = checkAuth(request); // Implement this function

	if (protectedRoutes.includes(pathname) && !isAuthenticated) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	return NextResponse.next();
}

function checkAuth(request: NextRequest): boolean {
	// Check for auth token in cookies, headers, etc.
	const token = request.cookies.get("sessionId")?.value;
	return !!token; // Replace with actual validation
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
