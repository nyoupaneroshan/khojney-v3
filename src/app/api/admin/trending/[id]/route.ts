import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "../../../../../../../_lib/require-admin";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const item = await db.trendingSearch.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const existing = await db.trendingSearch.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // If changing query, check uniqueness
  if (body.query && body.query !== existing.query) {
    const conflict = await db.trendingSearch.findUnique({ where: { query: body.query } });
    if (conflict) return NextResponse.json({ error: "Query already exists" }, { status: 409 });
  }

  const updated = await db.trendingSearch.update({
    where: { id },
    data: {
      query: body.query ?? existing.query,
      count: body.count !== undefined ? Number(body.count) : existing.count,
      module: body.module !== undefined ? body.module : existing.module,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : existing.isActive,
      order: body.order !== undefined ? Number(body.order) : existing.order,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  try {
    await db.trendingSearch.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found or could not be deleted" }, { status: 404 });
  }
}
