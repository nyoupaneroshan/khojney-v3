import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Landmark, Clock, Banknote, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { ListPageHeader } from "@/components/khojney/list-page-header";
import { FiltersShell, ClearFiltersLink } from "@/components/khojney/filters-shell";
import { SearchBar } from "@/components/khojney/search-bar";
import { FilterSelect } from "@/components/khojney/filter-select";
import { PaginationControl } from "@/components/khojney/pagination-control";
import { EmptyState } from "@/components/khojney/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  GOV_CATEGORY_OPTIONS,
  getGovCategoryLabel,
  getGovCategoryStyle,
} from "@/lib/government-categories";
import { asInt, asString, type SearchParamsLike } from "@/components/khojney/filter-url";

export const revalidate = 3600;
const BASE_PATH = "/government";
const PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: "Government Services in Nepal",
  description:
    "Step-by-step guides for Nepali government services — citizenship, passport, PAN/VAT, driving license, land registration, vehicle registration, tax filing and more.",
  alternates: { canonical: BASE_PATH },
};

const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Most viewed", value: "views" },
];

export default async function GovernmentListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsLike>;
}) {
  const user = await getSession();
  const sp = await searchParams;

  const q = asString(sp.q)?.trim() ?? "";
  const category = asString(sp.category);
  const sort = asString(sp.sort) ?? "newest";
  const page = Math.max(1, asInt(sp.page, 1));
  const pageSize = Math.max(1, Math.min(48, asInt(sp.pageSize, PAGE_SIZE)));

  const where: Record<string, unknown> = { isPublished: true };
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { ministry: { contains: q } },
      { department: { contains: q } },
      { office: { contains: q } },
    ];
  }
  if (category) where.category = category;

  const orderBy: Record<string, "asc" | "desc"> =
    sort === "views" ? { views: "desc" } : { createdAt: "desc" };

  const [total, services] = await Promise.all([
    db.governmentService.count({ where }),
    db.governmentService.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const activeFilterCount = [q, category].filter(Boolean).length;

  return (
    <AppShell user={user}>
      <ListPageHeader
        title="Government Services in Nepal"
        description="Step-by-step guides, required documents, fees, and contact details for every major Nepali government service — all in one place."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Government Services" }]}
        totalCount={total}
      />

      <section className="py-10">
        <div className="container-app">
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <FiltersShell title="Filter services" activeCount={activeFilterCount}>
              <div className="space-y-4">
                <FilterSelect
                  basePath={BASE_PATH}
                  param="category"
                  label="Category"
                  includeAll="All categories"
                  options={GOV_CATEGORY_OPTIONS}
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
                  placeholder="Search by title, ministry, or office..."
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

              {services.length === 0 ? (
                <EmptyState
                  icon={Building2}
                  title="No government services found"
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
                    of{" "}
                    <span className="font-medium text-foreground">{total}</span>{" "}
                    government services
                  </p>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {services.map((s) => (
                      <Card
                        key={s.id}
                        className="card-hover flex flex-col overflow-hidden"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium " +
                                getGovCategoryStyle(s.category)
                              }
                            >
                              {getGovCategoryLabel(s.category)}
                            </span>
                            {s.isFeatured && (
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                Featured
                              </span>
                            )}
                          </div>
                          <h3 className="mt-3 text-base font-semibold leading-snug">
                            <Link
                              href={`/government/${s.slug}`}
                              className="line-clamp-2 hover:text-primary"
                            >
                              {s.title}
                            </Link>
                          </h3>
                          {(s.ministry || s.department) && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Landmark className="h-3 w-3" />
                              <span className="line-clamp-1">
                                {[s.ministry, s.department].filter(Boolean).join(" · ")}
                              </span>
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="flex-1 space-y-3 pb-3">
                          <p className="line-clamp-3 text-sm text-muted-foreground">
                            {s.description}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            {s.processingTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {s.processingTime}
                              </span>
                            )}
                            {s.applicationFee && (
                              <span className="flex items-center gap-1">
                                <Banknote className="h-3.5 w-3.5" />
                                {s.applicationFee}
                              </span>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button
                            asChild
                            size="sm"
                            variant="ghost"
                            className="ml-auto"
                          >
                            <Link href={`/government/${s.slug}`}>
                              View Process{" "}
                              <ArrowRight className="h-3.5 w-3.5" />
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
    </AppShell>
  );
}
