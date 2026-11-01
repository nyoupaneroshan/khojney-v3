import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { parsePagination, slugify, stringifyJson } from "@/lib/admin-utils";
import { bustHospital } from "@/lib/cache-bust";

export const dynamic = "force-dynamic";

// GET /api/admin/hospitals — paginated, searchable list
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { page, pageSize, q, skip } = parsePagination(req.nextUrl.searchParams);

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { shortName: { contains: q, mode: "insensitive" as const } },
          { city: { contains: q, mode: "insensitive" as const } },
          { district: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    db.hospital.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.hospital.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

// POST /api/admin/hospitals — create
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => ({}));

  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = body.slug ? slugify(body.slug) : slugify(body.name);

  const existing = await db.hospital.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A hospital with this slug already exists" }, { status: 409 });
  }

  const hospital = await db.hospital.create({
    data: {
      slug,
      name: body.name,
      shortName: body.shortName || null,
      description: body.description || "",
      type: body.type || "GENERAL",
      province: body.province || null,
      district: body.district || null,
      city: body.city || null,
      address: body.address || null,
      establishedYear: body.establishedYear ? Number(body.establishedYear) : null,
      website: body.website || null,
      phone: body.phone || null,
      emergencyPhone: body.emergencyPhone || null,
      email: body.email || null,
      logo: body.logo || null,
      coverImage: body.coverImage || null,
      bedCount: body.bedCount != null ? Number(body.bedCount) : null,
      icuBeds: body.icuBeds != null ? Number(body.icuBeds) : null,
      ventilatorCount: body.ventilatorCount != null ? Number(body.ventilatorCount) : null,
      hasEmergency: body.hasEmergency !== false,
      hasAmbulance: body.hasAmbulance !== false,
      hasBloodBank: Boolean(body.hasBloodBank),
      hasPharmacy24x7: body.hasPharmacy24x7 !== false,
      departments: stringifyJson(body.departments || []),
      facilities: stringifyJson(body.facilities || []),
      isFeatured: Boolean(body.isFeatured),
      isPublished: body.isPublished !== false,
    },
  });

  bustHospital(slug);

  return NextResponse.json(hospital, { status: 201 });
}
