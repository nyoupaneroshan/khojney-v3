/**
 * Session token utilities.
 *
 * Tokens are opaque random strings stored in the `Session` table. The cookie
 * value is `token.hmac` where `hmac = HMAC-SHA256(sessionSecret, token)`. This
 * means:
 *   - An attacker who steals the DB but not the secret cannot forge sessions.
 *   - An attacker who steals the secret but not the DB cannot forge sessions.
 *   - We can revoke sessions server-side by deleting the `Session` row.
 *
 * The cookie stores `token.hmac` (both halves) so we can look up the session
 * by token and verify the HMAC at the same time.
 */
import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { env } from "@/lib/env";

const COOKIE_NAME = "khojney_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function getSecret(): string {
  // In dev without a configured secret, use a deterministic placeholder so
  // sessions still work locally. Production deployments MUST set SESSION_SECRET.
  return env.SESSION_SECRET || "DEV_ONLY_PLACEHOLDER_SECRET_DO_NOT_USE_IN_PROD";
}

function sign(token: string): string {
  return createHmac("sha256", getSecret()).update(token).digest("hex");
}

/** Create a new session token + its cookie value (`token.hmac`). */
export function createSessionToken(): { token: string; cookieValue: string } {
  const token = randomBytes(32).toString("hex");
  const hmac = sign(token);
  return { token, cookieValue: `${token}.${hmac}` };
}

/**
 * Verify a cookie value (`token.hmac`) and return the bare token if valid.
 * Returns `null` if the format is wrong or the HMAC doesn't match.
 */
export function verifySessionCookie(cookieValue: string | undefined): string | null {
  if (!cookieValue) return null;
  const dot = cookieValue.lastIndexOf(".");
  if (dot <= 0 || dot >= cookieValue.length - 1) return null;
  const token = cookieValue.slice(0, dot);
  const hmac = cookieValue.slice(dot + 1);

  const expected = sign(token);
  // Constant-time compare to prevent timing attacks.
  if (hmac.length !== expected.length) return null;
  try {
    if (!timingSafeEqual(Buffer.from(hmac), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  return token;
}

export const sessionCookieName = COOKIE_NAME;
export const sessionTtlMs = SESSION_TTL_MS;

export function sessionCookieMaxAge(): number {
  return SESSION_TTL_MS / 1000;
}
