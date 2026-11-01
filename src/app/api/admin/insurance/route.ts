import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { parsePagination, slugify, stringifyJson } from "@/lib/admin-utils";
import { bustInsurance } from "@/lib/cache-bust";

export const dynamic = "force-dynamic";

// GET /api/admin/insurance — paginated, searchable list
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { page, pageSize, q, skip } = parsePagination(req.nextUrl.searchParams);

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { shortName: { contains: q, mode: "insensitive" as const } },
          { type: { contains: q, mode: "insensitive" as const } },
          { headquarters: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    db.insuranceCompany.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.insuranceCompany.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

// POST /api/admin/insurance — create
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => ({}));

  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!body.shortName || typeof body.shortName !== "string") {
    return NextResponse.json({ error: "Short name is required" }, { status: 400 });
  }

  const slug = body.slug ? slugify(body.slug) : slugify(body.name);

  const existing = await db.insuranceCompany.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "An insurance company with this slug already exists" }, { status: 409 });
  }

  const company = await db.insuranceCompany.create({
    data: {
      slug,
      name: body.name,
      shortName: body.shortName,
      description: body.description || "",
      type: body.type || "LIFE",
      establishedYear: body.establishedYear ? Number(body.establishedYear) : null,
      headquarters: body.headquarters || null,
      website: body.website || null,
      phone: body.phone || null,
      email: body.email || null,
      logo: body.logo || null,
      paidUpCapital: body.paidUpCapital != null ? Number(body.paidUpCapital) : null,
      claimSettlementRatio: body.claimSettlementRatio != null ? Number(body.claimSettlementRatio) : null,
      branchCount: body.branchCount != null ? Number(body.branchCount) : null,
      solvencyRatio: body.solvencyRatio != null ? Number(body.solvencyRatio) : null,
      popularPlans: stringifyJson(body.popularPlans || []),
      coverageTypes: stringifyJson(body.coverageTypes || []),
      isFeatured: Boolean(body.isFeatured),
      isPublished: body.isPublished !== false,
    },
  });

  bustInsurance(slug);

  return NextResponse.json(company, { status: 201 });
}
