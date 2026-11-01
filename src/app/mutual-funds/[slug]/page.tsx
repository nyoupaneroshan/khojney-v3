import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PieChart,
  Landmark,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Layers,
  Globe,
  Phone,
  ArrowLeft,
  Building,
  Coins,
  DollarSign,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { BreadcrumbNav } from "@/components/khojney/breadcrumb-nav";
import { InfoCard, InfoRow } from "@/components/khojney/info-card";
import { JsonLd } from "@/components/khojney/json-ld";
import { BookmarkButton } from "@/components/khojney/bookmark-button";
import { ShareButton } from "@/components/khojney/share-button";
import { parseJsonArray, formatDate } from "@/components/khojney/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const fund = await db.mutualFund.findUnique({
    where: { slug },
    select: {
      name: true,
      schemeCode: true,
      fundManager: true,
      description: true,
      nav: true,
    },
  });

  if (!fund) {
    return { title: "Mutual Fund Not Found" };
  }

  const title = `${fund.name} (${fund.schemeCode || "NAV"}) — Fund Overview & Holdings`;
  const description = `${fund.name} managed by ${fund.fundManager}. Latest NAV: NPR ${fund.nav ? fund.nav.toFixed(2) : "N/A"}. ${fund.description.slice(0, 120)}...`;

  return {
    title,
    description,
    alternates: { canonical: `/mutual-funds/${slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/mutual-funds/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function MutualFundDetailPage({ params }: Params) {
  const { slug } = await params;
  const user = await getSession();

  const fund = await db.mutualFund.findUnique({
    where: { slug },
  });

  if (!fund || !fund.isPublished) notFound();

  const holdings = parseJsonArray<string>(fund.topHoldings);

  // Related mutual funds in same category or from same manager
  const related = await db.mutualFund.findMany({
    where: {
      isPublished: true,
      id: { not: fund.id },
      OR: [
        { fundManager: fund.fundManager },
        { category: fund.category },
      ],
    },
    take: 4,
    orderBy: { nav: "desc" },
  });

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: fund.name,
    description: fund.description,
    provider: {
      "@type": "Organization",
      name: fund.fundManager,
      url: fund.website || undefined,
    },
    category: fund.category,
    offers: {
      "@type": "Offer",
      price: fund.nav ? fund.nav.toFixed(2) : undefined,
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
            { label: "Mutual Funds", href: "/mutual-funds" },
            { label: fund.name },
          ]}
        />

        {/* Hero Scheme Header */}
        <div className="mt-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {fund.schemeCode && (
                  <Badge variant="outline" className="font-mono text-sm font-bold bg-muted/60">
                    {fund.schemeCode}
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {fund.category}
                </Badge>
                <Badge
                  variant={fund.fundType === "OPEN_ENDED" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {fund.fundType.replace("_", "-")}
                </Badge>
                {fund.isFeatured && (
                  <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs">
                    Featured Scheme
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {fund.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Landmark className="h-4 w-4 text-primary" />
                  Manager: <strong className="font-medium text-foreground">{fund.fundManager}</strong>
                </span>
                {fund.sponsor && (
                  <span className="flex items-center gap-1.5">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    Sponsor: <span className="text-foreground">{fund.sponsor}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <BookmarkButton
                entity="MUTUAL_FUND"
                entityId={fund.id}
                entityName={fund.name}
              />
              <ShareButton title={fund.name} url={`/mutual-funds/${fund.slug}`} />
              {fund.website && (
                <Button asChild variant="outline" size="sm">
                  <a href={fund.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Official Portal
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Key Financial Snapshot */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border/70 pt-6 sm:grid-cols-4">
            <div className="rounded-xl bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>Net Asset Value (NAV)</span>
              </div>
              <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {fund.nav ? `NPR ${fund.nav.toFixed(2)}` : "—"}
              </p>
              {fund.navDate && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  As of {formatDate(fund.navDate)}
                </p>
              )}
            </div>

            <div className="rounded-xl bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Coins className="h-4 w-4 text-emerald-500" />
                <span>Fund Size (Corpus)</span>
              </div>
              <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {fund.fundSize ? `NPR ${fund.fundSize} Cr` : "—"}
              </p>
              {fund.totalUnits && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {fund.totalUnits} Cr total units
                </p>
              )}
            </div>

            <div className="rounded-xl bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <DollarSign className="h-4 w-4 text-amber-500" />
                <span>Dividend Yield</span>
              </div>
              <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {fund.dividendYield ? `${fund.dividendYield}%` : "—"}
              </p>
              {fund.latestDividend && (
                <p className="mt-1 text-[11px] text-muted-foreground truncate">
                  Latest: {fund.latestDividend}
                </p>
              )}
            </div>

            <div className="rounded-xl bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>Maturity / Inception</span>
              </div>
              <p className="mt-1 text-base font-semibold tracking-tight text-foreground">
                {fund.maturityDate
                  ? formatDate(fund.maturityDate)
                  : fund.launchDate
                    ? formatDate(fund.launchDate)
                    : "Perpetual (Open-ended)"}
              </p>
              {fund.launchDate && fund.maturityDate && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Launched: {formatDate(fund.launchDate)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Scheme Layout */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Main Content Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About the Scheme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>{fund.description}</p>
                <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                  <h4 className="font-medium text-foreground">Regulatory Classification</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    This scheme is approved and regulated under the Securities Board of Nepal (SEBON)
                    Mutual Fund Regulations, 2067. Investments in mutual funds are subject to market
                    fluctuations, and net asset values vary according to the market performance of
                    underlying equity and debt instruments.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Top Portfolio Holdings */}
            {holdings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Top Portfolio Holdings</span>
                    <Badge variant="outline" className="text-xs font-normal">
                      {holdings.length} Key Holdings
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-4">
                    Major company shares and fixed-income assets held in this mutual fund portfolio:
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {holdings.map((symbol, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border border-border/60 bg-card p-3 transition-colors hover:border-primary/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-mono font-bold text-foreground">{symbol}</span>
                            <span className="block text-[11px] text-muted-foreground">
                              NEPSE Listed Holding
                            </span>
                          </div>
                        </div>
                        <Button asChild size="sm" variant="ghost" className="h-7 text-xs">
                          <Link href={`/nepse?q=${symbol}`}>
                            View Stock
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fund Governance & Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Governance & Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/60 p-4">
                    <span className="text-xs text-muted-foreground">Fund Sponsor</span>
                    <p className="mt-1 font-semibold text-foreground">
                      {fund.sponsor || "Commercial Bank / Financial Institution"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Provides primary institutional backing and capital covenant.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <span className="text-xs text-muted-foreground">Fund Manager (AMC)</span>
                    <p className="mt-1 font-semibold text-foreground">{fund.fundManager}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Responsible for day-to-day asset management and NAV calculation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact & Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fund Contact & Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Scheme Code</span>
                  <span className="font-mono font-semibold text-foreground">
                    {fund.schemeCode || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Structure</span>
                  <span className="font-medium text-foreground">
                    {fund.fundType.replace("_", "-")}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium text-foreground">{fund.category}</span>
                </div>
                {fund.contactPhone && (
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">Phone</span>
                    <a
                      href={`tel:${fund.contactPhone}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {fund.contactPhone}
                    </a>
                  </div>
                )}
                {fund.website && (
                  <div className="pt-2">
                    <Button asChild className="w-full text-xs" variant="outline">
                      <a href={fund.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" />
                        Fund Manager Portal
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related Funds */}
            {related.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Related Mutual Funds</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {related.map((rel) => (
                    <div
                      key={rel.id}
                      className="group rounded-lg border border-border/60 p-3 transition-colors hover:border-primary/50"
                    >
                      <Link href={`/mutual-funds/${rel.slug}`} className="block">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {rel.name}
                          </span>
                          <span className="font-mono text-xs font-bold text-foreground shrink-0 ml-2">
                            {rel.nav ? `NPR ${rel.nav.toFixed(2)}` : ""}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="truncate">{rel.fundManager}</span>
                          <Badge variant="outline" className="text-[10px] px-1 py-0">
                            {rel.category}
                          </Badge>
                        </div>
                      </Link>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Button asChild variant="ghost" className="w-full text-xs">
              <Link href="/mutual-funds">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Mutual Funds
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
