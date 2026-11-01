import type { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  DollarSign,
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { asInt, asString, type SearchParamsLike } from "@/components/khojney/filter-url";
import { buildMetadata, MODULE_KEYWORDS } from "@/lib/seo";
import { NEPSE_SECTORS } from "@/lib/constants";
import { CrossLinkFooter } from "@/components/khojney/cross-link-footer";

export const revalidate = 3600;
const BASE_PATH = "/nepse";
const PAGE_SIZE = 12;

export const metadata: Metadata = buildMetadata({
  title: "NEPSE Listed Stocks — Live Share Prices, Market Cap, P/E & Dividends",
  description:
    "Track Nepal Stock Exchange (NEPSE) listed companies. Compare stock prices (LTP), P/E ratios, EPS, 52-week highs/lows, bonus shares, and sector-wise performance in Nepal.",
  canonical: BASE_PATH,
  keywords: [...MODULE_KEYWORDS.nepse],
});

const SORT_OPTIONS = [
  { label: "Largest Market Cap", value: "marketCap" },
  { label: "Top Gainers (%)", value: "gainers" },
  { label: "Top Losers (%)", value: "losers" },
  { label: "Highest Price (LTP)", value: "ltp" },
  { label: "Lowest P/E Ratio", value: "pe" },
  { label: "Symbol (A → Z)", value: "symbol" },
  { label: "Newest first", value: "newest" },
];

const SECTOR_LABELS: Record<string, string> = {
  COMMERCIAL_BANK: "Commercial Banks",
  DEVELOPMENT_BANK: "Development Banks",
  FINANCE: "Finance Companies",
  HYDROPOWER: "Hydropower",
  MICROFINANCE: "Microfinance",
  LIFE_INSURANCE: "Life Insurance",
  NON_LIFE_INSURANCE: "Non-Life Insurance",
  HOTELS: "Hotels & Tourism",
  MANUFACTURING: "Manufacturing",
  INVESTMENT: "Investment",
  TELECOM: "Telecom & IT",
  OTHERS: "Others",
};

export default async function NepseListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsLike>;
}) {
  const user = await getSession();
  const sp = await searchParams;

  const q = asString(sp.q)?.trim() ?? "";
  const sector = asString(sp.sector);
  const sort = asString(sp.sort) ?? "marketCap";
  const page = Math.max(1, asInt(sp.page, 1));
  const pageSize = Math.max(1, Math.min(48, asInt(sp.pageSize, PAGE_SIZE)));

  const where: Record<string, unknown> = { isPublished: true };
  if (q) {
    where.OR = [
      { symbol: { contains: q, mode: "insensitive" } },
      { companyName: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { sector: { contains: q, mode: "insensitive" } },
    ];
  }
  if (sector) where.sector = sector;

  let orderBy: Record<string, "asc" | "desc"> = { marketCap: "desc" };
  if (sort === "symbol") orderBy = { symbol: "asc" };
  else if (sort === "gainers") orderBy = { percentChange: "desc" };
  else if (sort === "losers") orderBy = { percentChange: "asc" };
  else if (sort === "ltp") orderBy = { ltp: "desc" };
  else if (sort === "pe") orderBy = { peRatio: "asc" };
  else if (sort === "newest") orderBy = { createdAt: "desc" };

  const [total, stocks, aggregateData] = await Promise.all([
    db.nepseStock.count({ where }),
    db.nepseStock.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.nepseStock.aggregate({
      where: { isPublished: true },
      _count: { _all: true },
      _sum: { marketCap: true },
      _avg: { peRatio: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const activeFilterCount = [q, sector].filter(Boolean).length;

  const sectorOptions = NEPSE_SECTORS.map((s) => ({
    label: SECTOR_LABELS[s] || s,
    value: s,
  }));

  return (
    <AppShell user={user}>
      <ListPageHeader
        title="NEPSE Share Market"
        description="Directory of Nepal Stock Exchange (NEPSE) listed equities. Track Last Traded Prices (LTP), P/E ratios, earnings per share, and dividend returns across all sectors."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "NEPSE Stocks" }]}
        totalCount={total}
      />

      {/* Aggregate Market Stats Bar */}
      <div className="container-app py-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <BarChart3 className="h-3.5 w-3.5 text-primary" />
              <span>Tracked Listed Companies</span>
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {aggregateData._count._all}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
              <span>Total Market Capitalization</span>
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {aggregateData._sum.marketCap
                ? `NPR ${aggregateData._sum.marketCap.toLocaleString()} Cr`
                : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Percent className="h-3.5 w-3.5 text-blue-500" />
              <span>Average P/E Ratio</span>
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {aggregateData._avg.peRatio ? aggregateData._avg.peRatio.toFixed(1) : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
              <span>Stock Exchange</span>
            </div>
            <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
              NEPSE / CDS & Clearing
            </p>
          </div>
        </div>
      </div>

      <section className="py-6">
        <div className="container-app">
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <FiltersShell title="Filter stocks" activeCount={activeFilterCount}>
              <FilterSuspense>
                <div className="space-y-4">
                  <FilterSelect
                    basePath={BASE_PATH}
                    param="sector"
                    label="Sector"
                    includeAll="All sectors"
                    options={sectorOptions}
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
                    placeholder="Search by stock symbol e.g. NABIL, CIT, or company name..."
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

              {stocks.length === 0 ? (
                <EmptyState
                  icon={BarChart3}
                  title="No stocks found"
                  description="Try adjusting your filters or search keywords to see more listed companies."
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
                    of <span className="font-medium text-foreground">{total}</span> stocks
                  </p>

                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {stocks.map((stock) => {
                      const isPositive = (stock.pointChange ?? 0) > 0;
                      const isNegative = (stock.pointChange ?? 0) < 0;

                      return (
                        <Card
                          key={stock.id}
                          className="card-hover flex flex-col justify-between border-border/70"
                        >
                          <CardHeader className="space-y-2 pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="bg-primary/10 text-primary border-primary/20 font-mono text-sm font-bold tracking-wide"
                                  >
                                    {stock.symbol}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {SECTOR_LABELS[stock.sector] || stock.sector}
                                  </Badge>
                                </div>
                                <h2 className="mt-2 text-base font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                  <Link href={`${BASE_PATH}/${stock.slug}`}>{stock.companyName}</Link>
                                </h2>
                              </div>

                              {/* LTP & Price Change Pill */}
                              <div className="text-right shrink-0">
                                <div className="text-lg font-bold font-mono text-foreground">
                                  {stock.ltp ? `NPR ${stock.ltp.toLocaleString()}` : "—"}
                                </div>
                                {stock.pointChange !== null && stock.pointChange !== undefined && (
                                  <div
                                    className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                                      isPositive
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : isNegative
                                          ? "text-rose-600 dark:text-rose-400"
                                          : "text-muted-foreground"
                                    }`}
                                  >
                                    {isPositive && <TrendingUp className="h-3 w-3" />}
                                    {isNegative && <TrendingDown className="h-3 w-3" />}
                                    <span>
                                      {stock.pointChange > 0 ? `+${stock.pointChange}` : stock.pointChange}
                                    </span>
                                    {stock.percentChange !== null && stock.percentChange !== undefined && (
                                      <span>({stock.percentChange > 0 ? `+${stock.percentChange}` : stock.percentChange}%)</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="space-y-3 pb-3">
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {stock.description}
                            </p>

                            {/* Key Fundamentals Grid */}
                            <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-2.5 text-xs">
                              <div>
                                <span className="text-muted-foreground block text-[10px]">P/E Ratio</span>
                                <span className="font-bold text-foreground">
                                  {stock.peRatio ? stock.peRatio.toFixed(1) : "—"}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[10px]">EPS (NPR)</span>
                                <span className="font-bold text-foreground">
                                  {stock.eps ? stock.eps.toFixed(2) : "—"}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[10px]">Market Cap</span>
                                <span className="font-bold text-foreground">
                                  {stock.marketCap ? `NPR ${stock.marketCap} Cr` : "—"}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[10px]">Dividend Yield</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                  {stock.dividendYield ? `${stock.dividendYield}%` : "—"}
                                </span>
                              </div>
                            </div>

                            {/* 52-Week Range indicator */}
                            {(stock.low52 || stock.high52) && (
                              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                                <span>52W Low: {stock.low52 ?? "—"}</span>
                                <span>52W High: {stock.high52 ?? "—"}</span>
                              </div>
                            )}
                          </CardContent>

                          <CardFooter className="pt-2 border-t border-border/40 py-2.5">
                            <Button asChild variant="ghost" size="sm" className="w-full text-xs justify-between">
                              <Link href={`${BASE_PATH}/${stock.slug}`}>
                                <span>View Financial Fundamentals</span>
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

      <CrossLinkFooter module="nepse" />
    </AppShell>
  );
}
