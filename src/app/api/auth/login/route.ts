import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, setSession } from "@/lib/auth-server";
import { loginLimiter } from "@/lib/rate-limit";

interface LoginPayload {
  email?: string;
  password?: string;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * POST /api/auth/login
 * Verifies email + bcrypt password, issues a signed session cookie.
 * Rate-limited to 5 attempts per 15 minutes per IP.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = loginLimiter.check(`login:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  let body: LoginPayload;
  try {
    body = (await req.json()) as LoginPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@") || email.length > 254) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (!body.password || body.password.length < 1 || body.password.length > 1024) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  const user = await verifyPassword(email, body.password);
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  await setSession(user.id);
  // Reset the rate limiter on successful login so the user isn't penalized.
  loginLimiter.reset(`login:${ip}`);

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}
