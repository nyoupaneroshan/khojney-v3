import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { parsePagination, slugify } from "@/lib/admin-utils";
import { bustNepse } from "@/lib/cache-bust";

export const dynamic = "force-dynamic";

// GET /api/admin/nepse — paginated, searchable list
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { page, pageSize, q, skip } = parsePagination(req.nextUrl.searchParams);

  const where = q
    ? {
        OR: [
          { symbol: { contains: q, mode: "insensitive" as const } },
          { companyName: { contains: q, mode: "insensitive" as const } },
          { sector: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    db.nepseStock.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.nepseStock.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

// POST /api/admin/nepse — create
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => ({}));

  if (!body.symbol || typeof body.symbol !== "string") {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
  }
  if (!body.companyName || typeof body.companyName !== "string") {
    return NextResponse.json({ error: "Company name is required" }, { status: 400 });
  }

  const symbol = body.symbol.trim().toUpperCase();
  const slug = body.slug ? slugify(body.slug) : slugify(`${symbol}-${body.companyName}`);

  const existing = await db.nepseStock.findFirst({
    where: {
      OR: [{ slug }, { symbol }],
    },
  });
  if (existing) {
    return NextResponse.json({ error: "A stock with this symbol or slug already exists" }, { status: 409 });
  }

  const stock = await db.nepseStock.create({
    data: {
      slug,
      symbol,
      companyName: body.companyName,
      description: body.description || "",
      sector: body.sector || "COMMERCIAL_BANK",
      ltp: body.ltp != null ? Number(body.ltp) : null,
      pointChange: body.pointChange != null ? Number(body.pointChange) : null,
      percentChange: body.percentChange != null ? Number(body.percentChange) : null,
      high52: body.high52 != null ? Number(body.high52) : null,
      low52: body.low52 != null ? Number(body.low52) : null,
      peRatio: body.peRatio != null ? Number(body.peRatio) : null,
      eps: body.eps != null ? Number(body.eps) : null,
      bookValue: body.bookValue != null ? Number(body.bookValue) : null,
      marketCap: body.marketCap != null ? Number(body.marketCap) : null,
      paidUpCapital: body.paidUpCapital != null ? Number(body.paidUpCapital) : null,
      dividendYield: body.dividendYield != null ? Number(body.dividendYield) : null,
      bonusShare: body.bonusShare || null,
      cashDividend: body.cashDividend || null,
      website: body.website || null,
      headquarters: body.headquarters || null,
      establishedYear: body.establishedYear ? Number(body.establishedYear) : null,
      isFeatured: Boolean(body.isFeatured),
      isPublished: body.isPublished !== false,
    },
  });

  bustNepse(slug);

  return NextResponse.json(stock, { status: 201 });
}
