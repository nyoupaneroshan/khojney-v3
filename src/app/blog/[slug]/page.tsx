import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  Eye,
  ArrowLeft,
  Newspaper,
  Share2,
  BookOpen,
} from "lucide-react";
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

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({
    where: { slug },
    select: {
      title: true,
      excerpt: true,
      coverImage: true,
      metaTitle: true,
      metaDescription: true,
      publishedAt: true,
      author: { select: { name: true } },
    },
  });
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
      publishedTime: post.publishedAt.toISOString(),
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

  const post = await db.blogPost.findUnique({
    where: { slug },
    include: {
      category: true,
      author: { select: { id: true, name: true, image: true, bio: true } },
      tags: true,
    },
  });

  if (!post || post.status !== "PUBLISHED") notFound();

  // Fire-and-forget view increment
  db.blogPost
    .update({ where: { id: post.id }, data: { views: { increment: 1 } } })
    .catch(() => {
      /* swallow — view tracking is best-effort */
    });

  // Related posts (same category, exclude current, limit 3)
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
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
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
              ...(post.category
                ? [{ label: post.category.name, href: `/blog?category=${post.category.slug}` }]
                : []),
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
          <div className="grid gap-8 lg:grid-cols-[1fr_240px]">
            <article className="min-w-0">
              {/* Article content — professional long-form typography */}
              <div
                className="
                  max-w-none text-[16px] leading-7 text-foreground/90

                  /* Headings */
                  [&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:scroll-mt-24
                  [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:border-b [&_h2]:pb-2 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:scroll-mt-24
                  [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:scroll-mt-24
                  [&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:scroll-mt-24

                  /* Paragraphs & inline text */
                  [&_p]:my-4 [&_p]:leading-7
                  [&_strong]:font-semibold [&_strong]:text-foreground
                  [&_em]:italic
                  [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary/80

                  /* Lists */
                  [&_ul]:my-5 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-2
                  [&_ol]:my-5 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-2
                  [&_li]:leading-7
                  [&_li>ul]:mt-2 [&_li>ol]:mt-2

                  /* Blockquotes */
                  [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:bg-muted/40 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground

                  /* Inline & block code */
                  [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]
                  [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:bg-muted/60 [&_pre]:p-4 [&_pre]:text-sm
                  [&_pre_code]:bg-transparent [&_pre_code]:p-0

                  /* Images */
                  [&_img]:my-6 [&_img]:rounded-xl [&_img]:border [&_img]:shadow-sm
                  [&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-muted-foreground

                  /* Horizontal rule */
                  [&_hr]:my-10 [&_hr]:border-border

                  /* Tables — styled as clean data cards, e.g. salary/comparison tables */
                  [&_table]:my-8 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:rounded-xl [&_table]:border [&_table]:shadow-sm
                  [&_table]:[border-collapse:separate] [&_table]:[border-spacing:0]
                  [&_thead]:bg-muted/70
                  [&_th]:whitespace-nowrap [&_th]:border-b [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold [&_th]:text-foreground
                  [&_td]:border-b [&_td]:px-4 [&_td]:py-3 [&_td]:text-sm [&_td]:text-foreground/90
                  [&_tbody_tr:last-child_td]:border-b-0
                  [&_tbody_tr:nth-child(even)]:bg-muted/20
                  hover:[&_tbody_tr]:bg-primary/5
                "
              >
                <MarkdownContent content={post.content} />
              </div>

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

              {/* Author bio card */}
              {post.author?.name && (
                <div className="mt-10 flex items-start gap-4 rounded-xl border bg-card p-5 shadow-sm">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                    {post.author.name[0]?.toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Written by {post.author.name}
                    </p>
                    {post.author.bio && (
                      <p className="mt-1 text-sm text-muted-foreground">{post.author.bio}</p>
                    )}
                  </div>
                </div>
              )}

              <Separator className="my-8" />

              {/* Back link + share */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button asChild variant="outline">
                  <Link href="/blog">
                    <ArrowLeft className="h-4 w-4" /> Back to all articles
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="gap-1.5 text-muted-foreground">
                  <Link href={`/blog/${slug}#top`}>
                    <Share2 className="h-4 w-4" /> Share this article
                  </Link>
                </Button>
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div className="mt-14">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                    <BookOpen className="h-5 w-5 text-primary" /> Related articles
                  </h2>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {related.map((r) => (
                      <Card key={r.id} className="card-hover flex flex-col overflow-hidden">
                        {r.coverImage && (
                          <div className="aspect-video overflow-hidden bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={r.coverImage}
                              alt={r.title}
                              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
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
                    <nav className="mt-3 space-y-1 border-l pl-3">
                      {toc.map((h) => (
                        <a
                          key={h.id}
                          href={`#${h.id}`}
                          className={
                            h.level && h.level > 2
                              ? "block rounded px-2 py-1 pl-3 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              : "block rounded px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          }
                        >
                          {h.text}
                        </a>
                      ))}
                    </nav>
                  </div>

                  {/* Quick stats card */}
                  <div className="mt-4 rounded-xl border bg-card p-4 text-sm shadow-sm">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-muted-foreground">Read time</span>
                      <span className="font-medium">{post.readTimeMin} min</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-muted-foreground">Views</span>
                      <span className="font-medium">{formatNumber(post.views + 1)}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-muted-foreground">Published</span>
                      <span className="font-medium">{formatDate(post.publishedAt)}</span>
                    </div>
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