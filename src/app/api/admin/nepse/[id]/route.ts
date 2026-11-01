import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { slugify } from "@/lib/admin-utils";
import { bustNepse } from "@/lib/cache-bust";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/nepse/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const stock = await db.nepseStock.findUnique({ where: { id } });
  if (!stock) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(stock);
}

// PUT /api/admin/nepse/[id]
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const existing = await db.nepseStock.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const symbol = body.symbol ? body.symbol.trim().toUpperCase() : existing.symbol;
  const slug = body.slug ? slugify(body.slug) : existing.slug;

  if (symbol !== existing.symbol || slug !== existing.slug) {
    const conflict = await db.nepseStock.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          { OR: [{ slug }, { symbol }] },
        ],
      },
    });
    if (conflict) {
      return NextResponse.json({ error: "Symbol or slug already in use" }, { status: 409 });
    }
  }

  const updated = await db.nepseStock.update({
    where: { id },
    data: {
      slug,
      symbol,
      companyName: body.companyName ?? existing.companyName,
      description: body.description ?? existing.description,
      sector: body.sector ?? existing.sector,
      ltp:
        body.ltp !== undefined
          ? body.ltp != null ? Number(body.ltp) : null
          : existing.ltp,
      pointChange:
        body.pointChange !== undefined
          ? body.pointChange != null ? Number(body.pointChange) : null
          : existing.pointChange,
      percentChange:
        body.percentChange !== undefined
          ? body.percentChange != null ? Number(body.percentChange) : null
          : existing.percentChange,
      high52:
        body.high52 !== undefined
          ? body.high52 != null ? Number(body.high52) : null
          : existing.high52,
      low52:
        body.low52 !== undefined
          ? body.low52 != null ? Number(body.low52) : null
          : existing.low52,
      peRatio:
        body.peRatio !== undefined
          ? body.peRatio != null ? Number(body.peRatio) : null
          : existing.peRatio,
      eps:
        body.eps !== undefined
          ? body.eps != null ? Number(body.eps) : null
          : existing.eps,
      bookValue:
        body.bookValue !== undefined
          ? body.bookValue != null ? Number(body.bookValue) : null
          : existing.bookValue,
      marketCap:
        body.marketCap !== undefined
          ? body.marketCap != null ? Number(body.marketCap) : null
          : existing.marketCap,
      paidUpCapital:
        body.paidUpCapital !== undefined
          ? body.paidUpCapital != null ? Number(body.paidUpCapital) : null
          : existing.paidUpCapital,
      dividendYield:
        body.dividendYield !== undefined
          ? body.dividendYield != null ? Number(body.dividendYield) : null
          : existing.dividendYield,
      bonusShare: body.bonusShare !== undefined ? body.bonusShare || null : existing.bonusShare,
      cashDividend: body.cashDividend !== undefined ? body.cashDividend || null : existing.cashDividend,
      website: body.website !== undefined ? body.website || null : existing.website,
      headquarters: body.headquarters !== undefined ? body.headquarters || null : existing.headquarters,
      establishedYear:
        body.establishedYear !== undefined
          ? body.establishedYear ? Number(body.establishedYear) : null
          : existing.establishedYear,
      isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : existing.isPublished,
    },
  });

  bustNepse(slug);

  return NextResponse.json(updated);
}

// DELETE /api/admin/nepse/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const existing = await db.nepseStock.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.nepseStock.delete({ where: { id } });
  bustNepse(existing.slug);

  return NextResponse.json({ ok: true });
}
