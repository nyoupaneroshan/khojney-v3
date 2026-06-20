import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Landmark,
  Building,
  Phone,
  Mail,
  Globe,
  Clock,
  Banknote,
  CheckCircle2,
  ListOrdered,
  ArrowLeft,
  ArrowRight,
  Eye,
} from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { BreadcrumbNav } from "@/components/khojney/breadcrumb-nav";
import { InfoCard, InfoRow } from "@/components/khojney/info-card";
import { JsonLd } from "@/components/khojney/json-ld";
import { parseJsonArray, formatNumber } from "@/components/khojney/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  getGovCategoryLabel,
  getGovCategoryStyle,
} from "@/lib/government-categories";
import { BookmarkButton } from "@/components/khojney/bookmark-button";
import { ShareButton } from "@/components/government/share-button";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = await db.governmentService.findUnique({
    where: { slug },
    select: {
      title: true,
      description: true,
      ministry: true,
      department: true,
      category: true,
    },
  });
  if (!service) {
    return { title: "Government service not found" };
  }
  const description = service.description.slice(0, 160);
  const title = `${service.title} — Process, Fees & Documents`;
  return {
    title,
    description,
    alternates: { canonical: `/government/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/government/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function GovernmentServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const user = await getSession();

  const service = await db.governmentService.findUnique({
    where: { slug },
  });

  if (!service || !service.isPublished) notFound();

  const steps = parseJsonArray<string>(service.steps);
  const requiredDocuments = parseJsonArray<string>(service.requiredDocuments);

  // Fire-and-forget view increment. Not awaited so it never blocks render.
  db.governmentService
    .update({
      where: { id: service.id },
      data: { views: { increment: 1 } },
    })
    .catch(() => {
      /* swallow — view tracking is best-effort */
    });

  // Related services — same category, exclude current, limit 3
  const related = await db.governmentService.findMany({
    where: {
      isPublished: true,
      category: service.category,
      NOT: { id: service.id },
    },
    orderBy: [{ isFeatured: "desc" }, { views: "desc" }],
    take: 3,
    select: {
      id: true,
      slug: true,
      title: true,
      ministry: true,
      processingTime: true,
    },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name: service.title,
    description: service.description,
    category: getGovCategoryLabel(service.category),
    serviceType: getGovCategoryLabel(service.category),
    provider: {
      "@type": "GovernmentOrganization",
      name: service.ministry ?? service.department ?? service.office ?? undefined,
      department: service.department ?? undefined,
      areaServed: "NP",
    },
    serviceOperator: service.office ?? undefined,
    url: service.applicationUrl ?? undefined,
    offers: service.applicationFee
      ? {
          "@type": "Offer",
          priceSpecification: {
            "@type": "PriceSpecification",
            price: service.applicationFee,
          },
        }
      : undefined,
    processingTime: service.processingTime ?? undefined,
    telephone: service.contactPhone ?? undefined,
    email: service.contactEmail ?? undefined,
    step: steps.length
      ? steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s,
        }))
      : undefined,
  };

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
              { label: "Government Services", href: "/government" },
              { label: service.title },
            ]}
          />
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium " +
                    getGovCategoryStyle(service.category)
                  }
                >
                  {getGovCategoryLabel(service.category)}
                </span>
                {service.isFeatured && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Featured
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" /> {formatNumber(service.views)} views
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {service.title}
              </h1>
              {(service.ministry || service.department || service.office) && (
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {service.ministry && (
                    <span className="flex items-center gap-1.5">
                      <Landmark className="h-4 w-4" /> {service.ministry}
                    </span>
                  )}
                  {service.department && (
                    <span className="flex items-center gap-1.5">
                      <Building className="h-4 w-4" /> {service.department}
                    </span>
                  )}
                  {service.office && <span>· {service.office}</span>}
                </div>
              )}
            </div>
            <div className="hidden md:flex flex-col gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/government">
                  <ArrowLeft className="h-4 w-4" /> All services
                </Link>
              </Button>
              {service.applicationUrl && (
                <Button asChild size="sm">
                  <a
                    href={service.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="h-4 w-4" /> Apply online
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
            {/* Left column (2/3) */}
            <div className="space-y-8">
              {/* Description */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Overview</h2>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-[15px] leading-7 text-foreground/90">
                    {service.description}
                  </p>
                </CardContent>
              </Card>

              {/* Process steps */}
              {steps.length > 0 && (
                <Card>
                  <CardHeader>
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                      <ListOrdered className="h-5 w-5 text-primary" /> Process Steps
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-5">
                      {steps.map((step, idx) => (
                        <li key={idx} className="flex gap-4">
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                            aria-hidden="true"
                          >
                            {idx + 1}
                          </span>
                          <div className="pt-1.5">
                            <p className="text-[15px] leading-7 text-foreground/90">
                              {step}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              )}

              {/* Required documents */}
              {requiredDocuments.length > 0 && (
                <Card>
                  <CardHeader>
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                      <CheckCircle2 className="h-5 w-5 text-primary" /> Required Documents
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {requiredDocuments.map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-500" />
                          <span className="text-sm text-foreground/90">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right column (1/3) — sidebar */}
            <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
              <InfoCard title="Key Information">
                <div className="divide-y divide-border">
                  {service.applicationFee && (
                    <InfoRow
                      icon={<Banknote className="h-4 w-4" />}
                      label="Application Fee"
                      value={service.applicationFee}
                    />
                  )}
                  {service.processingTime && (
                    <InfoRow
                      icon={<Clock className="h-4 w-4" />}
                      label="Processing Time"
                      value={service.processingTime}
                    />
                  )}
                  {service.ministry && (
                    <InfoRow
                      icon={<Landmark className="h-4 w-4" />}
                      label="Ministry"
                      value={service.ministry}
                    />
                  )}
                  {service.department && (
                    <InfoRow
                      icon={<Building className="h-4 w-4" />}
                      label="Department"
                      value={service.department}
                    />
                  )}
                  {service.office && (
                    <InfoRow
                      icon={<Building className="h-4 w-4" />}
                      label="Office"
                      value={service.office}
                    />
                  )}
                </div>
                {service.applicationUrl && (
                  <Button asChild className="mt-4 w-full">
                    <a
                      href={service.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-4 w-4" /> Apply Online
                    </a>
                  </Button>
                )}
              </InfoCard>

              <InfoCard title="Contact">
                <div className="divide-y divide-border">
                  {service.contactPhone && (
                    <InfoRow
                      icon={<Phone className="h-4 w-4" />}
                      label="Phone"
                      value={
                        <a
                          href={`tel:${service.contactPhone}`}
                          className="hover:text-primary"
                        >
                          {service.contactPhone}
                        </a>
                      }
                    />
                  )}
                  {service.contactEmail && (
                    <InfoRow
                      icon={<Mail className="h-4 w-4" />}
                      label="Email"
                      value={
                        <a
                          href={`mailto:${service.contactEmail}`}
                          className="break-all hover:text-primary"
                        >
                          {service.contactEmail}
                        </a>
                      }
                    />
                  )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <BookmarkButton
                    entity="GOVERNMENT_SERVICE"
                    entityId={service.id}
                    entityName={service.title}
                  />
                  <ShareButton title={service.title} />
                </div>
              </InfoCard>
            </aside>
          </div>

          {/* Related services */}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-5 text-xl font-semibold">Related Services</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/government/${r.slug}`}
                    className="group rounded-xl border bg-card p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
                  >
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium " +
                        getGovCategoryStyle(service.category)
                      }
                    >
                      {getGovCategoryLabel(service.category)}
                    </span>
                    <h3 className="mt-3 font-semibold leading-snug group-hover:text-primary">
                      {r.title}
                    </h3>
                    {r.ministry && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Landmark className="h-3 w-3" />
                        <span className="line-clamp-1">{r.ministry}</span>
                      </p>
                    )}
                    {r.processingTime && (
                      <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> {r.processingTime}
                      </p>
                    )}
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      View process{" "}
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </AppShell>
  );
}
