import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { parsePagination, slugify } from "@/lib/admin-utils";
import { bustModule } from "@/lib/cache-bust";

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
          { tags: { contains: q } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    db.exam.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip,
      take: pageSize,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { questions: true, attempts: true, children: true } },
      },
    }),
    db.exam.count({ where }),
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
  const existing = await db.exam.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "An exam with this slug already exists" }, { status: 409 });
  }

  const exam = await db.exam.create({
    data: {
      slug,
      title: body.title,
      description: body.description ?? "",
      categoryId: body.categoryId || null,
      examType: body.examType ?? "MOCK",
      durationMin: body.durationMin ? Number(body.durationMin) : 60,
      totalMarks: body.totalMarks ? Number(body.totalMarks) : 100,
      passingMarks: body.passingMarks ? Number(body.passingMarks) : null,
      difficulty: body.difficulty ?? "MEDIUM",
      isFeatured: Boolean(body.isFeatured),
      isPublished: body.isPublished !== false,
      isParent: Boolean(body.isParent),
      tags: body.tags ?? null,
      coverImage: body.coverImage ?? null,
      order: body.order != null ? Number(body.order) : 0,
      // SEO fields
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
      seoContent: body.seoContent || null,
      keywords: body.keywords || null,
      canonicalUrl: body.canonicalUrl || null,
      // Landing page content
      featuredImage: body.featuredImage || null,
      heroTitle: body.heroTitle || null,
      heroDescription: body.heroDescription || null,
      benefits: body.benefits || null,
      instructions: body.instructions || null,
      faqs: body.faqs || null,
      ctaText: body.ctaText || null,
      relatedResources: body.relatedResources || null,
      // Scoring
      negativeMarking: Boolean(body.negativeMarking),
      negativeMarkValue: body.negativeMarkValue != null ? Number(body.negativeMarkValue) : 0,
    },
  });

  bustModule("exam");

  return NextResponse.json(exam, { status: 201 });
}
