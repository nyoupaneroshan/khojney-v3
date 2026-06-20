import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { slugify, stringifyJson } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** Normalize a JSON-string-or-array value into a storage-ready JSON string. */
function normalizeJsonField(value: unknown): string {
  if (typeof value === "string") return value;
  return stringifyJson(value ?? []);
}

const VALID_CATEGORIES = [
  "CITIZENSHIP",
  "PASSPORT",
  "PAN",
  "LICENSE",
  "TAX",
  "LAND",
  "VEHICLE",
  "OTHER",
];

// GET /api/admin/government/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const service = await db.governmentService.findUnique({ where: { id } });
  if (!service) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(service);
}

// PUT /api/admin/government/[id]
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const existing = await db.governmentService.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const slug = body.slug ? slugify(body.slug) : existing.slug;
  if (slug !== existing.slug) {
    const conflict = await db.governmentService.findUnique({ where: { slug } });
    if (conflict) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
  }

  const category = VALID_CATEGORIES.includes(body.category)
    ? body.category
    : body.category !== undefined
      ? existing.category
      : existing.category;

  const updated = await db.governmentService.update({
    where: { id },
    data: {
      slug,
      title: body.title ?? existing.title,
      description: body.description ?? existing.description,
      category,
      ministry: body.ministry ?? existing.ministry,
      department: body.department ?? existing.department,
      office: body.office ?? existing.office,
      applicationUrl: body.applicationUrl ?? existing.applicationUrl,
      applicationFee: body.applicationFee ?? existing.applicationFee,
      processingTime: body.processingTime ?? existing.processingTime,
      requiredDocuments:
        body.requiredDocuments !== undefined
          ? normalizeJsonField(body.requiredDocuments)
          : existing.requiredDocuments,
      steps:
        body.steps !== undefined
          ? normalizeJsonField(body.steps)
          : existing.steps,
      contactPhone: body.contactPhone ?? existing.contactPhone,
      contactEmail: body.contactEmail ?? existing.contactEmail,
      isFeatured:
        body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
      isPublished:
        body.isPublished !== undefined ? Boolean(body.isPublished) : existing.isPublished,
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/admin/government/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  try {
    await db.governmentService.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Not found or could not be deleted" },
      { status: 404 },
    );
  }
}
