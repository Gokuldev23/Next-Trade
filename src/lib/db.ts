// src/lib/db.ts
import { Pool } from "pg";

export const pool = new Pool({
  user: "gokul",
  host: "localhost",
  database: "nextauthdb",
  password: "Lg@2024",
  port: 5432,
});
