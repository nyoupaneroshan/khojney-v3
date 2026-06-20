import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { demoLogin } from "@/lib/auth-server";

interface LoginPayload {
  email?: string;
  password?: string;
  name?: string;
}

/**
 * POST /api/auth/login
 * Accepts { email, password } — any password works for demo accounts.
 * Also auto-creates a new user if the email doesn't exist.
 */
export async function POST(req: NextRequest) {
  let body: LoginPayload;
  try {
    body = (await req.json()) as LoginPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (!body.password || body.password.length < 1) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  const user = await demoLogin(email, body.password);

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
