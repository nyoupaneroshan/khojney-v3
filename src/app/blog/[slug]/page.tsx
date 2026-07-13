import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, Eye, ArrowLeft, Newspaper } from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { BreadcrumbNav } from "@/components/khojney/breadcrumb-nav";
import { EntityBadge } from "@/components/khojney/entity-badge";
import { JsonLd } from "@/components/khojney/json-ld";
import { MarkdownContent } from "@/components/khojney/markdown-content";
import { extractTocHeadings } from "@/components/khojney/toc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatNumber } from "@/components/khojney/format";
import { getCachedBlogPostBySlug } from "@/lib/cache";

export const revalidate = 300; // ISR: 5 minutes

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  // Use cached query — no DB hit on cache hit.
  const post = await getCachedBlogPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription ?? post.excerpt ?? post.title;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/blog/${slug}`,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
      publishedTime: new Date(post.publishedAt).toISOString(),
      authors: post.author?.name ? [post.author.name] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: Params) {
  const { slug } = await params;
  const user = await getSession();

  // Use cached query — no DB hit on cache hit (5 min TTL).
  const post = await getCachedBlogPostBySlug(slug);
  if (!post || post.status !== "PUBLISHED") notFound();

  // Fire-and-forget view increment (not cached — write through to DB).
  db.blogPost
    .update({ where: { id: post.id }, data: { views: { increment: 1 } } })
    .catch(() => {
      /* swallow — view tracking is best-effort */
    });

  // Related posts (same category, exclude current, limit 3) — direct DB
  // query because it's specific to this post and changes frequently.
  const related = post.category
    ? await db.blogPost.findMany({
        where: {
          status: "PUBLISHED",
          id: { not: post.id },
          categoryId: post.categoryId,
        },
        orderBy: { publishedAt: "desc" },
        take: 3,
        include: {
          category: true,
          author: { select: { name: true } },
        },
      })
    : [];

  const toc = extractTocHeadings(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? post.metaDescription ?? undefined,
    image: post.coverImage ?? undefined,
    datePublished: new Date(post.publishedAt).toISOString(),
dateModified: new Date(post.updatedAt).toISOString(),
    author: post.author?.name
      ? { "@type": "Person", name: post.author.name }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Khojney",
      logo: { "@type": "ImageObject", url: "https://khojney.com/logo.png" },
    },
    mainEntityOfPage: `/blog/${slug}`,
    keywords: post.tags.map((t) => t.name).join(", ") || undefined,
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
              { label: "Blog", href: "/blog" },
              ...(post.category ? [{ label: post.category.name, href: `/blog?category=${post.category.slug}` }] : []),
              { label: post.title },
            ]}
          />
          <div className="mx-auto max-w-3xl text-center">
            {post.category && (
              <Link
                href={`/blog?category=${post.category.slug}`}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20"
              >
                <Newspaper className="h-3 w-3" /> {post.category.name}
              </Link>
            )}
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">{post.excerpt}</p>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {post.author?.name && (
                <span className="flex items-center gap-1.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {post.author.name[0]?.toUpperCase()}
                  </span>
                  By <span className="font-medium text-foreground">{post.author.name}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {post.readTimeMin} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> {formatNumber(post.views + 1)} views
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <div className="container-app pt-8">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border bg-muted shadow-sm">
            <img
              src={post.coverImage}
              alt={post.title}
              className="aspect-video w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Body */}
      <section className="py-10">
        <div className="container-app">
          <div className="grid gap-8 lg:grid-cols-[1fr_220px]">
            <article className="min-w-0">
              <MarkdownContent content={post.content} />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Tags:</span>
                  {post.tags.map((t) => (
                    <Link
                      key={t.id}
                      href={`/blog?tag=${t.slug}`}
                      className="rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                    >
                      {t.name}
                    </Link>
                  ))}
                </div>
              )}

              <Separator className="my-8" />

              {/* Back link */}
              <div className="flex justify-center">
                <Button asChild variant="outline">
                  <Link href="/blog">
                    <ArrowLeft className="h-4 w-4" /> Back to all articles
                  </Link>
                </Button>
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-xl font-semibold mb-4">Related articles</h2>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {related.map((r) => (
                      <Card key={r.id} className="card-hover flex flex-col overflow-hidden">
                        {r.coverImage && (
                          <div className="aspect-video overflow-hidden bg-muted">
                            <img
                              src={r.coverImage}
                              alt={r.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <CardHeader className="pb-3">
                          {r.category && <EntityBadge variant="outline" value={r.category.name} />}
                          <h3 className="mt-2 text-sm font-semibold leading-snug">
                            <Link href={`/blog/${r.slug}`} className="line-clamp-2 hover:text-primary">
                              {r.title}
                            </Link>
                          </h3>
                        </CardHeader>
                        <CardContent className="pb-3 text-xs text-muted-foreground">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {formatDate(r.publishedAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {r.readTimeMin} min
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* TOC sidebar */}
            {toc.length > 0 && (
              <aside className="hidden lg:block">
                <div className="sticky top-20">
                  <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      On this page
                    </h2>
                    <nav className="mt-3 space-y-1">
                      {toc.map((h) => (
                        <a
                          key={h.id}
                          href={`#${h.id}`}
                          className="block rounded px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {h.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}