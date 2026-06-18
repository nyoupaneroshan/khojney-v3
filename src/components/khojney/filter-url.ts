/**
 * Shared helpers for building filter URLs across the public module pages.
 * All list pages (colleges, schools, universities, scholarships, blog)
 * use the same convention: filters + pagination live in the URL searchParams,
 * and changing a filter resets the page back to 1.
 */

export type SearchParamValue = string | string[] | undefined;
export type SearchParamsLike = Record<string, SearchParamValue>;

/** Returns a single string value for a search param (takes first if array). */
export function asString(value: SearchParamValue): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/** Returns an integer from a search param, falling back to `fallback`. */
export function asInt(value: SearchParamValue, fallback: number): number {
  const raw = asString(value);
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) return fallback;
  return parsed;
}

/**
 * Build a URL string from a base path + a set of params. Preserves existing
 * params from `current`, applies `updates`, and omits any keys whose value
 * is empty/undefined. Always resets `page` to 1 unless explicitly set in updates.
 */
export function buildFilterUrl(
  basePath: string,
  current: SearchParamsLike,
  updates: Record<string, string | undefined>,
  options: { keepPage?: boolean } = {},
): string {
  const merged: Record<string, string> = {};

  // Start from existing params (string values only)
  for (const [key, val] of Object.entries(current)) {
    const s = asString(val);
    if (s) merged[key] = s;
  }

  // Apply updates
  for (const [key, val] of Object.entries(updates)) {
    if (val === undefined || val === "") {
      delete merged[key];
    } else {
      merged[key] = val;
    }
  }

  // Reset page unless explicitly preserved
  if (!options.keepPage) {
    delete merged.page;
  }

  // Always ensure pageSize is set if there's any param
  const sp = new URLSearchParams(merged);
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Pagination range helper: returns the page numbers to render. */
export function getPageRange(current: number, total: number, window = 2): (number | "ellipsis")[] {
  if (total <= 0) return [];
  const pages: (number | "ellipsis")[] = [];
  const start = Math.max(1, current - window);
  const end = Math.min(total, current + window);

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("ellipsis");
  }
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total) {
    if (end < total - 1) pages.push("ellipsis");
    pages.push(total);
  }
  return pages;
}
