import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { getSession } from "@/lib/auth-server";
import { JsonLd } from "@/components/khojney/json-ld";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MapPin } from "lucide-react";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ province: string }>;
}

function humanize(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { province } = await params;
  const provinceName = humanize(province);
  const title = `Colleges, Schools & Banks in ${provinceName} Province, Nepal — Complete Directory`;
  const description = `Find the best colleges, schools, and banks in ${provinceName} province, Nepal. Compare by fees, programs, ratings, and services. Verified listings with contact details.`;

  return {
    title,
    description,
    keywords: [
      `${provinceName} colleges`,
      `${provinceName} schools`,
      `${provinceName} banks`,
      `colleges in ${provinceName} Nepal`,
      `best college ${provinceName}`,
    ],
    alternates: {
      canonical: `https://khojney.com/in/${province}`,
    },
    openGraph: { title, description, url: `https://khojney.com/in/${province}` },
  };
}

export default async function ProvincePage({ params }: PageProps) {
  const user = await getSession();
  const { province } = await params;
  const provinceName = humanize(province);

  // Get distinct cities that have listings in this province
  const [collegeCities, schoolCities, bankHqs] = await Promise.all([
    db.college.findMany({
      where: { isPublished: true, province: { equals: provinceName } },
      select: { city: true, district: true },
    }),
    db.school.findMany({
      where: { isPublished: true, province: { equals: provinceName } },
      select: { city: true, district: true },
    }),
    db.bank.findMany({
      where: { isPublished: true, headquarters: { not: null } },
      select: { headquarters: true },
    }),
  ]);

  // Aggregate cities
  const cityCounts: Record<string, { colleges: number; schools: number; banks: number }> = {};
  for (const c of collegeCities) {
    const city = c.city ?? c.district;
    if (!city) continue;
    const key = city.toLowerCase().replace(/\s+/g, "-");
    if (!cityCounts[key]) cityCounts[key] = { colleges: 0, schools: 0, banks: 0 };
    cityCounts[key].colleges++;
  }
  for (const s of schoolCities) {
    const city = s.city ?? s.district;
    if (!city) continue;
    const key = city.toLowerCase().replace(/\s+/g, "-");
    if (!cityCounts[key]) cityCounts[key] = { colleges: 0, schools: 0, banks: 0 };
    cityCounts[key].schools++;
  }
  // Banks use headquarters; we show them on the city page even if not in this province,
  // but for the province page we just count those that match province name in HQ.
  // For simplicity, skip bank city aggregation here (banks don't have province field).

  const cities = Object.entries(cityCounts).sort((a, b) => {
    const aTotal = a[1].colleges + a[1].schools;
    const bTotal = b[1].colleges + b[1].schools;
    return bTotal - aTotal;
  });

  const totalColleges = collegeCities.length;
  const totalSchools = schoolCities.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Institutions in ${provinceName} Province, Nepal`,
    description: `Directory of colleges, schools, and banks in ${provinceName} province.`,
    url: `https://khojney.com/in/${province}`,
    about: {
      "@type": "AdministrativeArea",
      name: `${provinceName} Province, Nepal`,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://khojney.com/" },
      { "@type": "ListItem", position: 2, name: provinceName },
    ],
  };

  return (
    <AppShell user={user}>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd} />

      <section className="border-b border-border bg-gradient-to-br from-red-50/40 via-white to-blue-50/30">
        <div className="container-app py-12 md:py-16">
          <nav className="mb-4 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li>/</li>
              <li className="text-foreground font-medium">{provinceName} Province</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Colleges, Schools & Banks in <span className="text-gradient-red">{provinceName}</span> Province
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Explore {totalColleges} colleges and {totalSchools} schools across {provinceName} province, Nepal.
            Select a city below to see detailed listings with fees, programs, ratings, and contact information.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-app">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Cities in {provinceName}</h2>
          {cities.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium">No listings found in {provinceName} yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  We&apos;re expanding our directory. Browse all institutions across Nepal.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Link href="/colleges" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">All Colleges</Link>
                  <Link href="/schools" className="rounded-md border border-border bg-background px-4 py-2 text-sm hover:bg-accent">All Schools</Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map(([citySlug, counts]) => {
                const cityName = humanize(citySlug);
                const total = counts.colleges + counts.schools;
                return (
                  <Link
                    key={citySlug}
                    href={`/in/${province}/${citySlug}`}
                    className="group rounded-xl border border-border bg-card p-5 hover:shadow-md hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-primary">{cityName}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{total} institutions</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {counts.colleges > 0 && (
                        <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5">🎓 {counts.colleges} Colleges</span>
                      )}
                      {counts.schools > 0 && (
                        <span className="rounded-full bg-amber-50 text-amber-700 px-2 py-0.5">🏫 {counts.schools} Schools</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
