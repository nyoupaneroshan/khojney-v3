import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, clearAllUserSessions } from "@/lib/auth-server";
import { RateLimiter } from "@/lib/rate-limit";

const resetLimiter = new RateLimiter({ windowMs: 60 * 60 * 1000, max: 10 });

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * POST /api/auth/reset-password
 * Body: { token, password }
 *
 * Validates the reset token (exists, not used, not expired), updates the
 * user's password, marks the token as used, and revokes all existing sessions
 * so they must log in with the new password.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = resetLimiter.check(`reset:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
      }
    );
  }

  let body: { token?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const token = body.token?.trim();
  if (!token || token.length < 32) {
    return NextResponse.json({ error: "Invalid reset token" }, { status: 400 });
  }

  const password = body.password ?? "";
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }
  if (password.length > 1024) {
    return NextResponse.json({ error: "Password is too long" }, { status: 400 });
  }

  // Look up the token.
  const resetToken = await db.passwordResetToken.findUnique({
    where: { token },
  });
  if (!resetToken) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }
  if (resetToken.used) {
    return NextResponse.json({ error: "This reset link has already been used" }, { status: 400 });
  }
  if (resetToken.expires.getTime() < Date.now()) {
    return NextResponse.json({ error: "This reset link has expired" }, { status: 400 });
  }

  // Find the user.
  const user = await db.user.findUnique({
    where: { email: resetToken.email },
    select: { id: true, isActive: true },
  });
  if (!user || !user.isActive) {
    return NextResponse.json({ error: "Account not found or deactivated" }, { status: 400 });
  }

  // Hash the new password and update.
  const passwordHash = await hashPassword(password);
  await db.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  // Mark the token as used (single-use).
  await db.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { used: true },
  });

  // Delete any other unused tokens for this email.
  await db.passwordResetToken.deleteMany({
    where: { email: resetToken.email, used: false },
  });

  // Revoke all existing sessions so the user must log in with the new password.
  await clearAllUserSessions(user.id);

  return NextResponse.json({ ok: true, message: "Password updated. Please log in." });
}
