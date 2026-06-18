import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "../../../../../../../_lib/require-admin";
import { slugify, stringifyJson } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const item = await db.scholarship.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const existing = await db.scholarship.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const slug = body.slug ? slugify(body.slug) : existing.slug;
  if (slug !== existing.slug) {
    const conflict = await db.scholarship.findUnique({ where: { slug } });
    if (conflict) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const updated = await db.scholarship.update({
    where: { id },
    data: {
      slug,
      title: body.title ?? existing.title,
      description: body.description ?? existing.description,
      provider: body.provider ?? existing.provider,
      providerUrl: body.providerUrl ?? existing.providerUrl,
      categoryId: body.categoryId !== undefined ? body.categoryId || null : existing.categoryId,
      level: body.level ?? existing.level,
      field: body.field ?? existing.field,
      amount: body.amount ?? existing.amount,
      eligibility: body.eligibility !== undefined ? stringifyJson(body.eligibility) : existing.eligibility,
      deadline:
        body.deadline !== undefined
          ? body.deadline ? new Date(body.deadline) : null
          : existing.deadline,
      applicationOpen:
        body.applicationOpen !== undefined
          ? body.applicationOpen ? new Date(body.applicationOpen) : null
          : existing.applicationOpen,
      applicationUrl: body.applicationUrl ?? existing.applicationUrl,
      country: body.country ?? existing.country,
      province: body.province ?? existing.province,
      isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : existing.isPublished,
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
    await db.scholarship.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found or could not be deleted" }, { status: 404 });
  }
}
