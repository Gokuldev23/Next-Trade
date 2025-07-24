import NextAuth from "next-auth";
import PostgresAdapter from "@auth/pg-adapter";
import GitHub from "next-auth/providers/github";

import { Pool } from "pg";

const pool = new Pool({
  user: "gokul",
  host: "localhost",
  database: "nextauthdb",
  password: "Lg@2024",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PostgresAdapter(pool),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 60,
  },
});
