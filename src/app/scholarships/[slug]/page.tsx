import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  Calendar,
  Globe,
  Building2,
  ExternalLink,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { BreadcrumbNav } from "@/components/khojney/breadcrumb-nav";
import { EntityBadge } from "@/components/khojney/entity-badge";
import { InfoCard, InfoRow } from "@/components/khojney/info-card";
import { JsonLd } from "@/components/khojney/json-ld";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { parseJsonArray, formatDate, daysUntil } from "@/components/khojney/format";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const s = await db.scholarship.findUnique({
    where: { slug },
    select: { title: true, description: true, coverImage: true, amount: true, provider: true },
  });
  if (!s) return { title: "Scholarship not found" };
  const description = s.description.slice(0, 160);
  const title = `${s.title} — Eligibility, Deadline, Apply`;
  return {
    title,
    description,
    alternates: { canonical: `/scholarships/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/scholarships/${slug}`,
      images: s.coverImage ? [{ url: s.coverImage }] : undefined,
    },
  };
}

export default async function ScholarshipDetailPage({ params }: Params) {
  const { slug } = await params;
  const user = await getSession();

  const scholarship = await db.scholarship.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!scholarship || !scholarship.isPublished) notFound();

  const eligibility = parseJsonArray<string>(scholarship.eligibility);

  // Related scholarships: same level OR same field, exclude current
  const related = await db.scholarship.findMany({
    where: {
      isPublished: true,
      id: { not: scholarship.id },
      OR: [
        ...(scholarship.level ? [{ level: scholarship.level }] : []),
        ...(scholarship.field ? [{ field: scholarship.field }] : []),
      ],
    },
    orderBy: { deadline: "asc" },
    take: 3,
  });

  const days = daysUntil(scholarship.deadline);
  const isClosed = days !== null && days < 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: scholarship.title,
    description: scholarship.description.slice(0, 200),
    datePublished: scholarship.createdAt,
    dateModified: scholarship.updatedAt,
    author: scholarship.provider ? { "@type": "Organization", name: scholarship.provider } : undefined,
    publisher: scholarship.provider
      ? { "@type": "Organization", name: scholarship.provider }
      : undefined,
    image: scholarship.coverImage ?? undefined,
    mainEntityOfPage: `/scholarships/${slug}`,
  };

  return (
    <AppShell user={user}>
      <JsonLd data={jsonLd} />

      <div className="border-b bg-gradient-to-b from-secondary/40 to-background">
        <div className="container-app py-8">
          <BreadcrumbNav
            className="mb-4"
            items={[
              { label: "Home", href: "/" },
              { label: "Scholarships", href: "/scholarships" },
              { label: scholarship.title },
            ]}
          />
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
              <Award className="h-8 w-8" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {scholarship.level && <EntityBadge variant="secondary" value={scholarship.level} />}
                {scholarship.category && (
                  <EntityBadge variant="outline" value={scholarship.category.name} />
                )}
                {scholarship.isFeatured && (
                  <EntityBadge variant="secondary" className="gap-1">
                    <Sparkles className="h-3 w-3" /> Featured
                  </EntityBadge>
                )}
                {isClosed ? (
                  <EntityBadge variant="outline">Closed</EntityBadge>
                ) : (
                  days !== null &&
                  days <= 30 && (
                    <EntityBadge variant="destructive">
                      {days} day{days === 1 ? "" : "s"} left
                    </EntityBadge>
                  )
                )}
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {scholarship.title}
              </h1>
              {scholarship.provider && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" /> Provided by{" "}
                  <span className="font-medium text-foreground">{scholarship.provider}</span>
                </p>
              )}
              {scholarship.amount && (
                <p className="mt-1 text-lg font-semibold text-emerald-700">{scholarship.amount}</p>
              )}
            </div>
            <div className="hidden md:flex flex-col gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/scholarships">
                  <ArrowLeft className="h-4 w-4" /> All scholarships
                </Link>
              </Button>
              {scholarship.applicationUrl && !isClosed && (
                <Button asChild size="sm">
                  <a href={scholarship.applicationUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" /> Apply now
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="py-10">
        <div className="container-app">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">About this scholarship</h2>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-[15px] leading-7 text-foreground/90">
                    {scholarship.description}
                  </p>
                </CardContent>
              </Card>

              {eligibility.length > 0 && (
                <Card>
                  <CardHeader>
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                      <CheckCircle2 className="h-5 w-5 text-primary" /> Eligibility criteria
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {eligibility.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {related.length > 0 && (
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Related scholarships</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {related.map((r) => {
                        const rDays = daysUntil(r.deadline);
                        return (
                          <Link
                            key={r.id}
                            href={`/scholarships/${r.slug}`}
                            className="group rounded-lg border p-3 transition-colors hover:bg-muted/40"
                          >
                            <div className="flex items-center gap-2">
                              {r.level && (
                                <Badge variant="secondary" className="text-xs">
                                  {r.level}
                                </Badge>
                              )}
                              {rDays !== null && rDays >= 0 && rDays <= 30 && (
                                <Badge variant="destructive" className="text-xs">
                                  {rDays}d left
                                </Badge>
                              )}
                            </div>
                            <h3 className="mt-2 line-clamp-2 text-sm font-semibold group-hover:text-primary">
                              {r.title}
                            </h3>
                            {r.amount && (
                              <p className="mt-1 text-xs font-medium text-emerald-700">{r.amount}</p>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
              <InfoCard title="Scholarship details">
                <div className="divide-y divide-border">
                  {scholarship.amount && (
                    <InfoRow
                      icon={<Award className="h-4 w-4" />}
                      label="Amount"
                      value={<span className="text-emerald-700 font-semibold">{scholarship.amount}</span>}
                    />
                  )}
                  {scholarship.field && (
                    <InfoRow
                      icon={<Award className="h-4 w-4" />}
                      label="Field"
                      value={scholarship.field}
                    />
                  )}
                  {scholarship.level && (
                    <InfoRow
                      icon={<Sparkles className="h-4 w-4" />}
                      label="Level"
                      value={scholarship.level}
                    />
                  )}
                  <InfoRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Deadline"
                    value={
                      <span className={isClosed ? "text-muted-foreground line-through" : ""}>
                        {formatDate(scholarship.deadline)}
                      </span>
                    }
                  />
                  {scholarship.applicationOpen && (
                    <InfoRow
                      icon={<Clock className="h-4 w-4" />}
                      label="Opens"
                      value={formatDate(scholarship.applicationOpen)}
                    />
                  )}
                  <InfoRow
                    icon={<Globe className="h-4 w-4" />}
                    label="Country"
                    value={scholarship.country}
                  />
                </div>
              </InfoCard>

              {scholarship.provider && (
                <InfoCard title="Provider">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">{scholarship.provider}</div>
                      {scholarship.providerUrl && (
                        <a
                          href={scholarship.providerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          Visit provider <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </InfoCard>
              )}

              {scholarship.applicationUrl && (
                <Button asChild className="w-full" size="lg">
                  <a href={scholarship.applicationUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    {isClosed ? "View application (closed)" : "Apply now"}
                  </a>
                </Button>
              )}

              <Separator />
              <Link
                href="/scholarships"
                className="inline-flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to all scholarships
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
