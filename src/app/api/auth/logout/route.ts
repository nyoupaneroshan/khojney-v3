import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth-server";
import { requireAdmin } from "../../../../../../_lib/require-admin";

/**
 * POST /api/auth/logout
 * Clears the session cookie.
 */
export async function POST() {
  await clearSession();
  return NextResponse.json({ ok: true });
}
