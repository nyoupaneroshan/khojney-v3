import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { parsePagination, slugify } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { page, pageSize, q, skip } = parsePagination(req.nextUrl.searchParams);
  const status = req.nextUrl.searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { slug: { contains: q } },
      { excerpt: { contains: q } },
    ];
  }
  if (status) where.status = status;

  const [items, total] = await Promise.all([
    db.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: {
        category: { select: { id: true, name: true } },
        author: { select: { id: true, name: true, email: true } },
        tags: { select: { id: true, name: true } },
      },
    }),
    db.blogPost.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => ({}));
  if (!body.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const slug = body.slug ? slugify(body.slug) : slugify(body.title);
  const existing = await db.blogPost.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
  }

  const tagIds: string[] = Array.isArray(body.tagIds) ? body.tagIds : [];

  const post = await db.blogPost.create({
    data: {
      slug,
      title: body.title,
      excerpt: body.excerpt ?? null,
      content: body.content ?? "",
      coverImage: body.coverImage ?? null,
      categoryId: body.categoryId || null,
      authorId: user?.id ?? null,
      status: body.status ?? "DRAFT",
      featured: Boolean(body.featured),
      readTimeMin: body.readTimeMin ? Number(body.readTimeMin) : 5,
      metaTitle: body.metaTitle ?? null,
      metaDescription: body.metaDescription ?? null,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      tags: tagIds.length
        ? { connect: tagIds.map((id) => ({ id })) }
        : undefined,
    },
    include: { tags: true },
  });

  return NextResponse.json(post, { status: 201 });
}
