import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "../../../../../../_lib/require-admin";
import { parsePagination, slugify, stringifyJson } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

// GET /api/admin/colleges — paginated, searchable list
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
    db.college.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: { category: { select: { id: true, name: true } } },
    }),
    db.college.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

// POST /api/admin/colleges — create
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => ({}));

  // Required fields
  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = body.slug ? slugify(body.slug) : slugify(body.name);

  // Check slug uniqueness
  const existing = await db.college.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A college with this slug already exists" }, { status: 409 });
  }

  const college = await db.college.create({
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
      affiliation: body.affiliation ?? null,
      type: body.type ?? "PRIVATE",
      establishedYear: body.establishedYear ? Number(body.establishedYear) : null,
      phone: body.phone ?? null,
      email: body.email ?? null,
      website: body.website ?? null,
      logo: body.logo ?? null,
      coverImage: body.coverImage ?? null,
      programs: stringifyJson(body.programs ?? []),
      facilities: stringifyJson(body.facilities ?? []),
      admissionProcess: body.admissionProcess ?? null,
      feesRange: body.feesRange ?? null,
      scholarshipsAvailable: Boolean(body.scholarshipsAvailable),
      isFeatured: Boolean(body.isFeatured),
      isVerified: Boolean(body.isVerified),
      isPublished: body.isPublished !== false,
    },
  });

  return NextResponse.json(college, { status: 201 });
}
