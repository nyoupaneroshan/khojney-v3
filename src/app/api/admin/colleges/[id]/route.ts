import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "../../../../../../../_lib/require-admin";
import { slugify, stringifyJson } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/colleges/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const college = await db.college.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!college) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(college);
}

// PUT /api/admin/colleges/[id]
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const existing = await db.college.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const slug = body.slug ? slugify(body.slug) : existing.slug;
  if (slug !== existing.slug) {
    const conflict = await db.college.findUnique({ where: { slug } });
    if (conflict) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
  }

  const updated = await db.college.update({
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
          ? body.latitude
            ? Number(body.latitude)
            : null
          : existing.latitude,
      longitude:
        body.longitude !== undefined
          ? body.longitude
            ? Number(body.longitude)
            : null
          : existing.longitude,
      affiliation: body.affiliation ?? existing.affiliation,
      type: body.type ?? existing.type,
      establishedYear:
        body.establishedYear !== undefined
          ? body.establishedYear
            ? Number(body.establishedYear)
            : null
          : existing.establishedYear,
      phone: body.phone ?? existing.phone,
      email: body.email ?? existing.email,
      website: body.website ?? existing.website,
      logo: body.logo ?? existing.logo,
      coverImage: body.coverImage ?? existing.coverImage,
      programs:
        body.programs !== undefined ? stringifyJson(body.programs) : existing.programs,
      facilities:
        body.facilities !== undefined ? stringifyJson(body.facilities) : existing.facilities,
      admissionProcess: body.admissionProcess ?? existing.admissionProcess,
      feesRange: body.feesRange ?? existing.feesRange,
      scholarshipsAvailable:
        body.scholarshipsAvailable !== undefined
          ? Boolean(body.scholarshipsAvailable)
          : existing.scholarshipsAvailable,
      isFeatured:
        body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
      isVerified:
        body.isVerified !== undefined ? Boolean(body.isVerified) : existing.isVerified,
      isPublished:
        body.isPublished !== undefined ? Boolean(body.isPublished) : existing.isPublished,
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/admin/colleges/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  try {
    await db.college.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found or could not be deleted" }, { status: 404 });
  }
}
