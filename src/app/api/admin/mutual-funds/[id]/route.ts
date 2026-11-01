import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { slugify, stringifyJson } from "@/lib/admin-utils";
import { bustMutualFund } from "@/lib/cache-bust";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/mutual-funds/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const mutualFund = await db.mutualFund.findUnique({ where: { id } });
  if (!mutualFund) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(mutualFund);
}

// PUT /api/admin/mutual-funds/[id]
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const existing = await db.mutualFund.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const slug = body.slug ? slugify(body.slug) : existing.slug;
  if (slug !== existing.slug) {
    const conflict = await db.mutualFund.findUnique({ where: { slug } });
    if (conflict) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
  }

  const updated = await db.mutualFund.update({
    where: { id },
    data: {
      slug,
      name: body.name ?? existing.name,
      schemeCode: body.schemeCode !== undefined ? body.schemeCode || null : existing.schemeCode,
      fundManager: body.fundManager ?? existing.fundManager,
      sponsor: body.sponsor !== undefined ? body.sponsor || null : existing.sponsor,
      description: body.description ?? existing.description,
      fundType: body.fundType ?? existing.fundType,
      category: body.category ?? existing.category,
      nav:
        body.nav !== undefined
          ? body.nav != null ? Number(body.nav) : null
          : existing.nav,
      navDate:
        body.navDate !== undefined
          ? body.navDate ? new Date(body.navDate) : null
          : existing.navDate,
      fundSize:
        body.fundSize !== undefined
          ? body.fundSize != null ? Number(body.fundSize) : null
          : existing.fundSize,
      totalUnits:
        body.totalUnits !== undefined
          ? body.totalUnits != null ? Number(body.totalUnits) : null
          : existing.totalUnits,
      maturityDate:
        body.maturityDate !== undefined
          ? body.maturityDate ? new Date(body.maturityDate) : null
          : existing.maturityDate,
      launchDate:
        body.launchDate !== undefined
          ? body.launchDate ? new Date(body.launchDate) : null
          : existing.launchDate,
      dividendYield:
        body.dividendYield !== undefined
          ? body.dividendYield != null ? Number(body.dividendYield) : null
          : existing.dividendYield,
      latestDividend:
        body.latestDividend !== undefined ? body.latestDividend || null : existing.latestDividend,
      topHoldings: body.topHoldings !== undefined ? stringifyJson(body.topHoldings) : existing.topHoldings,
      website: body.website !== undefined ? body.website || null : existing.website,
      contactPhone: body.contactPhone !== undefined ? body.contactPhone || null : existing.contactPhone,
      isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : existing.isPublished,
    },
  });

  bustMutualFund(slug);

  return NextResponse.json(updated);
}

// DELETE /api/admin/mutual-funds/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const existing = await db.mutualFund.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.mutualFund.delete({ where: { id } });
  bustMutualFund(existing.slug);

  return NextResponse.json({ ok: true });
}
