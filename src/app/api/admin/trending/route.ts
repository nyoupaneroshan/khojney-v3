import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "../../../../../../_lib/require-admin";
import { parsePagination } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { page, pageSize, q, skip } = parsePagination(req.nextUrl.searchParams);
  const where = q ? { query: { contains: q } } : {};

  const [items, total] = await Promise.all([
    db.trendingSearch.findMany({
      where,
      orderBy: [{ order: "asc" }, { count: "desc" }],
      skip,
      take: pageSize,
    }),
    db.trendingSearch.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => ({}));
  if (!body.query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  // Make query unique — upsert on query string
  const existing = await db.trendingSearch.findUnique({ where: { query: body.query } });
  if (existing) {
    return NextResponse.json({ error: "This trending query already exists" }, { status: 409 });
  }

  const item = await db.trendingSearch.create({
    data: {
      query: body.query,
      count: body.count ? Number(body.count) : 0,
      module: body.module ?? null,
      isActive: body.isActive !== false,
      order: body.order ? Number(body.order) : 0,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
