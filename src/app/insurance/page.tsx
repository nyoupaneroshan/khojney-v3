import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  Building2,
  ArrowRight,
  Percent,
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
import { buildMetadata, MODULE_KEYWORDS } from "@/lib/seo";
import { INSURANCE_TYPES } from "@/lib/constants";
import { parseJsonArray } from "@/components/khojney/format";
import { CrossLinkFooter } from "@/components/khojney/cross-link-footer";

export const revalidate = 3600;
const BASE_PATH = "/insurance";
const PAGE_SIZE = 12;

export const metadata: Metadata = buildMetadata({
  title: "Insurance Companies in Nepal — Life, Non-Life & Claim Settlement Ratios",
  description:
    "Compare Nepal Insurance Authority (Beema Pradhikaran) licensed insurance companies. Review claim settlement ratios, solvency margins, life policies, general insurance, and branch networks in Nepal.",
  canonical: BASE_PATH,
  keywords: [...MODULE_KEYWORDS.insurance],
});

const SORT_OPTIONS = [
  { label: "Highest rated", value: "rating" },
  { label: "Highest claim settlement ratio", value: "claimRatio" },
  { label: "Most branches", value: "branches" },
  { label: "Highest paid-up capital", value: "capital" },
  { label: "Name (A → Z)", value: "name" },
  { label: "Newest first", value: "newest" },
];

const TYPE_LABELS: Record<string, string> = {
  LIFE: "Life Insurance",
  NON_LIFE: "Non-Life / General",
  REINSURANCE: "Reinsurance",
  MICRO_INSURANCE: "Micro Insurance",
};

export default async function InsuranceListPage({
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

  const where: Record<string, unknown> = { isPublished: true };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { shortName: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { headquarters: { contains: q, mode: "insensitive" } },
    ];
  }
  if (type) where.type = type;

  let orderBy: Record<string, "asc" | "desc"> = { rating: "desc" };
  if (sort === "name") orderBy = { name: "asc" };
  else if (sort === "claimRatio") orderBy = { claimSettlementRatio: "desc" };
  else if (sort === "branches") orderBy = { branchCount: "desc" };
  else if (sort === "capital") orderBy = { paidUpCapital: "desc" };
  else if (sort === "newest") orderBy = { createdAt: "desc" };

  const [total, companies, aggregateData] = await Promise.all([
    db.insuranceCompany.count({ where }),
    db.insuranceCompany.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.insuranceCompany.aggregate({
      where: { isPublished: true },
      _count: { _all: true },
      _avg: { claimSettlementRatio: true },
      _sum: { branchCount: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const activeFilterCount = [q, type].filter(Boolean).length;

  const typeOptions = INSURANCE_TYPES.map((t) => ({
    label: TYPE_LABELS[t] || t,
    value: t,
  }));

  return (
    <AppShell user={user}>
      <ListPageHeader
        title="Insurance Companies in Nepal"
        description="Comprehensive directory of Nepal Insurance Authority licensed insurers. Compare claim settlement percentages, life endowment plans, general policies, and solvency ratings."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Insurance" }]}
        totalCount={total}
      />

      {/* Aggregate Stats Bar */}
      <div className="container-app py-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span>Licensed Insurers</span>
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {aggregateData._count._all}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Percent className="h-3.5 w-3.5 text-emerald-500" />
              <span>Avg Claim Settlement</span>
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {aggregateData._avg.claimSettlementRatio
                ? `${aggregateData._avg.claimSettlementRatio.toFixed(1)}%`
                : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 text-blue-500" />
              <span>Total Network Branches</span>
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {aggregateData._sum.branchCount
                ? `${aggregateData._sum.branchCount.toLocaleString()}+`
                : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
              <span>Regulator</span>
            </div>
            <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
              Nepal Insurance Authority
            </p>
          </div>
        </div>
      </div>

      <section className="py-6">
        <div className="container-app">
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <FiltersShell title="Filter insurers" activeCount={activeFilterCount}>
              <FilterSuspense>
                <div className="space-y-4">
                  <FilterSelect
                    basePath={BASE_PATH}
                    param="type"
                    label="Insurance type"
                    includeAll="All types"
                    options={typeOptions}
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
                    placeholder="Search by insurer name e.g. Nepal Life, Shikhar, NLIC..."
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

              {companies.length === 0 ? (
                <EmptyState
                  icon={Shield}
                  title="No insurance companies found"
                  description="Try adjusting your filters or search keywords to see more providers."
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
                    of <span className="font-medium text-foreground">{total}</span> providers
                  </p>

                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {companies.map((company) => {
                      const coverages = parseJsonArray<string>(company.coverageTypes);

                      return (
                        <Card
                          key={company.id}
                          className="card-hover flex flex-col justify-between border-border/70"
                        >
                          <CardHeader className="space-y-2 pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="font-mono text-xs font-bold bg-muted/50"
                                  >
                                    {company.shortName}
                                  </Badge>
                                  <Badge
                                    variant={company.type === "LIFE" ? "default" : "secondary"}
                                    className="text-xs"
                                  >
                                    {TYPE_LABELS[company.type] || company.type}
                                  </Badge>
                                </div>
                                <h2 className="mt-2 text-base font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                  <Link href={`${BASE_PATH}/${company.slug}`}>{company.name}</Link>
                                </h2>
                              </div>

                              {company.rating > 0 && (
                                <div className="flex items-center gap-1 shrink-0">
                                  <StarRating rating={company.rating} count={company.reviewCount} />
                                </div>
                              )}
                            </div>
                          </CardHeader>

                          <CardContent className="space-y-3 pb-3">
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {company.description}
                            </p>

                            {/* Claim Settlement Ratio Highlight */}
                            {company.claimSettlementRatio !== null && company.claimSettlementRatio !== undefined && (
                              <div className="rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 p-2 border border-emerald-500/20">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="flex items-center gap-1 font-medium text-emerald-800 dark:text-emerald-300 text-[11px]">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Claim Settlement Ratio
                                  </span>
                                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                                    {company.claimSettlementRatio}%
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-2.5 text-xs">
                              <div>
                                <span className="text-muted-foreground block text-[10px]">Paid-up Capital</span>
                                <span className="font-bold text-foreground">
                                  {company.paidUpCapital ? `NPR ${company.paidUpCapital} Cr` : "—"}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[10px]">Branch Network</span>
                                <span className="font-bold text-foreground">
                                  {company.branchCount ? `${company.branchCount} Branches` : "—"}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[10px]">Solvency Ratio</span>
                                <span className="font-bold text-foreground">
                                  {company.solvencyRatio ? `${company.solvencyRatio}x` : "—"}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[10px]">Headquarters</span>
                                <span className="font-medium text-foreground truncate block">
                                  {company.headquarters || "Nepal"}
                                </span>
                              </div>
                            </div>

                            {/* Coverage Tags */}
                            {coverages.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {coverages.slice(0, 3).map((cov, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0 bg-background"
                                  >
                                    {cov}
                                  </Badge>
                                ))}
                                {coverages.length > 3 && (
                                  <span className="text-[10px] text-muted-foreground self-center">
                                    +{coverages.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </CardContent>

                          <CardFooter className="pt-2 border-t border-border/40 py-2.5">
                            <Button asChild variant="ghost" size="sm" className="w-full text-xs justify-between">
                              <Link href={`${BASE_PATH}/${company.slug}`}>
                                <span>View Plans & Solvency</span>
                                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
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

      <CrossLinkFooter module="insurance" />
    </AppShell>
  );
}
