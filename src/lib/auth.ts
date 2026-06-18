/**
 * Session types that are safe to import from client components.
 * Server-only functions live in `@/lib/auth-server.ts`.
 */
export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  image: string | null;
}

export function isAdmin(role?: string | null) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export const ADMIN_ROLE_VALUES = ["ADMIN", "SUPER_ADMIN"] as const;
