/**
 * Server-only auth utilities. Import this from Server Components and API routes only.
 * Client components should import from `@/lib/auth` (types only).
 */
import "server-only";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import type { SessionUser } from "@/lib/auth";

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("khojney_user_id")?.value;
  if (!userId) return null;
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, image: true },
  });
  return user ?? null;
}

export async function setSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set("khojney_user_id", userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("khojney_user_id");
}

/**
 * Demo login: accepts any password for the demo accounts, or auto-creates a user
 * if the email doesn't exist (so visitors can try without registering).
 */
export async function demoLogin(email: string, _password?: string) {
  const user = await db.user.upsert({
    where: { email: email.toLowerCase() },
    update: {},
    create: {
      email: email.toLowerCase(),
      name: email.split("@")[0],
      role: email.toLowerCase().includes("admin") ? "ADMIN" : "USER",
      passwordHash: "demo",
    },
  });
  await setSession(user.id);
  return user;
}

export async function requireAdmin() {
  const user = await getSession();
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return null;
  }
  return user;
}

export { isAdmin, ADMIN_ROLE_VALUES } from "@/lib/auth";
export type { SessionUser } from "@/lib/auth";
