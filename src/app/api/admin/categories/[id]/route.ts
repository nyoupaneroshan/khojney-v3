import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { slugify } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const item = await db.category.findUnique({
    where: { id },
    include: { parent: true, children: true },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const existing = await db.category.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const slug = body.slug ? slugify(body.slug) : existing.slug;
  if (slug !== existing.slug) {
    const conflict = await db.category.findUnique({ where: { slug } });
    if (conflict) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  // Prevent making category a child of itself
  if (body.parentId === id) {
    return NextResponse.json({ error: "A category cannot be its own parent" }, { status: 400 });
  }

  const updated = await db.category.update({
    where: { id },
    data: {
      slug,
      name: body.name ?? existing.name,
      description: body.description !== undefined ? body.description : existing.description,
      icon: body.icon !== undefined ? body.icon : existing.icon,
      color: body.color !== undefined ? body.color : existing.color,
      parentId: body.parentId !== undefined ? body.parentId || null : existing.parentId,
      module: body.module !== undefined ? body.module : existing.module,
      order: body.order !== undefined ? Number(body.order) : existing.order,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  try {
    // Move children up to the same level (unparent them) before deletion
    await db.category.updateMany({
      where: { parentId: id },
      data: { parentId: null },
    });
    await db.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found or could not be deleted" }, { status: 404 });
  }
}
