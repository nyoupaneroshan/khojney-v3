import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth-server";

/**
 * POST /api/auth/logout — clears the session cookie (called from header dropdown).
 * GET  /api/auth/logout — same, but redirects to home (for direct link clicks / no-JS fallback).
 */
export async function POST() {
  await clearSession();
  return NextResponse.json({ ok: true });
}

export async function GET() {
  await clearSession();
  return NextResponse.redirect(new URL("/", "http://localhost:3000"), {
    status: 303,
  });
}
