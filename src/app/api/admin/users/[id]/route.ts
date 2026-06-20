import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { USER_ROLES } from "@/lib/constants";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/users/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      image: true,
      phone: true,
      location: true,
      bio: true,
      createdAt: true,
      updatedAt: true,
      passwordHash: true,
      _count: {
        select: {
          examAttempts: true,
          bookmarks: true,
          posts: true,
          reviews: true,
          notifications: true,
        },
      },
    },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

// PUT /api/admin/users/[id] — update role (and optionally name/phone/location/bio)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { user: adminUser, error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const target = await db.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Validate role if provided
  if (body.role !== undefined && !USER_ROLES.includes(body.role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // SUPER_ADMIN cannot be demoted by a regular ADMIN
  if (
    target.role === "SUPER_ADMIN" &&
    adminUser?.role !== "SUPER_ADMIN" &&
    body.role !== undefined &&
    body.role !== "SUPER_ADMIN"
  ) {
    return NextResponse.json(
      { error: "Only a super admin can demote another super admin" },
      { status: 403 }
    );
  }

  const updated = await db.user.update({
    where: { id },
    data: {
      role: body.role ?? target.role,
      name: body.name !== undefined ? body.name : target.name,
      phone: body.phone !== undefined ? body.phone : target.phone,
      location: body.location !== undefined ? body.location : target.location,
      bio: body.bio !== undefined ? body.bio : target.bio,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      location: true,
      bio: true,
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/admin/users/[id] — deactivate (unset password hash) instead of full delete
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { user: adminUser, error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const target = await db.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Prevent self-deactivation & super-admin demotion by non-super-admin
  if (id === adminUser?.id) {
    return NextResponse.json({ error: "You cannot deactivate your own account" }, { status: 400 });
  }
  if (target.role === "SUPER_ADMIN" && adminUser?.role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Only a super admin can deactivate another super admin" },
      { status: 403 }
    );
  }

  // Deactivate by clearing password hash (user can no longer log in via password)
  await db.user.update({
    where: { id },
    data: { passwordHash: null },
  });

  return NextResponse.json({ success: true, deactivated: true });
}
