/**
 * Server-only helpers for admin API routes.
 *
 * IMPORTANT: This file imports `@/lib/auth` which depends on `next/headers`.
 * It must ONLY be imported by server-side route handlers. Never import from
 * client components.
 */
import { NextResponse } from "next/server";
import { getSession, isAdmin, type SessionUser } from "@/lib/auth-server";

export interface AdminCheckResult {
  user: SessionUser | null;
  error: NextResponse | null;
}

/**
 * Get the session and verify the user is an admin.
 * Returns `{ user, error }` — if `error` is set, return it from the handler.
 */
export async function requireAdmin(): Promise<AdminCheckResult> {
  const user = await getSession();
  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  if (!isAdmin(user.role)) {
    return {
      user: null,
      error: NextResponse.json(
        { error: "Forbidden — admin access required" },
        { status: 403 }
      ),
    };
  }
  return { user, error: null };
}
