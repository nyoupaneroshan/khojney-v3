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
          { name: { contains: q } },
          { slug: { contains: q } },
          { city: { contains: q } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    db.university.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.university.count({ where }),
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
  const existing = await db.university.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A university with this slug already exists" }, { status: 409 });
  }

  const university = await db.university.create({
    data: {
      slug,
      name: body.name,
      description: body.description ?? "",
      establishedYear: body.establishedYear ? Number(body.establishedYear) : null,
      province: body.province ?? null,
      city: body.city ?? null,
      address: body.address ?? null,
      phone: body.phone ?? null,
      email: body.email ?? null,
      website: body.website ?? null,
      logo: body.logo ?? null,
      coverImage: body.coverImage ?? null,
      type: body.type ?? "PUBLIC",
      ranking: body.ranking ? Number(body.ranking) : null,
      totalCampuses: body.totalCampuses ? Number(body.totalCampuses) : 0,
      totalStudents: body.totalStudents ? Number(body.totalStudents) : null,
      faculties: stringifyJson(body.faculties ?? []),
      programs: stringifyJson(body.programs ?? []),
      admissionProcess: body.admissionProcess ?? null,
      notices: stringifyJson(body.notices ?? []),
      results: stringifyJson(body.results ?? []),
      isFeatured: Boolean(body.isFeatured),
      isPublished: body.isPublished !== false,
    },
  });

  return NextResponse.json(university, { status: 201 });
}
