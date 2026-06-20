import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { parsePagination, slugify } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { page, pageSize, q, skip } = parsePagination(req.nextUrl.searchParams);
  const moduleFilter = req.nextUrl.searchParams.get("module");

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [{ name: { contains: q } }, { slug: { contains: q } }];
  }
  if (moduleFilter) where.module = moduleFilter;

  const [items, total] = await Promise.all([
    db.category.findMany({
      where,
      orderBy: [{ module: "asc" }, { order: "asc" }],
      skip,
      take: pageSize,
      include: {
        parent: { select: { id: true, name: true } },
        _count: { select: { children: true } },
      },
    }),
    db.category.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => ({}));
  if (!body.name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = body.slug ? slugify(body.slug) : slugify(body.name);
  const existing = await db.category.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A category with this slug already exists" }, { status: 409 });
  }

  const category = await db.category.create({
    data: {
      slug,
      name: body.name,
      description: body.description ?? null,
      icon: body.icon ?? null,
      color: body.color ?? null,
      parentId: body.parentId || null,
      module: body.module ?? null,
      order: body.order ? Number(body.order) : 0,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
