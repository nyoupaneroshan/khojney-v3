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
import { getCachedCollegeBySlug } from "@/lib/cache";
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

interface CollegeProgram {
  name?: string;
  level?: string;
  duration?: string;
  fees?: string;
  description?: string;
}

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  // Use cached query — no DB hit on cache hit.
  const college = await getCachedCollegeBySlug(slug);
  if (!college) {
    return { title: "College not found" };
  }
  const description = college.description.slice(0, 160);
  const title = `${college.name} — Programs, Fees, Reviews`;
  return {
    title,
    description,
    alternates: { canonical: `/colleges/${slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/colleges/${slug}`,
      images: college.coverImage ? [{ url: college.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: college.coverImage ? [college.coverImage] : undefined,
    },
  };
}

export const revalidate = 3600; // ISR: 1 hour

export default async function CollegeDetailPage({ params }: Params) {
  const { slug } = await params;
  const user = await getSession();

  // Use cached query — no DB hit on cache hit (1 hour TTL).
  const college = await getCachedCollegeBySlug(slug);

  if (!college || !college.isPublished) notFound();

  const programs = parseJsonArray<CollegeProgram>(college.programs);
  const facilities = parseJsonArray<string>(college.facilities);
  const gallery = parseJsonArray<string>(college.gallery);

  // Reviews are stored as a polymorphic (entity, entityId) pair on the Review
  // model — not a Prisma relation — so we fetch them separately.
  const reviews = await db.review.findMany({
    where: { entity: "COLLEGE", entityId: college.id },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, image: true } } },
    take: 50,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: college.name,
    description: college.description,
    url: college.website ?? undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: college.city ?? undefined,
      addressRegion: college.district ?? college.province ?? undefined,
      addressCountry: "NP",
    },
    telephone: college.phone ?? undefined,
    email: college.email ?? undefined,
    foundingDate: college.establishedYear ? String(college.establishedYear) : undefined,
    aggregateRating:
      college.rating > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: college.rating,
            reviewCount: college.reviewCount,
          }
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
              { label: "Colleges", href: "/colleges" },
              { label: college.name },
            ]}
          />
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <AvatarInitial name={college.name} size="xl" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {college.name}
                </h1>
                {college.isVerified && (
                  <EntityBadge variant="secondary" className="gap-1">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </EntityBadge>
                )}
              </div>
              {college.rating > 0 && (
                <div className="mt-2">
                  <StarRating rating={college.rating} count={college.reviewCount} size={18} />
                </div>
              )}
              {college.address && (
                <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {college.address}
                  {(college.city || college.district) && (
                    <span>
                      {" "}
                      — {[college.city, college.district, college.province]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  )}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                {college.phone && (
                  <a
                    href={`tel:${college.phone}`}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-primary"
                  >
                    <Phone className="h-3.5 w-3.5" /> {college.phone}
                  </a>
                )}
                {college.email && (
                  <a
                    href={`mailto:${college.email}`}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-primary"
                  >
                    <Mail className="h-3.5 w-3.5" /> {college.email}
                  </a>
                )}
                {college.website && (
                  <a
                    href={college.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-primary"
                  >
                    <Globe className="h-3.5 w-3.5" /> Website
                  </a>
                )}
              </div>
            </div>
            <div className="hidden md:flex flex-col gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/colleges">
                  <ArrowLeft className="h-4 w-4" /> All colleges
                </Link>
              </Button>
              {college.website && (
                <Button asChild size="sm">
                  <a href={college.website} target="_blank" rel="noopener noreferrer">
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
            <div className="space-y-8">
              {/* About */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">About {college.name}</h2>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-[15px] leading-7 text-foreground/90">
                    {college.description}
                  </p>
                </CardContent>
              </Card>

              {/* Programs */}
              {programs.length > 0 && (
                <Card>
                  <CardHeader>
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                      <GraduationCap className="h-5 w-5 text-primary" /> Programs Offered
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {programs.map((p, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border bg-card p-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold leading-snug">{p.name ?? "Program"}</h3>
                            {p.level && <EntityBadge variant="secondary" value={p.level} />}
                          </div>
                          {(p.duration || p.fees) && (
                            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                              {p.duration && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" /> {p.duration}
                                </span>
                              )}
                              {p.fees && (
                                <span className="flex items-center gap-1">
                                  <Banknote className="h-3 w-3" /> {p.fees}
                                </span>
                              )}
                            </div>
                          )}
                          {p.description && (
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                              {p.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Facilities */}
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

              {/* Admission process */}
              {college.admissionProcess && (
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Admission Process</h2>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line text-[15px] leading-7 text-foreground/90">
                      {college.admissionProcess}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Gallery (if any) */}
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
                          alt={`${college.name} gallery image ${idx + 1}`}
                          className="aspect-video w-full rounded-lg border bg-muted object-cover"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <h2 className="flex items-center gap-2 text-xl font-semibold">
                    <User className="h-5 w-5 text-primary" /> Reviews &amp; Ratings
                  </h2>
                  {college.reviewCount > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {college.reviewCount} review{college.reviewCount === 1 ? "" : "s"} ·
                      Average{" "}
                      <span className="font-medium text-foreground">
                        {college.rating.toFixed(1)}
                      </span>{" "}
                      / 5
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <ReviewForm
                    entity="COLLEGE"
                    entityId={college.id}
                    isLoggedIn={!!user}
                    redirectPath={`/colleges/${college.slug}`}
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
            </div>

            {/* Sidebar */}
            <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
              <InfoCard title="Key facts">
                <div className="divide-y divide-border">
                  <InfoRow
                    icon={<Building2 className="h-4 w-4" />}
                    label="Type"
                    value={<Badge variant="outline">{college.type}</Badge>}
                  />
                  {college.affiliation && (
                    <InfoRow
                      icon={<Award className="h-4 w-4" />}
                      label="Affiliation"
                      value={college.affiliation}
                    />
                  )}
                  {college.establishedYear && (
                    <InfoRow
                      icon={<Calendar className="h-4 w-4" />}
                      label="Established"
                      value={college.establishedYear}
                    />
                  )}
                  {college.feesRange && (
                    <InfoRow
                      icon={<Banknote className="h-4 w-4" />}
                      label="Fees range"
                      value={college.feesRange}
                    />
                  )}
                  {college.category && (
                    <InfoRow
                      icon={<GraduationCap className="h-4 w-4" />}
                      label="Category"
                      value={college.category.name}
                    />
                  )}
                  {college.scholarshipsAvailable && (
                    <InfoRow
                      icon={<Award className="h-4 w-4" />}
                      label="Scholarships"
                      value={<Badge variant="secondary">Available</Badge>}
                    />
                  )}
                </div>
              </InfoCard>

              <InfoCard title="Contact & location">
                <div className="divide-y divide-border">
                  {college.phone && (
                    <InfoRow
                      icon={<Phone className="h-4 w-4" />}
                      label="Phone"
                      value={
                        <a href={`tel:${college.phone}`} className="hover:text-primary">
                          {college.phone}
                        </a>
                      }
                    />
                  )}
                  {college.email && (
                    <InfoRow
                      icon={<Mail className="h-4 w-4" />}
                      label="Email"
                      value={
                        <a href={`mailto:${college.email}`} className="hover:text-primary">
                          {college.email}
                        </a>
                      }
                    />
                  )}
                  {college.website && (
                    <InfoRow
                      icon={<Globe className="h-4 w-4" />}
                      label="Website"
                      value={
                        <a
                          href={college.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-primary hover:underline"
                        >
                          {college.website.replace(/^https?:\/\//, "")}
                        </a>
                      }
                    />
                  )}
                  {(college.city || college.district || college.province) && (
                    <InfoRow
                      icon={<MapPin className="h-4 w-4" />}
                      label="Location"
                      value={
                        [college.city, college.district, college.province]
                          .filter(Boolean)
                          .join(", ")
                      }
                    />
                  )}
                  {college.address && (
                    <InfoRow
                      icon={<MapPin className="h-4 w-4" />}
                      label="Address"
                      value={college.address}
                    />
                  )}
                </div>
                {college.website && (
                  <Button asChild className="mt-4 w-full">
                    <a href={college.website} target="_blank" rel="noopener noreferrer">
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
