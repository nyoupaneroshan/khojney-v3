/**
 * Shared utilities for the Khojney admin panel.
 *
 * IMPORTANT: This file is imported by BOTH client components (forms, editors)
 * and server-only API routes. Do NOT add top-level imports of server-only
 * modules (next/headers, @/lib/auth, @/lib/db) here — they would break the
 * client bundle.
 *
 * API routes that need an admin check should import `getSession` and `isAdmin`
 * directly from `@/lib/auth` and do the check inline (see any
 * admin route under src/app/api/admin/{module}/route.ts for the pattern).
 */

/** Convert any string to a URL-safe slug. */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Safely parse a JSON string field stored on a model. Returns `fallback` if parsing fails. */
export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/** Stringify a value for storage in a JSON-string column. */
export function stringifyJson(value: unknown): string {
  return JSON.stringify(value ?? []);
}

/** Parse pagination params from a URL searchParams object. */
export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "20", 10) || 20));
  const q = (searchParams.get("q") ?? "").trim();
  return { page, pageSize, q, skip: (page - 1) * pageSize };
}

/** Convert a Date to a yyyy-MM-dd string for `<input type="date">`. */
export function toDateInputValue(d: Date | string | null | undefined): string {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

/** Convert a Date to a yyyy-MM-ddTHH:mm string for `<input type="datetime-local">`. */
export function toDateTimeInputValue(d: Date | string | null | undefined): string {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "";
  // Build local-time string to avoid TZ surprises
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Format a date for display in admin tables. */
export function formatDateTime(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Format a date (no time) for display. */
export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
