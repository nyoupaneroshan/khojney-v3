import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { slugify, stringifyJson } from "@/lib/admin-utils";
import { bustHospital } from "@/lib/cache-bust";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/hospitals/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const hospital = await db.hospital.findUnique({ where: { id } });
  if (!hospital) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(hospital);
}

// PUT /api/admin/hospitals/[id]
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const existing = await db.hospital.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const slug = body.slug ? slugify(body.slug) : existing.slug;
  if (slug !== existing.slug) {
    const conflict = await db.hospital.findUnique({ where: { slug } });
    if (conflict) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
  }

  const updated = await db.hospital.update({
    where: { id },
    data: {
      slug,
      name: body.name ?? existing.name,
      shortName: body.shortName !== undefined ? body.shortName || null : existing.shortName,
      description: body.description ?? existing.description,
      type: body.type ?? existing.type,
      province: body.province !== undefined ? body.province || null : existing.province,
      district: body.district !== undefined ? body.district || null : existing.district,
      city: body.city !== undefined ? body.city || null : existing.city,
      address: body.address !== undefined ? body.address || null : existing.address,
      establishedYear:
        body.establishedYear !== undefined
          ? body.establishedYear ? Number(body.establishedYear) : null
          : existing.establishedYear,
      website: body.website !== undefined ? body.website || null : existing.website,
      phone: body.phone !== undefined ? body.phone || null : existing.phone,
      emergencyPhone: body.emergencyPhone !== undefined ? body.emergencyPhone || null : existing.emergencyPhone,
      email: body.email !== undefined ? body.email || null : existing.email,
      logo: body.logo !== undefined ? body.logo || null : existing.logo,
      coverImage: body.coverImage !== undefined ? body.coverImage || null : existing.coverImage,
      bedCount:
        body.bedCount !== undefined
          ? body.bedCount != null ? Number(body.bedCount) : null
          : existing.bedCount,
      icuBeds:
        body.icuBeds !== undefined
          ? body.icuBeds != null ? Number(body.icuBeds) : null
          : existing.icuBeds,
      ventilatorCount:
        body.ventilatorCount !== undefined
          ? body.ventilatorCount != null ? Number(body.ventilatorCount) : null
          : existing.ventilatorCount,
      hasEmergency: body.hasEmergency !== undefined ? Boolean(body.hasEmergency) : existing.hasEmergency,
      hasAmbulance: body.hasAmbulance !== undefined ? Boolean(body.hasAmbulance) : existing.hasAmbulance,
      hasBloodBank: body.hasBloodBank !== undefined ? Boolean(body.hasBloodBank) : existing.hasBloodBank,
      hasPharmacy24x7: body.hasPharmacy24x7 !== undefined ? Boolean(body.hasPharmacy24x7) : existing.hasPharmacy24x7,
      departments: body.departments !== undefined ? stringifyJson(body.departments) : existing.departments,
      facilities: body.facilities !== undefined ? stringifyJson(body.facilities) : existing.facilities,
      isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : existing.isPublished,
    },
  });

  bustHospital(slug);

  return NextResponse.json(updated);
}

// DELETE /api/admin/hospitals/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const existing = await db.hospital.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.hospital.delete({ where: { id } });
  bustHospital(existing.slug);

  return NextResponse.json({ ok: true });
}
