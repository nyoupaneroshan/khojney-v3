import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { slugify } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const item = await db.blogPost.findUnique({
    where: { id },
    include: {
      category: true,
      author: { select: { id: true, name: true, email: true } },
      tags: true,
    },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const existing = await db.blogPost.findUnique({ where: { id }, include: { tags: true } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const slug = body.slug ? slugify(body.slug) : existing.slug;
  if (slug !== existing.slug) {
    const conflict = await db.blogPost.findUnique({ where: { slug } });
    if (conflict) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  // Tag sync: disconnect all, connect new ones
  const tagIds: string[] | undefined = Array.isArray(body.tagIds) ? body.tagIds : undefined;
  const tagDisconnect = existing.tags.map((t) => ({ id: t.id }));

  const updated = await db.blogPost.update({
    where: { id },
    data: {
      slug,
      title: body.title ?? existing.title,
      excerpt: body.excerpt !== undefined ? body.excerpt : existing.excerpt,
      content: body.content ?? existing.content,
      coverImage: body.coverImage !== undefined ? body.coverImage : existing.coverImage,
      categoryId:
        body.categoryId !== undefined ? body.categoryId || null : existing.categoryId,
      status: body.status ?? existing.status,
      featured: body.featured !== undefined ? Boolean(body.featured) : existing.featured,
      readTimeMin:
        body.readTimeMin !== undefined ? Number(body.readTimeMin) : existing.readTimeMin,
      metaTitle: body.metaTitle !== undefined ? body.metaTitle : existing.metaTitle,
      metaDescription:
        body.metaDescription !== undefined ? body.metaDescription : existing.metaDescription,
      publishedAt:
        body.publishedAt !== undefined
          ? body.publishedAt ? new Date(body.publishedAt) : new Date()
          : existing.publishedAt,
      tags:
        tagIds !== undefined
          ? {
              disconnect: tagDisconnect,
              connect: tagIds.map((tid) => ({ id: tid })),
            }
          : undefined,
    },
    include: { tags: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  try {
    await db.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found or could not be deleted" }, { status: 404 });
  }
}
