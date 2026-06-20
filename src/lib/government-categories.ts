/**
 * Shared metadata for the GovernmentService `category` enum-string field.
 *
 * Used by the public list/detail pages and the admin form to keep labels,
 * colors, and ordering consistent. Kept here (not in constants.ts) so the
 * Government module is self-contained.
 */

export const GOV_CATEGORIES = [
  "CITIZENSHIP",
  "PASSPORT",
  "PAN",
  "LICENSE",
  "TAX",
  "LAND",
  "VEHICLE",
  "OTHER",
] as const;
export type GovCategory = (typeof GOV_CATEGORIES)[number];

export const GOV_CATEGORY_LABELS: Record<GovCategory, string> = {
  CITIZENSHIP: "Citizenship",
  PASSPORT: "Passport",
  PAN: "PAN / VAT",
  LICENSE: "License",
  TAX: "Tax",
  LAND: "Land & Property",
  VEHICLE: "Vehicle",
  OTHER: "Other",
};

/**
 * Tailwind class fragments for colored category badges.
 * Palette intentionally avoids blue/indigo per the project UI guidelines.
 */
export const GOV_CATEGORY_STYLES: Record<GovCategory, string> = {
  CITIZENSHIP:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  PASSPORT:
    "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300",
  PAN: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  LICENSE:
    "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300",
  TAX: "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300",
  LAND: "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300",
  VEHICLE:
    "bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300",
  OTHER: "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-300",
};

export function getGovCategoryStyle(cat: string | null | undefined): string {
  if (!cat) return GOV_CATEGORY_STYLES.OTHER;
  return GOV_CATEGORY_STYLES[cat as GovCategory] ?? GOV_CATEGORY_STYLES.OTHER;
}

export function getGovCategoryLabel(cat: string | null | undefined): string {
  if (!cat) return "Other";
  return GOV_CATEGORY_LABELS[cat as GovCategory] ?? cat;
}

/** Options for the admin form `<Select>` and the public filter `<FilterSelect>`. */
export const GOV_CATEGORY_OPTIONS = GOV_CATEGORIES.map((c) => ({
  value: c,
  label: GOV_CATEGORY_LABELS[c],
}));
