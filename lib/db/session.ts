"use server";

import { db } from "./db";

export async function verifySession(token: string) {
  if (!token) return null;

  const result = await db.query(
    `
    SELECT user_id, expires_at
    FROM sessions
    WHERE token = $1
    LIMIT 1
    `,
    [token]
  );
  const session = result.rows[0];

  // No session found
  if (!session) return null;

  // Expired session
  if (new Date(session.expires_at) < new Date()) {
    return null;
  }

  // Return user_id so API knows who’s logged in
  return session.user_id;
}
