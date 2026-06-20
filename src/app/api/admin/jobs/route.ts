import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { parsePagination, slugify, stringifyJson } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

// GET /api/admin/jobs — paginated, searchable list
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { page, pageSize, q, skip } = parsePagination(req.nextUrl.searchParams);

  const where = q
    ? {
        OR: [
          { title: { contains: q } },
          { slug: { contains: q } },
          { company: { contains: q } },
          { location: { contains: q } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    db.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.job.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

// POST /api/admin/jobs — create
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => ({}));

  // Required fields
  if (!body.title || typeof body.title !== "string") {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!body.company || typeof body.company !== "string") {
    return NextResponse.json({ error: "Company is required" }, { status: 400 });
  }

  const slug = body.slug ? slugify(body.slug) : slugify(body.title);

  // Check slug uniqueness
  const existing = await db.job.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A job with this slug already exists" }, { status: 409 });
  }

  const job = await db.job.create({
    data: {
      slug,
      title: body.title,
      description: body.description ?? "",
      company: body.company,
      companyLogo: body.companyLogo ?? null,
      location: body.location ?? null,
      jobType: body.jobType ?? "FULL_TIME",
      category: body.category ?? null,
      experienceLevel: body.experienceLevel ?? "ENTRY",
      salaryMin:
        body.salaryMin !== undefined && body.salaryMin !== null && body.salaryMin !== ""
          ? Number(body.salaryMin)
          : null,
      salaryMax:
        body.salaryMax !== undefined && body.salaryMax !== null && body.salaryMax !== ""
          ? Number(body.salaryMax)
          : null,
      salaryCurrency: body.salaryCurrency ?? "NPR",
      applicationUrl: body.applicationUrl ?? null,
      applicationEmail: body.applicationEmail ?? null,
      deadline: body.deadline ? new Date(body.deadline) : null,
      skills: stringifyJson(body.skills ?? []),
      qualifications: stringifyJson(body.qualifications ?? []),
      isFeatured: Boolean(body.isFeatured),
      isPublished: body.isPublished !== false,
    },
  });

  return NextResponse.json(job, { status: 201 });
}
