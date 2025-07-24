// src/app/api/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { pool } from "../../../lib/db";

export async function POST() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "No session" });
  }

  const client = await pool.connect();

  try {
    // Delete from DB
    await client.query("DELETE FROM sessions WHERE session_token = $1", [
      token,
    ]);

    // Clear cookie
    const res = NextResponse.json({ message: "Logged out" });
    res.cookies.delete("session_token");
    return res;
  } catch (err) {
    console.error("Logout failed", err);
    return NextResponse.json({ error: "Logout error" }, { status: 500 });
  } finally {
    client.release();
  }
}
