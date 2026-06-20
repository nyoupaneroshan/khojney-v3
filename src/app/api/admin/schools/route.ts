import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { parsePagination, slugify, stringifyJson } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

// GET /api/admin/schools
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { page, pageSize, q, skip } = parsePagination(req.nextUrl.searchParams);
  const where = q
    ? {
        OR: [
          { name: { contains: q } },
          { slug: { contains: q } },
          { city: { contains: q } },
          { affiliation: { contains: q } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    db.school.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: { category: { select: { id: true, name: true } } },
    }),
    db.school.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

// POST /api/admin/schools
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => ({}));
  if (!body.name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = body.slug ? slugify(body.slug) : slugify(body.name);
  const existing = await db.school.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A school with this slug already exists" }, { status: 409 });
  }

  const school = await db.school.create({
    data: {
      slug,
      name: body.name,
      description: body.description ?? "",
      categoryId: body.categoryId || null,
      province: body.province ?? null,
      district: body.district ?? null,
      city: body.city ?? null,
      address: body.address ?? null,
      latitude: body.latitude ? Number(body.latitude) : null,
      longitude: body.longitude ? Number(body.longitude) : null,
      level: body.level ?? null,
      type: body.type ?? "PRIVATE",
      affiliation: body.affiliation ?? null,
      establishedYear: body.establishedYear ? Number(body.establishedYear) : null,
      phone: body.phone ?? null,
      email: body.email ?? null,
      website: body.website ?? null,
      logo: body.logo ?? null,
      coverImage: body.coverImage ?? null,
      programs: stringifyJson(body.programs ?? []),
      facilities: stringifyJson(body.facilities ?? []),
      feesRange: body.feesRange ?? null,
      admissionProcess: body.admissionProcess ?? null,
      isFeatured: Boolean(body.isFeatured),
      isVerified: Boolean(body.isVerified),
      isPublished: body.isPublished !== false,
    },
  });

  return NextResponse.json(school, { status: 201 });
}
