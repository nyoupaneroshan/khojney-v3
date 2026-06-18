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
  const item = await db.school.findUnique({
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

  const existing = await db.school.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const slug = body.slug ? slugify(body.slug) : existing.slug;
  if (slug !== existing.slug) {
    const conflict = await db.school.findUnique({ where: { slug } });
    if (conflict) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const updated = await db.school.update({
    where: { id },
    data: {
      slug,
      name: body.name ?? existing.name,
      description: body.description ?? existing.description,
      categoryId: body.categoryId !== undefined ? body.categoryId || null : existing.categoryId,
      province: body.province ?? existing.province,
      district: body.district ?? existing.district,
      city: body.city ?? existing.city,
      address: body.address ?? existing.address,
      latitude:
        body.latitude !== undefined
          ? body.latitude ? Number(body.latitude) : null
          : existing.latitude,
      longitude:
        body.longitude !== undefined
          ? body.longitude ? Number(body.longitude) : null
          : existing.longitude,
      level: body.level ?? existing.level,
      type: body.type ?? existing.type,
      affiliation: body.affiliation ?? existing.affiliation,
      establishedYear:
        body.establishedYear !== undefined
          ? body.establishedYear ? Number(body.establishedYear) : null
          : existing.establishedYear,
      phone: body.phone ?? existing.phone,
      email: body.email ?? existing.email,
      website: body.website ?? existing.website,
      logo: body.logo ?? existing.logo,
      coverImage: body.coverImage ?? existing.coverImage,
      programs: body.programs !== undefined ? stringifyJson(body.programs) : existing.programs,
      facilities: body.facilities !== undefined ? stringifyJson(body.facilities) : existing.facilities,
      feesRange: body.feesRange ?? existing.feesRange,
      admissionProcess: body.admissionProcess ?? existing.admissionProcess,
      isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
      isVerified: body.isVerified !== undefined ? Boolean(body.isVerified) : existing.isVerified,
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : existing.isPublished,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  try {
    await db.school.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found or could not be deleted" }, { status: 404 });
  }
}
