import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Landmark,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Building2,
  Banknote,
  Wifi,
  Smartphone,
  CreditCard,
  Wallet,
  ArrowLeft,
  User,
  CheckCircle2,
  Star,
} from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { BreadcrumbNav } from "@/components/khojney/breadcrumb-nav";
import { StarRating } from "@/components/khojney/star-rating";
import { EntityBadge } from "@/components/khojney/entity-badge";
import { InfoCard, InfoRow } from "@/components/khojney/info-card";
import { JsonLd } from "@/components/khojney/json-ld";
import { ReviewForm } from "@/components/khojney/review-form";
import { BookmarkButton } from "@/components/khojney/bookmark-button";
import { ShareButton } from "@/components/khojney/share-button";
import { parseJsonArray, formatDate } from "@/components/khojney/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const bank = await db.bank.findUnique({
    where: { slug },
    select: {
      name: true,
      shortName: true,
      description: true,
      headquarters: true,
      type: true,
      logo: true,
      website: true,
    },
  });
  if (!bank) {
    return { title: "Bank not found" };
  }
  const description = bank.description.slice(0, 160);
  const title = `${bank.name} — Branches, Interest Rates, Cards & Loans`;
  return {
    title,
    description,
    alternates: { canonical: `/banks/${slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/banks/${slug}`,
      images: bank.logo ? [{ url: bank.logo }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: bank.logo ? [bank.logo] : undefined,
    },
  };
}

function formatRate(min: number | null, max: number | null): string {
  if (min == null && max == null) return "—";
  if (min != null && max != null) return `${min}% – ${max}%`;
  const v = (min ?? max) as number;
  return `${v}%`;
}

