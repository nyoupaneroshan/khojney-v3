import { Suspense } from "react";
import { Loader2 } from "lucide-react";

/**
 * Reusable Suspense boundary for client components that consume
 * `useSearchParams()` (e.g. SearchBar, FilterSelect, FilterTextInput).
 *
 * Next.js 15+/16 requires these hooks to be wrapped in a Suspense boundary
 * for static pre-rendering to succeed, even on dynamic routes. Centralizing
 * the fallback here keeps every list page consistent and easy to maintain.
 *
 * Usage:
 *   <FilterSuspense>
 *     <SearchBar basePath="/colleges" />
 *     <FilterSelect basePath="/colleges" param="sort" ... />
 *   </FilterSuspense>
 */
export function FilterSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<FilterSuspenseFallback />}>{children}</Suspense>
  );
}

/**
 * Inline fallback (small spinner) used while the filter UI hydrates.
 * Rendered server-side so the page shell stays static-friendly.
 */
export function FilterSuspenseFallback({
  label = "Loading filters...",
}: {
  label?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-2 text-xs text-muted-foreground"
      aria-busy="true"
      role="status"
    >
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      <span>{label}</span>
    </span>
  );
}
