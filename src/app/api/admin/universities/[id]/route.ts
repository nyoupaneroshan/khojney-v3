import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { slugify, stringifyJson } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const item = await db.university.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const existing = await db.university.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const slug = body.slug ? slugify(body.slug) : existing.slug;
  if (slug !== existing.slug) {
    const conflict = await db.university.findUnique({ where: { slug } });
    if (conflict) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const updated = await db.university.update({
    where: { id },
    data: {
      slug,
      name: body.name ?? existing.name,
      description: body.description ?? existing.description,
      establishedYear:
        body.establishedYear !== undefined
          ? body.establishedYear ? Number(body.establishedYear) : null
          : existing.establishedYear,
      province: body.province ?? existing.province,
      city: body.city ?? existing.city,
      address: body.address ?? existing.address,
      phone: body.phone ?? existing.phone,
      email: body.email ?? existing.email,
      website: body.website ?? existing.website,
      logo: body.logo ?? existing.logo,
      coverImage: body.coverImage ?? existing.coverImage,
      type: body.type ?? existing.type,
      ranking:
        body.ranking !== undefined
          ? body.ranking ? Number(body.ranking) : null
          : existing.ranking,
      totalCampuses:
        body.totalCampuses !== undefined ? Number(body.totalCampuses) : existing.totalCampuses,
      totalStudents:
        body.totalStudents !== undefined
          ? body.totalStudents ? Number(body.totalStudents) : null
          : existing.totalStudents,
      faculties: body.faculties !== undefined ? stringifyJson(body.faculties) : existing.faculties,
      programs: body.programs !== undefined ? stringifyJson(body.programs) : existing.programs,
      admissionProcess: body.admissionProcess ?? existing.admissionProcess,
      notices: body.notices !== undefined ? stringifyJson(body.notices) : existing.notices,
      results: body.results !== undefined ? stringifyJson(body.results) : existing.results,
      isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
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
    await db.university.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found or could not be deleted" }, { status: 404 });
  }
}