export default async function BankDetailPage({ params }: Params) {
  const { slug } = await params;
  const user = await getSession();

  const bank = await db.bank.findUnique({ where: { slug } });

  if (!bank || !bank.isPublished) notFound();

  const cards = parseJsonArray<string>(bank.cards);
  const loans = parseJsonArray<string>(bank.loans);

  // Reviews are stored polymorphically (entity, entityId) on the Review model.
  const reviews = await db.review.findMany({
    where: { entity: "BANK", entityId: bank.id },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, image: true } } },
    take: 50,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BankOrCreditUnion",
    name: bank.name,
    alternateName: bank.shortName || undefined,
    description: bank.description,
    url: bank.website ?? undefined,
    image: bank.logo ?? undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: bank.headquarters ?? undefined,
      addressCountry: "NP",
    },
    telephone: bank.phone ?? undefined,
    email: bank.email ?? undefined,
    foundingDate: bank.establishedYear ? String(bank.establishedYear) : undefined,
    aggregateRating:
      bank.rating > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: bank.rating,
            reviewCount: bank.reviewCount,
          }
        : undefined,
  };

  const savingsRate = formatRate(bank.savingsRateMin, bank.savingsRateMax);
  const fdRate = formatRate(bank.fixedDepositRateMin, bank.fixedDepositRateMax);

  return (
    <AppShell user={user}>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <div className="border-b bg-gradient-to-b from-secondary/40 to-background">
        <div className="container-app py-8">
          <BreadcrumbNav
            className="mb-4"
            items={[
              { label: "Home", href: "/" },
              { label: "Banks", href: "/banks" },
              { label: bank.name },
            ]}
          />
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {bank.logo ? (
                <img
                  src={bank.logo}
                  alt={`${bank.name} logo`}
                  className="h-full w-full rounded-xl object-contain p-2"
                />
              ) : (
                <Landmark className="h-12 w-12" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {bank.name}
                </h1>
                {bank.shortName && (
                  <EntityBadge variant="secondary" value={bank.shortName} />
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <EntityBadge variant="outline" value={bank.type} />
                {bank.isFeatured && (
                  <EntityBadge variant="default" className="gap-1">
                    <Star className="h-3 w-3" /> Featured
                  </EntityBadge>
                )}
                {bank.establishedYear && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" /> Est. {bank.establishedYear}
                  </span>
                )}
                {bank.headquarters && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {bank.headquarters}
                  </span>
                )}
              </div>
              {bank.rating > 0 && (
                <div className="mt-2">
                  <StarRating rating={bank.rating} count={bank.reviewCount} size={18} />
                </div>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                {bank.phone && (
                  <a
                    href={`tel:${bank.phone}`}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-primary"
                  >
                    <Phone className="h-3.5 w-3.5" /> {bank.phone}
                  </a>
                )}
                {bank.email && (
                  <a
                    href={`mailto:${bank.email}`}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-primary"
                  >
                    <Mail className="h-3.5 w-3.5" /> {bank.email}
                  </a>
                )}
                {bank.website && (
                  <a
                    href={bank.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-primary"
                  >
                    <Globe className="h-3.5 w-3.5" /> Website
                  </a>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <div className="flex flex-wrap gap-2">
                <BookmarkButton entity="BANK" entityId={bank.id} entityName={bank.name} />
                <ShareButton title={bank.name} text={bank.description} />
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/banks">
                  <ArrowLeft className="h-4 w-4" /> All banks
                </Link>
              </Button>
              {bank.website && (
                <Button asChild size="sm">
                  <a href={bank.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" /> Visit site
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <section className="py-10">
        <div className="container-app">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-6 flex w-full flex-wrap justify-start">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="rates">Interest Rates</TabsTrigger>
                  <TabsTrigger value="network">Branches &amp; ATMs</TabsTrigger>
                  <TabsTrigger value="cards-loans">Cards &amp; Loans</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview">
                  <Card>
                    <CardHeader>
                      <CardTitle>About {bank.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line text-[15px] leading-7 text-foreground/90">
                        {bank.description}
                      </p>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-lg border bg-muted/30 p-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Banknote className="h-4 w-4 text-primary" /> Savings Rate
                          </div>
                          <div className="mt-1 text-2xl font-bold text-foreground">
                            {savingsRate}
                          </div>
                        </div>
                        <div className="rounded-lg border bg-muted/30 p-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Banknote className="h-4 w-4 text-primary" /> Fixed Deposit
                          </div>
                          <div className="mt-1 text-2xl font-bold text-foreground">{fdRate}</div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {bank.mobileBanking && (
                          <EntityBadge variant="outline" className="gap-1">
                            <Smartphone className="h-3.5 w-3.5" /> Mobile Banking
                          </EntityBadge>
                        )}
                        {bank.internetBanking && (
                          <EntityBadge variant="outline" className="gap-1">
                            <Globe className="h-3.5 w-3.5" /> Internet Banking
                          </EntityBadge>
                        )}
                        {bank.swiftCode && (
                          <EntityBadge variant="outline" className="gap-1">
                            <Wifi className="h-3.5 w-3.5" /> SWIFT: {bank.swiftCode}
                          </EntityBadge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Interest rates */}
                <TabsContent value="rates">
                  <Card>
                    <CardHeader>
                      <CardTitle>Interest Rates</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Indicative annual interest rates. Confirm with the bank before opening an
                        account.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-hidden rounded-lg border">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/40">
                            <tr>
                              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                Product
                              </th>
                              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                                Min Rate
                              </th>
                              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                                Max Rate
                              </th>
                              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                                Range
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            <tr>
                              <td className="px-4 py-3 font-medium">Savings Account</td>
                              <td className="px-4 py-3 text-right">
                                {bank.savingsRateMin != null ? `${bank.savingsRateMin}%` : "—"}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {bank.savingsRateMax != null ? `${bank.savingsRateMax}%` : "—"}
                              </td>
                              <td className="px-4 py-3 text-right font-semibold">{savingsRate}</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium">Fixed Deposit</td>
                              <td className="px-4 py-3 text-right">
                                {bank.fixedDepositRateMin != null
                                  ? `${bank.fixedDepositRateMin}%`
                                  : "—"}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {bank.fixedDepositRateMax != null
                                  ? `${bank.fixedDepositRateMax}%`
                                  : "—"}
                              </td>
                              <td className="px-4 py-3 text-right font-semibold">{fdRate}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Network */}
                <TabsContent value="network">
                  <Card>
                    <CardHeader>
                      <CardTitle>Branches &amp; ATMs</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-lg border bg-muted/30 p-4 text-center">
                        <Building2 className="mx-auto h-6 w-6 text-primary" />
                        <div className="mt-2 text-2xl font-bold">
                          {bank.branchCount ?? "—"}
                        </div>
                        <div className="text-xs text-muted-foreground">Branches</div>
                      </div>
                      <div className="rounded-lg border bg-muted/30 p-4 text-center">
                        <Star className="mx-auto h-6 w-6 text-primary" />
                        <div className="mt-2 text-2xl font-bold">{bank.atmCount ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">ATMs</div>
                      </div>
                      <div className="rounded-lg border bg-muted/30 p-4 text-center">
                        <Smartphone className="mx-auto h-6 w-6 text-primary" />
                        <div className="mt-2 text-2xl font-bold">
                          {bank.mobileBanking ? "Yes" : "No"}
                        </div>
                        <div className="text-xs text-muted-foreground">Mobile Banking</div>
                      </div>
                      <div className="rounded-lg border bg-muted/30 p-4 text-center">
                        <Globe className="mx-auto h-6 w-6 text-primary" />
                        <div className="mt-2 text-2xl font-bold">
                          {bank.internetBanking ? "Yes" : "No"}
                        </div>
                        <div className="text-xs text-muted-foreground">Internet Banking</div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Cards & loans */}
                <TabsContent value="cards-loans">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-primary" /> Cards
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {cards.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No card information available.
                          </p>
                        ) : (
                          <ul className="space-y-2">
                            {cards.map((c, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 rounded-md border bg-muted/20 p-3 text-sm"
                              >
                                <CreditCard className="mt-0.5 h-4 w-4 text-primary" />
                                <span className="font-medium">{c}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Wallet className="h-5 w-5 text-primary" /> Loans
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loans.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No loan information available.
                          </p>
                        ) : (
                          <ul className="space-y-2">
                            {loans.map((l, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 rounded-md border bg-muted/20 p-3 text-sm"
                              >
                                <Wallet className="mt-0.5 h-4 w-4 text-primary" />
                                <span className="font-medium">{l}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Reviews */}
                <TabsContent value="reviews">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" /> Reviews &amp; Ratings
                      </CardTitle>
                      {bank.reviewCount > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {bank.reviewCount} review{bank.reviewCount === 1 ? "" : "s"} · Average{" "}
                          <span className="font-medium text-foreground">
                            {bank.rating.toFixed(1)}
                          </span>{" "}
                          / 5
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <ReviewForm
                        entity="BANK"
                        entityId={bank.id}
                        isLoggedIn={!!user}
                        redirectPath={`/banks/${bank.slug}`}
                      />
                      <Separator />
                      {reviews.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No reviews yet — be the first to share your experience with{" "}
                          {bank.shortName || bank.name}.
                        </p>
                      ) : (
                        <ul className="space-y-5">
                          {reviews.map((r) => (
                            <li key={r.id} className="border-l-2 border-primary/30 pl-4">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                    {(r.user?.name ?? "A")[0]?.toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">
                                      {r.user?.name ?? "Anonymous"}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {formatDate(r.createdAt)}
                                    </div>
                                  </div>
                                </div>
                                <StarRating rating={r.rating} showValue={false} size={14} />
                              </div>
                              {r.title && (
                                <div className="mt-2 text-sm font-medium">{r.title}</div>
                              )}
                              {r.comment && (
                                <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
              <InfoCard title="Key facts">
                <div className="divide-y divide-border">
                  <InfoRow
                    icon={<Landmark className="h-4 w-4" />}
                    label="Type"
                    value={<Badge variant="outline">{bank.type}</Badge>}
                  />
                  {bank.shortName && (
                    <InfoRow
                      icon={<Landmark className="h-4 w-4" />}
                      label="Short name"
                      value={bank.shortName}
                    />
                  )}
                  {bank.establishedYear && (
                    <InfoRow
                      icon={<Calendar className="h-4 w-4" />}
                      label="Established"
                      value={bank.establishedYear}
                    />
                  )}
                  {bank.headquarters && (
                    <InfoRow
                      icon={<MapPin className="h-4 w-4" />}
                      label="Headquarters"
                      value={bank.headquarters}
                    />
                  )}
                  {bank.swiftCode && (
                    <InfoRow
                      icon={<Wifi className="h-4 w-4" />}
                      label="SWIFT code"
                      value={bank.swiftCode}
                    />
                  )}
                </div>
              </InfoCard>

              <InfoCard title="Network">
                <div className="divide-y divide-border">
                  <InfoRow
                    icon={<Building2 className="h-4 w-4" />}
                    label="Branches"
                    value={bank.branchCount ?? "—"}
                  />
                  <InfoRow
                    icon={<Star className="h-4 w-4" />}
                    label="ATMs"
                    value={bank.atmCount ?? "—"}
                  />
                  <InfoRow
                    icon={<Smartphone className="h-4 w-4" />}
                    label="Mobile banking"
                    value={
                      bank.mobileBanking ? (
                        <Badge variant="secondary">Available</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not available</span>
                      )
                    }
                  />
                  <InfoRow
                    icon={<Globe className="h-4 w-4" />}
                    label="Internet banking"
                    value={
                      bank.internetBanking ? (
                        <Badge variant="secondary">Available</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not available</span>
                      )
                    }
                  />
                </div>
              </InfoCard>

              <InfoCard title="Interest rates">
                <div className="divide-y divide-border">
                  <InfoRow
                    icon={<Banknote className="h-4 w-4" />}
                    label="Savings"
                    value={savingsRate}
                  />
                  <InfoRow
                    icon={<Banknote className="h-4 w-4" />}
                    label="Fixed deposit"
                    value={fdRate}
                  />
                </div>
              </InfoCard>

              <InfoCard title="Contact">
                <div className="divide-y divide-border">
                  {bank.phone && (
                    <InfoRow
                      icon={<Phone className="h-4 w-4" />}
                      label="Phone"
                      value={
                        <a href={`tel:${bank.phone}`} className="hover:text-primary">
                          {bank.phone}
                        </a>
                      }
                    />
                  )}
                  {bank.email && (
                    <InfoRow
                      icon={<Mail className="h-4 w-4" />}
                      label="Email"
                      value={
                        <a href={`mailto:${bank.email}`} className="hover:text-primary">
                          {bank.email}
                        </a>
                      }
                    />
                  )}
                  {bank.website && (
                    <InfoRow
                      icon={<Globe className="h-4 w-4" />}
                      label="Website"
                      value={
                        <a
                          href={bank.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-primary hover:underline"
                        >
                          {bank.website.replace(/^https?:\/\//, "")}
                        </a>
                      }
                    />
                  )}
                </div>
                {bank.website && (
                  <Button asChild className="mt-4 w-full">
                    <a href={bank.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" /> Visit official website
                    </a>
                  </Button>
                )}
              </InfoCard>

              <InfoCard title="Quick actions">
                <div className="flex flex-col gap-2">
                  <BookmarkButton
                    entity="BANK"
                    entityId={bank.id}
                    entityName={bank.name}
                    className="w-full justify-center"
                  />
                  <ShareButton
                    title={bank.name}
                    text={bank.description}
                    className="w-full"
                  />
                </div>
                <div className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3" /> Verified listing on Khojney
                </div>
              </InfoCard>
            </aside>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
