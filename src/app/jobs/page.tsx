import type { Metadata } from "next";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Building2,
  Calendar,
  Banknote,
  ArrowRight,
  ExternalLink,
  Clock,
  Sparkles,
} from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { ListPageHeader } from "@/components/khojney/list-page-header";
import { FiltersShell, ClearFiltersLink } from "@/components/khojney/filters-shell";
import { SearchBar } from "@/components/khojney/search-bar";
import { FilterSelect } from "@/components/khojney/filter-select";
import { FilterSuspense } from "@/components/khojney/filter-suspense";
import { PaginationControl } from "@/components/khojney/pagination-control";
import { EmptyState } from "@/components/khojney/empty-state";
import { EntityBadge } from "@/components/khojney/entity-badge";
import { AvatarInitial } from "@/components/khojney/avatar-initial";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { parseJsonArray, formatDate, daysUntil } from "@/components/khojney/format";
import { asInt, asString, type SearchParamsLike } from "@/components/khojney/filter-url";
import { buildMetadata, MODULE_KEYWORDS } from "@/lib/seo";
import { CrossLinkFooter } from "@/components/khojney/cross-link-footer";
import { formatSalary } from "@/lib/job-utils";

export const revalidate = 3600;
const BASE_PATH = "/jobs";
const PAGE_SIZE = 12;

export const metadata: Metadata = buildMetadata({
  title: "Jobs in Nepal 2025 — Latest Job Vacancies, IT, Government & NGO Jobs",
  description:
    "Browse the latest job openings in Nepal — full-time, part-time, contract, internship, and remote roles across IT, finance, marketing, engineering, healthcare, education, and more.",
  canonical: BASE_PATH,
  keywords: [...MODULE_KEYWORDS.jobs],
});

const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Deadline (soonest first)", value: "deadline" },
  { label: "Highest salary", value: "salary" },
];

const JOB_TYPE_OPTIONS = [
  { label: "Full-time", value: "FULL_TIME" },
  { label: "Part-time", value: "PART_TIME" },
  { label: "Contract", value: "CONTRACT" },
  { label: "Internship", value: "INTERNSHIP" },
  { label: "Remote", value: "REMOTE" },
];

const CATEGORY_OPTIONS = [
  { label: "IT / Software", value: "IT" },
  { label: "Finance", value: "FINANCE" },
  { label: "Marketing", value: "MARKETING" },
  { label: "Engineering", value: "ENGINEERING" },
  { label: "Healthcare", value: "HEALTHCARE" },
  { label: "Education", value: "EDUCATION" },
  { label: "Other", value: "OTHER" },
];

const EXPERIENCE_OPTIONS = [
  { label: "Entry level", value: "ENTRY" },
  { label: "Mid level", value: "MID" },
  { label: "Senior", value: "SENIOR" },
  { label: "Lead", value: "LEAD" },
];

/** Format a salary range like "NPR 50,000 – 80,000". */
export { formatSalary } from "@/lib/job-utils";

