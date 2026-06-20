import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { slugify, stringifyJson } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/banks/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const bank = await db.bank.findUnique({ where: { id } });
  if (!bank) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(bank);
}

// PUT /api/admin/banks/[id]
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const existing = await db.bank.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const slug = body.slug ? slugify(body.slug) : existing.slug;
  if (slug !== existing.slug) {
    const conflict = await db.bank.findUnique({ where: { slug } });
    if (conflict) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
  }

  const updated = await db.bank.update({
    where: { id },
    data: {
      slug,
      name: body.name ?? existing.name,
      shortName: body.shortName ?? existing.shortName,
      description: body.description ?? existing.description,
      type: body.type ?? existing.type,
      establishedYear:
        body.establishedYear !== undefined
          ? body.establishedYear
            ? Number(body.establishedYear)
            : null
          : existing.establishedYear,
      headquarters: body.headquarters ?? existing.headquarters,
      website: body.website ?? existing.website,
      phone: body.phone ?? existing.phone,
      email: body.email ?? existing.email,
      logo: body.logo ?? existing.logo,
      swiftCode: body.swiftCode ?? existing.swiftCode,
      savingsRateMin:
        body.savingsRateMin !== undefined
          ? body.savingsRateMin != null
            ? Number(body.savingsRateMin)
            : null
          : existing.savingsRateMin,
      savingsRateMax:
        body.savingsRateMax !== undefined
          ? body.savingsRateMax != null
            ? Number(body.savingsRateMax)
            : null
          : existing.savingsRateMax,
      fixedDepositRateMin:
        body.fixedDepositRateMin !== undefined
          ? body.fixedDepositRateMin != null
            ? Number(body.fixedDepositRateMin)
            : null
          : existing.fixedDepositRateMin,
      fixedDepositRateMax:
        body.fixedDepositRateMax !== undefined
          ? body.fixedDepositRateMax != null
            ? Number(body.fixedDepositRateMax)
            : null
          : existing.fixedDepositRateMax,
      branchCount:
        body.branchCount !== undefined
          ? body.branchCount != null
            ? Number(body.branchCount)
            : null
          : existing.branchCount,
      atmCount:
        body.atmCount !== undefined
          ? body.atmCount != null
            ? Number(body.atmCount)
            : null
          : existing.atmCount,
      mobileBanking:
        body.mobileBanking !== undefined ? Boolean(body.mobileBanking) : existing.mobileBanking,
      internetBanking:
        body.internetBanking !== undefined
          ? Boolean(body.internetBanking)
          : existing.internetBanking,
      cards: body.cards !== undefined ? stringifyJson(body.cards) : existing.cards,
      loans: body.loans !== undefined ? stringifyJson(body.loans) : existing.loans,
      isFeatured:
        body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
      isPublished:
        body.isPublished !== undefined ? Boolean(body.isPublished) : existing.isPublished,
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/admin/banks/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  try {
    await db.bank.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found or could not be deleted" }, { status: 404 });
  }
}
