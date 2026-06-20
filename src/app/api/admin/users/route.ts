import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { parsePagination } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { page, pageSize, q, skip } = parsePagination(req.nextUrl.searchParams);
  const roleFilter = req.nextUrl.searchParams.get("role");

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { email: { contains: q } },
      { location: { contains: q } },
    ];
  }
  if (roleFilter) where.role = roleFilter;

  const [items, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        phone: true,
        location: true,
        bio: true,
        createdAt: true,
        passwordHash: true,
        _count: { select: { examAttempts: true, bookmarks: true, posts: true } },
      },
    }),
    db.user.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}
