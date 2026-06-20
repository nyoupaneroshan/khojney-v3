/**
 * Helpers shared between the jobs list page and the jobs detail page.
 * Lives outside the page components so it can be imported cleanly by both.
 */

/** Format a salary range like "NPR 50,000 – 80,000". */
export function formatSalary(
  min: number | null,
  max: number | null,
  currency: string,
): string | null {
  if (min == null && max == null) return null;
  const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);
  const cur = currency || "NPR";
  if (min != null && max != null) {
    return `${cur} ${fmt(min)} – ${fmt(max)}`;
  }
  if (min != null) return `${cur} ${fmt(min)}+`;
  return `${cur} up to ${fmt(max as number)}`;
}
