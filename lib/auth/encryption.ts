// lib/session/jose.ts
import { EncryptJWT, jwtDecrypt } from "jose";

const RAW_SECRET_BASE64 = process.env.SESSION_SECRET!;
if (!RAW_SECRET_BASE64) throw new Error("Missing SESSION_SECRET env var");

// jose accepts Uint8Array for direct symmetric 'dir' key
const SECRET = Uint8Array.from(Buffer.from(RAW_SECRET_BASE64, "base64"));

export async function encrypt(
  payload: Record<string, any>,
  ttlSeconds = 60 * 60 * 24 * 3
) {
  // Add exp as seconds since epoch for easier checks if needed
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;

  const jwe = await new EncryptJWT({ ...payload, exp })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .encrypt(SECRET);

  return jwe; // compact JWE string
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtDecrypt(token, SECRET, {
      // optionally: clockTolerance, maxTokenAge etc
    });
    // payload is a general object (Record<string, any>)
    return payload as Record<string, any>;
  } catch (e) {
    return null;
  }
}
