import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HeartPulse,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Bed,
  ShieldAlert,
  Ambulance,
  Activity,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Building,
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

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const hospital = await db.hospital.findUnique({
    where: { slug },
    select: {
      name: true,
      shortName: true,
      description: true,
      city: true,
      district: true,
      logo: true,
    },
  });
  if (!hospital) {
    return { title: "Hospital not found" };
  }
  const title = `${hospital.name}${hospital.shortName ? ` (${hospital.shortName})` : ""} — Emergency Contact & Departments`;
  const description = hospital.description.slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical: `/hospitals/${slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/hospitals/${slug}`,
      images: hospital.logo ? [{ url: hospital.logo }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: hospital.logo ? [hospital.logo] : undefined,
    },
  };
}

export default async function HospitalDetailPage({ params }: Params) {
  const { slug } = await params;
  const user = await getSession();

  const hospital = await db.hospital.findUnique({ where: { slug } });
  if (!hospital || !hospital.isPublished) notFound();

  // Fetch reviews for this hospital
  const reviews = await db.review.findMany({
    where: { entity: "HOSPITAL", entityId: hospital.id },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, image: true } } },
    take: 10,
  });

  // Related hospitals in same district or type
  const related = await db.hospital.findMany({
    where: {
      isPublished: true,
      id: { not: hospital.id },
      OR: [
        { district: hospital.district },
        { type: hospital.type },
      ],
    },
    take: 3,
    select: {
      id: true,
      slug: true,
      name: true,
      shortName: true,
      type: true,
      city: true,
      bedCount: true,
      rating: true,
    },
  });

  const departments = parseJsonArray<string>(hospital.departments);
  const facilities = parseJsonArray<string>(hospital.facilities);

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: hospital.name,
    description: hospital.description,
    telephone: hospital.emergencyPhone || hospital.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: hospital.address,
      addressLocality: hospital.city,
      addressRegion: hospital.province,
      addressCountry: "NP",
    },
    url: hospital.website,
  };

  return (
    <AppShell user={user}>
      <JsonLd data={jsonLdData} />
      <div className="container-app py-8">
        <BreadcrumbNav
          items={[
            { label: "Hospitals", href: "/hospitals" },
            { label: hospital.name, href: `/hospitals/${hospital.slug}` },
          ]}
        />

        {/* Hero Section */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 font-bold text-2xl shadow-sm">
                <HeartPulse className="h-9 w-9" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    {hospital.name}
                  </h1>
                  {hospital.shortName && (
                    <Badge variant="outline" className="text-sm font-semibold">
                      {hospital.shortName}
                    </Badge>
                  )}
                  <EntityBadge value={hospital.type.replace(/_/g, " ")} variant="secondary" />
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    {[hospital.address, hospital.city, hospital.district, hospital.province].filter(Boolean).join(", ")}
                  </span>
                  {hospital.establishedYear && (
                    <span>· Est. {hospital.establishedYear}</span>
                  )}
                </div>
                <div className="pt-2">
                  <StarRating rating={hospital.rating} count={hospital.reviewCount} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              <BookmarkButton
                entity="HOSPITAL"
                entityId={hospital.id}
                entityName={hospital.name}
              />
              <ShareButton title={hospital.name} />
            </div>
          </div>
        </div>

        {/* Emergency Alert Banner */}
        {hospital.hasEmergency && (
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/40 dark:border-red-900/60 p-4 md:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                <ShieldAlert className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base font-bold text-red-900 dark:text-red-200">
                  24/7 Emergency & Trauma Services (ER) Active
                </h2>
                <p className="text-xs text-red-700 dark:text-red-300">
                  Immediate triage, emergency operations, and ICU care available round-the-clock.
                </p>
              </div>
            </div>
            {hospital.emergencyPhone && (
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold shrink-0">
                <a href={`tel:${hospital.emergencyPhone}`}>
                  <Phone className="mr-2 h-4 w-4" /> Call ER: {hospital.emergencyPhone}
                </a>
              </Button>
            )}
          </div>
        )}

        {/* Main 2-Column Content */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Main Info (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About the Hospital</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {hospital.description}
              </CardContent>
            </Card>

            {/* Capacity & Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Capacity & Infrastructure</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-xs uppercase text-muted-foreground font-semibold">Total Beds</p>
                  <p className="text-2xl font-bold mt-1 text-primary">{hospital.bedCount ?? "—"}</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-xs uppercase text-muted-foreground font-semibold">ICU Capacity</p>
                  <p className="text-2xl font-bold mt-1 text-blue-600">{hospital.icuBeds ?? "—"}</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-xs uppercase text-muted-foreground font-semibold">Ventilators</p>
                  <p className="text-2xl font-bold mt-1 text-emerald-600">{hospital.ventilatorCount ?? "—"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Medical Departments */}
            {departments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Specialties & Departments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {departments.map((dept) => (
                      <div
                        key={dept}
                        className="flex items-center gap-2 rounded-lg border bg-muted/20 p-2.5 text-sm font-medium"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{dept}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Diagnostic & Specialized Facilities */}
            {facilities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Facilities & Equipment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {facilities.map((fac) => (
                      <div
                        key={fac}
                        className="flex items-center gap-2 rounded-lg border p-2.5 text-sm"
                      >
                        <Activity className="h-4 w-4 text-primary shrink-0" />
                        <span>{fac}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Patient Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Patient Reviews & Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ReviewForm
                  entity="HOSPITAL"
                  entityId={hospital.id}
                  isLoggedIn={!!user}
                />

                <Separator />

                {reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No reviews yet. Be the first patient or family member to leave a review.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((r) => (
                      <div key={r.id} className="rounded-lg border p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">{r.user?.name ?? "Anonymous"}</span>
                          <span className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</span>
                        </div>
                        <StarRating rating={r.rating} count={0} showValue={false} />
                        {r.title && <h3 className="font-medium text-sm">{r.title}</h3>}
                        {r.comment && <p className="text-xs text-muted-foreground">{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar (1 col) */}
          <div className="space-y-6">
            <InfoCard title="Contact Information">
              {hospital.emergencyPhone && (
                <InfoRow
                  label="Emergency Hotline"
                  value={
                    <a href={`tel:${hospital.emergencyPhone}`} className="font-bold text-red-600 hover:underline">
                      {hospital.emergencyPhone}
                    </a>
                  }
                />
              )}
              {hospital.phone && (
                <InfoRow
                  label="Reception / OPD"
                  value={
                    <a href={`tel:${hospital.phone}`} className="text-primary hover:underline">
                      {hospital.phone}
                    </a>
                  }
                />
              )}
              {hospital.email && (
                <InfoRow
                  label="Email"
                  value={
                    <a href={`mailto:${hospital.email}`} className="text-primary hover:underline">
                      {hospital.email}
                    </a>
                  }
                />
              )}
              {hospital.website && (
                <InfoRow
                  label="Official Website"
                  value={
                    <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                      Visit Website ↗
                    </a>
                  }
                />
              )}
              {hospital.address && (
                <InfoRow label="Address" value={hospital.address} />
              )}
            </InfoCard>

            <InfoCard title="Key Hospital Facts">
              <InfoRow label="Type" value={hospital.type.replace(/_/g, " ")} />
              <InfoRow label="Ambulance Service" value={hospital.hasAmbulance ? "Available" : "Not listed"} />
              <InfoRow label="In-house Blood Bank" value={hospital.hasBloodBank ? "Yes" : "Nearby coordination"} />
              <InfoRow label="24/7 Pharmacy" value={hospital.hasPharmacy24x7 ? "Available on-site" : "Standard hours"} />
            </InfoCard>

            {related.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Nearby / Related Hospitals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {related.map((rel) => (
                    <div key={rel.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                      <div>
                        <Link href={`/hospitals/${rel.slug}`} className="font-medium hover:text-primary">
                          {rel.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">{rel.city || rel.type}</p>
                      </div>
                      {rel.bedCount && (
                        <span className="text-xs text-muted-foreground font-semibold">
                          {rel.bedCount} beds
                        </span>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
