/**
 * Server-only auth utilities. Import this from Server Components and API routes only.
 * Client components should import from `@/lib/auth` (types only).
 */
import "server-only";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import type { SessionUser } from "@/lib/auth";
import {
  createSessionToken,
  verifySessionCookie,
  sessionCookieName,
  sessionCookieMaxAge,
  sessionTtlMs,
} from "@/lib/session";

const BCRYPT_ROUNDS = 12;

/**
 * Read the current session from the signed cookie + DB.
 * Returns null if: no cookie, bad signature, session expired, session not
 * found in DB, or user is deactivated.
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(sessionCookieName)?.value;
  const token = verifySessionCookie(cookieValue);
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { sessionToken: token },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          image: true,
          isActive: true,
        },
      },
    },
  });

  if (!session) return null;
  if (session.expires.getTime() < Date.now()) {
    // Expired — clean up.
    await db.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  if (!session.user.isActive) {
    // Deactivated user — clean up their session.
    await db.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  const { user } = session;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    image: user.image,
  };
}

/**
 * Create a new session for a user. Writes the signed cookie + a row in the
 * Session table. Any existing sessions for the user are NOT automatically
 * invalidated (multi-device supported). Call `clearAllUserSessions()` to
 * force logout everywhere.
 */
export async function setSession(userId: string): Promise<void> {
  const { token, cookieValue } = createSessionToken();
  const expires = new Date(Date.now() + sessionTtlMs);

  await db.session.create({
    data: { sessionToken: token, userId, expires },
  });

  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, cookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProd,
    path: "/",
    maxAge: sessionCookieMaxAge(),
  });
}

/**
 * Clear the current session (logout). Deletes the DB row and the cookie.
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(sessionCookieName)?.value;
  const token = verifySessionCookie(cookieValue);
  if (token) {
    await db.session.delete({ where: { sessionToken: token } }).catch(() => {});
  }
  cookieStore.delete(sessionCookieName);
}

/**
 * Invalidate every session for a user (force logout on all devices).
 * Used when: user is deactivated, password is changed, role is demoted.
 */
export async function clearAllUserSessions(userId: string): Promise<void> {
  await db.session.deleteMany({ where: { userId } }).catch(() => {});
}

/**
 * Verify an email + password against the stored bcrypt hash.
 * Returns the user (without passwordHash) on success, or null on failure.
 * Constant-time comparison is handled by bcrypt.
 */
export async function verifyPassword(
  email: string,
  password: string
): Promise<SessionUser | null> {
  const user = await db.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (!user || !user.isActive) return null;
  if (!user.passwordHash) return null; // OAuth-only user, no password set

  // Backward-compat: any account still using the old "demo" hash is treated
  // as having no verified password — callers should prompt for password reset.
  if (user.passwordHash === "demo") return null;

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    image: user.image,
  };
}

/**
 * Hash a password for storage. Uses bcrypt with 12 rounds.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Create a new user account with a hashed password. Always role=USER.
 * Returns null if the email is already taken.
 */
export async function createUserWithEmail(
  email: string,
  name: string,
  password: string
): Promise<SessionUser | null> {
  const passwordHash = await hashPassword(password);
  try {
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name: name.trim() || email.split("@")[0],
        passwordHash,
        role: "USER",
      },
      select: { id: true, email: true, name: true, role: true, image: true },
    });
    return user;
  } catch (err) {
    // P2002 = unique constraint violation (email already taken)
    if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
      return null;
    }
    throw err;
  }
}

/**
 * Find or create a user from an OAuth provider (Google).
 * Used by the OAuth callback. Never grants admin role — new OAuth users are
 * always role=USER.
 */
export async function upsertOAuthUser(opts: {
  email: string;
  name?: string | null;
  image?: string | null;
}): Promise<SessionUser> {
  const email = opts.email.toLowerCase();
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    if (!existing.isActive) {
      throw new Error("Account is deactivated");
    }
    return {
      id: existing.id,
      email: existing.email,
      name: existing.name,
      role: existing.role,
      image: existing.image,
    };
  }
  const user = await db.user.create({
    data: {
      email,
      name: opts.name?.trim() || email.split("@")[0],
      image: opts.image,
      // passwordHash stays null — OAuth-only user
      role: "USER",
    },
    select: { id: true, email: true, name: true, role: true, image: true },
  });
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
