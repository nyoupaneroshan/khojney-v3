import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /dashboard/api/notifications/[id]
 * Marks a notification as read. Only the owner can do this.
 */
export async function PATCH(_req: NextRequest, ctx: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const notification = await db.notification.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!notification) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (notification.userId !== session.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const updated = await db.notification.update({
    where: { id },
    data: { read: true },
    select: { id: true, read: true },
  });
  return NextResponse.json({ ok: true, notification: updated });
}

/**
 * DELETE /dashboard/api/notifications/[id]
 * Deletes a notification belonging to the current user.
 */
export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const notification = await db.notification.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!notification) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (notification.userId !== session.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await db.notification.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
