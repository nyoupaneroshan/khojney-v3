import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";

const ENTITY_TABLE: Record<string, "College" | "School" | "University" | "Bank"> = {
  COLLEGE: "College",
  SCHOOL: "School",
  UNIVERSITY: "University",
  BANK: "Bank",
};

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
      update: { rating, title, comment },
      create: {
        userId: user.id,
        entity,
        entityId,
        rating,
        title,
        comment,
      },
    });

    // Recompute aggregate rating + reviewCount on the parent entity
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
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ reviews });
}
