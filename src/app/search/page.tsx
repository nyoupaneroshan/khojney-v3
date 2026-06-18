import Link from "next/link";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { SearchTabs } from "@/components/khojney/search-tabs";
import { SearchResults } from "@/components/khojney/search-results";
import { SearchInput } from "@/components/khojney/search-input";
import { POPULAR_SEARCHES } from "@/lib/constants";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Search as SearchIcon, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface SearchParams {
  q?: string;
  module?: string;
  page?: string;
  pageSize?: string;
}

// Modules shown as tabs
const MODULE_TABS = [
  { key: "ALL", label: "All" },
  { key: "EXAM", label: "Exams" },
  { key: "COLLEGE", label: "Colleges" },
  { key: "SCHOOL", label: "Schools" },
  { key: "UNIVERSITY", label: "Universities" },
  { key: "SCHOLARSHIP", label: "Scholarships" },
  { key: "BLOG", label: "Blog" },
] as const;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const q = sp.q?.trim();
  if (!q) {
    return {
      title: "Search",
      description: "Search across exams, colleges, schools, universities, scholarships, and articles on Khojney.",
    };
  }
  return {
    title: `Search: ${q}`,
    description: `Results for "${q}" across Khojney's directory of exams, colleges, schools, universities, scholarships, and articles.`,
    alternates: { canonical: `/search?q=${encodeURIComponent(q)}` },
  };
}

interface SearchHit {
  type: string;
  id: string;
  slug: string;
  title: string;
  description: string;
  url: string;
  image: string | null;
  meta: Record<string, string | number | null>;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await getSession();
  const sp = await searchParams;

  const q = sp.q?.trim() ?? "";
  const moduleParam = (sp.module ?? "ALL").toUpperCase();
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const pageSize = 10;

  let results: SearchHit[] = [];
  let total = 0;
  let activeModule = moduleParam;

