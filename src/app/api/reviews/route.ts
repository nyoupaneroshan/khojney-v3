import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";

const ENTITY_TABLE: Record<
  string,
  "College" | "School" | "University" | "Bank" | "Hospital" | "InsuranceCompany"
> = {
  COLLEGE: "College",
  SCHOOL: "School",
  UNIVERSITY: "University",
  BANK: "Bank",
  HOSPITAL: "Hospital",
  INSURANCE: "InsuranceCompany",
};

const MAX_TITLE_LEN = 120;
const MAX_COMMENT_LEN = 2000;

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  let body: { entity?: string; entityId?: string; rating?: number; title?: string; comment?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { entity, entityId, rating, title, comment } = body;
  if (!entity || !entityId || !rating) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!ENTITY_TABLE[entity]) {
    return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }
  if (title && title.trim().length > MAX_TITLE_LEN) {
    return NextResponse.json({ error: `Title cannot exceed ${MAX_TITLE_LEN} characters` }, { status: 400 });
  }
  if (comment && comment.trim().length > MAX_COMMENT_LEN) {
    return NextResponse.json({ error: `Comment cannot exceed ${MAX_COMMENT_LEN} characters` }, { status: 400 });
  }

  // Verify the entity exists
  const table = ENTITY_TABLE[entity];
  const record = await (db as unknown as Record<string, { findUnique: (args: { where: { id: string }; select: { id: true } }) => Promise<{ id: string } | null> }>)[table]?.findUnique({ where: { id: entityId }, select: { id: true } });
  if (!record) {
    return NextResponse.json({ error: "Entity not found" }, { status: 404 });
  }

  // Upsert the review (one review per user per entity)
  try {
    const review = await db.review.upsert({
      where: {
        userId_entity_entityId: {
          userId: user.id,
          entity,
          entityId,
        },
      },
      update: {
        rating,
        title: title ? title.trim() : null,
        comment: comment ? comment.trim() : null,
      },
      create: {
        userId: user.id,
        entity,
        entityId,
        rating,
        title: title ? title.trim() : null,
        comment: comment ? comment.trim() : null,
      },
    });

    // Recompute aggregate rating + reviewCount on the parent entity
    await updateEntityAggregates(entity, entityId, table);

    return NextResponse.json({ ok: true, review });
  } catch (err) {
    console.error("Create review error:", err);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const entity = url.searchParams.get("entity");
  const entityId = url.searchParams.get("entityId");
  if (!entity || !entityId) {
    return NextResponse.json({ error: "Missing entity/entityId" }, { status: 400 });
  }
  const reviews = await db.review.findMany({
    where: { entity, entityId },
    select: {
      id: true,
      rating: true,
      title: true,
      comment: true,
      createdAt: true,
      user: { select: { name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100, // cap — paginated UI should request more if needed
  });
  return NextResponse.json({ reviews });
}

/**
 * DELETE /api/reviews?id=...
 * Enforces BOLA: only the review author or an ADMIN can delete a review.
 */
export async function DELETE(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id parameter is required" }, { status: 400 });
  }

  const existing = await db.review.findUnique({
    where: { id },
    select: { id: true, userId: true, entity: true, entityId: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  // BOLA verification
  if (existing.userId !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden: You cannot delete another user's review" }, { status: 403 });
  }

  try {
    await db.review.delete({ where: { id } });

    // Recalculate parent entity metrics
    const table = ENTITY_TABLE[existing.entity];
    if (table) {
      await updateEntityAggregates(existing.entity, existing.entityId, table);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete review error:", err);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}

async function updateEntityAggregates(entity: string, entityId: string, table: string) {
  const aggregates = await db.review.aggregate({
    where: { entity, entityId },
    _avg: { rating: true },
    _count: { rating: true },
  });
  const avg = aggregates._avg.rating ?? 0;
  const count = aggregates._count.rating ?? 0;
  await (db as unknown as Record<string, { update: (args: { where: { id: string }; data: { rating: number; reviewCount: number } }) => Promise<unknown> }>)[table]?.update({
    where: { id: entityId },
    data: { rating: Math.round(avg * 10) / 10, reviewCount: count },
  });
}
