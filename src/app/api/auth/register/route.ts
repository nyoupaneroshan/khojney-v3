import { NextRequest, NextResponse } from "next/server";
import { createUserWithEmail, setSession } from "@/lib/auth-server";
import { registerLimiter } from "@/lib/rate-limit";

interface RegisterPayload {
  name?: string;
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
 * POST /api/auth/register
 * Creates a new USER-role account with a bcrypt-hashed password and issues a
 * signed session cookie. Rate-limited to 5 registrations per hour per IP.
 * New users are NEVER granted admin role — that requires DB-side promotion.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = registerLimiter.check(`register:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many registration attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  let body: RegisterPayload;
  try {
    body = (await req.json()) as RegisterPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const name = body.name?.trim();
  if (!email || !email.includes("@") || email.length > 254) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (!body.password || body.password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }
  if (body.password.length > 1024) {
    return NextResponse.json(
      { error: "Password is too long" },
      { status: 400 },
    );
  }
  if (!name || name.length < 2 || name.length > 80) {
    return NextResponse.json(
      { error: "Please provide your name (2–80 characters)" },
      { status: 400 },
    );
  }

  const user = await createUserWithEmail(email, name, body.password);
  if (!user) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 },
    );
  }

  await setSession(user.id);
  registerLimiter.reset(`register:${ip}`);

  return NextResponse.json({ ok: true, user });
}
