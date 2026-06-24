import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setSession } from "@/lib/auth-server";

/**
 * GET /api/auth/google/callback
 *
 * Handles the OAuth 2.0 callback from Google:
 * 1. Verifies the state parameter (CSRF protection)
 * 2. Exchanges the authorization code for access + ID tokens
 * 3. Fetches the user's Google profile (name, email, avatar)
 * 4. Finds or creates a Khojney user with that email
 * 5. Sets the session cookie
 * 6. Redirects to the callback URL (default: /dashboard)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const stateParam = searchParams.get("state");
  const error = searchParams.get("error");

  // User denied consent
  if (error === "access_denied") {
    return NextResponse.redirect(new URL("/login?error=access_denied", req.url));
  }

  if (!code || !stateParam) {
    return NextResponse.redirect(new URL("/login?error=missing_params", req.url));
  }

  // Parse and verify state
  let stateData: { state?: string; callbackUrl?: string; mode?: string };
  try {
    stateData = JSON.parse(stateParam);
  } catch {
    return NextResponse.redirect(new URL("/login?error=invalid_state", req.url));
  }

  const cookieState = req.cookies.get("google_oauth_state")?.value;
  if (!cookieState || cookieState !== stateData.state) {
    return NextResponse.redirect(new URL("/login?error=state_mismatch", req.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectBase = process.env.GOOGLE_REDIRECT_BASE ?? "http://localhost:3000";
  const redirectUri = `${redirectBase}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/login?error=google_not_configured", req.url));
  }

  // Exchange code for tokens
  let tokenResponse: Response;
  try {
    tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
  } catch {
    return NextResponse.redirect(new URL("/login?error=token_exchange_failed", req.url));
  }

  if (!tokenResponse.ok) {
    console.error("Token exchange failed:", await tokenResponse.text());
    return NextResponse.redirect(new URL("/login?error=token_exchange_failed", req.url));
  }

  const tokens = await tokenResponse.json();
  const accessToken = tokens.access_token;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login?error=no_access_token", req.url));
  }

  // Fetch user profile from Google
  let profileResponse: Response;
  try {
    profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch {
    return NextResponse.redirect(new URL("/login?error=profile_fetch_failed", req.url));
  }

  if (!profileResponse.ok) {
    return NextResponse.redirect(new URL("/login?error=profile_fetch_failed", req.url));
  }

  const profile = await profileResponse.json();
  const email = profile.email?.toLowerCase();
  const name = profile.name ?? profile.given_name ?? email?.split("@")[0] ?? "Google User";
  const avatar = profile.picture ?? null;

  if (!email) {
    return NextResponse.redirect(new URL("/login?error=no_email", req.url));
  }

  // Find or create user
  const user = await db.user.upsert({
    where: { email },
    update: {
      // Update name and avatar if the user already exists
      name,
      image: avatar,
    },
    create: {
      email,
      name,
      image: avatar,
      role: "USER",
      passwordHash: null, // Google users don't have a password
      bio: "Signed up via Google",
    },
  });

  // Set session cookie
  await setSession(user.id);

  // Clear the OAuth state cookie
  const callbackUrl = stateData.callbackUrl ?? "/dashboard";
  const res = NextResponse.redirect(new URL(callbackUrl, req.url));
  res.cookies.delete("google_oauth_state");
  return res;
}
