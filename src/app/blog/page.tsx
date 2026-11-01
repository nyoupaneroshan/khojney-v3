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
import { getCachedCategories, getCachedBlogTags } from "@/lib/cache";
import { buildMetadata, MODULE_KEYWORDS, buildBreadcrumbSchema, buildItemListSchema } from "@/lib/seo";
import { JsonLd } from "@/components/khojney/json-ld";

export const revalidate = 3600;
const BASE_PATH = "/blog";
const PAGE_SIZE = 9;

export const metadata: Metadata = buildMetadata({
  title: "Khojney Blog — Guides, Exam Tips, College & Career Advice in Nepal",
  description:
    "Read the Khojney blog for exam preparation guides, career tips, college admission advice, and education news in Nepal.",
  canonical: BASE_PATH,
  keywords: [...MODULE_KEYWORDS.blog],
});

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
    // Cached: blog categories change rarely.
    getCachedCategories("BLOG"),
    // Cached: blog tags change rarely.
    getCachedBlogTags(),
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

  const breadcrumbLd = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: BASE_PATH },
  ]);

  const itemListLd = buildItemListSchema({
    name: "Khojney Blog",
    description: "Guides, exam tips, career advice, and education news for Nepali students.",
    items: posts.map((p) => ({
      name: p.title,
      url: `/blog/${p.slug}`,
      image: p.coverImage || null,
    })),
  });

  return (
    <AppShell user={user}>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={itemListLd} />
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
            <div className="mb-12">
              <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:border-primary/40 hover:shadow-md transition-all">
                <div className="grid gap-0 md:grid-cols-12 items-stretch">
                  {featuredPost.coverImage && (
                    <div className="relative aspect-video overflow-hidden bg-muted md:aspect-auto md:h-full md:col-span-7">
                      <img
                        src={featuredPost.coverImage}
                        alt={featuredPost.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className={cn("flex flex-col justify-center gap-4 p-6 sm:p-10", featuredPost.coverImage ? "md:col-span-5" : "md:col-span-12")}>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="gap-1 font-semibold text-xs tracking-wider uppercase bg-primary/10 text-primary border-primary/20">
                        <Newspaper className="h-3 w-3" /> Lead Story
                      </Badge>
                      {featuredPost.category && (
                        <EntityBadge variant="outline" value={featuredPost.category.name} />
                      )}
                    </div>
                    <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl leading-snug">
                      <Link href={`/blog/${featuredPost.slug}`} className="hover:text-primary transition-colors">
                        {featuredPost.title}
                      </Link>
                    </h2>
                    {featuredPost.excerpt && (
                      <p className="line-clamp-3 text-sm text-muted-foreground sm:text-base leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                    )}
                    <PostMeta
                      author={featuredPost.author?.name}
                      publishedAt={featuredPost.publishedAt}
                      readTime={featuredPost.readTimeMin}
                      views={featuredPost.views}
                    />
                    <div className="pt-2">
                      <Button asChild size="sm" className="font-semibold gap-1.5 shadow-sm">
                        <Link href={`/blog/${featuredPost.slug}`}>
                          Read full guide <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
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
                <div className="mb-6 flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    {isDefaultView && featuredPost ? "All Published Guides" : `Articles (${total})`}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                </div>
              )}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((p) => (
                  <Card key={p.id} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs hover:border-primary/40 hover:shadow-md transition-all">
                    {p.coverImage && (
                      <div className="aspect-video overflow-hidden bg-muted">
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      {p.category && (
                        <div className="mb-2">
                          <EntityBadge variant="outline" value={p.category.name} />
                        </div>
                      )}
                      <h3 className="text-base font-bold leading-snug">
                        <Link href={`/blog/${p.slug}`} className="line-clamp-2 hover:text-primary transition-colors">
                          {p.title}
                        </Link>
                      </h3>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between space-y-4 pb-4">
                      {p.excerpt && (
                        <p className="line-clamp-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {p.excerpt}
                        </p>
                      )}
                      <div className="pt-2 border-t border-border/40">
                        <PostMeta
                          author={p.author?.name}
                          publishedAt={p.publishedAt}
                          readTime={p.readTimeMin}
                          views={p.views}
                          compact
                        />
                      </div>
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
