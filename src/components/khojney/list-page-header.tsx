import { BreadcrumbNav, type BreadcrumbItemData } from "./breadcrumb-nav";

interface ListPageHeaderProps {
  title: string;
  description?: string;
  breadcrumb: BreadcrumbItemData[];
  /** Total result count, displayed as a small badge. */
  totalCount?: number;
  /** Optional small label like "12 of 240 colleges". */
  resultLabel?: string;
}

/**
 * Standard header for public list pages: breadcrumb + title + description.
 */
export function ListPageHeader({
  title,
  description,
  breadcrumb,
  totalCount,
  resultLabel,
}: ListPageHeaderProps) {
  return (
    <div className="border-b bg-gradient-to-b from-secondary/40 to-background">
      <div className="container-app py-8">
        <BreadcrumbNav items={breadcrumb} className="mb-3" />
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            {description && (
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                {description}
              </p>
            )}
          </div>
          {(typeof totalCount === "number" || resultLabel) && (
            <div className="rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              {resultLabel ?? `${totalCount ?? 0} results`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
