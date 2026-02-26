"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { query } from "@/lib/db";
import type { Strategy } from "@/lib/types/trade.type";

export async function getTrades() {
	const user = await getSession();
	if (!user) return [];

	try {
		const res = await query(
			`SELECT t.*,
        COALESCE(
          json_agg(json_build_object('id', s.id, 'name', s.name, 'color', s.color))
          FILTER (WHERE s.id IS NOT NULL),
          '[]'::json
        ) AS strategies
       FROM trades t
       LEFT JOIN trade_strategies ts ON t.id = ts.trade_id
       LEFT JOIN strategies s ON ts.strategy_id = s.id
       WHERE t.user_id = $1
       GROUP BY t.id
       ORDER BY t.entry_date DESC`,
			[user.id],
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

	const symbol = (formData.get("symbol") as string).toUpperCase().trim();
	const trade_type = formData.get("trade_type") as string;
	const status = (formData.get("status") as string) || "OPEN";
	const entry_price = parseFloat(formData.get("entry_price") as string);
	const quantity = parseFloat(formData.get("quantity") as string);
	const entry_date =
		(formData.get("entry_date") as string) || new Date().toISOString();

	const exit_price_raw = formData.get("exit_price") as string;
	const exit_price = exit_price_raw ? parseFloat(exit_price_raw) : null;

	const stop_loss_raw = formData.get("stop_loss") as string;
	const stop_loss = stop_loss_raw ? parseFloat(stop_loss_raw) : null;

	const target_price_raw = formData.get("target_price") as string;
	const target_price = target_price_raw ? parseFloat(target_price_raw) : null;

	const exit_date_raw = formData.get("exit_date") as string;
	const exit_date = exit_date_raw || null;

	const fees = parseFloat((formData.get("fees") as string) || "0") || 0;

	const notes_raw = formData.get("notes") as string;
	const notes = notes_raw?.trim() || null;

	const strategy_ids = formData.getAll("strategy") as string[];

	// Compute PnL when exit price is available
	let gross_pnl = 0;
	if (exit_price !== null) {
		if (trade_type === "BUY" || trade_type === "COVER") {
			gross_pnl = (exit_price - entry_price) * quantity;
		} else {
			gross_pnl = (entry_price - exit_price) * quantity;
		}
	}
	const net_pnl = gross_pnl - fees;

	try {
		const result = await query(
			`INSERT INTO trades (
        user_id, symbol, trade_type, status,
        entry_price, quantity,
        exit_price, stop_loss, target_price,
        entry_date, exit_date,
        gross_pnl, fees, net_pnl,
        notes
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING id`,
			[
				user.id,
				symbol,
				trade_type,
				status,
				entry_price,
				quantity,
				exit_price,
				stop_loss,
				target_price,
				entry_date,
				exit_date,
				gross_pnl,
				fees,
				net_pnl,
				notes,
			],
		);

		const tradeId = result.rows[0].id;

		if (strategy_ids.length > 0) {
			const placeholders = strategy_ids
				.map((_, i) => `($1, $${i + 2})`)
				.join(", ");
			await query(
				`INSERT INTO trade_strategies (trade_id, strategy_id) VALUES ${placeholders}`,
				[tradeId, ...strategy_ids],
			);
		}

		revalidatePath("/dashboard/trades");
		return { success: true };
	} catch (e) {
		console.error(e);
		return { success: false, error: "Failed to create trade" };
	}
}

export async function updateTrade(tradeId: string, formData: FormData) {
	const user = await getSession();
	if (!user) throw new Error("Unauthorized");

	const symbol = (formData.get("symbol") as string).toUpperCase().trim();
	const trade_type = formData.get("trade_type") as string;
	const status = (formData.get("status") as string) || "OPEN";
	const entry_price = parseFloat(formData.get("entry_price") as string);
	const quantity = parseFloat(formData.get("quantity") as string);
	const entry_date =
		(formData.get("entry_date") as string) || new Date().toISOString();

	const exit_price_raw = formData.get("exit_price") as string;
	const exit_price = exit_price_raw ? parseFloat(exit_price_raw) : null;

	const stop_loss_raw = formData.get("stop_loss") as string;
	const stop_loss = stop_loss_raw ? parseFloat(stop_loss_raw) : null;

	const target_price_raw = formData.get("target_price") as string;
	const target_price = target_price_raw ? parseFloat(target_price_raw) : null;

	const exit_date_raw = formData.get("exit_date") as string;
	const exit_date = exit_date_raw || null;

	const fees = parseFloat((formData.get("fees") as string) || "0") || 0;

	const notes_raw = formData.get("notes") as string;
	const notes = notes_raw?.trim() || null;

	const strategy_ids = formData.getAll("strategy") as string[];

	let gross_pnl = 0;
	if (exit_price !== null) {
		if (trade_type === "BUY" || trade_type === "COVER") {
			gross_pnl = (exit_price - entry_price) * quantity;
		} else {
			gross_pnl = (entry_price - exit_price) * quantity;
		}
	}
	const net_pnl = gross_pnl - fees;

	try {
		await query(
			`UPDATE trades SET
        symbol = $1, trade_type = $2, status = $3,
        entry_price = $4, quantity = $5,
        exit_price = $6, stop_loss = $7, target_price = $8,
        entry_date = $9, exit_date = $10,
        gross_pnl = $11, fees = $12, net_pnl = $13,
        notes = $14
      WHERE id = $15 AND user_id = $16`,
			[
				symbol,
				trade_type,
				status,
				entry_price,
				quantity,
				exit_price,
				stop_loss,
				target_price,
				entry_date,
				exit_date,
				gross_pnl,
				fees,
				net_pnl,
				notes,
				tradeId,
				user.id,
			],
		);

		// Replace all strategies
		await query(`DELETE FROM trade_strategies WHERE trade_id = $1`, [tradeId]);
		if (strategy_ids.length > 0) {
			const placeholders = strategy_ids
				.map((_, i) => `($1, $${i + 2})`)
				.join(", ");
			await query(
				`INSERT INTO trade_strategies (trade_id, strategy_id) VALUES ${placeholders}`,
				[tradeId, ...strategy_ids],
			);
		}

		revalidatePath("/dashboard/trades");
		return { success: true };
	} catch (e) {
		console.error(e);
		return { success: false, error: "Failed to update trade" };
	}
}

export async function getStrategies(): Promise<Strategy[]> {
	const user = await getSession();
	if (!user) return [];

	try {
		const res = await query(
			`SELECT * FROM strategies WHERE user_id = $1 ORDER BY name ASC`,
			[user.id],
		);
		return res.rows;
	} catch (error) {
		console.error("Failed to fetch strategies:", error);
		return [];
	}
}

export async function createStrategy(
	formData: FormData,
): Promise<{ success: boolean; strategy?: Strategy; error?: string }> {
	const user = await getSession();
	if (!user) throw new Error("Unauthorized");

	const name = (formData.get("name") as string).trim();
	const description = (formData.get("description") as string)?.trim() || null;
	const color = (formData.get("color") as string) || "#000000";

	if (!name) return { success: false, error: "Name is required" };

	try {
		const res = await query(
			`INSERT INTO strategies (user_id, name, description, color)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
			[user.id, name, description, color],
		);
		revalidatePath("/dashboard/trades");
		return { success: true, strategy: res.rows[0] };
	} catch (e) {
		console.error(e);
		return { success: false, error: "Failed to create strategy" };
	}
}