export default async function JobsListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsLike>;
}) {
  const user = await getSession();
  const sp = await searchParams;

  const q = asString(sp.q)?.trim() ?? "";
  const jobType = asString(sp.jobType);
  const category = asString(sp.category);
  const experienceLevel = asString(sp.experienceLevel);
  const location = asString(sp.location)?.trim();
  const sort = asString(sp.sort) ?? "newest";
  const page = Math.max(1, asInt(sp.page, 1));
  const pageSize = Math.max(1, Math.min(48, asInt(sp.pageSize, PAGE_SIZE)));

  // Build Prisma where clause
  const where: Record<string, unknown> = { isPublished: true };
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { company: { contains: q } },
      { location: { contains: q } },
      { description: { contains: q } },
    ];
  }
  if (jobType) where.jobType = jobType;
  if (category) where.category = category;
  if (experienceLevel) where.experienceLevel = experienceLevel;
  if (location) where.location = { contains: location };

  const orderBy: Record<string, "asc" | "desc"> =
    sort === "deadline"
      ? { deadline: "asc" }
      : sort === "salary"
        ? { salaryMax: "desc" }
        : { createdAt: "desc" };

  const [total, jobs] = await Promise.all([
    db.job.count({ where }),
    db.job.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const activeFilterCount = [
    q,
    jobType,
    category,
    experienceLevel,
    location,
  ].filter(Boolean).length;

  return (
    <AppShell user={user}>
      <ListPageHeader
        title="Jobs in Nepal"
        description="Explore job opportunities across Nepal — full-time, part-time, remote, internship, and contract roles in every major industry."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Jobs" }]}
        totalCount={total}
      />

      <section className="py-10">
        <div className="container-app">
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <FiltersShell title="Filter jobs" activeCount={activeFilterCount}>
              <FilterSuspense>
                <div className="space-y-4">
                  <FilterSelect
                    basePath={BASE_PATH}
                    param="jobType"
                    label="Job type"
                    includeAll="All types"
                    options={JOB_TYPE_OPTIONS}
                  />
                  <FilterSelect
                    basePath={BASE_PATH}
                    param="category"
                    label="Category"
                    includeAll="All categories"
                    options={CATEGORY_OPTIONS}
                  />
                  <FilterSelect
                    basePath={BASE_PATH}
                    param="experienceLevel"
                    label="Experience"
                    includeAll="All levels"
                    options={EXPERIENCE_OPTIONS}
                  />
                  <Separator />
                  <ClearFiltersLink basePath={BASE_PATH} />
                </div>
              </FilterSuspense>
            </FiltersShell>

            <div>
              <FilterSuspense>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <SearchBar
                    basePath={BASE_PATH}
                    placeholder="Search by title, company, or location..."
                    className="sm:max-w-md"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Sort:</span>
                    <FilterSelect
                      basePath={BASE_PATH}
                      param="sort"
                      includeAll="Default"
                      options={SORT_OPTIONS}
                      resetPage={false}
                      className="min-w-[180px]"
                    />
                  </div>
                </div>
              </FilterSuspense>

              {jobs.length === 0 ? (
                <EmptyState
                  icon={Briefcase}
                  title="No jobs found"
                  description="Try adjusting your filters or search keywords to see more results."
                  actionLabel="Clear all filters"
                  actionHref={BASE_PATH}
                />
              ) : (
                <>
                  <p className="mb-4 text-xs text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium text-foreground">
                      {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)}
                    </span>{" "}
                    of <span className="font-medium text-foreground">{total}</span> jobs
                  </p>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {jobs.map((job) => {
                      const skills = parseJsonArray<string>(job.skills).slice(0, 4);
                      const days = daysUntil(job.deadline);
                      const isClosingSoon =
                        days !== null && days >= 0 && days <= 7;
                      const isClosed = days !== null && days < 0;
                      const salary = formatSalary(
                        job.salaryMin,
                        job.salaryMax,
                        job.salaryCurrency,
                      );
                      return (
                        <Card key={job.id} className="card-hover flex flex-col overflow-hidden">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <AvatarInitial name={job.company || job.title} size="md" />
                              <div className="flex flex-wrap gap-1 justify-end">
                                {job.isFeatured && (
                                  <EntityBadge variant="secondary" className="gap-1">
                                    <Sparkles className="h-3 w-3" /> Featured
                                  </EntityBadge>
                                )}
                              </div>
                            </div>
                            <h3 className="mt-3 text-base font-semibold leading-snug">
                              <Link
                                href={`/jobs/${job.slug}`}
                                className="line-clamp-2 hover:text-primary"
                              >
                                {job.title}
                              </Link>
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                              {job.company && (
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" /> {job.company}
                                </span>
                              )}
                              {job.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" /> {job.location}
                                </span>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="flex-1 space-y-3 pb-3">
                            <div className="flex flex-wrap gap-1">
                              <EntityBadge variant="secondary" value={job.jobType} />
                              {job.category && (
                                <EntityBadge variant="outline" value={job.category} />
                              )}
                              <EntityBadge value={job.experienceLevel} />
                            </div>
                            <p className="line-clamp-2 text-sm text-muted-foreground">
                              {job.description}
                            </p>
                            {salary && (
                              <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                                <Banknote className="h-3.5 w-3.5" /> {salary}
                              </div>
                            )}
                            {skills.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {skills.map((skill, idx) => (
                                  <EntityBadge key={`${skill}-${idx}`} variant="outline">
                                    {skill}
                                  </EntityBadge>
                                ))}
                              </div>
                            )}
                            {job.deadline && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" /> Deadline:{" "}
                                {formatDate(job.deadline)}
                                {isClosingSoon && (
                                  <EntityBadge variant="destructive" className="ml-1">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {days}d left
                                  </EntityBadge>
                                )}
                                {isClosed && (
                                  <EntityBadge variant="outline" className="ml-1">
                                    Closed
                                  </EntityBadge>
                                )}
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="gap-2 pt-0">
                            {job.applicationUrl && !isClosed ? (
                              <Button asChild size="sm">
                                <a
                                  href={job.applicationUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" /> Apply Now
                                </a>
                              </Button>
                            ) : job.applicationEmail && !isClosed ? (
                              <Button asChild size="sm">
                                <a href={`mailto:${job.applicationEmail}`}>
                                  <ExternalLink className="h-3.5 w-3.5" /> Apply Now
                                </a>
                              </Button>
                            ) : null}
                            <Button asChild size="sm" variant="ghost" className="ml-auto">
                              <Link href={`/jobs/${job.slug}`}>
                                View Details <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>

                  <PaginationControl
                    currentPage={page}
                    totalPages={totalPages}
                    basePath={BASE_PATH}
                    searchParams={sp}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <CrossLinkFooter module="jobs" />
    </AppShell>
  );
}
