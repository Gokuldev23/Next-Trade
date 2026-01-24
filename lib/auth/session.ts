import { cookies } from "next/headers";
import { COOKIE_NAME, SESSION_TTL } from "../constants";
import type { UserType } from "../types/user.type";
import { decrypt, encrypt } from "./encryption";

const _TTL = 600; // 1 minute

type SessionData = Record<string, any>;

export type Cookies = {
	set: (
		key: string,
		value: string,
		options: {
			secure?: boolean;
			httpOnly?: boolean;
			sameSite?: "strict" | "lax";
			expires?: number;
		},
	) => void;
	get: (key: string) => { name: string; value: string } | undefined;
	delete: (key: string) => void;
};

// export async function getSession(): Promise<UserType | null> {
// 	const client = getRedisClient();

// 	const sessionId = await getSessionIdByCookie(await cookies());
// 	if (!sessionId) return null;

// 	const data = await client.get(COOKIE_NAME + sessionId);

// 	return data as UserType;
// }

export async function updateSession(ttl: number = SESSION_TTL): Promise<void> {
	const sessionId = await getSessionIdByCookie(await cookies());

	if (!sessionId) return;

	// refresh cookie maxAge
	await setCookie(sessionId, await cookies());
}

export async function refreshSession(ttl: number = SESSION_TTL): Promise<void> {
	const sessionId = await getSessionIdByCookie(await cookies());

	if (sessionId) {
		await setCookie(sessionId, await cookies());
	}
}

async function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
	cookies.set(COOKIE_NAME, sessionId, {
		secure: true,
		httpOnly: true,
		sameSite: "lax",
		expires: Date.now() + SESSION_TTL * 1000,
	});
}

async function getSessionIdByCookie(cookies: Pick<Cookies, "get">) {
	const sessionData = cookies.get(COOKIE_NAME);
	return sessionData?.value;
}

export async function setSession(data: UserType) {
	const token = await encrypt({
		...data,
		exp: Math.floor(Date.now() / 1000) + SESSION_TTL, // expiry
	});

	const cookieStore = await cookies();
	cookieStore.set({
		name: COOKIE_NAME,
		value: token,
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: SESSION_TTL,
	});
}

export async function getSession() {
	const cookie = (await cookies()).get(COOKIE_NAME)?.value;
	if (!cookie) return null;

	const data = await decrypt(cookie);
	if (!data) return null;
	const nowSec = Math.floor(Date.now() / 1000);

	if (nowSec > data.exp) return null;

	return data as UserType;
}

export async function deleteSession() {
	const cookieStore = await cookies();
	cookieStore.delete(COOKIE_NAME);
}
