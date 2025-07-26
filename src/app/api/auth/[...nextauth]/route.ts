import { handlers } from "../../../../lib/auth"; // Referring to the auth.ts we just created
console.log("DATABASE_URL:", process.env.DATABASE_URL);
export const { GET, POST } = handlers;
