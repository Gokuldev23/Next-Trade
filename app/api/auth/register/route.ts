import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    console.log({ name, email, password });

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    // Check if user exists
    const rows = await db.query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email]
    );
    if (rows.rows[0]) {
      return new Response(JSON.stringify({ error: "Email already in use" }), {
        status: 409,
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const result = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
      [name, email, hashed]
    );

    const userId = result.rows[0].id;

    // Create session token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
    await db.query(
      "INSERT INTO session (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [userId, token, expiresAt]
    );

    const cookieStore = await cookies();

    // Set cookie
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

      return new Response(JSON.stringify({ error: null }), {
        status: 201,
      });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
