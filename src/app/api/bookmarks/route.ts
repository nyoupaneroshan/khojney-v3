import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { handlePrismaError } from "@/lib/prisma-error";

const VALID = [
  "EXAM",
  "COLLEGE",
  "SCHOOL",
  "UNIVERSITY",
  "SCHOLARSHIP",
  "POST",
  "BANK",
  "JOB",
  "GOVERNMENT_SERVICE",
];

const MAX_BOOKMARKS_RETURNED = 500;

/**
 * GET /api/bookmarks — returns the current user's bookmarks.
 * Capped at 500 to bound response size; users with more should use a paginated
 * dashboard view.
 */
export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const b = await db.bookmark.findMany({
      where: { userId: s.id },
      orderBy: { createdAt: "desc" },
      take: MAX_BOOKMARKS_RETURNED,
      select: {
        id: true,
        entity: true,
        entityId: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ bookmarks: b });
  } catch (err) {
    const handled = handlePrismaError(err, "bookmark");
    if (handled) return handled;
    console.error("bookmarks list error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/**
 * POST /api/bookmarks — create a bookmark.
 */
export async function POST(req: NextRequest) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Auth required" }, { status: 401 });

  const { entity, entityId } = (await req.json().catch(() => ({}))) as {
    entity?: string;
    entityId?: string;
  };
  if (!entity || !entityId) {
    return NextResponse.json({ error: "Required" }, { status: 400 });
  }
  if (!VALID.includes(entity)) {
    return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });
  }

  try {
    const b = await db.bookmark.create({
      data: { userId: s.id, entity, entityId },
      select: { id: true, entity: true, entityId: true, createdAt: true },
    });
    return NextResponse.json({ ok: true, bookmark: b });
  } catch (err) {
    // P2002 = unique constraint (already bookmarked)
    const handled = handlePrismaError(err, "bookmark");
    if (handled) return handled;
    console.error("bookmark create error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/**
 * DELETE /api/bookmarks?entity=...&entityId=...
 */
export async function DELETE(req: NextRequest) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const u = new URL(req.url);
  const e = u.searchParams.get("entity");
  const id = u.searchParams.get("entityId");
  if (e && id) {
    try {
      await db.bookmark.deleteMany({
        where: { userId: s.id, entity: e, entityId: id },
      });
      return NextResponse.json({ ok: true });
    } catch (err) {
      const handled = handlePrismaError(err, "bookmark");
      if (handled) return handled;
      console.error("bookmark delete error:", err);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
  }
  return NextResponse.json({ error: "Params required" }, { status: 400 });
}
