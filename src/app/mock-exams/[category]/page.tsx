import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getSession } from "@/lib/auth-server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbNav } from "@/components/khojney/breadcrumb-nav";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileQuestion, Clock, Trophy } from "lucide-react";
import { getCachedExamCategories, getCachedPublishedExams } from "@/lib/cache";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  // Use cached exam categories instead of hitting DB directly.
  const categories = await getCachedExamCategories();
  const cat = categories.find((c) => c.slug === category);
  if (!cat) return { title: "Mock Exams Not Found" };

  const title = `${cat.name} Mock Exams — Free Online Practice Tests | Khojney`;
  const description = cat.description ?? `Free ${cat.name} mock exams and online practice tests. Real exam pattern, instant scoring, detailed explanations.`;

  return {
    title,
    description,
    alternates: { canonical: `/mock-exams/${category}` },
    openGraph: { title, description, url: `/mock-exams/${category}`, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryLandingPage({ params }: PageProps) {
  const { category } = await params;
  const user = await getSession();

  // Use cached exam categories.
  const categories = await getCachedExamCategories();
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();

  // Use cached published exams + filter by category in memory.
  const allExams = await getCachedPublishedExams();
  const exams = allExams.filter((e) => e.categoryId === cat.id);

  if (exams.length === 0) {
    return (
      <AppShell user={user}>
        <div className="container-app py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">No mock exams found in {cat.name}</h1>
          <p className="text-muted-foreground mb-6">
            We&apos;re working on adding mock exams for this category. Check back soon!
          </p>
          <Button asChild>
            <Link href="/mock-exams">Browse all mock exams</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  // JSON-LD: BreadcrumbList + ItemList
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${cat.name} Mock Exams`,
    itemListElement: exams.map((exam, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: exam.title,
      url: `/mock-exams/${cat.slug}/${exam.slug}`,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Mock Exams", item: "/mock-exams" },
      { "@type": "ListItem", position: 3, name: cat.name, item: `/mock-exams/${cat.slug}` },
    ],
  };

  return (
    <AppShell user={user}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="container-app pt-4">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Mock Exams", href: "/mock-exams" },
            { label: cat.name },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16">
        <div className="container-app max-w-4xl">
          <Badge className="mb-4" variant="secondary">
            {exams.length} {exams.length === 1 ? "Mock Exam" : "Mock Exams"} Available
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {cat.name} Mock Exams — Free Online Practice
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {cat.description ?? `Prepare for your ${cat.name} exams with our free online mock tests. Real exam pattern, instant scoring, and detailed explanations.`}
          </p>
        </div>
      </section>

      {/* Exam Cards */}
      <section className="pb-16">
        <div className="container-app">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <Card key={exam.id} className="card-hover flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">
                      <Link
                        href={`/mock-exams/${cat.slug}/${exam.slug}`}
                        className="hover:text-primary"
                      >
                        {exam.title}
                      </Link>
                    </CardTitle>
                    {exam.isFeatured && (
                      <Badge variant="default" className="shrink-0 text-xs">Featured</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3 flex-1">
                    {exam.heroDescription ?? exam.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <FileQuestion className="h-3 w-3" />
                      {exam._count.children > 0 ? `${exam._count.children} sets` : `${exam._count.questions} Q`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />{exam.durationMin} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />{exam.totalMarks} marks
                    </span>
                  </div>
                  <Button asChild size="sm" className="w-full">
                    <Link href={`/mock-exams/${cat.slug}/${exam.slug}`}>
                      Start Mock Exam
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
