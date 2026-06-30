import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, Eye, ArrowRight, Newspaper } from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { ListPageHeader } from "@/components/khojney/list-page-header";
import { BreadcrumbNav } from "@/components/khojney/breadcrumb-nav";
import { SearchBar } from "@/components/khojney/search-bar";
import { FilterSelect } from "@/components/khojney/filter-select";
import { FilterSuspense } from "@/components/khojney/filter-suspense";
import { PaginationControl } from "@/components/khojney/pagination-control";
import { EmptyState } from "@/components/khojney/empty-state";
import { EntityBadge } from "@/components/khojney/entity-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/components/khojney/format";
import { asInt, asString, type SearchParamsLike } from "@/components/khojney/filter-url";
import { cn } from "@/lib/utils";

export const revalidate = 3600;
const BASE_PATH = "/blog";
const PAGE_SIZE = 9;

export const metadata: Metadata = {
  title: "Blog — Guides, Exam Tips, Career Advice",
  description:
    "Read the Khojney blog for exam preparation guides, career tips, college admission advice, and education news in Nepal.",
  alternates: { canonical: BASE_PATH },
};

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsLike>;
}) {
  const user = await getSession();
  const sp = await searchParams;

  const q = asString(sp.q)?.trim() ?? "";
  const categorySlug = asString(sp.category);
  const tagSlug = asString(sp.tag);
  const page = Math.max(1, asInt(sp.page, 1));
  const pageSize = Math.max(1, Math.min(36, asInt(sp.pageSize, PAGE_SIZE)));

  // Where clause
  const where: Record<string, unknown> = { status: "PUBLISHED" };
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { excerpt: { contains: q } },
      { content: { contains: q } },
    ];
  }
  if (categorySlug) {
    where.category = { slug: categorySlug };
  }
  if (tagSlug) {
    where.tags = { some: { slug: tagSlug } };
  }

  // For page 1 with no filters, render a featured post at top + the rest.
  const isDefaultView = !q && !categorySlug && !tagSlug && page === 1;

  const [total, posts, categories, tags] = await Promise.all([
    db.blogPost.count({ where }),
    db.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: isDefaultView ? 1 : (page - 1) * pageSize, // skip the featured one in default view
      take: isDefaultView ? pageSize - 1 : pageSize,
      include: {
        category: true,
        author: { select: { name: true, image: true } },
        tags: true,
      },
    }),
    db.category.findMany({
      where: { module: "BLOG" },
      orderBy: { name: "asc" },
    }),
    db.tag.findMany({
      orderBy: { name: "asc" },
      take: 30,
    }),
  ]);

  // Fetch the featured post for default view
  let featuredPost: typeof posts[number] | null = null;
  if (isDefaultView) {
    featuredPost = await db.blogPost.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      include: {
        category: true,
        author: { select: { name: true, image: true } },
        tags: true,
      },
    });
  }

  // Adjust total when we skipped the featured post for page 1 default view
  const adjustedTotal = isDefaultView && featuredPost ? total : total;
  const totalPages = Math.max(1, Math.ceil(adjustedTotal / pageSize));
  const activeFilterCount = [q, categorySlug, tagSlug].filter(Boolean).length;

  return (
    <AppShell user={user}>
      <ListPageHeader
        title="Khojney Blog"
        description="Guides, exam tips, career advice, and education news for Nepali students."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        totalCount={total}
      />

      <section className="py-10">
        <div className="container-app">
          {/* Toolbar */}
          <div className="mb-8 flex flex-col gap-4">
            <FilterSuspense>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <SearchBar
                  basePath={BASE_PATH}
                  placeholder="Search articles..."
                  className="sm:max-w-md"
                />
                <FilterSelect
                  basePath={BASE_PATH}
                  param="category"
                  includeAll="All categories"
                  options={categories.map((c) => ({ label: c.name, value: c.slug }))}
                />
              </div>
            </FilterSuspense>
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Tags:</span>
                {tags.map((t) => {
                  const isActive = tagSlug === t.slug;
                  return (
                    <Link
                      key={t.id}
                      href={isActive ? BASE_PATH : `${BASE_PATH}?tag=${t.slug}`}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
                      )}
                    >
                      {t.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Featured post (only on default view page 1) */}
          {featuredPost && (
            <div className="mb-10">
              <Card className="card-hover overflow-hidden">
                <div className="grid gap-0 md:grid-cols-2">
                  {featuredPost.coverImage && (
                    <div className="aspect-video overflow-hidden bg-muted md:aspect-auto md:h-full">
                      <img
                        src={featuredPost.coverImage}
                        alt={featuredPost.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="gap-1">
                        <Newspaper className="h-3 w-3" /> Featured
                      </Badge>
                      {featuredPost.category && (
                        <EntityBadge variant="outline" value={featuredPost.category.name} />
                      )}
                    </div>
                    <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
                      <Link href={`/blog/${featuredPost.slug}`} className="hover:text-primary">
                        {featuredPost.title}
                      </Link>
                    </h2>
                    {featuredPost.excerpt && (
                      <p className="line-clamp-3 text-sm text-muted-foreground sm:text-base">
                        {featuredPost.excerpt}
                      </p>
                    )}
                    <PostMeta
                      author={featuredPost.author?.name}
                      publishedAt={featuredPost.publishedAt}
                      readTime={featuredPost.readTimeMin}
                      views={featuredPost.views}
                    />
                    <div>
                      <Button asChild size="sm">
                        <Link href={`/blog/${featuredPost.slug}`}>
                          Read article <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Posts grid */}
          {posts.length === 0 && !featuredPost ? (
            <EmptyState
              icon={Newspaper}
              title="No articles found"
              description="Try adjusting your search or filters."
              actionLabel="View all posts"
              actionHref={BASE_PATH}
            />
          ) : (
            <>
              {posts.length > 0 && (
                <p className="mb-4 text-xs text-muted-foreground">
                  {isDefaultView && featuredPost ? "Latest articles" : `Showing ${posts.length} of ${total} articles`}
                </p>
              )}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((p) => (
                  <Card key={p.id} className="card-hover flex flex-col overflow-hidden">
                    {p.coverImage && (
                      <div className="aspect-video overflow-hidden bg-muted">
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      {p.category && (
                        <EntityBadge variant="outline" value={p.category.name} />
                      )}
                      <h3 className="mt-2 text-base font-semibold leading-snug">
                        <Link href={`/blog/${p.slug}`} className="line-clamp-2 hover:text-primary">
                          {p.title}
                        </Link>
                      </h3>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-3 pb-3">
                      {p.excerpt && (
                        <p className="line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
                      )}
                      <PostMeta
                        author={p.author?.name}
                        publishedAt={p.publishedAt}
                        readTime={p.readTimeMin}
                        views={p.views}
                        compact
                      />
                    </CardContent>
                  </Card>
                ))}
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
      </section>
    </AppShell>
  );
}

function PostMeta({
  author,
  publishedAt,
  readTime,
  views,
  compact,
}: {
  author?: string | null;
  publishedAt: Date;
  readTime: number;
  views: number;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground",
        compact ? "text-xs" : "text-sm",
      )}
    >
      {author && (
        <span className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
            {author[0]?.toUpperCase()}
          </span>
          By {author}
        </span>
      )}
      <span className="flex items-center gap-1">
        <Calendar className="h-3 w-3" /> {formatDate(publishedAt)}
      </span>
      <span className="flex items-center gap-1">
        <Clock className="h-3 w-3" /> {readTime} min
      </span>
      <span className="flex items-center gap-1">
        <Eye className="h-3 w-3" /> {formatNumber(views)}
      </span>
    </div>
  );
}
