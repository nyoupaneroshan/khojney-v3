import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Shield,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  Globe,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  Percent,
  Coins,
  MapPin,
  FileText,
  Star,
} from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { BreadcrumbNav } from "@/components/khojney/breadcrumb-nav";
import { StarRating } from "@/components/khojney/star-rating";
import { JsonLd } from "@/components/khojney/json-ld";
import { ReviewForm } from "@/components/khojney/review-form";
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

const TYPE_LABELS: Record<string, string> = {
  LIFE: "Life Insurance",
  NON_LIFE: "Non-Life / General",
  REINSURANCE: "Reinsurance",
  MICRO_INSURANCE: "Micro Insurance",
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const company = await db.insuranceCompany.findUnique({
    where: { slug },
    select: {
      name: true,
      shortName: true,
      type: true,
      claimSettlementRatio: true,
      description: true,
      logo: true,
    },
  });

  if (!company) {
    return { title: "Insurance Company Not Found" };
  }

  const title = `${company.name} (${company.shortName}) — Claim Ratio, Plans & Ratings`;
  const description = `${company.name} (${company.shortName}) is licensed by Nepal Insurance Authority. Claim Settlement Ratio: ${company.claimSettlementRatio ? `${company.claimSettlementRatio}%` : "N/A"}. ${company.description.slice(0, 120)}...`;

  return {
    title,
    description,
    alternates: { canonical: `/insurance/${slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/insurance/${slug}`,
      images: company.logo ? [{ url: company.logo }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: company.logo ? [company.logo] : undefined,
    },
  };
}

export default async function InsuranceCompanyDetailPage({ params }: Params) {
  const { slug } = await params;
  const user = await getSession();

  const company = await db.insuranceCompany.findUnique({
    where: { slug },
  });

  if (!company || !company.isPublished) notFound();

  // Fetch reviews for this insurance company
  const reviews = await db.review.findMany({
    where: { entity: "INSURANCE", entityId: company.id },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, image: true } } },
    take: 10,
  });

  // Related insurance providers of the same type
  const related = await db.insuranceCompany.findMany({
    where: {
      isPublished: true,
      id: { not: company.id },
      type: company.type,
    },
    take: 4,
    orderBy: { claimSettlementRatio: "desc" },
  });

  const popularPlans = parseJsonArray<string | { name: string; description?: string }>(company.popularPlans);
  const coverages = parseJsonArray<string>(company.coverageTypes);

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: company.name,
    alternateName: company.shortName,
    description: company.description,
    telephone: company.phone || undefined,
    email: company.email || undefined,
    url: company.website || undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: company.headquarters || "Kathmandu",
      addressCountry: "NP",
    },
    aggregateRating:
      company.rating > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: company.rating.toString(),
            reviewCount: company.reviewCount.toString(),
          }
        : undefined,
  };

  return (
    <AppShell user={user}>
      <JsonLd data={jsonLdData} />

      <div className="container-app py-6">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Insurance", href: "/insurance" },
            { label: company.name },
          ]}
        />

        {/* Hero Header */}
        <div className="mt-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono text-sm font-bold bg-muted/60">
                  {company.shortName}
                </Badge>
                <Badge
                  variant={company.type === "LIFE" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {TYPE_LABELS[company.type] || company.type}
                </Badge>
                {company.isFeatured && (
                  <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs">
                    Featured Insurer
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {company.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {company.rating > 0 && (
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={company.rating} count={company.reviewCount} />
                    <span className="text-xs text-muted-foreground">
                      ({company.reviewCount} verified reviews)
                    </span>
                  </div>
                )}
                {company.headquarters && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {company.headquarters}
                  </span>
                )}
                {company.establishedYear && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Est. {company.establishedYear}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <BookmarkButton
                entity="INSURANCE"
                entityId={company.id}
                entityName={company.name}
              />
              <ShareButton title={company.name} url={`/insurance/${company.slug}`} />
              {company.website && (
                <Button asChild variant="outline" size="sm">
                  <a href={company.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Official Portal
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Key Solvency & Claim Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border/70 pt-6 sm:grid-cols-4">
            <div className="rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 p-4 border border-emerald-500/20">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                <span>Claim Settlement Ratio</span>
              </div>
              <p className="mt-1 text-2xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">
                {company.claimSettlementRatio ? `${company.claimSettlementRatio}%` : "—"}
              </p>
              <p className="mt-1 text-[11px] text-emerald-600/80 dark:text-emerald-400/80">
                Claims resolved against total filed
              </p>
            </div>

            <div className="rounded-xl bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Percent className="h-4 w-4 text-primary" />
                <span>Solvency Ratio</span>
              </div>
              <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {company.solvencyRatio ? `${company.solvencyRatio}x` : "—"}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Regulatory minimum is 1.50x
              </p>
            </div>

            <div className="rounded-xl bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Coins className="h-4 w-4 text-amber-500" />
                <span>Paid-Up Capital</span>
              </div>
              <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {company.paidUpCapital ? `NPR ${company.paidUpCapital} Cr` : "—"}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Regulatory capital compliance
              </p>
            </div>

            <div className="rounded-xl bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Building2 className="h-4 w-4 text-blue-500" />
                <span>Branch Network</span>
              </div>
              <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {company.branchCount ? `${company.branchCount}` : "—"}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Nationwide service branches
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Layout */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Main Content Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About {company.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>{company.description}</p>
                <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                  <h4 className="font-medium text-foreground">Regulatory Authority</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Licensed and regulated by the <strong>Nepal Insurance Authority (Nepal Beema Pradhikaran)</strong>.
                    Policyholders are protected under statutory reserve and reinsurance pooling guidelines.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Popular Insurance Plans */}
            {popularPlans.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Popular Insurance Policies & Plans</span>
                    <Badge variant="outline" className="text-xs">
                      {popularPlans.length} Plans Available
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {popularPlans.map((plan, idx) => {
                      const planName = typeof plan === "string" ? plan : plan.name;
                      const planDesc = typeof plan === "object" && plan.description ? plan.description : null;
                      return (
                        <div
                          key={idx}
                          className="rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-primary/50"
                        >
                          <div className="flex items-start gap-2.5">
                            <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-sm text-foreground">{planName}</h4>
                              {planDesc && (
                                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                  {planDesc}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Coverage Areas */}
            {coverages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Underwriting & Coverage Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {coverages.map((cov, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{cov}</span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Policyholder Reviews & Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ReviewForm
                  entity="INSURANCE"
                  entityId={company.id}
                  isLoggedIn={!!user}
                />

                <Separator />

                {reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No reviews yet. Be the first to review your experience with {company.name}!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="rounded-lg border border-border/60 p-4 space-y-2 bg-muted/20"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-foreground">
                              {rev.user?.name || "Verified Customer"}
                            </span>
                            <StarRating rating={rev.rating} />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(rev.createdAt)}
                          </span>
                        </div>
                        {rev.comment && (
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {rev.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact & Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Head Office & Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {company.headquarters && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    <span>{company.headquarters}</span>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0 text-primary" />
                    <a href={`tel:${company.phone}`} className="hover:text-primary transition-colors">
                      {company.phone}
                    </a>
                  </div>
                )}
                {company.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0 text-primary" />
                    <a href={`mailto:${company.email}`} className="hover:text-primary transition-colors truncate">
                      {company.email}
                    </a>
                  </div>
                )}
                {company.website && (
                  <div className="pt-2">
                    <Button asChild className="w-full text-xs" variant="outline">
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" />
                        Visit Official Website
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related Insurance Companies */}
            {related.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Other {TYPE_LABELS[company.type] || "Insurance"} Providers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {related.map((rel) => (
                    <div
                      key={rel.id}
                      className="group rounded-lg border border-border/60 p-3 transition-colors hover:border-primary/50"
                    >
                      <Link href={`/insurance/${rel.slug}`} className="block">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {rel.name}
                          </span>
                          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0 ml-2">
                            {rel.claimSettlementRatio ? `${rel.claimSettlementRatio}%` : ""}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{rel.shortName}</span>
                          {rel.branchCount && (
                            <span className="text-[11px]">{rel.branchCount} branches</span>
                          )}
                        </div>
                      </Link>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Button asChild variant="ghost" className="w-full text-xs">
              <Link href="/insurance">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Insurance Providers
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
