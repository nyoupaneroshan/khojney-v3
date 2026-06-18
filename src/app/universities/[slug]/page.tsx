import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Building2,
  Users,
  Landmark,
  Award,
  GraduationCap,
  ArrowLeft,
  FileText,
  Trophy,
  User,
  ExternalLink,
} from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { BreadcrumbNav } from "@/components/khojney/breadcrumb-nav";
import { AvatarInitial } from "@/components/khojney/avatar-initial";
import { StarRating } from "@/components/khojney/star-rating";
import { EntityBadge } from "@/components/khojney/entity-badge";
import { InfoCard, InfoRow } from "@/components/khojney/info-card";
import { JsonLd } from "@/components/khojney/json-ld";
import { ReviewForm } from "@/components/khojney/review-form";
import { parseJsonArray, formatDate, formatNumber } from "@/components/khojney/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface UniversityProgram {
  faculty?: string;
  level?: string;
  name?: string;
  duration?: string;
}

interface UniversityNotice {
  title?: string;
  date?: string;
  link?: string;
}

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const uni = await db.university.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
      city: true,
      province: true,
      type: true,
      coverImage: true,
    },
  });
  if (!uni) return { title: "University not found" };
  const description = uni.description.slice(0, 160);
  const title = `${uni.name} — Programs, Faculties, Notices`;
  return {
    title,
    description,
    alternates: { canonical: `/universities/${slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/universities/${slug}`,
      images: uni.coverImage ? [{ url: uni.coverImage }] : undefined,
    },
  };
}

