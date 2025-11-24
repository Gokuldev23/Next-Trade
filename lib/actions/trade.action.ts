"use server";

import { getSession } from "../auth/session";
import { db } from "../db/postgres";

export async function createTrade(formData: FormData) {
	const user = await getSession();
	if (!user?.id) throw new Error("User is not defined");

	// Core fields
	const user_id = user.id;
	const symbol = formData.get("symbol") as string;
	const quantity = Number(formData.get("quantity"));
	const trade_type = formData.get("trade_type") as string;
	const status = formData.get("status") as string;

	const entry_price = Number(formData.get("entry_price"));
	const exit_price = formData.get("exit_price")
		? Number(formData.get("exit_price"))
		: null;

	const stop_loss = formData.get("stop_loss")
		? Number(formData.get("stop_loss"))
		: null;

	const target_price = formData.get("target_price")
		? Number(formData.get("target_price"))
		: null;

	// Optional fields
	const notes = formData.get("notes") || null;
	const broker = formData.get("broker") || null;
	const commission = Number(formData.get("commission") || 0);

	const strategy_id = formData.get("strategy_id") || null;
	const portfolio_id = formData.get("portfolio_id") || null;

	const tags = formData.getAll("tags") || null;

	const exit_date = status === "CLOSED" ? new Date() : null;

	const result = await db.query(
		`
      INSERT INTO trades (
        user_id,
        symbol,
        quantity,
        trade_type,
        status,
        entry_price,
        exit_price,
        stop_loss,
        target_price,
        exit_date,
        notes,
        tags,
        broker,
        commission,
        strategy_id,
        portfolio_id
      )
      VALUES (
        $1, $2, $3, $4, $5, 
        $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16
      )
      RETURNING *;
    `,
		[
			user_id,
			symbol,
			quantity,
			trade_type,
			status,
			entry_price,
			exit_price,
			stop_loss,
			target_price,
			exit_date,
			notes,
			tags,
			broker,
			commission,
			strategy_id,
			portfolio_id,
		],
	);

	console.log("Trade inserted →", result.rows[0]);
	return result.rows[0];
}

export async function getTrades() {
	const user = await getSession();
	if (!user?.id) throw new Error("User not found");

	const result = await db.query(
		`
      SELECT *
      FROM trades
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
		[user.id],
	);

	return result.rows;
}
