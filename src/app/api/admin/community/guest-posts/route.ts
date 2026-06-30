import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { handlePrismaError } from "@/lib/prisma-error";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/community/guest-posts
 * Paginated list of guest post submissions. Capped to 100 per page.
 */
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(sp.get("pageSize") ?? "50", 10) || 50));
  const status = sp.get("status"); // PENDING | APPROVED | PUBLISHED | REJECTED
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  try {
    const [items, total] = await Promise.all([
      db.guestPost.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          status: true,
          authorName: true,
          coverImage: true,
          createdAt: true,
          reviewedAt: true,
          category: { select: { name: true } },
        },
      }),
      db.guestPost.count({ where }),
    ]);
    return NextResponse.json({ items, total, page, pageSize });
  } catch (err) {
    const handled = handlePrismaError(err, "guest post");
    if (handled) return handled;
    console.error("guest-posts list error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/**
 * POST /api/admin/community/guest-posts
 * Approve / publish / reject a guest post submission.
 */
export async function POST(req: NextRequest) {
  const { user, error } = await requireAdmin();
  if (error) return error;

  let body: { id?: string; action?: string; adminNotes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id, action, adminNotes } = body;
  if (!id || !action) {
    return NextResponse.json({ error: "id and action are required" }, { status: 400 });
  }
  if (!["approve", "publish", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  try {
    const p = await db.guestPost.findUnique({ where: { id } });
    if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const status = action === "approve" ? "APPROVED" : action === "publish" ? "PUBLISHED" : "REJECTED";

    if (action === "publish") {
      const sl = (s: string) =>
        s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      let slug = sl(p.title);
      const ex = await db.blogPost.findUnique({ where: { slug } });
      if (ex) slug = `${slug}-${Date.now().toString(36)}`;
      await db.blogPost.create({
        data: {
          title: p.title,
          slug,
          excerpt: p.excerpt,
          content: p.content,
          coverImage: p.coverImage,
          categoryId: p.categoryId,
          authorId: p.authorId,
          status: "PUBLISHED",
          featured: false,
          readTimeMin: Math.max(3, Math.ceil(p.content.split(" ").length / 200)),
          publishedAt: new Date(),
        },
      });
    }

    const u = await db.guestPost.update({
      where: { id },
      data: {
        status,
        adminNotes: adminNotes || null,
        reviewedBy: user!.id,
        reviewedAt: new Date(),
      },
    });
    return NextResponse.json({ ok: true, post: u });
  } catch (err) {
    const handled = handlePrismaError(err, "guest post");
    if (handled) return handled;
    console.error("guest-posts action error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
