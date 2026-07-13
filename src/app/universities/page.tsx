import type { Metadata } from "next";
import Link from "next/link";
import { Building2, MapPin, Users, Landmark, Award, ArrowRight, Calendar } from "lucide-react";
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
import { AvatarInitial } from "@/components/khojney/avatar-initial";
import { StarRating } from "@/components/khojney/star-rating";
import { EntityBadge } from "@/components/khojney/entity-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatNumber } from "@/components/khojney/format";
import { asInt, asString, type SearchParamsLike } from "@/components/khojney/filter-url";
import { buildMetadata, MODULE_KEYWORDS } from "@/lib/seo";
import { CrossLinkFooter } from "@/components/khojney/cross-link-footer";

export const revalidate = 3600;
const BASE_PATH = "/universities";
const PAGE_SIZE = 12;

export const metadata: Metadata = buildMetadata({
  title: "Universities in Nepal 2025 — TU, KU, PU, PoU & More Rankings",
  description:
    "Explore all major universities in Nepal — Tribhuvan University, Kathmandu University, Pokhara University, Purbanchal University, and more. Compare programs, faculties, and campuses.",
  canonical: BASE_PATH,
  keywords: [...MODULE_KEYWORDS.universities],
});

const SORT_OPTIONS = [
  { label: "Highest rated", value: "rating" },
  { label: "Name (A → Z)", value: "name" },
  { label: "Newest first", value: "newest" },
  { label: "Ranking (low → high)", value: "ranking" },
];

const TYPE_OPTIONS = [
  { label: "Public", value: "PUBLIC" },
  { label: "Private", value: "PRIVATE" },
];

export default async function UniversitiesListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsLike>;
}) {
  const user = await getSession();
  const sp = await searchParams;

  const q = asString(sp.q)?.trim() ?? "";
  const type = asString(sp.type);
  const city = asString(sp.city)?.trim();
  const sort = asString(sp.sort) ?? "rating";
  const page = Math.max(1, asInt(sp.page, 1));
  const pageSize = Math.max(1, Math.min(48, asInt(sp.pageSize, PAGE_SIZE)));

  const where: Record<string, unknown> = { isPublished: true };
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { city: { contains: q } },
    ];
  }
  if (type) where.type = type;
  if (city) where.city = { contains: city };

  const orderBy: Record<string, "asc" | "desc"> =
    sort === "name"
      ? { name: "asc" }
      : sort === "newest"
        ? { createdAt: "desc" }
        : sort === "ranking"
          ? { ranking: "asc" }
          : { rating: "desc" };

  const [total, universities] = await Promise.all([
    db.university.count({ where }),
    db.university.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const activeFilterCount = [q, type, city].filter(Boolean).length;

  return (
    <AppShell user={user}>
      <ListPageHeader
        title="Universities in Nepal"
        description="Browse all accredited universities in Nepal. Compare programs, faculties, campuses, and student stats."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Universities" }]}
        totalCount={total}
      />

      <section className="py-10">
        <div className="container-app">
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <FiltersShell title="Filter universities" activeCount={activeFilterCount}>
              <FilterSuspense>
                <div className="space-y-4">
                  <FilterSelect
                    basePath={BASE_PATH}
                    param="type"
                    label="Type"
                    includeAll="All types"
                    options={TYPE_OPTIONS}
                  />
                  <FilterTextInput
                    basePath={BASE_PATH}
                    param="city"
                    label="City"
                    placeholder="e.g. Kathmandu"
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
                    placeholder="Search by name, description, or city..."
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

              {universities.length === 0 ? (
                <EmptyState
                  icon={Landmark}
                  title="No universities found"
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
                    of <span className="font-medium text-foreground">{total}</span> universities
                  </p>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {universities.map((u) => (
                      <Card key={u.id} className="card-hover flex flex-col overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <AvatarInitial name={u.name} size="md" />
                            {u.ranking && (
                              <EntityBadge variant="secondary">Rank #{u.ranking}</EntityBadge>
                            )}
                          </div>
                          <h3 className="mt-3 text-base font-semibold leading-snug">
                            <Link href={`/universities/${u.slug}`} className="line-clamp-2 hover:text-primary">
                              {u.name}
                            </Link>
                          </h3>
                          {u.city && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" /> {u.city}
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="flex-1 space-y-3 pb-3">
                          <p className="line-clamp-3 text-sm text-muted-foreground">
                            {u.description}
                          </p>
                          {u.rating > 0 && (
                            <StarRating rating={u.rating} count={u.reviewCount} />
                          )}
                          <div className="flex flex-wrap gap-1">
                            <EntityBadge value={u.type} />
                            {u.establishedYear && (
                              <EntityBadge variant="secondary">Est. {u.establishedYear}</EntityBadge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" /> {formatNumber(u.totalCampuses)} campuses
                            </span>
                            {u.totalStudents && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" /> {formatNumber(u.totalStudents)} students
                              </span>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button asChild size="sm" variant="ghost" className="ml-auto">
                            <Link href={`/universities/${u.slug}`}>
                              View details <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
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
      <CrossLinkFooter module="universities" />
    </AppShell>
  );
}
