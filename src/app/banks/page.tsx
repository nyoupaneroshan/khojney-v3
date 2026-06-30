import type { Metadata } from "next";
import Link from "next/link";
import {
  Landmark,
  MapPin,
  Calendar,
  Building2,
  Smartphone,
  Globe,
  Wifi,
  Star,
} from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { ListPageHeader } from "@/components/khojney/list-page-header";
import { FiltersShell, ClearFiltersLink } from "@/components/khojney/filters-shell";
import { SearchBar } from "@/components/khojney/search-bar";
import { FilterSelect } from "@/components/khojney/filter-select";
import { FilterSuspense } from "@/components/khojney/filter-suspense";
import { PaginationControl } from "@/components/khojney/pagination-control";
import { EmptyState } from "@/components/khojney/empty-state";
import { StarRating } from "@/components/khojney/star-rating";
import { EntityBadge } from "@/components/khojney/entity-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { asInt, asString, type SearchParamsLike } from "@/components/khojney/filter-url";

export const revalidate = 3600;
const BASE_PATH = "/banks";
const PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: "Banks of Nepal",
  description:
    "Explore commercial, development, finance, and microfinance banks of Nepal. Compare savings & fixed deposit rates, branch/ATM networks, mobile & internet banking, and more.",
  alternates: { canonical: BASE_PATH },
};

const SORT_OPTIONS = [
  { label: "Highest rated", value: "rating" },
  { label: "Name (A → Z)", value: "name" },
  { label: "Oldest first", value: "established" },
];

const TYPE_OPTIONS = [
  { label: "Commercial (Class A)", value: "COMMERCIAL" },
  { label: "Development (Class B)", value: "DEVELOPMENT" },
  { label: "Finance (Class C)", value: "FINANCE" },
  { label: "Microfinance (Class D)", value: "MICROFINANCE" },
];

/** Format a rate range like "2.5% – 8.0%". Returns null when neither bound is set. */
function formatRateRange(min: number | null, max: number | null): string | null {
  if (min == null && max == null) return null;
  if (min != null && max != null) return `${min}% – ${max}%`;
  const v = (min ?? max) as number;
  return `${v}%`;
}

