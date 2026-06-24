import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { getSession } from "@/lib/auth-server";
import { JsonLd } from "@/components/khojney/json-ld";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, ArrowRight } from "lucide-react";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ province: string; city: string }>;
}

function humanize(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { province, city } = await params;
  const provinceName = humanize(province);
  const cityName = humanize(city);
  const title = `Colleges, Schools & Banks in ${cityName}, ${provinceName} — Fees, Reviews, Admissions`;
  const description = `Find the best colleges, schools, and banks in ${cityName}, ${provinceName}, Nepal. Compare fees, programs, ratings, and contact details. ${cityName} directory with verified listings.`;

  return {
    title,
    description,
    keywords: [
      `colleges in ${cityName}`,
      `schools in ${cityName}`,
      `banks in ${cityName}`,
      `best college ${cityName} ${provinceName}`,
      `${cityName} Nepal education`,
      `${cityName} college fees`,
      `top 10 colleges ${cityName}`,
    ],
    alternates: {
      canonical: `https://khojney.com/in/${province}/${city}`,
    },
    openGraph: { title, description, url: `https://khojney.com/in/${province}/${city}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CityPage({ params }: PageProps) {
  const user = await getSession();
  const { province, city } = await params;
  const provinceName = humanize(province);
  const cityName = humanize(city);

  const [colleges, banks, schools] = await Promise.all([
    db.college.findMany({
      where: {
        isPublished: true,
        OR: [
          { city: { equals: cityName } },
          { district: { equals: cityName } },
        ],
      },
      orderBy: [{ isFeatured: "desc" }, { rating: "desc" }],
      select: {
        id: true, slug: true, name: true, description: true, city: true,
        district: true, affiliation: true, type: true, rating: true,
        reviewCount: true, isVerified: true, feesRange: true, isFeatured: true,
        establishedYear: true,
      },
    }),
    db.bank.findMany({
      where: {
        isPublished: true,
        headquarters: { equals: cityName },
      },
      orderBy: [{ isFeatured: "desc" }, { rating: "desc" }],
      select: {
        id: true, slug: true, name: true, shortName: true, description: true,
        headquarters: true, type: true, rating: true, reviewCount: true,
        savingsRateMax: true, fixedDepositRateMax: true, branchCount: true,
        mobileBanking: true, internetBanking: true, isFeatured: true,
      },
    }),
    db.school.findMany({
      where: {
        isPublished: true,
        OR: [
          { city: { equals: cityName } },
          { district: { equals: cityName } },
        ],
      },
      orderBy: [{ isFeatured: "desc" }, { rating: "desc" }],
      select: {
        id: true, slug: true, name: true, description: true, city: true,
        district: true, level: true, affiliation: true, type: true,
        rating: true, reviewCount: true, isVerified: true, feesRange: true,
        isFeatured: true, establishedYear: true,
      },
    }),
  ]);

  const totalListings = colleges.length + banks.length + schools.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Colleges, Schools & Banks in ${cityName}, ${provinceName}`,
    description: `Directory of ${totalListings} institutions in ${cityName}, ${provinceName}, Nepal.`,
    url: `https://khojney.com/in/${province}/${city}`,
    about: {
      "@type": "Place",
      name: `${cityName}, ${provinceName}, Nepal`,
      address: { "@type": "PostalAddress", addressRegion: provinceName, addressCountry: "NP" },
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalListings,
      itemListElement: [
        ...colleges.slice(0, 10).map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "EducationalOrganization",
            name: c.name,
            url: `https://khojney.com/colleges/${c.slug}`,
            address: `${c.city ?? ""}, ${c.district ?? ""}, Nepal`,
          },
        })),
        ...banks.slice(0, 10).map((b, i) => ({
          "@type": "ListItem",
          position: colleges.length + i + 1,
          item: {
            "@type": "BankOrCreditUnion",
            name: b.name,
            url: `https://khojney.com/banks/${b.slug}`,
          },
        })),
      ],
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://khojney.com/" },
      { "@type": "ListItem", position: 2, name: provinceName, item: `https://khojney.com/in/${province}` },
      { "@type": "ListItem", position: 3, name: cityName },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How many colleges are there in ${cityName}?`,
        acceptedAnswer: { "@type": "Answer", text: `Khojney lists ${colleges.length} colleges in ${cityName}, ${provinceName}. Compare by fees, programs, and ratings.` },
      },
      {
        "@type": "Question",
        name: `Which is the best college in ${cityName}?`,
        acceptedAnswer: { "@type": "Answer", text: `Browse our ${colleges.length} verified college listings in ${cityName} with ratings, reviews, and admission details to find the best fit.` },
      },
      {
        "@type": "Question",
        name: `What is the average college fee in ${cityName}?`,
        acceptedAnswer: { "@type": "Answer", text: `Public colleges in ${cityName} charge NPR 1-2 lakh/year; private colleges NPR 5-10 lakh. Check individual pages for details.` },
      },
    ],
  };

  return (
    <AppShell user={user}>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={faqLd} />

      <section className="border-b border-border bg-gradient-to-br from-red-50/40 via-white to-blue-50/30">
        <div className="container-app py-12 md:py-16">
          <nav className="mb-4 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 flex-wrap">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li>/</li>
              <li><Link href={`/in/${province}`} className="hover:text-primary">{provinceName}</Link></li>
              <li>/</li>
              <li className="text-foreground font-medium">{cityName}</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Colleges, Schools & Banks in <span className="text-gradient-red">{cityName}</span>, {provinceName}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Explore {totalListings} verified institutions in {cityName}, {provinceName}, Nepal.
            Compare colleges, schools, and banks by fees, programs, ratings, and services.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Badge variant="secondary">🎓 {colleges.length} Colleges</Badge>
            <Badge variant="secondary">🏫 {schools.length} Schools</Badge>
            <Badge variant="secondary">🏦 {banks.length} Banks</Badge>
          </div>
        </div>
      </section>

      {colleges.length > 0 && (
        <section className="py-12">
          <div className="container-app">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Colleges in {cityName}</h2>
                <p className="text-sm text-muted-foreground mt-1">{colleges.length} colleges found</p>
              </div>
              <Link href="/colleges" className="text-sm text-primary hover:underline flex items-center gap-1">
                All colleges <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {colleges.slice(0, 12).map((c) => (
                <Card key={c.id} className="card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                        {c.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/colleges/${c.slug}`} className="font-semibold hover:text-primary line-clamp-2">
                          {c.name}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.city ?? c.district}</span>
                          {c.rating > 0 && <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {c.rating.toFixed(1)}</span>}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {c.affiliation && <Badge variant="outline" className="text-[10px]">{c.affiliation}</Badge>}
                      <Badge variant="outline" className="text-[10px]">{c.type}</Badge>
                      {c.isVerified && <Badge variant="secondary" className="text-[10px]">✓ Verified</Badge>}
                    </div>
                    {c.feesRange && <p className="mt-2 text-xs font-medium text-emerald-700">{c.feesRange}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {banks.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container-app">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Banks in {cityName}</h2>
                <p className="text-sm text-muted-foreground mt-1">{banks.length} banks headquartered here</p>
              </div>
              <Link href="/banks" className="text-sm text-primary hover:underline flex items-center gap-1">
                All banks <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {banks.map((b) => (
                <Card key={b.id} className="card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 font-bold text-lg">🏦</div>
                      <div className="min-w-0">
                        <Link href={`/banks/${b.slug}`} className="font-semibold hover:text-primary line-clamp-2">{b.name}</Link>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Badge variant="outline" className="text-[10px]">{b.shortName}</Badge>
                          {b.rating > 0 && <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {b.rating.toFixed(1)}</span>}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2">{b.description}</p>
                    <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                      {b.savingsRateMax && <span>Savings: up to {b.savingsRateMax}%</span>}
                      {b.fixedDepositRateMax && <span>FD: up to {b.fixedDepositRateMax}%</span>}
                      {b.branchCount && <span>{b.branchCount} branches</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {schools.length > 0 && (
        <section className="py-12">
          <div className="container-app">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Schools in {cityName}</h2>
                <p className="text-sm text-muted-foreground mt-1">{schools.length} schools found</p>
              </div>
              <Link href="/schools" className="text-sm text-primary hover:underline flex items-center gap-1">
                All schools <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {schools.slice(0, 12).map((s) => (
                <Card key={s.id} className="card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 font-bold text-lg">🏫</div>
                      <div className="min-w-0">
                        <Link href={`/schools/${s.slug}`} className="font-semibold hover:text-primary line-clamp-2">{s.name}</Link>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {s.city ?? s.district}</span>
                          {s.rating > 0 && <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {s.rating.toFixed(1)}</span>}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {s.level && <Badge variant="outline" className="text-[10px]">{s.level}</Badge>}
                      <Badge variant="outline" className="text-[10px]">{s.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {totalListings === 0 && (
        <section className="py-16">
          <div className="container-app text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold">No listings found in {cityName} yet</h2>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              We&apos;re continuously expanding our directory. Browse all institutions across Nepal.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/colleges" className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Browse all colleges</Link>
              <Link href="/banks" className="rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-accent">Browse all banks</Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-12 bg-muted/30">
        <div className="container-app max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight mb-6">FAQs about {cityName}</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold">How many colleges are there in {cityName}?</h3>
              <p className="mt-2 text-sm text-muted-foreground">Khojney lists {colleges.length} colleges in {cityName}, {provinceName}. Compare them by fees, programs, ratings, and admission process.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold">Which is the best college in {cityName}?</h3>
              <p className="mt-2 text-sm text-muted-foreground">The best college depends on your field of study and goals. Browse our verified listings with ratings and reviews to find the right fit.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold">What is the average college fee in {cityName}?</h3>
              <p className="mt-2 text-sm text-muted-foreground">Public colleges charge NPR 1-2 lakh/year; private colleges NPR 5-10 lakh. Check individual college pages for detailed fee structures.</p>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
