import crypto from "node:crypto";
import { cookies } from "next/headers";
import { getRedisClient } from "../db/redis";

const SESSION_PREFIX = "session:";
const SESSION_TTL = 60; // 1 minute in seconds
const COOKIE_NAME = "sessionId";

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

export async function createSession(
	data: SessionData,
	ttl: number = SESSION_TTL,
): Promise<string> {
	const client = getRedisClient();
	const sessionId = crypto.randomBytes(32).toString("hex");

	await client.setex(SESSION_PREFIX + sessionId, ttl, JSON.stringify(data));

	// Set cookie in browser
	(await cookies()).set({
		name: COOKIE_NAME,
		value: sessionId,
		httpOnly: true, // JS can't access (secure)
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: ttl,
		sameSite: "lax",
	});
	console.log("Session created");
	return sessionId;
}

export async function getSession<T extends SessionData>(): Promise<T | null> {
	const client = getRedisClient();

	const sessionId = await getSessionIdByCookie(await cookies());
	console.log({ sessionId });
	if (!sessionId) return null;

	const data = await client.get(SESSION_PREFIX + sessionId);

	return data as T;
}

export async function updateSession(ttl: number = SESSION_TTL): Promise<void> {
	const client = getRedisClient();
	const sessionId = await getSessionIdByCookie(await cookies());

	if (!sessionId) return;

	await client.expire(SESSION_PREFIX + sessionId, ttl);

	// refresh cookie maxAge
	await setCookie(sessionId, await cookies());
}

export async function deleteSession(): Promise<void> {
	const client = getRedisClient();
	const sessionId = await getSessionIdByCookie(await cookies());

	if (sessionId) {
		await client.del(SESSION_PREFIX + sessionId);
	}

	// clear cookie
	(await cookies()).delete(COOKIE_NAME);
}

export async function refreshSession(ttl: number = SESSION_TTL): Promise<void> {
	const client = getRedisClient();
	const sessionId = await getSessionIdByCookie(await cookies());

	if (sessionId) {
		await client.expire(SESSION_PREFIX + sessionId, ttl);

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
