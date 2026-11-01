import type { Metadata } from "next";
import Link from "next/link";
import {
  HeartPulse,
  MapPin,
  Building2,
  PhoneCall,
  Bed,
  ShieldAlert,
  Ambulance,
  Activity,
  ArrowRight,
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { asInt, asString, type SearchParamsLike } from "@/components/khojney/filter-url";
import { buildMetadata, MODULE_KEYWORDS, buildBreadcrumbSchema, buildItemListSchema } from "@/lib/seo";
import { JsonLd } from "@/components/khojney/json-ld";
import { NEPAL_PROVINCES, HOSPITAL_TYPES } from "@/lib/constants";
import { CrossLinkFooter } from "@/components/khojney/cross-link-footer";

export const revalidate = 3600;
const BASE_PATH = "/hospitals";
const PAGE_SIZE = 12;

export const metadata: Metadata = buildMetadata({
  title: "Hospitals in Nepal — Emergency Contacts, Bed Availability & Specialties",
  description:
    "Find government, teaching, private, and specialty hospitals across Nepal. Compare bed capacities, emergency hotlines, ICU facilities, and medical specialties.",
  canonical: BASE_PATH,
  keywords: [...MODULE_KEYWORDS.hospitals],
});

const SORT_OPTIONS = [
  { label: "Highest rated", value: "rating" },
  { label: "Most beds", value: "beds" },
  { label: "Name (A → Z)", value: "name" },
  { label: "Newest first", value: "newest" },
];

function parseDepartments(json: string | null): string[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function HospitalsListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsLike>;
}) {
  const user = await getSession();
  const sp = await searchParams;

  const q = asString(sp.q)?.trim() ?? "";
  const type = asString(sp.type);
  const province = asString(sp.province);
  const emergencyOnly = asString(sp.emergency) === "true";
  const sort = asString(sp.sort) ?? "rating";
  const page = Math.max(1, asInt(sp.page, 1));
  const pageSize = Math.max(1, Math.min(48, asInt(sp.pageSize, PAGE_SIZE)));

  const where: Record<string, unknown> = { isPublished: true };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { shortName: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
      { district: { contains: q, mode: "insensitive" } },
    ];
  }
  if (type) where.type = type;
  if (province) where.province = province;
  if (emergencyOnly) where.hasEmergency = true;

  const orderBy: Record<string, "asc" | "desc"> =
    sort === "name"
      ? { name: "asc" }
      : sort === "beds"
        ? { bedCount: "desc" }
        : sort === "newest"
          ? { createdAt: "desc" }
          : { rating: "desc" };

  const [total, hospitals] = await Promise.all([
    db.hospital.count({ where }),
    db.hospital.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const activeFilterCount = [q, type, province, emergencyOnly ? "emergency" : null].filter(Boolean).length;

  const typeOptions = HOSPITAL_TYPES.map((t) => ({
    label: t.replace(/_/g, " "),
    value: t,
  }));

  const provinceOptions = NEPAL_PROVINCES.map((p) => ({
    label: p,
    value: p,
  }));

  const breadcrumbLd = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Hospitals", url: BASE_PATH },
  ]);

  const itemListLd = buildItemListSchema({
    name: "Hospitals in Nepal",
    description: "Emergency hotlines, ICU and ventilator beds, and medical departments across Nepal.",
    items: hospitals.map((h) => ({
      name: h.name,
      url: `/hospitals/${h.slug}`,
      image: h.coverImage || null,
    })),
  });

  return (
    <AppShell user={user}>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={itemListLd} />
      <ListPageHeader
        title="Hospitals in Nepal"
        description="Emergency hotlines, ICU and ventilator beds, medical departments, and contact numbers across all provinces of Nepal."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Hospitals" }]}
        totalCount={total}
      />

      <section className="py-10">
        <div className="container-app">
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <FiltersShell title="Filter hospitals" activeCount={activeFilterCount}>
              <FilterSuspense>
                <div className="space-y-4">
                  <FilterSelect
                    basePath={BASE_PATH}
                    param="type"
                    label="Hospital type"
                    includeAll="All types"
                    options={typeOptions}
                  />
                  <FilterSelect
                    basePath={BASE_PATH}
                    param="province"
                    label="Province"
                    includeAll="All provinces"
                    options={provinceOptions}
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
                    placeholder="Search by hospital name, city, specialty..."
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

              {hospitals.length === 0 ? (
                <EmptyState
                  icon={HeartPulse}
                  title="No hospitals found"
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
                    of <span className="font-medium text-foreground">{total}</span> hospitals
                  </p>

                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {hospitals.map((h) => {
                      const depts = parseDepartments(h.departments);
                      return (
                        <Card key={h.id} className="card-hover flex flex-col overflow-hidden justify-between border-border/70">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 font-bold">
                                <HeartPulse className="h-5 w-5" />
                              </div>
                              <div className="flex flex-wrap gap-1 items-center justify-end">
                                {h.shortName && (
                                  <Badge variant="outline" className="text-xs font-mono font-bold">
                                    {h.shortName}
                                  </Badge>
                                )}
                                <Badge variant="secondary" className="text-xs">
                                  {h.type.replace(/_/g, " ")}
                                </Badge>
                              </div>
                            </div>
                            <h3 className="mt-2 text-base font-semibold leading-snug line-clamp-2">
                              <Link href={`${BASE_PATH}/${h.slug}`} className="hover:text-primary transition-colors">
                                {h.name}
                              </Link>
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              <span>
                                {[h.city, h.district, h.province].filter(Boolean).join(", ")}
                              </span>
                            </div>
                          </CardHeader>

                          <CardContent className="space-y-3 pb-3 text-xs">
                            <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-2.5">
                              <div>
                                <span className="text-muted-foreground block text-[10px]">Bed Capacity</span>
                                <span className="font-bold text-foreground">
                                  {h.bedCount ? `${h.bedCount} Beds` : "—"}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[10px]">ICU / Vent</span>
                                <span className="font-bold text-foreground">
                                  {h.icuBeds ? `${h.icuBeds} ICU` : "Available"}
                                </span>
                              </div>
                            </div>

                            {h.emergencyPhone && (
                              <div className="flex items-center gap-1.5 font-medium text-rose-600 dark:text-rose-400">
                                <PhoneCall className="h-3.5 w-3.5 shrink-0" />
                                <span>24/7 ER: {h.emergencyPhone}</span>
                              </div>
                            )}

                            {depts.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {depts.slice(0, 3).map((d, i) => (
                                  <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0 bg-background">
                                    {d}
                                  </Badge>
                                ))}
                                {depts.length > 3 && (
                                  <span className="text-[10px] text-muted-foreground self-center">
                                    +{depts.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </CardContent>

                          <CardFooter className="pt-2 border-t border-border/40 py-2.5 flex items-center justify-between text-xs text-muted-foreground">
                            {h.rating > 0 ? (
                              <StarRating rating={h.rating} count={h.reviewCount} />
                            ) : (
                              <span>No reviews yet</span>
                            )}
                            <Button asChild size="sm" variant="ghost" className="h-8 gap-1">
                              <Link href={`${BASE_PATH}/${h.slug}`}>
                                Details <ArrowRight className="h-3.5 w-3.5" />
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

      <CrossLinkFooter module="hospitals" />
    </AppShell>
  );
}
