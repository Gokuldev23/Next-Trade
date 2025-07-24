// src/app/api/signin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../../lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    // 1. Find or create user
    const { rows } = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    let user = rows[0];
    if (!user) {
      const insertRes = await client.query(
        "INSERT INTO users (email) VALUES ($1) RETURNING *",
        [email]
      );
      user = insertRes.rows[0];
    }

    // 2. Create session
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 1000); // 1 min

    await client.query(
      `INSERT INTO sessions (user_id, session_token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, sessionToken, expiresAt]
    );

    // 3. Set cookie
    const res = NextResponse.json({ message: "Signed in!" });
    res.cookies.set("session_token", sessionToken, {
      httpOnly: true,
      path: "/",
      maxAge: 60, // 1 min
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  } finally {
    client.release();
  }
}
