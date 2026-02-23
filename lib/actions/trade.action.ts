"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";

export async function getTrades() {
  const user = await getSession();
  if (!user) return [];

  try {
    const res = await query(
      `SELECT * FROM trades WHERE user_id = $1 ORDER BY entry_date DESC`,
      [user.id]
    );
    return res.rows;
  } catch (error) {
    console.error("Failed to fetch trades:", error);
    return [];
  }
}

export async function createTrade(formData: FormData) {
  const user = await getSession();
  if (!user) throw new Error("Unauthorized");

  const symbol = formData.get("symbol") as string;
  const type = formData.get("type") as string;
  const entry_price = parseFloat(formData.get("entry_price") as string);
  const quantity = parseFloat(formData.get("quantity") as string);

  try {
    await query(
      `INSERT INTO trades (user_id, symbol, trade_type, entry_price, quantity)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.id, symbol, type, entry_price, quantity]
    );
    revalidatePath("/trades");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to create trade" };
  }
}
