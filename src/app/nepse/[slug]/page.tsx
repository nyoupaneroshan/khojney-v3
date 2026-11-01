import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Building2,
  Calendar,
  Globe,
  DollarSign,
  Percent,
  Layers,
  ArrowLeft,
  ShieldCheck,
  Award,
  Wallet,
} from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { BreadcrumbNav } from "@/components/khojney/breadcrumb-nav";
import { JsonLd } from "@/components/khojney/json-ld";
import { BookmarkButton } from "@/components/khojney/bookmark-button";
import { ShareButton } from "@/components/khojney/share-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Params {
  params: Promise<{ slug: string }>;
}

const SECTOR_LABELS: Record<string, string> = {
  COMMERCIAL_BANK: "Commercial Banks",
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

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const stock = await db.nepseStock.findUnique({
    where: { slug },
    select: {
      symbol: true,
      companyName: true,
      sector: true,
      ltp: true,
      peRatio: true,
      eps: true,
      description: true,
    },
  });

  if (!stock) {
    return { title: "Stock Not Found" };
  }

  const title = `${stock.symbol} (${stock.companyName}) — NEPSE Share Price, Fundamentals & P/E`;
  const description = `${stock.companyName} (${stock.symbol}) listed on NEPSE. LTP: NPR ${stock.ltp ? stock.ltp.toLocaleString() : "N/A"}. P/E: ${stock.peRatio ?? "N/A"}, EPS: NPR ${stock.eps ?? "N/A"}. ${stock.description.slice(0, 100)}...`;

  return {
    title,
    description,
    alternates: { canonical: `/nepse/${slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/nepse/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function NepseStockDetailPage({ params }: Params) {
  const { slug } = await params;
  const user = await getSession();

  const stock = await db.nepseStock.findUnique({
    where: { slug },
  });

  if (!stock || !stock.isPublished) notFound();

  const isPositive = (stock.pointChange ?? 0) > 0;
  const isNegative = (stock.pointChange ?? 0) < 0;

  // Fetch peer stocks in the same sector
  const peers = await db.nepseStock.findMany({
    where: {
      isPublished: true,
      sector: stock.sector,
      id: { not: stock.id },
    },
    take: 4,
    orderBy: { marketCap: "desc" },
  });

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: stock.companyName,
    alternateName: stock.symbol,
    description: stock.description,
    provider: {
      "@type": "Organization",
      name: stock.companyName,
      url: stock.website || undefined,
    },
    offers: {
      "@type": "Offer",
      price: stock.ltp ? stock.ltp.toString() : undefined,
      priceCurrency: "NPR",
    },
  };

  return (
    <AppShell user={user}>
      <JsonLd data={jsonLdData} />

      <div className="container-app py-6">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "NEPSE Stocks", href: "/nepse" },
            { label: stock.symbol },
          ]}
        />

        {/* Hero Stock Header */}
        <div className="mt-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-primary text-primary-foreground font-mono text-base font-bold px-3 py-1">
                  {stock.symbol}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {SECTOR_LABELS[stock.sector] || stock.sector}
                </Badge>
                {stock.headquarters && (
                  <Badge variant="outline" className="text-xs">
                    {stock.headquarters}
                  </Badge>
                )}
                {stock.isFeatured && (
                  <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs">
                    Blue Chip
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {stock.companyName}
              </h1>

              <p className="text-xs text-muted-foreground">
                Listed and actively traded on the Nepal Stock Exchange (NEPSE) under scrip code{" "}
                <span className="font-mono font-semibold text-foreground">{stock.symbol}</span>
              </p>
            </div>

            {/* Price & Action Area */}
            <div className="flex flex-col items-start gap-4 sm:items-end">
              <div className="rounded-xl bg-muted/30 p-4 text-left sm:text-right border border-border/50">
                <span className="text-xs text-muted-foreground block">Last Traded Price (LTP)</span>
                <div className="mt-0.5 text-3xl font-extrabold font-mono text-foreground">
                  {stock.ltp ? `NPR ${stock.ltp.toLocaleString()}` : "—"}
                </div>
                {stock.pointChange !== null && stock.pointChange !== undefined && (
                  <div
                    className={`mt-1 inline-flex items-center gap-1 text-sm font-semibold ${
                      isPositive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : isNegative
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-muted-foreground"
                    }`}
                  >
                    {isPositive && <TrendingUp className="h-4 w-4" />}
                    {isNegative && <TrendingDown className="h-4 w-4" />}
                    <span>
                      {stock.pointChange > 0 ? `+${stock.pointChange}` : stock.pointChange} NPR
                    </span>
                    {stock.percentChange !== null && stock.percentChange !== undefined && (
                      <span>({stock.percentChange > 0 ? `+${stock.percentChange}` : stock.percentChange}%)</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <BookmarkButton
                  entity="NEPSE_STOCK"
                  entityId={stock.id}
                  entityName={stock.symbol}
                />
                <ShareButton title={`${stock.symbol} - ${stock.companyName}`} url={`/nepse/${stock.slug}`} />
                {stock.website && (
                  <Button asChild variant="outline" size="sm">
                    <a href={stock.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      Investor Relations
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Key Fundamentals Snapshot */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border/70 pt-6 sm:grid-cols-4 lg:grid-cols-6">
            <div className="rounded-xl bg-muted/40 p-3">
              <span className="text-[11px] text-muted-foreground">P/E Ratio</span>
              <p className="mt-0.5 text-lg font-bold font-mono text-foreground">
                {stock.peRatio ? stock.peRatio.toFixed(2) : "—"}
              </p>
            </div>
            <div className="rounded-xl bg-muted/40 p-3">
              <span className="text-[11px] text-muted-foreground">EPS (Earnings / Share)</span>
              <p className="mt-0.5 text-lg font-bold font-mono text-foreground">
                {stock.eps ? `NPR ${stock.eps.toFixed(2)}` : "—"}
              </p>
            </div>
            <div className="rounded-xl bg-muted/40 p-3">
              <span className="text-[11px] text-muted-foreground">Book Value</span>
              <p className="mt-0.5 text-lg font-bold font-mono text-foreground">
                {stock.bookValue ? `NPR ${stock.bookValue.toFixed(2)}` : "—"}
              </p>
            </div>
            <div className="rounded-xl bg-muted/40 p-3">
              <span className="text-[11px] text-muted-foreground">Market Cap</span>
              <p className="mt-0.5 text-lg font-bold font-mono text-foreground">
                {stock.marketCap ? `NPR ${stock.marketCap} Cr` : "—"}
              </p>
            </div>
            <div className="rounded-xl bg-muted/40 p-3">
              <span className="text-[11px] text-muted-foreground">52-Week High</span>
              <p className="mt-0.5 text-lg font-bold font-mono text-foreground">
                {stock.high52 ? `NPR ${stock.high52}` : "—"}
              </p>
            </div>
            <div className="rounded-xl bg-muted/40 p-3">
              <span className="text-[11px] text-muted-foreground">52-Week Low</span>
              <p className="mt-0.5 text-lg font-bold font-mono text-foreground">
                {stock.low52 ? `NPR ${stock.low52}` : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Layout */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Main Content Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* About Company */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Company Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>{stock.description}</p>
                <div className="grid gap-3 sm:grid-cols-3 pt-2">
                  <div className="rounded-lg border border-border/60 p-3">
                    <span className="text-xs text-muted-foreground">Established</span>
                    <p className="font-semibold text-foreground">
                      {stock.establishedYear ? `${stock.establishedYear} BS / AD` : "—"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-3">
                    <span className="text-xs text-muted-foreground">Headquarters</span>
                    <p className="font-semibold text-foreground">
                      {stock.headquarters || "Kathmandu, Nepal"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-3">
                    <span className="text-xs text-muted-foreground">Paid-up Capital</span>
                    <p className="font-semibold text-foreground">
                      {stock.paidUpCapital ? `NPR ${stock.paidUpCapital} Cr` : "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dividend & Shareholder Returns */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Dividend History & Shareholder Returns</span>
                  <Badge variant="outline" className="text-xs">
                    Yield: {stock.dividendYield ? `${stock.dividendYield}%` : "—"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                    <div className="flex items-center gap-2 text-primary font-medium text-sm">
                      <Award className="h-4 w-4" />
                      <span>Bonus Shares (Stock Dividend)</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold font-mono text-foreground">
                      {stock.bonusShare || "0.00%"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Free shares issued to existing equity holders from retained profits.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                      <Wallet className="h-4 w-4" />
                      <span>Cash Dividend</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold font-mono text-foreground">
                      {stock.cashDividend || "0.00%"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Direct cash payout distributed into Demat-linked bank accounts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Valuation Analysis Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Valuation Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  With an EPS of <strong>NPR {stock.eps ?? "—"}</strong> and a Last Traded Price of{" "}
                  <strong>NPR {stock.ltp ?? "—"}</strong>, {stock.companyName} trades at a P/E multiple
                  of <strong>{stock.peRatio ? `${stock.peRatio.toFixed(2)}x` : "—"}</strong>.
                </p>
                <p className="text-xs">
                  * Market data on Khojney is compiled from official Nepal Stock Exchange daily
                  clearing files and audited annual financial disclosures submitted to the
                  Securities Board of Nepal (SEBON).
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar: Peer Comparison */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Sector Peers</span>
                  <Badge variant="outline" className="text-xs">
                    {SECTOR_LABELS[stock.sector] || stock.sector}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {peers.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No other stocks in this sector.</p>
                ) : (
                  peers.map((peer) => (
                    <div
                      key={peer.id}
                      className="group rounded-lg border border-border/60 p-3 transition-colors hover:border-primary/50"
                    >
                      <Link href={`/nepse/${peer.slug}`} className="block">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                            {peer.symbol}
                          </span>
                          <span className="font-mono text-xs font-bold text-foreground">
                            {peer.ltp ? `NPR ${peer.ltp.toLocaleString()}` : "—"}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="truncate">{peer.companyName}</span>
                          {peer.pointChange !== null && (
                            <span
                              className={`text-[11px] font-medium ${
                                peer.pointChange > 0
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : peer.pointChange < 0
                                    ? "text-rose-600 dark:text-rose-400"
                                    : ""
                              }`}
                            >
                              {peer.pointChange > 0 ? `+${peer.pointChange}` : peer.pointChange}
                            </span>
                          )}
                        </div>
                      </Link>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Button asChild variant="ghost" className="w-full text-xs">
              <Link href="/nepse">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All NEPSE Stocks
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
