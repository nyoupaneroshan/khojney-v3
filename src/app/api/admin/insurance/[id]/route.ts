import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { slugify, stringifyJson } from "@/lib/admin-utils";
import { bustInsurance } from "@/lib/cache-bust";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/insurance/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const company = await db.insuranceCompany.findUnique({ where: { id } });
  if (!company) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(company);
}

// PUT /api/admin/insurance/[id]
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const existing = await db.insuranceCompany.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const slug = body.slug ? slugify(body.slug) : existing.slug;
  if (slug !== existing.slug) {
    const conflict = await db.insuranceCompany.findUnique({ where: { slug } });
    if (conflict) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
  }

  const updated = await db.insuranceCompany.update({
    where: { id },
    data: {
      slug,
      name: body.name ?? existing.name,
      shortName: body.shortName ?? existing.shortName,
      description: body.description ?? existing.description,
      type: body.type ?? existing.type,
      establishedYear:
        body.establishedYear !== undefined
          ? body.establishedYear ? Number(body.establishedYear) : null
          : existing.establishedYear,
      headquarters: body.headquarters !== undefined ? body.headquarters || null : existing.headquarters,
      website: body.website !== undefined ? body.website || null : existing.website,
      phone: body.phone !== undefined ? body.phone || null : existing.phone,
      email: body.email !== undefined ? body.email || null : existing.email,
      logo: body.logo !== undefined ? body.logo || null : existing.logo,
      paidUpCapital:
        body.paidUpCapital !== undefined
          ? body.paidUpCapital != null ? Number(body.paidUpCapital) : null
          : existing.paidUpCapital,
      claimSettlementRatio:
        body.claimSettlementRatio !== undefined
          ? body.claimSettlementRatio != null ? Number(body.claimSettlementRatio) : null
          : existing.claimSettlementRatio,
      branchCount:
        body.branchCount !== undefined
          ? body.branchCount != null ? Number(body.branchCount) : null
          : existing.branchCount,
      solvencyRatio:
        body.solvencyRatio !== undefined
          ? body.solvencyRatio != null ? Number(body.solvencyRatio) : null
          : existing.solvencyRatio,
      popularPlans: body.popularPlans !== undefined ? stringifyJson(body.popularPlans) : existing.popularPlans,
      coverageTypes: body.coverageTypes !== undefined ? stringifyJson(body.coverageTypes) : existing.coverageTypes,
      isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : existing.isPublished,
    },
  });

  bustInsurance(slug);

  return NextResponse.json(updated);
}

// DELETE /api/admin/insurance/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const existing = await db.insuranceCompany.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.insuranceCompany.delete({ where: { id } });
  bustInsurance(existing.slug);

  return NextResponse.json({ ok: true });
}
