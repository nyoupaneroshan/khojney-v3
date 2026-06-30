import { NextRequest, NextResponse } from "next/server";
import { clearSession } from "@/lib/auth-server";

/**
 * POST /api/auth/logout — clears the signed session cookie + DB session row.
 * Safe from CSRF because:
 *   - It's a POST endpoint (browsers don't fire cross-origin POST without CORS preflight)
 *   - The cookie is SameSite=Lax, so cross-site requests don't carry it anyway
 *   - Logout is not a sensitive operation (no data loss even if forced)
 */
export async function POST(req: NextRequest) {
  await clearSession();
  // Redirect to the host the request came from (works in dev and prod).
  const origin = req.nextUrl.origin;
  return NextResponse.redirect(new URL("/", origin), { status: 303 });
}

// GET handler removed — allowing logout via <a href> or <img src> is a
// low-impact CSRF. Clients should POST instead.
