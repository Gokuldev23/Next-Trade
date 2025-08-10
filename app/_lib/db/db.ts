import  { Pool } from "pg"

const db = new Pool({
  connectionString: process.env.DB_CONNECT_STRING,
});