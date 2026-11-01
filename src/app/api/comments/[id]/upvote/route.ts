import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { RateLimiter } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const upvoteLimiter = new RateLimiter({ windowMs: 60 * 1000, max: 30 });

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const rl = upvoteLimiter.check(`upvote:${s.id}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many upvotes. Please slow down." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } },
    );
  }

  const { id } = await params;
  const c = await db.comment.findUnique({ where: { id }, select: { id: true, upvotes: true } });
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const u = await db.comment.update({
    where: { id },
    data: { upvotes: { increment: 1 } },
    select: { id: true, upvotes: true },
  });
  return NextResponse.json({ ok: true, upvotes: u.upvotes });
}
