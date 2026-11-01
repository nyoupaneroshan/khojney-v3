import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, Eye, ArrowLeft, Newspaper, ShieldCheck, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { BreadcrumbNav } from "@/components/khojney/breadcrumb-nav";
import { EntityBadge } from "@/components/khojney/entity-badge";
import { JsonLd } from "@/components/khojney/json-ld";
import { MarkdownContent } from "@/components/khojney/markdown-content";
import { extractTocHeadings } from "@/components/khojney/toc";
import { BlogArticleShell } from "@/components/khojney/blog-article-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate, formatNumber } from "@/components/khojney/format";
import { getCachedBlogPostBySlug } from "@/lib/cache";

export const revalidate = 300; // ISR: 5 minutes

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
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

  const post = await getCachedBlogPostBySlug(slug);
  if (!post || post.status !== "PUBLISHED") notFound();

  // Fire-and-forget view increment (write through to DB)
  db.blogPost
    .update({ where: { id: post.id }, data: { views: { increment: 1 } } })
    .catch(() => {});

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

  const authorName = post.author?.name || "Khojney Editorial Team";

  return (
    <AppShell user={user}>
      <JsonLd data={jsonLd} />

      {/* Editorial Header (Left-anchored, high authority) */}
      <header className="border-b border-border/80 bg-muted/20 py-10 md:py-14">
        <div className="container-app">
          <BreadcrumbNav
            className="mb-6"
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              ...(post.category ? [{ label: post.category.name, href: `/blog?category=${post.category.slug}` }] : []),
              { label: post.title },
            ]}
          />

          <div className="max-w-4xl text-left">
            {/* Category Pill & Verification Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {post.category && (
                <Link
                  href={`/blog?category=${post.category.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                >
                  <Newspaper className="h-3.5 w-3.5" /> {post.category.name}
                </Link>
              )}
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/30 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" /> Fact-Checked Guide
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-foreground leading-[1.18]">
              {post.title}
            </h1>

            {/* Editorial Byline & Metadata Strip */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border/60 pt-4 text-xs sm:text-sm text-muted-foreground">
              {/* Author */}
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-xs">
                  {authorName[0]?.toUpperCase()}
                </span>
                <div>
                  <span className="text-foreground font-semibold block">{authorName}</span>
                  <span className="text-[11px] text-muted-foreground block">Education & Entrance Specialist</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  {post.readTimeMin} min read
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  {formatNumber(post.views + 1)} views
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Reading Canvas */}
      <section className="py-10 md:py-14">
        <div className="container-app">
          {/* Executive Summary / Key Takeaways Box (Anti-AI-Slop & Inverted Pyramid) */}
          {post.excerpt && (
            <div className="mb-10 max-w-4xl rounded-xl border border-primary/20 bg-primary/[0.03] p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2 pb-2 text-xs font-bold uppercase tracking-wider text-primary">
                <CheckCircle2 className="h-4 w-4" /> Executive Summary & Key Takeaways
              </div>
              <p className="mt-1 text-sm sm:text-base leading-relaxed text-foreground/90 font-medium">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Cover Image (Editorial framing with subtle border) */}
          {post.coverImage && (
            <div className="mb-10 max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <img
                src={post.coverImage}
                alt={post.title}
                className="aspect-video w-full object-cover max-h-[480px]"
              />
            </div>
          )}

          {/* Shell with Interactive Reading Progress and Sticky TOC */}
          <BlogArticleShell toc={toc} title={post.title}>
            {/* The Article Markdown */}
            <MarkdownContent content={post.content} />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap items-center gap-2 pt-6 border-t border-border">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">
                  Topics:
                </span>
                {post.tags.map((t) => (
                  <Link
                    key={t.id}
                    href={`/blog?tag=${t.slug}`}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground hover:border-primary/50 hover:bg-muted transition-colors"
                  >
                    #{t.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Institutional Trust & Fact-Checking Disclaimer Card (Google E-E-A-T) */}
            <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="space-y-1.5 text-xs sm:text-sm">
                  <h3 className="font-bold text-foreground text-base">Editorial Integrity & Verification Standards</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    This guide has been prepared by Khojney's academic research staff and cross-referenced with official curriculum notifications from Loksewa Aayog, Institute of Engineering (IOE Pulchowk), and Tribhuvan University.
                  </p>
                  <p className="text-[12px] text-muted-foreground pt-1">
                    Have an updated syllabus, fee notice, or correction? Contact our editorial desk at <a href="mailto:editorial@khojney.com" className="text-primary underline">editorial@khojney.com</a>.
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Blog Button */}
            <div className="mt-10 flex justify-start">
              <Button asChild variant="outline" size="sm">
                <Link href="/blog">
                  <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to all articles
                </Link>
              </Button>
            </div>

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="mt-14 pt-10 border-t border-border">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Related Guides & Articles</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Explore related preparation strategies and syllabus updates.</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/blog">View all</Link>
                  </Button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((r) => (
                    <Card key={r.id} className="card-hover flex flex-col overflow-hidden border border-border bg-card">
                      {r.coverImage && (
                        <div className="aspect-video overflow-hidden bg-muted">
                          <img
                            src={r.coverImage}
                            alt={r.title}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        {r.category && <EntityBadge variant="outline" value={r.category.name} />}
                        <h3 className="mt-2 text-sm font-bold leading-snug">
                          <Link href={`/blog/${r.slug}`} className="line-clamp-2 hover:text-primary transition-colors">
                            {r.title}
                          </Link>
                        </h3>
                      </CardHeader>
                      <CardContent className="mt-auto pb-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {formatDate(r.publishedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {r.readTimeMin} min read
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </BlogArticleShell>
        </div>
      </section>
    </AppShell>
  );
}