  if (q.length >= 2) {
    const tasks: Promise<SearchHit[]>[] = [];
    const wantsAll = activeModule === "ALL";

    if (wantsAll || activeModule === "EXAM") {
      tasks.push(
        db.exam
          .findMany({
            where: {
              isPublished: true,
              OR: [
                { title: { contains: q } },
                { description: { contains: q } },
                { tags: { contains: q } },
              ],
            },
            take: 25,
            include: {
              category: true,
              _count: { select: { attempts: true } },
            },
          })
          .then((rows) =>
            rows.map((e) => ({
              type: "EXAM",
              id: e.id,
              slug: e.slug,
              title: e.title,
              description: e.description,
              url: `/exams/${e.slug}`,
              image: e.coverImage ?? null,
              meta: {
                category: e.category?.name ?? null,
                difficulty: e.difficulty,
                duration: `${e.durationMin} min`,
                questions: e._count.attempts,
                attempts: e._count.attempts,
              },
            })),
          ),
      );
    }
    if (wantsAll || activeModule === "COLLEGE") {
      tasks.push(
        db.college
          .findMany({
            where: {
              isPublished: true,
              OR: [
                { name: { contains: q } },
                { description: { contains: q } },
                { city: { contains: q } },
                { district: { contains: q } },
                { affiliation: { contains: q } },
              ],
            },
            take: 25,
            include: { category: true },
          })
          .then((rows) =>
            rows.map((c) => ({
              type: "COLLEGE",
              id: c.id,
              slug: c.slug,
              title: c.name,
              description: c.description,
              url: `/colleges/${c.slug}`,
              image: c.logo ?? c.coverImage ?? null,
              meta: {
                category: c.category?.name ?? null,
                city: c.city,
                district: c.district,
                affiliation: c.affiliation,
                rating: c.rating,
              },
            })),
          ),
      );
    }
    if (wantsAll || activeModule === "SCHOOL") {
      tasks.push(
        db.school
          .findMany({
            where: {
              isPublished: true,
              OR: [
                { name: { contains: q } },
                { description: { contains: q } },
                { city: { contains: q } },
                { district: { contains: q } },
              ],
            },
            take: 25,
            include: { category: true },
          })
          .then((rows) =>
            rows.map((s) => ({
              type: "SCHOOL",
              id: s.id,
              slug: s.slug,
              title: s.name,
              description: s.description,
              url: `/schools/${s.slug}`,
              image: s.logo ?? s.coverImage ?? null,
              meta: {
                category: s.category?.name ?? null,
                city: s.city,
                district: s.district,
                level: s.level,
                rating: s.rating,
              },
            })),
          ),
      );
    }
    if (wantsAll || activeModule === "UNIVERSITY") {
      tasks.push(
        db.university
          .findMany({
            where: {
              isPublished: true,
              OR: [
                { name: { contains: q } },
                { description: { contains: q } },
                { city: { contains: q } },
                { address: { contains: q } },
              ],
            },
            take: 25,
          })
          .then((rows) =>
            rows.map((u) => ({
              type: "UNIVERSITY",
              id: u.id,
              slug: u.slug,
              title: u.name,
              description: u.description,
              url: `/universities/${u.slug}`,
              image: u.logo ?? u.coverImage ?? null,
              meta: {
                city: u.city,
                type: u.type,
                ranking: u.ranking,
                established: u.establishedYear,
              },
            })),
          ),
      );
    }
    if (wantsAll || activeModule === "SCHOLARSHIP") {
      tasks.push(
        db.scholarship
          .findMany({
            where: {
              isPublished: true,
              OR: [
                { title: { contains: q } },
                { description: { contains: q } },
                { provider: { contains: q } },
                { field: { contains: q } },
              ],
            },
            take: 25,
            include: { category: true },
          })
          .then((rows) =>
            rows.map((s) => ({
              type: "SCHOLARSHIP",
              id: s.id,
              slug: s.slug,
              title: s.title,
              description: s.description,
              url: `/scholarships/${s.slug}`,
              image: s.coverImage ?? null,
              meta: {
                provider: s.provider,
                amount: s.amount,
                level: s.level,
                field: s.field,
                deadline: s.deadline
                  ? s.deadline.toISOString().split("T")[0]
                  : null,
              },
            })),
          ),
      );
    }
    if (wantsAll || activeModule === "BLOG") {
      tasks.push(
        db.blogPost
          .findMany({
            where: {
              status: "PUBLISHED",
              OR: [
                { title: { contains: q } },
                { excerpt: { contains: q } },
                { content: { contains: q } },
              ],
            },
            take: 25,
            include: { category: true, author: true },
          })
          .then((rows) =>
            rows.map((p) => ({
              type: "BLOG",
              id: p.id,
              slug: p.slug,
              title: p.title,
              description: p.excerpt ?? p.content.slice(0, 200),
              url: `/blog/${p.slug}`,
              image: p.coverImage ?? null,
              meta: {
                category: p.category?.name ?? null,
                author: p.author?.name ?? null,
                readTime: `${p.readTimeMin} min read`,
                publishedAt: p.publishedAt.toISOString().split("T")[0],
              },
            })),
          ),
      );
    }

    const all = (await Promise.all(tasks)).flat();
    all.sort((a, b) => {
      const aStarts = a.title.toLowerCase().startsWith(q.toLowerCase()) ? 0 : 1;
      const bStarts = b.title.toLowerCase().startsWith(q.toLowerCase()) ? 0 : 1;
      if (aStarts !== bStarts) return aStarts - bStarts;
      return a.title.localeCompare(b.title);
    });

    total = all.length;
    const start = (page - 1) * pageSize;
    results = all.slice(start, start + pageSize);

    // Save to search history (non-blocking) — only on first page
    if (user && page === 1) {
      db.searchHistory
        .create({
          data: {
            userId: user.id,
            query: q,
            module: activeModule === "ALL" ? null : activeModule,
            results: total,
          },
        })
        .catch(() => undefined);
    }
  } else {
    activeModule = "ALL";
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AppShell user={user}>
      <div className="container-app py-8 md:py-12">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Search</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-2">
            <SearchIcon className="h-7 w-7 text-primary" /> Search Khojney
          </h1>
          <p className="mt-2 text-muted-foreground">
            Find exams, colleges, schools, universities, scholarships, and articles.
          </p>
        </header>

        <SearchInput initialQuery={q} />

        {q.length < 2 ? (
          <EmptyState />
        ) : (
          <>
            <SearchTabs
              tabs={MODULE_TABS.map((t) => ({ key: t.key, label: t.label }))}
              activeKey={activeModule}
              query={q}
            />

            <div className="mt-4 mb-4 text-sm text-muted-foreground">
              {total === 0
                ? `No results for `
                : `${total.toLocaleString()} result${total !== 1 ? "s" : ""} for `}
              {total >= 0 && (
                <span className="font-medium text-foreground">&ldquo;{q}&rdquo;</span>
              )}
              {activeModule !== "ALL" && (
                <>
                  {" in "}
                  <span className="font-medium text-foreground">
                    {MODULE_TABS.find((t) => t.key === activeModule)?.label}
                  </span>
                </>
              )}
            </div>

            <SearchResults results={results} />

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - page) <= 1,
                  )
                  .map((p, idx, arr) => (
                    <span key={p} className="flex items-center">
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Link
                        href={`/search?${buildSearchUrl(q, activeModule, p)}`}
                        className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors ${
                          p === page
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background hover:bg-accent"
                        }`}
                      >
                        {p}
                      </Link>
                    </span>
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

function buildSearchUrl(q: string, module: string, page: number): string {
  const sp = new URLSearchParams();
  sp.set("q", q);
  if (module && module !== "ALL") sp.set("module", module);
  if (page > 1) sp.set("page", String(page));
  return sp.toString();
}

function EmptyState() {
  return (
    <div className="mt-8 rounded-xl border border-dashed bg-muted/30 py-12 text-center">
      <TrendingUp className="mx-auto h-10 w-10 text-primary" />
      <h2 className="mt-3 text-lg font-semibold">Start typing to search</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Or try one of these popular searches:
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto px-4">
        {POPULAR_SEARCHES.map((term) => (
          <Link
            key={term}
            href={`/search?q=${encodeURIComponent(term)}`}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground hover:bg-accent hover:border-primary/30 transition-colors"
          >
            {term}
          </Link>
        ))}
      </div>
    </div>
  );
}
