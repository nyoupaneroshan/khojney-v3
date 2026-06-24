import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/google
 *
 * Initiates the Google OAuth 2.0 sign-in flow.
 * Redirects the user to Google's consent screen.
 * After consent, Google redirects to /api/auth/google/callback.
 */
export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectBase = process.env.GOOGLE_REDIRECT_BASE ?? "http://localhost:3000";

  // If Google OAuth is not configured, redirect to login with an error message
  if (!clientId || !clientSecret || clientId === "your-google-client-id-here") {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("error", "google_not_configured");
    return NextResponse.redirect(loginUrl);
  }

  const redirectUri = `${redirectBase}/api/auth/google/callback`;
  const state = crypto.randomUUID(); // CSRF protection
  const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") ?? "/dashboard";
  const mode = req.nextUrl.searchParams.get("mode") ?? "login";

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    state: JSON.stringify({ state, callbackUrl, mode }),
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  // Store state in a cookie for CSRF verification in the callback
  const res = NextResponse.redirect(googleAuthUrl);
  res.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
    secure: false,
  });

  return res;
}
