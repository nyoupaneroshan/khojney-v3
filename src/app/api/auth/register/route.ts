import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { demoLogin } from "@/lib/auth-server";
import { requireAdmin } from "../../../../../../_lib/require-admin";

interface RegisterPayload {
  name?: string;
  email?: string;
  password?: string;
}

/**
 * POST /api/auth/register
 * Accepts { name, email, password } and creates/updates a demo user.
 * Reuses demoLogin which auto-creates users. If user already exists,
 * update their name (so registration can personalize the display name).
 */
export async function POST(req: NextRequest) {
  let body: RegisterPayload;
  try {
    body = (await req.json()) as RegisterPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const name = body.name?.trim();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (!body.password || body.password.length < 4) {
    return NextResponse.json(
      { error: "Password must be at least 4 characters" },
      { status: 400 },
    );
  }
  if (!name || name.length < 2) {
    return NextResponse.json(
      { error: "Please provide your name" },
      { status: 400 },
    );
  }

  // Ensure user exists, then update display name
  const user = await demoLogin(email, body.password);
  const updated = await db.user.update({
    where: { id: user.id },
    data: { name },
    select: { id: true, email: true, name: true, role: true },
  });

  return NextResponse.json({ ok: true, user: updated });
}
