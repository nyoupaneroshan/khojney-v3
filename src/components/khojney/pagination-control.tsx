import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPageRange, buildFilterUrl, type SearchParamsLike } from "./filter-url";

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams: SearchParamsLike;
  /** Number of pages to show around current (default 2). */
  window?: number;
}

/**
 * URL-aware pagination for list pages. Renders Previous / page numbers / Next
 * links that preserve all current filter params.
 *
 * Uses plain `<a href>` (via the shadcn Pagination primitives, which render
 * `<a>` tags). On server components this is fine; the small full-page reload
 * is acceptable for filter pagination.
 */
export function PaginationControl({
  currentPage,
  totalPages,
  basePath,
  searchParams,
  window = 2,
}: PaginationControlProps) {
  if (totalPages <= 1) return null;

  const pages = getPageRange(currentPage, totalPages, window);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const pageHref = (page: number) =>
    buildFilterUrl(basePath, searchParams, { page: String(page) }, { keepPage: true });

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          {hasPrev ? (
            <PaginationPrevious href={pageHref(currentPage - 1)} />
          ) : (
            <span className="pointer-events-none opacity-40">
              <PaginationPrevious />
            </span>
          )}
        </PaginationItem>

        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <PaginationItem key={`e-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink href={pageHref(p)} isActive={p === currentPage}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          {hasNext ? (
            <PaginationNext href={pageHref(currentPage + 1)} />
          ) : (
            <span className="pointer-events-none opacity-40">
              <PaginationNext />
            </span>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
