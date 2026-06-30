import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { handlePrismaError } from "@/lib/prisma-error";

export const dynamic = "force-dynamic";

const MAX_ROOT_COMMENTS = 100;
const MAX_REPLIES_PER_COMMENT = 50;
const MAX_COMMENT_LEN = 2000;

/**
 * GET /api/comments?entity=...&entityId=...
 * Returns root comments + their replies (capped).
 */
export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const e = u.searchParams.get("entity");
  const id = u.searchParams.get("entityId");
  if (!e || !id) return NextResponse.json({ error: "Required" }, { status: 400 });

  try {
    const comments = await db.comment.findMany({
      where: { entity: e, entityId: id, isHidden: false, parentId: null },
      orderBy: [{ isPinned: "desc" }, { upvotes: "desc" }, { createdAt: "desc" }],
      take: MAX_ROOT_COMMENTS,
      select: {
        id: true,
        entity: true,
        entityId: true,
        content: true,
        isPinned: true,
        upvotes: true,
        createdAt: true,
        userId: true,
        user: { select: { name: true, image: true } },
        replies: {
          where: { isHidden: false },
          orderBy: { createdAt: "asc" },
          take: MAX_REPLIES_PER_COMMENT,
          select: {
            id: true,
            content: true,
            upvotes: true,
            createdAt: true,
            userId: true,
            user: { select: { name: true, image: true } },
          },
        },
      },
    });
    return NextResponse.json({ comments });
  } catch (err) {
    const handled = handlePrismaError(err, "comment");
    if (handled) return handled;
    console.error("comments list error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/**
 * POST /api/comments — create a comment or reply.
 */
export async function POST(req: NextRequest) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Login required" }, { status: 401 });

  let body: { entity?: string; entityId?: string; content?: string; parentId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { entity, entityId, content, parentId } = body;
  if (!entity || !entityId || !content?.trim()) {
    return NextResponse.json({ error: "Required" }, { status: 400 });
  }
  if (content.trim().length > MAX_COMMENT_LEN) {
    return NextResponse.json({ error: "Too long" }, { status: 400 });
  }

  try {
    const c = await db.comment.create({
      data: {
        entity,
        entityId,
        content: content.trim(),
        userId: s.id,
        parentId: parentId || null,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        upvotes: true,
        user: { select: { name: true, image: true } },
      },
    });
    return NextResponse.json({ ok: true, comment: c }, { status: 201 });
  } catch (err) {
    const handled = handlePrismaError(err, "comment");
    if (handled) return handled;
    console.error("comment create error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/**
 * DELETE /api/comments?id=... — author or admin only.
 */
export async function DELETE(req: NextRequest) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const u = new URL(req.url);
  const id = u.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  try {
    const c = await db.comment.findUnique({ where: { id } });
    if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Authorization: author or admin only
    if (c.userId !== s.id && s.role !== "ADMIN" && s.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.comment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const handled = handlePrismaError(err, "comment");
    if (handled) return handled;
    console.error("comment delete error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
