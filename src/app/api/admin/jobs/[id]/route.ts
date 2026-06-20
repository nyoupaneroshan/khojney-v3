import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { slugify, stringifyJson } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/jobs/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const job = await db.job.findUnique({ where: { id } });
  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(job);
}

// PUT /api/admin/jobs/[id]
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const existing = await db.job.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const slug = body.slug ? slugify(body.slug) : existing.slug;
  if (slug !== existing.slug) {
    const conflict = await db.job.findUnique({ where: { slug } });
    if (conflict) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
  }

  // Helper: when a numeric field is explicitly cleared (empty string or null),
  // store null; otherwise keep the existing value if not provided.
  const numOrNull = (
    incoming: unknown,
    fallback: number | null,
  ): number | null => {
    if (incoming === undefined) return fallback;
    if (incoming === null || incoming === "") return null;
    const n = Number(incoming);
    return Number.isNaN(n) ? fallback : n;
  };

  const updated = await db.job.update({
    where: { id },
    data: {
      slug,
      title: body.title ?? existing.title,
      description: body.description ?? existing.description,
      company: body.company ?? existing.company,
      companyLogo: body.companyLogo ?? existing.companyLogo,
      location: body.location ?? existing.location,
      jobType: body.jobType ?? existing.jobType,
      category: body.category ?? existing.category,
      experienceLevel: body.experienceLevel ?? existing.experienceLevel,
      salaryMin: numOrNull(body.salaryMin, existing.salaryMin),
      salaryMax: numOrNull(body.salaryMax, existing.salaryMax),
      salaryCurrency: body.salaryCurrency ?? existing.salaryCurrency,
      applicationUrl: body.applicationUrl ?? existing.applicationUrl,
      applicationEmail: body.applicationEmail ?? existing.applicationEmail,
      deadline:
        body.deadline !== undefined
          ? body.deadline
            ? new Date(body.deadline)
            : null
          : existing.deadline,
      skills:
        body.skills !== undefined ? stringifyJson(body.skills) : existing.skills,
      qualifications:
        body.qualifications !== undefined
          ? stringifyJson(body.qualifications)
          : existing.qualifications,
      isFeatured:
        body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
      isPublished:
        body.isPublished !== undefined ? Boolean(body.isPublished) : existing.isPublished,
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/admin/jobs/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  try {
    await db.job.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found or could not be deleted" }, { status: 404 });
  }
}