export default async function BanksListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsLike>;
}) {
  const user = await getSession();
  const sp = await searchParams;

  const q = asString(sp.q)?.trim() ?? "";
  const type = asString(sp.type);
  const sort = asString(sp.sort) ?? "rating";
  const page = Math.max(1, asInt(sp.page, 1));
  const pageSize = Math.max(1, Math.min(48, asInt(sp.pageSize, PAGE_SIZE)));

  // Build Prisma where clause
  const where: Record<string, unknown> = { isPublished: true };
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { shortName: { contains: q } },
      { description: { contains: q } },
      { headquarters: { contains: q } },
    ];
  }
  if (type) where.type = type;

  const orderBy: Record<string, "asc" | "desc"> =
    sort === "name"
      ? { name: "asc" }
      : sort === "established"
        ? { establishedYear: "asc" }
        : { rating: "desc" };

  const [total, banks] = await Promise.all([
    db.bank.count({ where }),
    db.bank.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const activeFilterCount = [q, type].filter(Boolean).length;

  return (
    <AppShell user={user}>
      <ListPageHeader
        title="Banks of Nepal"
        description="Browse and compare commercial, development, finance, and microfinance banks across Nepal. Check interest rates, branches, ATMs, mobile & internet banking, cards, and loans."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Banks" }]}
        totalCount={total}
      />

      <section className="py-10">
        <div className="container-app">
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <FiltersShell title="Filter banks" activeCount={activeFilterCount}>
              <FilterSuspense>
                <div className="space-y-4">
                  <FilterSelect
                    basePath={BASE_PATH}
                    param="type"
                    label="Bank type"
                    includeAll="All types"
                    options={TYPE_OPTIONS}
                  />
                  <Separator />
                  <ClearFiltersLink basePath={BASE_PATH} />
                </div>
              </FilterSuspense>
            </FiltersShell>

            <div>
              <FilterSuspense>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <SearchBar
                    basePath={BASE_PATH}
                    placeholder="Search by name, short name, or city..."
                    className="sm:max-w-md"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Sort:</span>
                    <FilterSelect
                      basePath={BASE_PATH}
                      param="sort"
                      includeAll="Default"
                      options={SORT_OPTIONS}
                      resetPage={false}
                      className="min-w-[160px]"
                    />
                  </div>
                </div>
              </FilterSuspense>

              {banks.length === 0 ? (
                <EmptyState
                  icon={Landmark}
                  title="No banks found"
                  description="Try adjusting your filters or search keywords to see more results."
                  actionLabel="Clear all filters"
                  actionHref={BASE_PATH}
                />
              ) : (
                <>
                  <p className="mb-4 text-xs text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium text-foreground">
                      {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)}
                    </span>{" "}
                    of <span className="font-medium text-foreground">{total}</span> banks
                  </p>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {banks.map((b) => {
                      const savings = formatRateRange(b.savingsRateMin, b.savingsRateMax);
                      return (
                        <Card
                          key={b.id}
                          className="card-hover flex flex-col overflow-hidden"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Landmark className="h-6 w-6" />
                              </div>
                              <EntityBadge variant="secondary" value={b.type} />
                            </div>
                            <h3 className="mt-3 text-base font-semibold leading-snug">
                              <Link
                                href={`/banks/${b.slug}`}
                                className="line-clamp-2 hover:text-primary"
                              >
                                {b.name}
                              </Link>
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                              {b.shortName && (
                                <span className="font-medium text-foreground">
                                  {b.shortName}
                                </span>
                              )}
                              {b.establishedYear && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" /> Est. {b.establishedYear}
                                </span>
                              )}
                              {b.headquarters && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" /> {b.headquarters}
                                </span>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="flex-1 space-y-3 pb-3">
                            <p className="line-clamp-2 text-sm text-muted-foreground">
                              {b.description}
                            </p>
                            {b.rating > 0 && (
                              <StarRating rating={b.rating} count={b.reviewCount} />
                            )}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Building2 className="h-3.5 w-3.5" />
                                <span>
                                  <span className="font-medium text-foreground">
                                    {b.branchCount ?? "—"}
                                  </span>{" "}
                                  branches
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Star className="h-3.5 w-3.5" />
                                <span>
                                  <span className="font-medium text-foreground">
                                    {b.atmCount ?? "—"}
                                  </span>{" "}
                                  ATMs
                                </span>
                              </div>
                              {savings && (
                                <div className="col-span-2 flex items-center gap-1.5 text-muted-foreground">
                                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                                    Savings
                                  </span>
                                  <span className="font-medium text-foreground">{savings}</span>
                                </div>
                              )}
                            </div>
                            {(b.mobileBanking || b.internetBanking) && (
                              <div className="flex flex-wrap gap-1.5">
                                {b.mobileBanking && (
                                  <EntityBadge variant="outline" className="gap-1">
                                    <Smartphone className="h-3 w-3" /> Mobile
                                  </EntityBadge>
                                )}
                                {b.internetBanking && (
                                  <EntityBadge variant="outline" className="gap-1">
                                    <Globe className="h-3 w-3" /> Internet
                                  </EntityBadge>
                                )}
                                {b.swiftCode && (
                                  <EntityBadge variant="outline" className="gap-1">
                                    <Wifi className="h-3 w-3" /> SWIFT
                                  </EntityBadge>
                                )}
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button asChild size="sm" variant="ghost" className="ml-auto">
                              <Link href={`/banks/${b.slug}`}>View details</Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>

                  <PaginationControl
                    currentPage={page}
                    totalPages={totalPages}
                    basePath={BASE_PATH}
                    searchParams={sp}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
