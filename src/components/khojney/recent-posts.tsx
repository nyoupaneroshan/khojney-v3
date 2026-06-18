import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RecentPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  readTimeMin: number;
  views: number;
  publishedAt: Date;
  category: { name: string; slug: string } | null;
  author: { name: string | null } | null;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}

export function RecentPosts({ posts }: { posts: RecentPost[] }) {
  if (!posts.length) return null;
  const [featured, ...rest] = posts;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container-app">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">From the Blog</h2>
            <p className="mt-2 text-muted-foreground">Guides, exam tips, and career advice for Nepali students.</p>
          </div>
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/blog">All articles <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Featured post */}
          <Card className="card-hover overflow-hidden flex flex-col">
            {featured.coverImage && (
              <div className="aspect-video overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader className="pb-3">
              {featured.category && (
                <Badge variant="secondary" className="w-fit text-xs">{featured.category.name}</Badge>
              )}
              <h3 className="text-2xl font-bold leading-tight mt-2">
                <Link href={`/blog/${featured.slug}`} className="hover:text-primary">
                  {featured.title}
                </Link>
              </h3>
            </CardHeader>
            <CardContent className="flex-1">
              {featured.excerpt && <p className="text-muted-foreground line-clamp-3">{featured.excerpt}</p>}
              <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                {featured.author?.name && <span>By {featured.author.name}</span>}
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(featured.publishedAt)}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {featured.readTimeMin} min read</span>
              </div>
            </CardContent>
          </Card>

          {/* Rest of posts */}
          <div className="flex flex-col gap-4">
            {rest.slice(0, 4).map((p) => (
              <Card key={p.id} className="card-hover overflow-hidden">
                <div className="flex gap-4 p-4">
                  {p.coverImage && (
                    <div className="hidden sm:block w-32 h-24 shrink-0 overflow-hidden rounded-md bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {p.category && (
                      <Badge variant="outline" className="text-xs mb-1">{p.category.name}</Badge>
                    )}
                    <h4 className="font-semibold leading-snug line-clamp-2">
                      <Link href={`/blog/${p.slug}`} className="hover:text-primary">
                        {p.title}
                      </Link>
                    </h4>
                    {p.excerpt && <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{p.excerpt}</p>}
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(p.publishedAt)}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.readTimeMin} min</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
