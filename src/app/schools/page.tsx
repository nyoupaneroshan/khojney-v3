import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, BadgeCheck, School as SchoolIcon, Banknote, GraduationCap } from "lucide-react";
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
import { NEPAL_PROVINCES, NEPAL_DISTRICTS } from "@/lib/constants";
import { asInt, asString, type SearchParamsLike } from "@/components/khojney/filter-url";

export const revalidate = 3600;
const BASE_PATH = "/schools";
const PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: "Schools in Nepal",
  description:
    "Browse primary, secondary, and higher-secondary schools in Nepal. Filter by level, province, district, affiliation, and rating.",
  alternates: { canonical: BASE_PATH },
};

const SORT_OPTIONS = [
  { label: "Highest rated", value: "rating" },
  { label: "Name (A → Z)", value: "name" },
  { label: "Newest first", value: "newest" },
];

const TYPE_OPTIONS = [
  { label: "Public", value: "PUBLIC" },
  { label: "Private", value: "PRIVATE" },
  { label: "Community", value: "COMMUNITY" },
];

const LEVEL_OPTIONS = [
  { label: "Primary (1–5)", value: "PRIMARY" },
  { label: "Lower secondary (6–8)", value: "LOWER_SECONDARY" },
  { label: "Secondary (9–10)", value: "SECONDARY" },
  { label: "Higher secondary (+2)", value: "HIGHER_SECONDARY" },
];

const RATING_OPTIONS = [
  { label: "1+ stars", value: "1" },
  { label: "2+ stars", value: "2" },
  { label: "3+ stars", value: "3" },
  { label: "4+ stars", value: "4" },
  { label: "5 stars", value: "5" },
];

export default async function SchoolsListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsLike>;
}) {
  const user = await getSession();
  const sp = await searchParams;

  const q = asString(sp.q)?.trim() ?? "";
  const province = asString(sp.province);
  const district = asString(sp.district);
  const affiliation = asString(sp.affiliation)?.trim();
  const type = asString(sp.type);
  const level = asString(sp.level);
  const minRating = asInt(sp.minRating, 0);
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
  if (province) where.province = province;
  if (district) where.district = district;
  if (affiliation) where.affiliation = { contains: affiliation };
  if (type) where.type = type;
  if (level) where.level = level;
  if (minRating > 0) where.rating = { gte: minRating };

  const orderBy: Record<string, "asc" | "desc"> =
    sort === "name"
      ? { name: "asc" }
      : sort === "newest"
        ? { createdAt: "desc" }
        : { rating: "desc" };

  const [total, schools] = await Promise.all([
    db.school.count({ where }),
    db.school.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const activeFilterCount = [
    q,
    province,
    district,
    affiliation,
    type,
    level,
    minRating > 0 ? String(minRating) : "",
  ].filter(Boolean).length;

  return (
    <AppShell user={user}>
      <ListPageHeader
        title="Schools in Nepal"
        description="Browse and compare primary, secondary, and higher-secondary schools across Nepal. Filter by level, location, and affiliation."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Schools" }]}
        totalCount={total}
      />

      <section className="py-10">
        <div className="container-app">
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <FiltersShell title="Filter schools" activeCount={activeFilterCount}>
              <FilterSuspense>
                <div className="space-y-4">
                  <FilterSelect
                    basePath={BASE_PATH}
                    param="level"
                    label="Level"
                    includeAll="All levels"
                    options={LEVEL_OPTIONS}
                  />
                  <FilterSelect
                    basePath={BASE_PATH}
                    param="province"
                    label="Province"
                    includeAll="All provinces"
                    options={NEPAL_PROVINCES.map((p) => ({ label: p, value: p }))}
                  />
                  <FilterSelect
                    basePath={BASE_PATH}
                    param="district"
                    label="District"
                    includeAll="All districts"
                    options={NEPAL_DISTRICTS.map((d) => ({ label: d, value: d }))}
                  />
                  <FilterTextInput
                    basePath={BASE_PATH}
                    param="affiliation"
                    label="Affiliation"
                    placeholder="e.g. NEB, CDC"
                  />
                  <FilterSelect
                    basePath={BASE_PATH}
                    param="type"
                    label="Type"
                    includeAll="All types"
                    options={TYPE_OPTIONS}
                  />
                  <FilterSelect
                    basePath={BASE_PATH}
                    param="minRating"
                    label="Min rating"
                    includeAll="Any rating"
                    options={RATING_OPTIONS}
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

              {schools.length === 0 ? (
                <EmptyState
                  icon={SchoolIcon}
                  title="No schools found"
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
                    of <span className="font-medium text-foreground">{total}</span> schools
                  </p>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {schools.map((s) => (
                      <Card key={s.id} className="card-hover flex flex-col overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <AvatarInitial name={s.name} size="md" />
                            {s.isVerified && (
                              <EntityBadge variant="secondary" className="gap-1">
                                <BadgeCheck className="h-3 w-3" /> Verified
                              </EntityBadge>
                            )}
                          </div>
                          <h3 className="mt-3 text-base font-semibold leading-snug">
                            <Link href={`/schools/${s.slug}`} className="line-clamp-2 hover:text-primary">
                              {s.name}
                            </Link>
                          </h3>
                          {(s.city || s.district) && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {[s.city, s.district].filter(Boolean).join(", ")}
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="flex-1 space-y-3 pb-3">
                          <p className="line-clamp-3 text-sm text-muted-foreground">
                            {s.description}
                          </p>
                          {s.rating > 0 && (
                            <StarRating rating={s.rating} count={s.reviewCount} />
                          )}
                          <div className="flex flex-wrap gap-1">
                            {s.level && (
                              <EntityBadge variant="secondary">
                                <GraduationCap className="h-3 w-3" />
                                {s.level.replace(/_/g, " ").toLowerCase()}
                              </EntityBadge>
                            )}
                            {s.affiliation && <EntityBadge value={s.affiliation} />}
                            <EntityBadge value={s.type} />
                          </div>
                          {s.feesRange && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Banknote className="h-3.5 w-3.5" /> {s.feesRange}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button asChild size="sm" variant="ghost" className="ml-auto">
                            <Link href={`/schools/${s.slug}`}>View details</Link>
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
    </AppShell>
  );
}
