import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { triggerWebhooks, isSafeUrl } from "@/lib/webhook";

export const dynamic = "force-dynamic";

/** PUT /api/admin/webhooks/[id] — update. Validates URL on change. */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const b = await req.json().catch(() => ({}));

  if (b.url !== undefined) {
    const safety = isSafeUrl(b.url);
    if (!safety.ok) {
      return NextResponse.json(
        { error: `Webhook URL rejected: ${safety.reason}` },
        { status: 400 }
      );
    }
  }

  const u = await db.webhook.update({
    where: { id },
    data: {
      ...(b.name !== undefined && { name: String(b.name).slice(0, 120) }),
      ...(b.url !== undefined && { url: String(b.url).slice(0, 2048) }),
      ...(b.events !== undefined && {
        events:
          typeof b.events === "string"
            ? b.events
            : JSON.stringify(b.events),
      }),
      ...(b.secret !== undefined && {
        secret: typeof b.secret === "string" && b.secret ? b.secret : null,
      }),
      ...(b.isActive !== undefined && { isActive: !!b.isActive }),
    },
    select: {
      id: true,
      name: true,
      url: true,
      events: true,
      isActive: true,
      updatedAt: true,
    },
  });
  return NextResponse.json(u);
}

/** DELETE /api/admin/webhooks/[id] */
export async function DELETE(
  _r: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  await db.webhook.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

/** POST /api/admin/webhooks/[id] — send a test event. */
export async function POST(
  _r: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const w = await db.webhook.findUnique({ where: { id } });
  if (!w) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await triggerWebhooks("webhook.test", { message: "Test", webhookId: id });
  return NextResponse.json({ ok: true });
}
