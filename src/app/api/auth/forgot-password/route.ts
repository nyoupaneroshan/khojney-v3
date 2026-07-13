import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { RateLimiter } from "@/lib/rate-limit";

const forgotLimiter = new RateLimiter({ windowMs: 60 * 60 * 1000, max: 5 });

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * POST /api/auth/forgot-password
 * Body: { email }
 *
 * Issues a password-reset token. Always returns 200 (even if the email doesn't
 * exist) to prevent email enumeration. The reset link is returned in dev mode
 * for convenience; in production it would be emailed.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = forgotLimiter.check(`forgot:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
      }
    );
  }

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@") || email.length > 254) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, email: true, isActive: true },
  });

  // Always return success to prevent email enumeration.
  if (!user || !user.isActive) {
    return NextResponse.json({
      ok: true,
      message: "If an account exists for that email, a reset link has been sent.",
    });
  }

  // Delete any previous unused tokens for this email (only one active at a time).
  await db.passwordResetToken.deleteMany({ where: { email, used: false } });

  // Issue a new token.
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db.passwordResetToken.create({
    data: { email, token, expires },
  });

  // In production, send an email here. For now, we log it server-side and
  // return a dev-only reset URL so the flow can be tested without SMTP.
  const resetUrl = `${process.env.GOOGLE_REDIRECT_BASE ?? "http://localhost:3000"}/reset-password?token=${token}`;
  console.log(`[forgot-password] Reset link for ${email}: ${resetUrl}`);

  // In dev, include the reset URL in the response so it can be tested without
  // email infrastructure. In production, this is omitted (email is sent instead).
  const isDev = process.env.NODE_ENV !== "production";
  return NextResponse.json({
    ok: true,
    message: "If an account exists for that email, a reset link has been sent.",
    ...(isDev ? { devResetUrl: resetUrl } : {}),
  });
}
