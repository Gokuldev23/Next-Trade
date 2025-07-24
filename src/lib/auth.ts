// src/lib/auth.ts
import { cookies } from "next/headers";
import { pool } from "./db";

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session_token")?.value;

  if (!token) return null;

  const client = await pool.connect();

  try {
    const sessionRes = await client.query(
      `SELECT * FROM sessions WHERE session_token = $1 AND expires_at > NOW()`,
      [token]
    );

    const session = sessionRes.rows[0];
    if (!session) return null;

    const userRes = await client.query(`SELECT * FROM users WHERE id = $1`, [
      session.user_id,
    ]);

    return userRes.rows[0] || null;
  } catch (e) {
    console.error("Error in getCurrentUser:", e);
    return null;
  } finally {
    client.release();
  }
}
