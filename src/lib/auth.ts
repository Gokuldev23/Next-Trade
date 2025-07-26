import NextAuth from "next-auth";
import NeonAdapter from "@auth/neon-adapter";
import GitHub from "next-auth/providers/github";
import { Pool } from "@neondatabase/serverless";


export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  // Create a `Pool` inside the request handler.
  const pool:any = new Pool({ connectionString: process.env.DATABASE_URL })
  return {
    adapter: NeonAdapter(pool),
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
  }
});
