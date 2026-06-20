import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Briefcase,
  MapPin,
  Building2,
  Calendar,
  Banknote,
  ExternalLink,
  Mail,
  ArrowLeft,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Layers,
  GraduationCap,
  Eye,
} from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { BreadcrumbNav } from "@/components/khojney/breadcrumb-nav";
import { AvatarInitial } from "@/components/khojney/avatar-initial";
import { EntityBadge } from "@/components/khojney/entity-badge";
import { InfoCard, InfoRow } from "@/components/khojney/info-card";
import { JsonLd } from "@/components/khojney/json-ld";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { parseJsonArray, formatDate, daysUntil } from "@/components/khojney/format";
import { JobActions } from "@/components/khojney/job-actions";
import { formatSalary } from "@/lib/job-utils";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const job = await db.job.findUnique({
    where: { slug },
    select: {
      title: true,
      description: true,
      company: true,
      location: true,
      jobType: true,
      category: true,
      experienceLevel: true,
      salaryMin: true,
      salaryMax: true,
      salaryCurrency: true,
      deadline: true,
      createdAt: true,
    },
  });
  if (!job) {
    return { title: "Job not found" };
  }
  const description = job.description.slice(0, 160);
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);
  const title = `${job.title} at ${job.company} — Job in Nepal`;
  return {
    title,
    description,
    alternates: { canonical: `/jobs/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/jobs/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    keywords: [
      job.title,
      job.company,
      job.location ?? "",
      job.jobType,
      job.category ?? "",
      "Nepal jobs",
      salary ?? "",
    ]
      .filter(Boolean)
      .join(", "),
  };
}

export default async function JobDetailPage({ params }: Params) {
  const { slug } = await params;
  const user = await getSession();

  const job = await db.job.findUnique({
    where: { slug },
  });

  if (!job || !job.isPublished) notFound();

  // Fire-and-forget view increment
  db.job
    .update({
      where: { id: job.id },
      data: { views: { increment: 1 } },
    })
    .catch(() => {
      /* swallow errors in fire-and-forget */
    });

  const skills = parseJsonArray<string>(job.skills);
  const qualifications = parseJsonArray<string>(job.qualifications);
  const days = daysUntil(job.deadline);
  const isClosed = days !== null && days < 0;
  const isClosingSoon = days !== null && days >= 0 && days <= 7;
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);

  // Related jobs — same category, exclude current
  const related = job.category
    ? await db.job.findMany({
        where: {
          isPublished: true,
          id: { not: job.id },
          category: job.category,
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      })
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description.slice(0, 5000),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      logo: job.companyLogo ?? undefined,
    },
    jobLocation: job.location
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.location,
            addressCountry: "NP",
          },
        }
      : undefined,
    employmentType: job.jobType,
    industry: job.category ?? undefined,
    experienceRequirements: job.experienceLevel,
    datePosted: job.createdAt,
    validThrough: job.deadline ?? undefined,
    baseSalary:
      job.salaryMin != null || job.salaryMax != null
        ? {
            "@type": "MonetaryAmount",
            currency: job.salaryCurrency || "NPR",
            minValue: job.salaryMin ?? undefined,
            maxValue: job.salaryMax ?? undefined,
          }
        : undefined,
    skills: skills.length > 0 ? skills.join(", ") : undefined,
    qualifications: qualifications.length > 0 ? qualifications.join(". ") : undefined,
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
              { label: "Jobs", href: "/jobs" },
              { label: job.title },
            ]}
          />
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <AvatarInitial name={job.company || job.title} size="xl" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {job.isFeatured && (
                  <EntityBadge variant="secondary" className="gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> Featured
                  </EntityBadge>
                )}
                <EntityBadge variant="secondary" value={job.jobType} />
                {job.category && <EntityBadge variant="outline" value={job.category} />}
                <EntityBadge value={job.experienceLevel} />
                {isClosed ? (
                  <EntityBadge variant="outline">Closed</EntityBadge>
                ) : isClosingSoon ? (
                  <EntityBadge variant="destructive">
                    <Clock className="mr-1 h-3 w-3" />
                    {days}d left
                  </EntityBadge>
                ) : null}
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {job.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                {job.company && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium text-foreground">{job.company}</span>
                  </span>
                )}
                {job.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {job.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Posted {formatDate(job.createdAt)}
                </span>
                {job.deadline && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> Deadline {formatDate(job.deadline)}
                  </span>
                )}
              </div>
              {salary && (
                <p className="mt-2 text-lg font-semibold text-emerald-700">{salary}</p>
              )}
            </div>
            <div className="hidden md:flex flex-col gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/jobs">
                  <ArrowLeft className="h-4 w-4" /> All jobs
                </Link>
              </Button>
              {job.applicationUrl && !isClosed && (
                <Button asChild size="sm">
                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" /> Apply Now
                  </a>
                </Button>
              )}
              {job.applicationEmail && !job.applicationUrl && !isClosed && (
                <Button asChild size="sm">
                  <a href={`mailto:${job.applicationEmail}`}>
                    <Mail className="h-4 w-4" /> Apply via Email
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
            {/* Left column */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <h2 className="flex items-center gap-2 text-xl font-semibold">
                    <Briefcase className="h-5 w-5 text-primary" /> Job Description
                  </h2>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-[15px] leading-7 text-foreground/90">
                    {job.description}
                  </p>
                </CardContent>
              </Card>

              {skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                      <Layers className="h-5 w-5 text-primary" /> Skills Required
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, idx) => (
                        <Badge key={`${skill}-${idx}`} variant="outline" className="text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {qualifications.length > 0 && (
                <Card>
                  <CardHeader>
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                      <GraduationCap className="h-5 w-5 text-primary" /> Qualifications
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {qualifications.map((q, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-foreground/90"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {related.length > 0 && (
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Related jobs</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {related.map((r) => {
                        const rDays = daysUntil(r.deadline);
                        const rSalary = formatSalary(
                          r.salaryMin,
                          r.salaryMax,
                          r.salaryCurrency,
                        );
                        return (
                          <Link
                            key={r.id}
                            href={`/jobs/${r.slug}`}
                            className="group rounded-lg border p-3 transition-colors hover:bg-muted/40"
                          >
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {r.jobType}
                              </Badge>
                              {rDays !== null && rDays >= 0 && rDays <= 7 && (
                                <Badge variant="destructive" className="text-xs">
                                  {rDays}d left
                                </Badge>
                              )}
                            </div>
                            <h3 className="mt-2 line-clamp-2 text-sm font-semibold group-hover:text-primary">
                              {r.title}
                            </h3>
                            {r.company && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {r.company}
                                {r.location ? ` · ${r.location}` : ""}
                              </p>
                            )}
                            {rSalary && (
                              <p className="mt-1 text-xs font-medium text-emerald-700">
                                {rSalary}
                              </p>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
              <InfoCard title="Job summary">
                <div className="divide-y divide-border">
                  <InfoRow
                    icon={<Briefcase className="h-4 w-4" />}
                    label="Job type"
                    value={<Badge variant="outline">{job.jobType}</Badge>}
                  />
                  {job.category && (
                    <InfoRow
                      icon={<Layers className="h-4 w-4" />}
                      label="Category"
                      value={<Badge variant="outline">{job.category}</Badge>}
                    />
                  )}
                  <InfoRow
                    icon={<GraduationCap className="h-4 w-4" />}
                    label="Experience"
                    value={<Badge variant="outline">{job.experienceLevel}</Badge>}
                  />
                  {salary && (
                    <InfoRow
                      icon={<Banknote className="h-4 w-4" />}
                      label="Salary"
                      value={<span className="text-emerald-700 font-semibold">{salary}</span>}
                    />
                  )}
                  {job.deadline && (
                    <InfoRow
                      icon={<Calendar className="h-4 w-4" />}
                      label="Deadline"
                      value={
                        <span
                          className={
                            isClosed
                              ? "text-muted-foreground line-through"
                              : isClosingSoon
                                ? "text-destructive font-medium"
                                : ""
                          }
                        >
                          {formatDate(job.deadline)}
                        </span>
                      }
                    />
                  )}
                  <InfoRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Posted"
                    value={formatDate(job.createdAt)}
                  />
                  {job.location && (
                    <InfoRow
                      icon={<MapPin className="h-4 w-4" />}
                      label="Location"
                      value={job.location}
                    />
                  )}
                  <InfoRow
                    icon={<Eye className="h-4 w-4" />}
                    label="Views"
                    value={job.views + 1}
                  />
                </div>
              </InfoCard>

              <InfoCard title="How to apply">
                <div className="space-y-3">
                  {job.applicationUrl && (
                    <Button asChild className="w-full">
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {isClosed ? "View application (closed)" : "Apply on website"}
                      </a>
                    </Button>
                  )}
                  {job.applicationEmail && (
                    <Button
                      asChild
                      className="w-full"
                      variant={job.applicationUrl ? "outline" : "default"}
                    >
                      <a href={`mailto:${job.applicationEmail}`}>
                        <Mail className="h-4 w-4" /> {isClosed ? "Email (closed)" : "Apply via email"}
                      </a>
                    </Button>
                  )}
                  {!job.applicationUrl && !job.applicationEmail && (
                    <p className="text-sm text-muted-foreground">
                      No application link or email provided. Please contact the employer
                      directly.
                    </p>
                  )}
                </div>
              </InfoCard>

              <div className="flex gap-2">
                <JobActions title={job.title} jobId={job.id} />
              </div>

              <Separator />

              <Link
                href="/jobs"
                className="inline-flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to all jobs
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
