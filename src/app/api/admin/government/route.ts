import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { parsePagination, slugify, stringifyJson } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

/**
 * Normalize a JSON-string-or-array value into a storage-ready JSON string.
 * Accepts either a pre-stringified JSON string (from the admin form) or a
 * raw array (defensive — e.g. if called from another client).
 */
function normalizeJsonField(value: unknown): string {
  if (typeof value === "string") return value;
  return stringifyJson(value ?? []);
}

// GET /api/admin/government — paginated, searchable list
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { page, pageSize, q, skip } = parsePagination(req.nextUrl.searchParams);

  const where = q
    ? {
        OR: [
          { title: { contains: q } },
          { slug: { contains: q } },
          { ministry: { contains: q } },
          { department: { contains: q } },
          { office: { contains: q } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    db.governmentService.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.governmentService.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

// POST /api/admin/government — create
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => ({}));

  if (!body.title || typeof body.title !== "string") {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const slug = body.slug ? slugify(body.slug) : slugify(body.title);

  // Check slug uniqueness
  const existing = await db.governmentService.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json(
      { error: "A government service with this slug already exists" },
      { status: 409 },
    );
  }

  const validCategories = [
    "CITIZENSHIP",
    "PASSPORT",
    "PAN",
    "LICENSE",
    "TAX",
    "LAND",
    "VEHICLE",
    "OTHER",
  ];
  const category = validCategories.includes(body.category)
    ? body.category
    : "CITIZENSHIP";

  const service = await db.governmentService.create({
    data: {
      slug,
      title: body.title,
      description: body.description ?? "",
      category,
      ministry: body.ministry ?? null,
      department: body.department ?? null,
      office: body.office ?? null,
      applicationUrl: body.applicationUrl ?? null,
      applicationFee: body.applicationFee ?? null,
      processingTime: body.processingTime ?? null,
      requiredDocuments: normalizeJsonField(body.requiredDocuments),
      steps: normalizeJsonField(body.steps),
      contactPhone: body.contactPhone ?? null,
      contactEmail: body.contactEmail ?? null,
      isFeatured: Boolean(body.isFeatured),
      isPublished: body.isPublished !== false,
    },
  });

  return NextResponse.json(service, { status: 201 });
}