export default async function UniversityDetailPage({ params }: Params) {
  const { slug } = await params;
  const user = await getSession();

  const university = await db.university.findUnique({
    where: { slug },
  });

  if (!university || !university.isPublished) notFound();

  const programs = parseJsonArray<UniversityProgram>(university.programs);
  const faculties = parseJsonArray<string>(university.faculties);
  const notices = parseJsonArray<UniversityNotice>(university.notices);
  const results = parseJsonArray<UniversityNotice>(university.results);

  // Reviews are stored as a polymorphic (entity, entityId) pair on the Review
  // model — not a Prisma relation — so we fetch them separately.
  const reviews = await db.review.findMany({
    where: { entity: "UNIVERSITY", entityId: university.id },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, image: true } } },
    take: 50,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: university.name,
    description: university.description,
    url: university.website ?? undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: university.city ?? undefined,
      addressRegion: university.province ?? undefined,
      addressCountry: "NP",
    },
    telephone: university.phone ?? undefined,
    email: university.email ?? undefined,
    foundingDate: university.establishedYear ? String(university.establishedYear) : undefined,
    aggregateRating:
      university.rating > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: university.rating,
            reviewCount: university.reviewCount,
          }
        : undefined,
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
              { label: "Universities", href: "/universities" },
              { label: university.name },
            ]}
          />
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <AvatarInitial name={university.name} size="xl" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{university.name}</h1>
                {university.ranking && (
                  <EntityBadge variant="secondary">
                    <Trophy className="h-3.5 w-3.5" /> Rank #{university.ranking}
                  </EntityBadge>
                )}
              </div>
              {university.rating > 0 && (
                <div className="mt-2">
                  <StarRating rating={university.rating} count={university.reviewCount} size={18} />
                </div>
              )}
              {university.address && (
                <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {university.address}
                  {(university.city || university.province) && (
                    <span>
                      {" "}
                      — {[university.city, university.province].filter(Boolean).join(", ")}
                    </span>
                  )}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                {university.phone && (
                  <a href={`tel:${university.phone}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-primary">
                    <Phone className="h-3.5 w-3.5" /> {university.phone}
                  </a>
                )}
                {university.email && (
                  <a href={`mailto:${university.email}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-primary">
                    <Mail className="h-3.5 w-3.5" /> {university.email}
                  </a>
                )}
                {university.website && (
                  <a href={university.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-muted-foreground hover:text-primary">
                    <Globe className="h-3.5 w-3.5" /> Website
                  </a>
                )}
              </div>
            </div>
            <div className="hidden md:flex flex-col gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/universities">
                  <ArrowLeft className="h-4 w-4" /> All universities
                </Link>
              </Button>
              {university.website && (
                <Button asChild size="sm">
                  <a href={university.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" /> Visit site
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="border-b bg-muted/30">
        <div className="container-app py-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              icon={<Building2 className="h-5 w-5" />}
              label="Campuses"
              value={formatNumber(university.totalCampuses)}
            />
            {university.totalStudents && (
              <StatCard
                icon={<Users className="h-5 w-5" />}
                label="Students"
                value={formatNumber(university.totalStudents)}
              />
            )}
            {university.establishedYear && (
              <StatCard
                icon={<Calendar className="h-5 w-5" />}
                label="Established"
                value={String(university.establishedYear)}
              />
            )}
            {faculties.length > 0 && (
              <StatCard
                icon={<GraduationCap className="h-5 w-5" />}
                label="Faculties"
                value={String(faculties.length)}
              />
            )}
          </div>
        </div>
      </div>

      <section className="py-10">
        <div className="container-app">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">About {university.name}</h2>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-[15px] leading-7 text-foreground/90">
                    {university.description}
                  </p>
                </CardContent>
              </Card>

              {faculties.length > 0 && (
                <Card>
                  <CardHeader>
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                      <GraduationCap className="h-5 w-5 text-primary" /> Faculties
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {faculties.map((f, idx) => (
                        <Badge key={idx} variant="outline" className="text-sm">
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {programs.length > 0 && (
                <Card>
                  <CardHeader>
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                      <Award className="h-5 w-5 text-primary" /> Programs Offered
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="border-b px-3 py-2 text-left font-semibold">Program</th>
                            <th className="border-b px-3 py-2 text-left font-semibold">Faculty</th>
                            <th className="border-b px-3 py-2 text-left font-semibold">Level</th>
                            <th className="border-b px-3 py-2 text-left font-semibold">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {programs.map((p, idx) => (
                            <tr key={idx} className="hover:bg-muted/30">
                              <td className="border-b px-3 py-2 font-medium">{p.name ?? "—"}</td>
                              <td className="border-b px-3 py-2 text-muted-foreground">
                                {p.faculty ?? "—"}
                              </td>
                              <td className="border-b px-3 py-2 text-muted-foreground">
                                {p.level ?? "—"}
                              </td>
                              <td className="border-b px-3 py-2 text-muted-foreground">
                                {p.duration ?? "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {university.admissionProcess && (
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Admission Process</h2>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line text-[15px] leading-7 text-foreground/90">
                      {university.admissionProcess}
                    </p>
                  </CardContent>
                </Card>
              )}

              {notices.length > 0 && (
                <Card>
                  <CardHeader>
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                      <FileText className="h-5 w-5 text-primary" /> Notice Board
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y divide-border">
                      {notices.map((n, idx) => (
                        <li key={idx} className="py-3 first:pt-0 last:pb-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-medium leading-snug">{n.title ?? "Notice"}</div>
                              {n.date && (
                                <div className="mt-0.5 text-xs text-muted-foreground">
                                  {formatDate(n.date)}
                                </div>
                              )}
                            </div>
                            {n.link && (
                              <a
                                href={n.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
                              >
                                Open <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {results.length > 0 && (
                <Card>
                  <CardHeader>
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                      <Trophy className="h-5 w-5 text-primary" /> Results
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y divide-border">
                      {results.map((r, idx) => (
                        <li key={idx} className="py-3 first:pt-0 last:pb-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-medium leading-snug">{r.title ?? "Result"}</div>
                              {r.date && (
                                <div className="mt-0.5 text-xs text-muted-foreground">
                                  {formatDate(r.date)}
                                </div>
                              )}
                            </div>
                            {r.link && (
                              <a
                                href={r.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
                              >
                                Open <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <h2 className="flex items-center gap-2 text-xl font-semibold">
                    <User className="h-5 w-5 text-primary" /> Reviews &amp; Ratings
                  </h2>
                  {university.reviewCount > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {university.reviewCount} review{university.reviewCount === 1 ? "" : "s"} ·
                      Average{" "}
                      <span className="font-medium text-foreground">{university.rating.toFixed(1)}</span>{" "}
                      / 5
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <ReviewForm
                    entity="UNIVERSITY"
                    entityId={university.id}
                    isLoggedIn={!!user}
                    redirectPath={`/universities/${university.slug}`}
                  />
                  <Separator />
                  {reviews.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No reviews yet — be the first to share your experience.
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
                                <div className="text-sm font-medium">{r.user?.name ?? "Anonymous"}</div>
                                <div className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</div>
                              </div>
                            </div>
                            <StarRating rating={r.rating} showValue={false} size={14} />
                          </div>
                          {r.title && <div className="mt-2 text-sm font-medium">{r.title}</div>}
                          {r.comment && <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
              <InfoCard title="Key facts">
                <div className="divide-y divide-border">
                  <InfoRow
                    icon={<Landmark className="h-4 w-4" />}
                    label="Type"
                    value={<Badge variant="outline">{university.type}</Badge>}
                  />
                  {university.establishedYear && (
                    <InfoRow
                      icon={<Calendar className="h-4 w-4" />}
                      label="Established"
                      value={university.establishedYear}
                    />
                  )}
                  {university.ranking && (
                    <InfoRow
                      icon={<Trophy className="h-4 w-4" />}
                      label="Ranking"
                      value={`#${university.ranking}`}
                    />
                  )}
                  <InfoRow
                    icon={<Building2 className="h-4 w-4" />}
                    label="Campuses"
                    value={formatNumber(university.totalCampuses)}
                  />
                  {university.totalStudents && (
                    <InfoRow
                      icon={<Users className="h-4 w-4" />}
                      label="Students"
                      value={formatNumber(university.totalStudents)}
                    />
                  )}
                </div>
              </InfoCard>

              <InfoCard title="Contact & location">
                <div className="divide-y divide-border">
                  {university.phone && (
                    <InfoRow
                      icon={<Phone className="h-4 w-4" />}
                      label="Phone"
                      value={<a href={`tel:${university.phone}`} className="hover:text-primary">{university.phone}</a>}
                    />
                  )}
                  {university.email && (
                    <InfoRow
                      icon={<Mail className="h-4 w-4" />}
                      label="Email"
                      value={<a href={`mailto:${university.email}`} className="hover:text-primary">{university.email}</a>}
                    />
                  )}
                  {university.website && (
                    <InfoRow
                      icon={<Globe className="h-4 w-4" />}
                      label="Website"
                      value={
                        <a href={university.website} target="_blank" rel="noopener noreferrer" className="break-all text-primary hover:underline">
                          {university.website.replace(/^https?:\/\//, "")}
                        </a>
                      }
                    />
                  )}
                  {(university.city || university.province) && (
                    <InfoRow
                      icon={<MapPin className="h-4 w-4" />}
                      label="Location"
                      value={[university.city, university.province].filter(Boolean).join(", ")}
                    />
                  )}
                </div>
                {university.website && (
                  <Button asChild className="mt-4 w-full">
                    <a href={university.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" /> Visit official website
                    </a>
                  </Button>
                )}
              </InfoCard>
            </aside>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-primary">{icon}</span>
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-1 text-2xl font-bold text-foreground">{value}</div>
    </div>
  );
}
