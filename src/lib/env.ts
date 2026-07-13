/**
 * Environment variable validation.
 * Import this once from src/lib/db.ts (and any other server entry point)
 * to fail fast at startup if required env vars are missing.
 */
import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    // In dev, fall back to a deterministic placeholder so the app still runs.
    // In production, hard-fail.
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `Missing required env var: ${name}. Set it in your deployment environment.`
      );
    }
    return "";
  }
  return value.trim();
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? "file:./dev.db",
  SESSION_SECRET: required("SESSION_SECRET"),
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? "",
  GOOGLE_REDIRECT_BASE:
    process.env.GOOGLE_REDIRECT_BASE ?? "http://localhost:3000",
  NEXT_PUBLIC_ADSENSE_CLIENT: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
  NODE_ENV: process.env.NODE_ENV ?? "development",
  isProd: process.env.NODE_ENV === "production",
};

/**
 * True if the session secret is configured for production use.
 * In dev with an empty/placeholder secret, we still allow logins but
 * log a warning on startup.
 */
export function hasSessionSecret(): boolean {
  return env.SESSION_SECRET.length >= 32;
}
