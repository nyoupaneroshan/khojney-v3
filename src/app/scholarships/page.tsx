import type { Metadata } from "next";
import Link from "next/link";
import { Award, Calendar, Globe, ArrowRight, Building2 } from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { ListPageHeader } from "@/components/khojney/list-page-header";
import { FiltersShell, ClearFiltersLink } from "@/components/khojney/filters-shell";
import { SearchBar } from "@/components/khojney/search-bar";
import { FilterSelect } from "@/components/khojney/filter-select";
import { FilterTextInput } from "@/components/khojney/filter-text-input";
import { FilterSuspense } from "@/components/khojney/filter-suspense";
import { PaginationControl } from "@/components/khojney/pagination-control";
import { EmptyState } from "@/components/khojney/empty-state";
import { EntityBadge } from "@/components/khojney/entity-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, daysUntil } from "@/components/khojney/format";
import { asInt, asString, type SearchParamsLike } from "@/components/khojney/filter-url";

export const revalidate = 3600;
const BASE_PATH = "/scholarships";
const PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: "Scholarships in Nepal & Abroad",
  description:
    "Discover scholarships for Nepali students — school, +2, bachelors, masters, and PhD. Filter by level, field, country, and deadline.",
  alternates: { canonical: BASE_PATH },
};

const SORT_OPTIONS = [
  { label: "Deadline (soonest first)", value: "deadline" },
  { label: "Newest first", value: "newest" },
];

const LEVEL_OPTIONS = [
  { label: "School", value: "SCHOOL" },
  { label: "+2 (Higher Secondary)", value: "+2" },
  { label: "Bachelors", value: "BACHELORS" },
  { label: "Masters", value: "MASTERS" },
  { label: "PhD", value: "PHD" },
  { label: "Any level", value: "ANY" },
];

export default async function ScholarshipsListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsLike>;
}) {
  const user = await getSession();
  const sp = await searchParams;

  const q = asString(sp.q)?.trim() ?? "";
  const level = asString(sp.level);
  const field = asString(sp.field)?.trim();
  const country = asString(sp.country)?.trim();
  const openOnly = asString(sp.open) === "1";
  const sort = asString(sp.sort) ?? "deadline";
  const page = Math.max(1, asInt(sp.page, 1));
  const pageSize = Math.max(1, Math.min(48, asInt(sp.pageSize, PAGE_SIZE)));

  const where: Record<string, unknown> = { isPublished: true };
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { provider: { contains: q } },
    ];
  }
  if (level) where.level = level;
  if (field) where.field = { contains: field };
  if (country) where.country = { contains: country };
  if (openOnly) {
    where.deadline = { gte: new Date() };
  }

  const orderBy: Record<string, "asc" | "desc"> =
    sort === "newest" ? { createdAt: "desc" } : { deadline: "asc" };

  const [total, scholarships] = await Promise.all([
    db.scholarship.count({ where }),
    db.scholarship.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const activeFilterCount = [q, level, field, country, openOnly ? "1" : ""].filter(Boolean).length;

  return (
    <AppShell user={user}>
      <ListPageHeader
        title="Scholarships"
        description="Find local and international scholarships for Nepali students — from +2 through PhD."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Scholarships" }]}
        totalCount={total}
      />

      <section className="py-10">
        <div className="container-app">
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <FiltersShell title="Filter scholarships" activeCount={activeFilterCount}>
              <FilterSuspense>
                <div className="space-y-4">
                  <FilterSelect
                    basePath={BASE_PATH}
                    param="level"
                    label="Level"
                    includeAll="All levels"
                    options={LEVEL_OPTIONS}
                  />
                  <FilterTextInput
                    basePath={BASE_PATH}
                    param="field"
                    label="Field of study"
                    placeholder="e.g. Engineering, Medicine"
                  />
                  <FilterTextInput
                    basePath={BASE_PATH}
                    param="country"
                    label="Country"
                    placeholder="e.g. Nepal, India, USA"
                  />
                  <FilterSelect
                    basePath={BASE_PATH}
                    param="open"
                    label="Status"
                    includeAll="All scholarships"
                    options={[{ label: "Open only (deadline not passed)", value: "1" }]}
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
                    placeholder="Search scholarships by title, provider..."
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
                      className="min-w-[180px]"
                    />
                  </div>
                </div>
              </FilterSuspense>

              {scholarships.length === 0 ? (
                <EmptyState
                  icon={Award}
                  title="No scholarships found"
                  description="Try clearing some filters or checking back later — new scholarships are added regularly."
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
                    of <span className="font-medium text-foreground">{total}</span> scholarships
                  </p>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {scholarships.map((s) => {
                      const days = daysUntil(s.deadline);
                      const isClosed = days !== null && days < 0;
                      return (
                        <Card key={s.id} className="card-hover flex flex-col overflow-hidden">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <Award className="h-5 w-5" />
                              </div>
                              {s.level && <EntityBadge variant="secondary" value={s.level} />}
                            </div>
                            <h3 className="text-base font-semibold leading-snug">
                              <Link href={`/scholarships/${s.slug}`} className="line-clamp-2 hover:text-primary">
                                {s.title}
                              </Link>
                            </h3>
                            {s.provider && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Building2 className="h-3 w-3" /> {s.provider}
                              </div>
                            )}
                          </CardHeader>
                          <CardContent className="flex-1 space-y-3 pb-3">
                            <p className="line-clamp-2 text-sm text-muted-foreground">
                              {s.description}
                            </p>
                            {s.amount && (
                              <div className="text-sm font-semibold text-emerald-700">{s.amount}</div>
                            )}
                            <div className="space-y-1.5 text-xs text-muted-foreground">
                              {s.field && (
                                <div className="flex items-center gap-1">
                                  <Award className="h-3 w-3" /> {s.field}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> Deadline: {formatDate(s.deadline)}
                                {days !== null && days >= 0 && days <= 30 && (
                                  <EntityBadge variant="destructive" className="ml-1">
                                    {days}d left
                                  </EntityBadge>
                                )}
                                {isClosed && (
                                  <EntityBadge variant="outline" className="ml-1">
                                    Closed
                                  </EntityBadge>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Globe className="h-3 w-3" /> {s.country}
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button asChild size="sm" variant="ghost" className="ml-auto">
                              <Link href={`/scholarships/${s.slug}`}>
                                View details <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
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
