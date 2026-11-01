import Link from "next/link";
import {
  HeartPulse,
  Bed,
  PhoneCall,
  MapPin,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Shield,
  ShieldCheck,
  Landmark,
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/khojney/star-rating";

// ─── 1. Featured Hospitals ──────────────────────────────────
export interface FeaturedHospitalItem {
  id: string;
  slug: string;
  name: string;
  shortName: string | null;
  type: string;
  city: string | null;
  province: string | null;
  district: string | null;
  phone: string | null;
  emergencyPhone: string | null;
  bedCount: number | null;
  hasEmergency: boolean;
  hasAmbulance: boolean;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
}

export function FeaturedHospitals({ hospitals }: { hospitals: FeaturedHospitalItem[] }) {
  if (!hospitals.length) return null;
  return (
    <section className="py-16 bg-muted/20">
      <div className="container-app">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">
              <HeartPulse className="h-4 w-4" />
              <span>Healthcare & Emergency Services</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Top Hospitals in Nepal</h2>
            <p className="mt-1 text-muted-foreground">
              Emergency contacts, bed capacities, ICU facilities, and medical specialties across Nepal.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/hospitals">
              All Hospitals <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {hospitals.map((h) => (
            <Card key={h.id} className="card-hover flex flex-col justify-between border-border/70">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                  {h.shortName && (
                    <Badge variant="outline" className="text-xs font-mono font-bold">
                      {h.shortName}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-base leading-snug mt-2 line-clamp-2">
                  <Link href={`/hospitals/${h.slug}`} className="hover:text-primary transition-colors">
                    {h.name}
                  </Link>
                </CardTitle>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span>
                    {h.city || h.district || "Nepal"}
                    {h.province ? `, ${h.province}` : ""}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="flex-1 pb-3 space-y-2 text-xs">
                {h.bedCount && (
                  <div className="flex items-center gap-1.5 text-foreground font-medium">
                    <Bed className="h-3.5 w-3.5 text-primary" />
                    <span>{h.bedCount} Total Beds</span>
                  </div>
                )}
                {h.emergencyPhone && (
                  <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>24/7 Hotline: {h.emergencyPhone}</span>
                  </div>
                )}
                {h.rating > 0 && (
                  <div className="pt-1">
                    <StarRating rating={h.rating} count={h.reviewCount} />
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-0 border-t border-border/40 py-3">
                <Button asChild variant="ghost" size="sm" className="w-full text-xs justify-between">
                  <Link href={`/hospitals/${h.slug}`}>
                    <span>View Departments</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 2. Featured NEPSE Stocks ───────────────────────────────
export interface FeaturedNepseItem {
  id: string;
  slug: string;
  symbol: string;
  companyName: string;
  sector: string;
  ltp: number | null;
  pointChange: number | null;
  percentChange: number | null;
  marketCap: number | null;
  peRatio: number | null;
  isFeatured: boolean;
}

export function FeaturedNepseStocks({ stocks }: { stocks: FeaturedNepseItem[] }) {
  if (!stocks.length) return null;
  return (
    <section className="py-16">
      <div className="container-app">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <BarChart3 className="h-4 w-4" />
              <span>Nepal Stock Exchange (NEPSE)</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Active NEPSE Blue Chips</h2>
            <p className="mt-1 text-muted-foreground">
              Real-time stock indicators, Last Traded Prices (LTP), market caps, and P/E multiples.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/nepse">
              All Stocks <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stocks.map((s) => {
            const isPositive = (s.pointChange ?? 0) > 0;
            const isNegative = (s.pointChange ?? 0) < 0;

            return (
              <Card key={s.id} className="card-hover flex flex-col justify-between border-border/70">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary text-primary-foreground font-mono font-bold text-xs px-2.5 py-0.5">
                      {s.symbol}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      {s.sector.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold leading-snug mt-2 line-clamp-1">
                    <Link href={`/nepse/${s.slug}`} className="hover:text-primary transition-colors">
                      {s.companyName}
                    </Link>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 pb-3">
                  <div className="rounded-lg bg-muted/40 p-3">
                    <span className="text-[11px] text-muted-foreground block">LTP (NPR)</span>
                    <div className="text-xl font-extrabold font-mono text-foreground">
                      {s.ltp ? s.ltp.toLocaleString() : "—"}
                    </div>
                    {s.pointChange !== null && s.pointChange !== undefined && (
                      <div
                        className={`mt-0.5 flex items-center gap-1 text-xs font-semibold ${
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
                          {s.pointChange > 0 ? `+${s.pointChange}` : s.pointChange}
                        </span>
                        {s.percentChange !== null && s.percentChange !== undefined && (
                          <span>({s.percentChange > 0 ? `+${s.percentChange}` : s.percentChange}%)</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>P/E: {s.peRatio ? `${s.peRatio.toFixed(1)}x` : "—"}</span>
                    <span>Cap: {s.marketCap ? `NPR ${s.marketCap} Cr` : "—"}</span>
                  </div>
                </CardContent>

                <CardFooter className="pt-0 border-t border-border/40 py-2.5">
                  <Button asChild variant="ghost" size="sm" className="w-full text-xs justify-between">
                    <Link href={`/nepse/${s.slug}`}>
                      <span>Financial Ratios</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 3. Featured Mutual Funds ───────────────────────────────
export interface FeaturedMutualFundItem {
  id: string;
  slug: string;
  name: string;
  schemeCode: string | null;
  fundManager: string;
  fundType: string;
  category: string;
  nav: number | null;
  fundSize: number | null;
  dividendYield: number | null;
  latestDividend: string | null;
  isFeatured: boolean;
}

export function FeaturedMutualFunds({ funds }: { funds: FeaturedMutualFundItem[] }) {
  if (!funds.length) return null;
  return (
    <section className="py-16 bg-muted/20">
      <div className="container-app">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
              <PieChart className="h-4 w-4" />
              <span>SEBON Mutual Funds</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Top Mutual Funds in Nepal</h2>
            <p className="mt-1 text-muted-foreground">
              Compare Net Asset Values (NAV), dividend yields, fund sizes, and scheme structures.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/mutual-funds">
              All Mutual Funds <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {funds.map((f) => (
            <Card key={f.id} className="card-hover flex flex-col justify-between border-border/70">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {f.schemeCode && (
                    <Badge variant="outline" className="font-mono text-xs font-bold">
                      {f.schemeCode}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-[10px]">
                    {f.category}
                  </Badge>
                </div>
                <CardTitle className="text-sm font-semibold leading-snug mt-2 line-clamp-2">
                  <Link href={`/mutual-funds/${f.slug}`} className="hover:text-primary transition-colors">
                    {f.name}
                  </Link>
                </CardTitle>
                <div className="flex items-center gap-1 text-xs text-muted-foreground pt-0.5">
                  <Landmark className="h-3 w-3 shrink-0" />
                  <span className="truncate">{f.fundManager}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-2 pb-3">
                <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-2.5 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Latest NAV</span>
                    <span className="font-bold text-foreground">
                      {f.nav ? `NPR ${f.nav.toFixed(2)}` : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Dividend Yield</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {f.dividendYield ? `${f.dividendYield}%` : "—"}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0 border-t border-border/40 py-2.5">
                <Button asChild variant="ghost" size="sm" className="w-full text-xs justify-between">
                  <Link href={`/mutual-funds/${f.slug}`}>
                    <span>View Scheme</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 4. Featured Insurance Companies ────────────────────────
export interface FeaturedInsuranceItem {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  type: string;
  headquarters?: string | null;
  establishedYear?: number | null;
  claimSettlementRatio?: number | null;
  solvencyRatio?: number | null;
  branchCount?: number | null;
  paidUpCapital?: number | null;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
}

export function FeaturedInsurance({ companies }: { companies: FeaturedInsuranceItem[] }) {
  if (!companies.length) return null;
  return (
    <section className="py-16">
      <div className="container-app">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Nepal Insurance Authority</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Top Insurance Providers</h2>
            <p className="mt-1 text-muted-foreground">
              Life and general insurance companies ranked by claim settlement efficiency and solvency.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/insurance">
              All Insurers <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {companies.map((c) => (
            <Card key={c.id} className="card-hover flex flex-col justify-between border-border/70">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    <Shield className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="font-mono text-xs font-bold">
                    {c.shortName}
                  </Badge>
                </div>
                <CardTitle className="text-sm font-semibold leading-snug mt-2 line-clamp-1">
                  <Link href={`/insurance/${c.slug}`} className="hover:text-primary transition-colors">
                    {c.name}
                  </Link>
                </CardTitle>
                <div className="text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-[10px]">
                    {c.type === "LIFE" ? "Life Insurance" : "General Insurance"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-2 pb-3">
                {c.claimSettlementRatio !== null && (
                  <div className="rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 p-2 text-xs border border-emerald-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
                        Claim Settlement
                      </span>
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {c.claimSettlementRatio}%
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span>{c.branchCount ? `${c.branchCount} Branches` : ""}</span>
                  {c.rating > 0 && <StarRating rating={c.rating} count={c.reviewCount} />}
                </div>
              </CardContent>

              <CardFooter className="pt-0 border-t border-border/40 py-2.5">
                <Button asChild variant="ghost" size="sm" className="w-full text-xs justify-between">
                  <Link href={`/insurance/${c.slug}`}>
                    <span>View Policies</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
