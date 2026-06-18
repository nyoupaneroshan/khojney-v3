import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  BadgeCheck,
  Calendar,
  Building2,
  Banknote,
  Award,
  CheckCircle2,
  GraduationCap,
  ArrowLeft,
  User,
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
import { parseJsonArray, formatDate } from "@/components/khojney/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const school = await db.school.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
      city: true,
      district: true,
      province: true,
      level: true,
      affiliation: true,
      type: true,
      coverImage: true,
    },
  });
  if (!school) return { title: "School not found" };

  const description = school.description.slice(0, 160);
  const title = `${school.name} — Programs, Facilities, Reviews`;
  return {
    title,
    description,
    alternates: { canonical: `/schools/${slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/schools/${slug}`,
      images: school.coverImage ? [{ url: school.coverImage }] : undefined,
    },
  };
}

export default async function SchoolDetailPage({ params }: Params) {
  const { slug } = await params;
  const user = await getSession();

  const school = await db.school.findUnique({
    where: { slug },
  });

  if (!school || !school.isPublished) notFound();

  const programs = parseJsonArray<string>(school.programs);
  const facilities = parseJsonArray<string>(school.facilities);
  const gallery = parseJsonArray<string>(school.gallery);

  // Reviews are stored as a polymorphic (entity, entityId) pair on the Review
  // model — not a Prisma relation — so we fetch them separately.
  const reviews = await db.review.findMany({
    where: { entity: "SCHOOL", entityId: school.id },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, image: true } } },
    take: 50,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: school.name,
    description: school.description,
    url: school.website ?? undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: school.city ?? undefined,
      addressRegion: school.district ?? school.province ?? undefined,
      addressCountry: "NP",
    },
    telephone: school.phone ?? undefined,
    email: school.email ?? undefined,
    foundingDate: school.establishedYear ? String(school.establishedYear) : undefined,
    aggregateRating:
      school.rating > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: school.rating,
            reviewCount: school.reviewCount,
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
              { label: "Schools", href: "/schools" },
              { label: school.name },
            ]}
          />
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <AvatarInitial name={school.name} size="xl" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{school.name}</h1>
                {school.isVerified && (
                  <EntityBadge variant="secondary" className="gap-1">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </EntityBadge>
                )}
              </div>
              {school.rating > 0 && (
                <div className="mt-2">
                  <StarRating rating={school.rating} count={school.reviewCount} size={18} />
                </div>
              )}
              {school.address && (
                <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {school.address}
                  {(school.city || school.district) && (
                    <span>
                      {" "}
                      — {[school.city, school.district, school.province].filter(Boolean).join(", ")}
                    </span>
                  )}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                {school.phone && (
                  <a href={`tel:${school.phone}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-primary">
                    <Phone className="h-3.5 w-3.5" /> {school.phone}
                  </a>
                )}
                {school.email && (
                  <a href={`mailto:${school.email}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-primary">
                    <Mail className="h-3.5 w-3.5" /> {school.email}
                  </a>
                )}
                {school.website && (
                  <a href={school.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-muted-foreground hover:text-primary">
                    <Globe className="h-3.5 w-3.5" /> Website
                  </a>
                )}
              </div>
            </div>
            <div className="hidden md:flex flex-col gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/schools">
                  <ArrowLeft className="h-4 w-4" /> All schools
                </Link>
              </Button>
              {school.website && (
                <Button asChild size="sm">
                  <a href={school.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" /> Visit site
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
                  <h2 className="text-xl font-semibold">About {school.name}</h2>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-[15px] leading-7 text-foreground/90">
                    {school.description}
                  </p>
                </CardContent>
              </Card>

              {programs.length > 0 && (
                <Card>
                  <CardHeader>
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                      <GraduationCap className="h-5 w-5 text-primary" /> Classes &amp; Programs
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {programs.map((p, idx) => (
                        <Badge key={idx} variant="outline" className="text-sm">
                          {typeof p === "string" ? p : String(p)}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {facilities.length > 0 && (
                <Card>
                  <CardHeader>
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                      <CheckCircle2 className="h-5 w-5 text-primary" /> Facilities
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {facilities.map((f, idx) => (
                        <Badge key={idx} variant="outline" className="text-sm">
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {school.admissionProcess && (
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Admission Process</h2>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line text-[15px] leading-7 text-foreground/90">
                      {school.admissionProcess}
                    </p>
                  </CardContent>
                </Card>
              )}

              {gallery.length > 0 && (
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Gallery</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {gallery.map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt={`${school.name} gallery image ${idx + 1}`}
                          className="aspect-video w-full rounded-lg border bg-muted object-cover"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <h2 className="flex items-center gap-2 text-xl font-semibold">
                    <User className="h-5 w-5 text-primary" /> Reviews &amp; Ratings
                  </h2>
                  {school.reviewCount > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {school.reviewCount} review{school.reviewCount === 1 ? "" : "s"} ·
                      Average{" "}
                      <span className="font-medium text-foreground">{school.rating.toFixed(1)}</span>{" "}
                      / 5
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <ReviewForm
                    entity="SCHOOL"
                    entityId={school.id}
                    isLoggedIn={!!user}
                    redirectPath={`/schools/${school.slug}`}
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
                    icon={<Building2 className="h-4 w-4" />}
                    label="Type"
                    value={<Badge variant="outline">{school.type}</Badge>}
                  />
                  {school.level && (
                    <InfoRow
                      icon={<GraduationCap className="h-4 w-4" />}
                      label="Level"
                      value={school.level.replace(/_/g, " ").toLowerCase()}
                    />
                  )}
                  {school.affiliation && (
                    <InfoRow
                      icon={<Award className="h-4 w-4" />}
                      label="Affiliation"
                      value={school.affiliation}
                    />
                  )}
                  {school.establishedYear && (
                    <InfoRow
                      icon={<Calendar className="h-4 w-4" />}
                      label="Established"
                      value={school.establishedYear}
                    />
                  )}
                  {school.feesRange && (
                    <InfoRow
                      icon={<Banknote className="h-4 w-4" />}
                      label="Fees range"
                      value={school.feesRange}
                    />
                  )}
                </div>
              </InfoCard>

              <InfoCard title="Contact & location">
                <div className="divide-y divide-border">
                  {school.phone && (
                    <InfoRow
                      icon={<Phone className="h-4 w-4" />}
                      label="Phone"
                      value={<a href={`tel:${school.phone}`} className="hover:text-primary">{school.phone}</a>}
                    />
                  )}
                  {school.email && (
                    <InfoRow
                      icon={<Mail className="h-4 w-4" />}
                      label="Email"
                      value={<a href={`mailto:${school.email}`} className="hover:text-primary">{school.email}</a>}
                    />
                  )}
                  {school.website && (
                    <InfoRow
                      icon={<Globe className="h-4 w-4" />}
                      label="Website"
                      value={
                        <a href={school.website} target="_blank" rel="noopener noreferrer" className="break-all text-primary hover:underline">
                          {school.website.replace(/^https?:\/\//, "")}
                        </a>
                      }
                    />
                  )}
                  {(school.city || school.district || school.province) && (
                    <InfoRow
                      icon={<MapPin className="h-4 w-4" />}
                      label="Location"
                      value={[school.city, school.district, school.province].filter(Boolean).join(", ")}
                    />
                  )}
                </div>
                {school.website && (
                  <Button asChild className="mt-4 w-full">
                    <a href={school.website} target="_blank" rel="noopener noreferrer">
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
