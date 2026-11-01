import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { parsePagination, slugify, stringifyJson } from "@/lib/admin-utils";
import { bustMutualFund } from "@/lib/cache-bust";

export const dynamic = "force-dynamic";

// GET /api/admin/mutual-funds — paginated, searchable list
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { page, pageSize, q, skip } = parsePagination(req.nextUrl.searchParams);

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { schemeCode: { contains: q, mode: "insensitive" as const } },
          { fundManager: { contains: q, mode: "insensitive" as const } },
          { sponsor: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    db.mutualFund.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.mutualFund.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

// POST /api/admin/mutual-funds — create
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => ({}));

  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!body.fundManager || typeof body.fundManager !== "string") {
    return NextResponse.json({ error: "Fund manager is required" }, { status: 400 });
  }

  const slug = body.slug ? slugify(body.slug) : slugify(body.name);

  const existing = await db.mutualFund.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A mutual fund with this slug already exists" }, { status: 409 });
  }

  const mutualFund = await db.mutualFund.create({
    data: {
      slug,
      name: body.name,
      schemeCode: body.schemeCode || null,
      fundManager: body.fundManager,
      sponsor: body.sponsor || null,
      description: body.description || "",
      fundType: body.fundType || "CLOSE_ENDED",
      category: body.category || "EQUITY",
      nav: body.nav != null ? Number(body.nav) : null,
      navDate: body.navDate ? new Date(body.navDate) : null,
      fundSize: body.fundSize != null ? Number(body.fundSize) : null,
      totalUnits: body.totalUnits != null ? Number(body.totalUnits) : null,
      maturityDate: body.maturityDate ? new Date(body.maturityDate) : null,
      launchDate: body.launchDate ? new Date(body.launchDate) : null,
      dividendYield: body.dividendYield != null ? Number(body.dividendYield) : null,
      latestDividend: body.latestDividend || null,
      topHoldings: stringifyJson(body.topHoldings || []),
      website: body.website || null,
      contactPhone: body.contactPhone || null,
      isFeatured: Boolean(body.isFeatured),
      isPublished: body.isPublished !== false,
    },
  });

  bustMutualFund(slug);

  return NextResponse.json(mutualFund, { status: 201 });
}
