import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "../../../../../../_lib/require-admin";
import { parsePagination, slugify, stringifyJson } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { page, pageSize, q, skip } = parsePagination(req.nextUrl.searchParams);
  const where = q
    ? {
        OR: [
          { title: { contains: q } },
          { slug: { contains: q } },
          { provider: { contains: q } },
          { field: { contains: q } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    db.scholarship.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: { category: { select: { id: true, name: true } } },
    }),
    db.scholarship.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => ({}));
  if (!body.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const slug = body.slug ? slugify(body.slug) : slugify(body.title);
  const existing = await db.scholarship.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A scholarship with this slug already exists" }, { status: 409 });
  }

  const scholarship = await db.scholarship.create({
    data: {
      slug,
      title: body.title,
      description: body.description ?? "",
      provider: body.provider ?? null,
      providerUrl: body.providerUrl ?? null,
      categoryId: body.categoryId || null,
      level: body.level ?? null,
      field: body.field ?? null,
      amount: body.amount ?? null,
      eligibility: stringifyJson(body.eligibility ?? []),
      deadline: body.deadline ? new Date(body.deadline) : null,
      applicationOpen: body.applicationOpen ? new Date(body.applicationOpen) : null,
      applicationUrl: body.applicationUrl ?? null,
      country: body.country ?? "Nepal",
      province: body.province ?? null,
      isFeatured: Boolean(body.isFeatured),
      isPublished: body.isPublished !== false,
      coverImage: body.coverImage ?? null,
    },
  });

  return NextResponse.json(scholarship, { status: 201 });
}
