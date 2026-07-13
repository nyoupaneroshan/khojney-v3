import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { getSession } from "@/lib/auth-server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbNav } from "@/components/khojney/breadcrumb-nav";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileQuestion, Clock, Trophy, BookOpen } from "lucide-react";
import { getCachedPublishedExams, getCachedExamCategories } from "@/lib/cache";

export const revalidate = 3600; // ISR: 1 hour

export const metadata: Metadata = {
  title: "Free Mock Exams & Online Practice Tests in Nepal | Khojney",
  description:
    "Take free online mock exams in Nepal. IOE, CEE, CMAT, Loksewa, driving license, banking, and more. Real exam pattern, instant scoring, detailed explanations. Start practicing now.",
  alternates: { canonical: "/mock-exams" },
  openGraph: {
    title: "Free Mock Exams & Online Practice Tests in Nepal | Khojney",
    description:
      "Take free online mock exams in Nepal. IOE, CEE, CMAT, Loksewa, driving license, banking, and more. Real exam pattern, instant scoring, detailed explanations.",
    url: "/mock-exams",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Mock Exams & Online Practice Tests in Nepal | Khojney",
    description:
      "Take free online mock exams in Nepal. IOE, CEE, CMAT, Loksewa, driving license, banking, and more.",
  },
};

export default async function MockExamsLandingPage() {
  const user = await getSession();

  // Use cached queries — DB is only hit on cache miss (every 5 min for exams,
  // every 1 hour for categories). Subsequent page loads serve from cache.
  const [exams, categories] = await Promise.all([
    getCachedPublishedExams(),
    getCachedExamCategories(),
  ]);

  // Group exams by category
  const examsByCategory = new Map<string, typeof exams>();
  for (const exam of exams) {
    const catId = exam.categoryId ?? "uncategorized";
    if (!examsByCategory.has(catId)) examsByCategory.set(catId, []);
    examsByCategory.get(catId)!.push(exam);
  }

  return (
    <AppShell user={user}>
      <div className="container-app pt-4">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Mock Exams" },
          ]}
        />
      </div>

      <section className="py-12 md:py-16">
        <div className="container-app text-center max-w-4xl mx-auto">
          <Badge className="mb-4" variant="secondary">100% Free</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Free Mock Exams & Online Practice Tests in Nepal
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Prepare for your entrance exams, Loksewa, driving license, and banking exams with our
            free online mock tests. Real exam patterns, instant scoring, and detailed explanations.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <FileQuestion className="h-4 w-4" /> 500+ Questions
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> Timed Practice
            </span>
            <span className="flex items-center gap-1.5">
              <Trophy className="h-4 w-4" /> Instant Results
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" /> Detailed Explanations
            </span>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-app space-y-12">
          {categories.map((category) => {
            const categoryExams = examsByCategory.get(category.id) ?? [];
            if (categoryExams.length === 0) return null;
            return (
              <div key={category.id}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">{category.name}</h2>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    )}
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/mock-exams/${category.slug}`}>
                      View all <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryExams.slice(0, 6).map((exam) => (
                    <Card key={exam.id} className="card-hover flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base leading-snug">
                            <Link
                              href={`/mock-exams/${category.slug}/${exam.slug}`}
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
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
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
                          <Link href={`/mock-exams/${category.slug}/${exam.slug}`}>
                            Start Mock Exam
                            <ArrowRight className="ml-1 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="container-app max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight mb-6">
            Why Take Mock Exams on Khojney?
          </h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p>
              Khojney is Nepal&apos;s largest free platform for mock exams and online practice tests.
              Whether you&apos;re preparing for the IOE engineering entrance, CEE medical entrance,
              CMAT management admission test, Loksewa Aayog exams, or your driving license written
              test, we have comprehensive mock tests designed to match the real exam pattern.
            </p>
            <p>
              Our mock exams feature real exam-style questions, timed practice sessions, instant
              scoring, and detailed explanations for every question. You can practice unlimited times,
              track your progress, and identify weak areas before the actual exam. All tests are
              completely free — no registration fee, no hidden charges, no subscription required.
            </p>
            <p>
              Taking regular mock tests is the single most effective way to improve your exam
              performance. Mock tests help you master time management, build exam temperament, reduce
              anxiety, and identify areas where you need more preparation. Start your exam preparation
              journey with Khojney today.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
