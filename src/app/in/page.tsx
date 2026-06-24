import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { getSession } from "@/lib/auth-server";
import { JsonLd } from "@/components/khojney/json-ld";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MapPin } from "lucide-react";
import { NEPAL_PROVINCES } from "@/lib/constants";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Browse by Location — Colleges, Schools & Banks in Nepal by Province",
  description: "Explore colleges, schools, and banks across all 7 provinces of Nepal. Find institutions in Kathmandu, Pokhara, Biratnagar, Birgunj, and more cities.",
  alternates: { canonical: "https://khojney.com/in" },
};

export default async function BrowseByLocationPage() {
  const user = await getSession();

  // Count listings per province
  const provinceCounts: Record<string, number> = {};
  const provinces = NEPAL_PROVINCES as readonly string[];
  const [colleges, schools] = await Promise.all([
    db.college.findMany({ where: { isPublished: true }, select: { province: true } }),
    db.school.findMany({ where: { isPublished: true }, select: { province: true } }),
  ]);
  for (const c of [...colleges, ...schools]) {
    if (c.province) {
      const key = c.province.toLowerCase().replace(/\s+/g, "-");
      provinceCounts[key] = (provinceCounts[key] ?? 0) + 1;
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Browse Institutions in Nepal by Province",
    description: "Directory of colleges, schools, and banks across all 7 provinces of Nepal.",
    url: "https://khojney.com/in",
  };

  return (
    <AppShell user={user}>
      <JsonLd data={jsonLd} />
      <section className="border-b border-border bg-gradient-to-br from-red-50/40 via-white to-blue-50/30">
        <div className="container-app py-12 md:py-16">
          <nav className="mb-4 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li>/</li>
              <li className="text-foreground font-medium">Browse by Location</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Browse by <span className="text-gradient-red">Location</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Find colleges, schools, and banks across all 7 provinces of Nepal. Click a province to explore cities and institutions.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-app">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Nepal&apos;s 7 Provinces</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {provinces.map((province) => {
              const slug = province.toLowerCase().replace(/\s+/g, "-");
              const count = provinceCounts[slug] ?? 0;
              return (
                <Link
                  key={province}
                  href={`/in/${slug}`}
                  className="group rounded-xl border border-border bg-card p-5 hover:shadow-md hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary">{province} Province</h3>
                      <p className="text-sm text-muted-foreground mt-1">{count} institutions listed</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container-app text-center">
          <h2 className="text-2xl font-bold tracking-tight">Can&apos;t find your city?</h2>
          <p className="mt-2 text-muted-foreground">We&apos;re adding new locations every week. Browse all institutions across Nepal.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/colleges" className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">🎓 All Colleges</Link>
            <Link href="/schools" className="rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-accent">🏫 All Schools</Link>
            <Link href="/banks" className="rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-accent">🏦 All Banks</Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
