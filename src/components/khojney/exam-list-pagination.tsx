import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface ExamListPaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}

function buildHref(
  page: number,
  searchParams: Record<string, string | undefined>,
): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined && value !== null && value !== "") {
      sp.set(key, value);
    }
  }
  sp.set("page", String(page));
  return `/exams?${sp.toString()}`;
}

export function ExamListPagination({
  currentPage,
  totalPages,
  searchParams,
}: ExamListPaginationProps) {
  if (totalPages <= 1) return null;

  // Build page window: show first, last, current ±1, with ellipses
  const pages: (number | "ellipsis")[] = [];
  const add = (p: number | "ellipsis") => pages.push(p);

  add(1);
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  if (start > 2) add("ellipsis");
  for (let i = start; i <= end; i++) add(i);
  if (end < totalPages - 1) add("ellipsis");
  if (totalPages > 1) add(totalPages);

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={buildHref(currentPage - 1, searchParams)}
            />
          </PaginationItem>
        )}
        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <PaginationItem key={`e-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href={buildHref(p, searchParams)}
                isActive={p === currentPage}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              href={buildHref(currentPage + 1, searchParams)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
