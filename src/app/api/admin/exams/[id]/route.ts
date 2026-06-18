import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "../../../../../../../_lib/require-admin";
import { slugify } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const item = await db.exam.findUnique({
    where: { id },
    include: {
      category: true,
      questions: { orderBy: { order: "asc" } },
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

  const existing = await db.exam.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const slug = body.slug ? slugify(body.slug) : existing.slug;
  if (slug !== existing.slug) {
    const conflict = await db.exam.findUnique({ where: { slug } });
    if (conflict) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const updated = await db.exam.update({
    where: { id },
    data: {
      slug,
      title: body.title ?? existing.title,
      description: body.description ?? existing.description,
      categoryId: body.categoryId !== undefined ? body.categoryId || null : existing.categoryId,
      examType: body.examType ?? existing.examType,
      durationMin: body.durationMin !== undefined ? Number(body.durationMin) : existing.durationMin,
      totalMarks: body.totalMarks !== undefined ? Number(body.totalMarks) : existing.totalMarks,
      passingMarks:
        body.passingMarks !== undefined
          ? body.passingMarks ? Number(body.passingMarks) : null
          : existing.passingMarks,
      difficulty: body.difficulty ?? existing.difficulty,
      isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : existing.isPublished,
      tags: body.tags !== undefined ? body.tags : existing.tags,
      coverImage: body.coverImage ?? existing.coverImage,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  try {
    await db.exam.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found or could not be deleted" }, { status: 404 });
  }
}
