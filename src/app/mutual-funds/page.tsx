import type { Metadata } from "next";
import Link from "next/link";
import {
  PieChart,
  TrendingUp,
  Landmark,
  ArrowRight,
  ShieldCheck,
  Coins,
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { asInt, asString, type SearchParamsLike } from "@/components/khojney/filter-url";
import { buildMetadata, MODULE_KEYWORDS } from "@/lib/seo";
import { MUTUAL_FUND_TYPES, MUTUAL_FUND_CATEGORIES } from "@/lib/constants";
import { parseJsonArray, formatDate } from "@/components/khojney/format";
import { CrossLinkFooter } from "@/components/khojney/cross-link-footer";

export const revalidate = 3600;
const BASE_PATH = "/mutual-funds";
const PAGE_SIZE = 12;

export const metadata: Metadata = buildMetadata({
  title: "Mutual Funds in Nepal — Latest NAV, Performance, Yield & Holdings",
  description:
    "Track and compare SEBON-registered mutual funds in Nepal. Explore open-ended and close-ended mutual funds, latest NAVs, dividend histories, asset sizes, and portfolio holdings.",
  canonical: BASE_PATH,
  keywords: [...MODULE_KEYWORDS.mutualFunds],
});

const SORT_OPTIONS = [
  { label: "Highest NAV", value: "nav" },
  { label: "Largest fund size", value: "size" },
  { label: "Highest dividend yield", value: "yield" },
  { label: "Name (A → Z)", value: "name" },
  { label: "Newest first", value: "newest" },
];

const FUND_TYPE_LABELS: Record<string, string> = {
  CLOSE_ENDED: "Close-Ended",
  OPEN_ENDED: "Open-Ended",
};

const CATEGORY_LABELS: Record<string, string> = {
  EQUITY: "Equity",
  BALANCED: "Balanced",
  DEBT: "Debt / Income",
  INDEX: "Index",
};

export default async function MutualFundsListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsLike>;
}) {
  const user = await getSession();
  const sp = await searchParams;

  const q = asString(sp.q)?.trim() ?? "";
  const type = asString(sp.type);
  const category = asString(sp.category);
  const sort = asString(sp.sort) ?? "nav";
  const page = Math.max(1, asInt(sp.page, 1));
  const pageSize = Math.max(1, Math.min(48, asInt(sp.pageSize, PAGE_SIZE)));

  const where: Record<string, unknown> = { isPublished: true };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { schemeCode: { contains: q, mode: "insensitive" } },
      { fundManager: { contains: q, mode: "insensitive" } },
      { sponsor: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  if (type) where.fundType = type;
  if (category) where.category = category;

  const orderBy: Record<string, "asc" | "desc"> =
    sort === "name"
      ? { name: "asc" }
      : sort === "size"
        ? { fundSize: "desc" }
        : sort === "yield"
          ? { dividendYield: "desc" }
          : sort === "newest"
            ? { createdAt: "desc" }
            : { nav: "desc" };

  const [total, funds, aggregateData] = await Promise.all([
    db.mutualFund.count({ where }),
    db.mutualFund.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.mutualFund.aggregate({
      where: { isPublished: true },
      _count: { _all: true },
      _sum: { fundSize: true },
      _avg: { nav: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const activeFilterCount = [q, type, category].filter(Boolean).length;

  const typeOptions = MUTUAL_FUND_TYPES.map((t) => ({
    label: FUND_TYPE_LABELS[t] || t,
    value: t,
  }));

  const categoryOptions = MUTUAL_FUND_CATEGORIES.map((c) => ({
    label: CATEGORY_LABELS[c] || c,
    value: c,
  }));

  return (
    <AppShell user={user}>
      <ListPageHeader
        title="Mutual Funds in Nepal"
        description="Comprehensive directory of SEBON-regulated mutual funds. Compare Net Asset Values (NAV), fund sizes, dividend returns, and portfolio allocations."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Mutual Funds" }]}
        totalCount={total}
      />

      {/* Aggregate Stats Bar */}
      <div className="container-app py-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <PieChart className="h-3.5 w-3.5 text-primary" />
              <span>Total Schemes</span>
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {aggregateData._count._all}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Coins className="h-3.5 w-3.5 text-emerald-500" />
              <span>Total Corpus Size</span>
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              NPR {aggregateData._sum.fundSize ? `${aggregateData._sum.fundSize.toLocaleString()} Cr` : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
              <span>Average NAV</span>
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              NPR {aggregateData._avg.nav ? aggregateData._avg.nav.toFixed(2) : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
              <span>Regulator</span>
            </div>
            <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
              SEBON Nepal
            </p>
          </div>
        </div>
      </div>

      <section className="py-6">
        <div className="container-app">
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <FiltersShell title="Filter mutual funds" activeCount={activeFilterCount}>
              <FilterSuspense>
                <div className="space-y-4">
                  <FilterSelect
                    basePath={BASE_PATH}
                    param="type"
                    label="Fund type"
                    includeAll="All types"
                    options={typeOptions}
                  />
                  <FilterSelect
                    basePath={BASE_PATH}
                    param="category"
                    label="Category"
                    includeAll="All categories"
                    options={categoryOptions}
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
                    placeholder="Search by scheme name, code, manager..."
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

              {funds.length === 0 ? (
                <EmptyState
                  icon={PieChart}
                  title="No mutual funds found"
                  description="Try adjusting your filters or search keywords to see more schemes."
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
                    of <span className="font-medium text-foreground">{total}</span> schemes
                  </p>

                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {funds.map((fund) => {
                      const holdings = parseJsonArray<string>(fund.topHoldings);
                      return (
                        <Card
                          key={fund.id}
                          className="card-hover flex flex-col justify-between border-border/70"
                        >
                          <CardHeader className="space-y-2 pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  {fund.schemeCode && (
                                    <Badge variant="outline" className="font-mono text-xs font-semibold">
                                      {fund.schemeCode}
                                    </Badge>
                                  )}
                                  <Badge variant="secondary" className="text-xs">
                                    {CATEGORY_LABELS[fund.category] || fund.category}
                                  </Badge>
                                  <Badge
                                    variant={fund.fundType === "OPEN_ENDED" ? "default" : "secondary"}
                                    className="text-xs"
                                  >
                                    {FUND_TYPE_LABELS[fund.fundType] || fund.fundType}
                                  </Badge>
                                </div>
                                <h2 className="mt-2 text-base font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                  <Link href={`${BASE_PATH}/${fund.slug}`}>{fund.name}</Link>
                                </h2>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Landmark className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{fund.fundManager}</span>
                            </div>
                          </CardHeader>

                          <CardContent className="space-y-3 pb-3">
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {fund.description}
                            </p>

                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-2.5 text-xs">
                              <div>
                                <span className="text-muted-foreground block text-[10px]">Latest NAV</span>
                                <span className="font-bold text-foreground">
                                  {fund.nav ? `NPR ${fund.nav.toFixed(2)}` : "—"}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[10px]">Fund Size</span>
                                <span className="font-bold text-foreground">
                                  {fund.fundSize ? `NPR ${fund.fundSize} Cr` : "—"}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[10px]">Dividend Yield</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                  {fund.dividendYield ? `${fund.dividendYield}%` : "—"}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[10px]">Maturity</span>
                                <span className="font-medium text-foreground truncate block">
                                  {fund.maturityDate
                                    ? formatDate(fund.maturityDate)
                                    : "Perpetual"}
                                </span>
                              </div>
                            </div>

                            {/* Top holdings tags */}
                            {holdings.length > 0 && (
                              <div>
                                <span className="text-[10px] font-medium text-muted-foreground">
                                  Top Holdings:
                                </span>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {holdings.slice(0, 3).map((h, i) => (
                                    <Badge
                                      key={i}
                                      variant="outline"
                                      className="text-[10px] px-1.5 py-0 bg-background font-mono"
                                    >
                                      {h}
                                    </Badge>
                                  ))}
                                  {holdings.length > 3 && (
                                    <span className="text-[10px] text-muted-foreground self-center">
                                      +{holdings.length - 3}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>

                          <CardFooter className="pt-2 border-t border-border/40 py-2.5">
                            <Button asChild variant="ghost" size="sm" className="w-full text-xs justify-between">
                              <Link href={`${BASE_PATH}/${fund.slug}`}>
                                <span>View Scheme Details</span>
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

      <CrossLinkFooter module="mutualFunds" />
    </AppShell>
  );
}
