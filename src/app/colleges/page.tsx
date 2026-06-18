import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, BadgeCheck, Building2, Banknote } from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { ListPageHeader } from "@/components/khojney/list-page-header";
import { FiltersShell, ClearFiltersLink } from "@/components/khojney/filters-shell";
import { SearchBar } from "@/components/khojney/search-bar";
import { FilterSelect } from "@/components/khojney/filter-select";
import { FilterTextInput } from "@/components/khojney/filter-text-input";
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
const BASE_PATH = "/colleges";
const PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: "Colleges in Nepal",
  description:
    "Browse and compare top colleges in Nepal — engineering, medical, management, science, and more. Filter by province, district, affiliation, type, and rating.",
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
  { label: "International", value: "INTERNATIONAL" },
];

const RATING_OPTIONS = [
  { label: "1+ stars", value: "1" },
  { label: "2+ stars", value: "2" },
  { label: "3+ stars", value: "3" },
  { label: "4+ stars", value: "4" },
  { label: "5 stars", value: "5" },
];

export default async function CollegesListPage({
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
  const categoryId = asString(sp.category);
  const minRating = asInt(sp.minRating, 0);
  const sort = asString(sp.sort) ?? "rating";
  const page = Math.max(1, asInt(sp.page, 1));
  const pageSize = Math.max(1, Math.min(48, asInt(sp.pageSize, PAGE_SIZE)));

  // Build Prisma where clause
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
  if (categoryId) where.categoryId = categoryId;
  if (minRating > 0) where.rating = { gte: minRating };

  const orderBy: Record<string, "asc" | "desc"> =
    sort === "name"
      ? { name: "asc" }
      : sort === "newest"
        ? { createdAt: "desc" }
        : { rating: "desc" };

  const [total, colleges, categories] = await Promise.all([
    db.college.count({ where }),
    db.college.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: true },
    }),
    db.category.findMany({
      where: { module: "COLLEGE" },
      orderBy: { name: "asc" },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const activeFilterCount = [
    q,
    province,
    district,
    affiliation,
    type,
    categoryId,
    minRating > 0 ? String(minRating) : "",
  ].filter(Boolean).length;

  return (
    <AppShell user={user}>
      <ListPageHeader
        title="Colleges in Nepal"
        description="Browse, compare, and review top colleges across Nepal. Filter by location, affiliation, type, and rating to find the right fit."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Colleges" }]}
        totalCount={total}
      />

      <section className="py-10">
        <div className="container-app">
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <FiltersShell title="Filter colleges" activeCount={activeFilterCount}>
              <div className="space-y-4">
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
                  placeholder="e.g. TU, KU, PU, CTEVT"
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
                  param="category"
                  label="Category"
                  includeAll="All categories"
                  options={categories.map((c) => ({ label: c.name, value: c.id }))}
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
            </FiltersShell>

            <div>
              {/* Toolbar: search + sort */}
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

              {colleges.length === 0 ? (
                <EmptyState
                  icon={Building2}
                  title="No colleges found"
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
                    of <span className="font-medium text-foreground">{total}</span> colleges
                  </p>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {colleges.map((c) => (
                      <Card key={c.id} className="card-hover flex flex-col overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <AvatarInitial name={c.name} size="md" />
                            {c.isVerified && (
                              <EntityBadge variant="secondary" className="gap-1">
                                <BadgeCheck className="h-3 w-3" /> Verified
                              </EntityBadge>
                            )}
                          </div>
                          <h3 className="mt-3 text-base font-semibold leading-snug">
                            <Link
                              href={`/colleges/${c.slug}`}
                              className="line-clamp-2 hover:text-primary"
                            >
                              {c.name}
                            </Link>
                          </h3>
                          {(c.city || c.district) && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {[c.city, c.district].filter(Boolean).join(", ")}
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="flex-1 space-y-3 pb-3">
                          <p className="line-clamp-3 text-sm text-muted-foreground">
                            {c.description}
                          </p>
                          {c.rating > 0 && (
                            <StarRating rating={c.rating} count={c.reviewCount} />
                          )}
                          <div className="flex flex-wrap gap-1">
                            {c.affiliation && <EntityBadge value={c.affiliation} />}
                            <EntityBadge value={c.type} />
                            {c.scholarshipsAvailable && (
                              <EntityBadge variant="secondary">Scholarships</EntityBadge>
                            )}
                          </div>
                          {c.feesRange && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Banknote className="h-3.5 w-3.5" />
                              {c.feesRange}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button asChild size="sm" variant="ghost" className="ml-auto">
                            <Link href={`/colleges/${c.slug}`}>View details</Link>
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
