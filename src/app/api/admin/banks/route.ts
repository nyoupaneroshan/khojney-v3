import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { parsePagination, slugify, stringifyJson } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

// GET /api/admin/banks — paginated, searchable list
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { page, pageSize, q, skip } = parsePagination(req.nextUrl.searchParams);

  const where = q
    ? {
        OR: [
          { name: { contains: q } },
          { shortName: { contains: q } },
          { slug: { contains: q } },
          { headquarters: { contains: q } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    db.bank.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.bank.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

// POST /api/admin/banks — create
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => ({}));

  // Required fields
  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!body.shortName || typeof body.shortName !== "string") {
    return NextResponse.json({ error: "Short name is required" }, { status: 400 });
  }

  const slug = body.slug ? slugify(body.slug) : slugify(body.name);

  // Check slug uniqueness
  const existing = await db.bank.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A bank with this slug already exists" }, { status: 409 });
  }

  const bank = await db.bank.create({
    data: {
      slug,
      name: body.name,
      shortName: body.shortName,
      description: body.description ?? "",
      type: body.type ?? "COMMERCIAL",
      establishedYear: body.establishedYear ? Number(body.establishedYear) : null,
      headquarters: body.headquarters ?? null,
      website: body.website ?? null,
      phone: body.phone ?? null,
      email: body.email ?? null,
      logo: body.logo ?? null,
      swiftCode: body.swiftCode ?? null,
      savingsRateMin: body.savingsRateMin != null ? Number(body.savingsRateMin) : null,
      savingsRateMax: body.savingsRateMax != null ? Number(body.savingsRateMax) : null,
      fixedDepositRateMin:
        body.fixedDepositRateMin != null ? Number(body.fixedDepositRateMin) : null,
      fixedDepositRateMax:
        body.fixedDepositRateMax != null ? Number(body.fixedDepositRateMax) : null,
      branchCount: body.branchCount != null ? Number(body.branchCount) : null,
      atmCount: body.atmCount != null ? Number(body.atmCount) : null,
      mobileBanking: Boolean(body.mobileBanking),
      internetBanking: Boolean(body.internetBanking),
      cards: stringifyJson(body.cards ?? []),
      loans: stringifyJson(body.loans ?? []),
      isFeatured: Boolean(body.isFeatured),
      isPublished: body.isPublished !== false,
    },
  });

  return NextResponse.json(bank, { status: 201 });
}
