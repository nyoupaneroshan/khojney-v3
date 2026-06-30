import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { isSafeUrl } from "@/lib/webhook";

export const dynamic = "force-dynamic";

/** GET /api/admin/webhooks — list all webhooks (secret field redacted). */
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const w = await db.webhook.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { logs: true } } },
    select: {
      id: true,
      name: true,
      url: true,
      events: true,
      // `secret` intentionally NOT selected — never expose it to the client.
      isActive: true,
      lastTriggered: true,
      lastStatus: true,
      lastResponse: true,
      triggerCount: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { logs: true } },
    },
  });
  return NextResponse.json({ items: w });
}

/** POST /api/admin/webhooks — create. Validates URL against SSRF blocklist. */
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const b = await req.json().catch(() => ({}));
  if (!b.name || !b.url || !b.events) {
    return NextResponse.json(
      { error: "name, url, and events are required" },
      { status: 400 }
    );
  }

  // Validate URL against SSRF blocklist before storing.
  const safety = isSafeUrl(b.url);
  if (!safety.ok) {
    return NextResponse.json(
      { error: `Webhook URL rejected: ${safety.reason}` },
      { status: 400 }
    );
  }

  // Validate events is a string[] or comma-separated string.
  let events: string[];
  if (Array.isArray(b.events)) {
    events = b.events.filter((e: unknown): e is string => typeof e === "string");
  } else if (typeof b.events === "string") {
    events = b.events.split(",").map((s) => s.trim()).filter(Boolean);
  } else {
    return NextResponse.json(
      { error: "events must be a string array or comma-separated string" },
      { status: 400 }
    );
  }
  if (events.length === 0) {
    return NextResponse.json(
      { error: "events must contain at least one event name" },
      { status: 400 }
    );
  }

  const created = await db.webhook.create({
    data: {
      name: String(b.name).slice(0, 120),
      url: String(b.url).slice(0, 2048),
      events: JSON.stringify(events),
      secret: typeof b.secret === "string" && b.secret ? b.secret : null,
      isActive: b.isActive !== false,
    },
    select: {
      id: true,
      name: true,
      url: true,
      events: true,
      isActive: true,
      createdAt: true,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
