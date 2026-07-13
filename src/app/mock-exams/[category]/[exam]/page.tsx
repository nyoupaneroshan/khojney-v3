import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getSession } from "@/lib/auth-server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbNav } from "@/components/khojney/breadcrumb-nav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  FileQuestion,
  Clock,
  Trophy,
  Target,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Award,
  Zap,
  Smartphone,
  Repeat,
  TrendingUp,
} from "lucide-react";
import { parseJsonArray } from "@/components/khojney/format";
import {
  getCachedExamCategories,
  getCachedExamForLanding,
  getCachedRelatedExams,
  getCachedExamChildSets,
} from "@/lib/cache";

export const revalidate = 300; // ISR: 5 minutes

interface PageProps {
  params: Promise<{ category: string; exam: string }>;
}

// ─── Helpers ────────────────────────────────────────────────────

function parseFaqs(json: string | null | undefined): Array<{ question: string; answer: string }> {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is { question: string; answer: string } =>
        typeof item === "object" &&
        item !== null &&
        typeof item.question === "string" &&
        typeof item.answer === "string"
    );
  } catch {
    return [];
  }
}

function parseBenefits(json: string | null | undefined): string[] {
  return parseJsonArray<string>(json);
}

function parseRelatedResources(
  json: string | null | undefined
): Array<{ title: string; url: string }> {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is { title: string; url: string } =>
        typeof item === "object" &&
        item !== null &&
        typeof item.title === "string" &&
        typeof item.url === "string"
    );
  } catch {
    return [];
  }
}

// ─── Metadata ───────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, exam } = await params;

  // Use cached queries — no DB hit on cache hit.
  const examRecord = await getCachedExamForLanding(exam);
  if (!examRecord) return { title: "Mock Exam Not Found" };

  const title = examRecord.seoTitle ?? `${examRecord.title} — Free Online Mock Test | Khojney`;
  const description =
    examRecord.seoDescription ??
    examRecord.heroDescription ??
    examRecord.description.slice(0, 155);

  return {
    title,
    description,
    keywords: examRecord.keywords ?? undefined,
    alternates: { canonical: examRecord.canonicalUrl ?? `/mock-exams/${category}/${exam}` },
    openGraph: {
      title,
      description,
      url: `/mock-exams/${category}/${exam}`,
      images: examRecord.featuredImage ? [{ url: examRecord.featuredImage }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: examRecord.featuredImage ? [examRecord.featuredImage] : undefined,
    },
  };
}

// ─── Page Component ─────────────────────────────────────────────

export default async function ExamLandingPage({ params }: PageProps) {
  const { category, exam } = await params;
  const user = await getSession();

  // Use cached queries — DB is only hit on cache miss.
  // getCategory comes from the cached exam categories list.
  const [categories, examRecord] = await Promise.all([
    getCachedExamCategories(),
    getCachedExamForLanding(exam),
  ]);

  const cat = categories.find((c) => c.slug === category);
  if (!cat || !examRecord) notFound();

  // Fetch related exams (same category, different slug) — cached.
  const relatedExams = examRecord.categoryId
    ? await getCachedRelatedExams(examRecord.categoryId, examRecord.slug)
    : [];

  // Fetch child sets if this is a parent — cached.
  const childSets = examRecord.isParent
    ? await getCachedExamChildSets(examRecord.id)
    : [];

  // Parse JSON fields
  const faqs = parseFaqs(examRecord.faqs);
  const benefits = parseBenefits(examRecord.benefits);
  const relatedResources = parseRelatedResources(examRecord.relatedResources);
  const instructions = examRecord.instructions
    ? parseJsonArray<string>(examRecord.instructions)
    : [];

  const heroTitle = examRecord.heroTitle ?? examRecord.title;
  const heroDescription =
    examRecord.heroDescription ?? examRecord.description;
  const ctaText = examRecord.ctaText ?? "Start Free Mock Exam";
  const canonicalUrl = examRecord.canonicalUrl ?? `/mock-exams/${category}/${exam}`;

  const canStartDirectly =
    !examRecord.isParent && examRecord._count.questions > 0;

  // ─── JSON-LD Schemas ─────────────────────────────────────────

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Mock Exams", item: "/mock-exams" },
      { "@type": "ListItem", position: 3, name: cat.name, item: `/mock-exams/${cat.slug}` },
      { "@type": "ListItem", position: 4, name: heroTitle, item: canonicalUrl },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: heroTitle,
    description: examRecord.seoDescription ?? heroDescription.slice(0, 155),
    url: canonicalUrl,
    isPartOf: { "@type": "WebSite", name: "Khojney", url: "/" },
    about: { "@type": "Thing", name: examRecord.title },
  };

  const faqJsonLd =
    faqs.length > 0 ?
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Khojney",
    url: "/",
    logo: "/logo.png",
    description: "Nepal's information, education, and resource ecosystem platform.",
  };

  // ─── Render ──────────────────────────────────────────────────

  return (
    <AppShell user={user}>
      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      {/* Breadcrumb */}
      <div className="container-app pt-4">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Mock Exams", href: "/mock-exams" },
            { label: cat.name, href: `/mock-exams/${cat.slug}` },
            { label: heroTitle },
          ]}
        />
      </div>

      {/* ─── Hero Section ─────────────────────────────────────── */}
      <section className="py-10 md:py-14">
        <div className="container-app max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="secondary">{cat.name}</Badge>
            <Badge variant="outline">{examRecord.difficulty}</Badge>
            {examRecord.isFeatured && <Badge>Featured</Badge>}
            <Badge variant="outline" className="text-emerald-600 border-emerald-200">100% Free</Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            {heroTitle}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
            {heroDescription}
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-3">
            {canStartDirectly ? (
              <Button asChild size="lg" className="text-base h-12 px-8">
                <Link href={`/exams/${examRecord.slug}/take`}>
                  <Zap className="mr-2 h-5 w-5" />
                  {ctaText}
                </Link>
              </Button>
            ) : childSets.length > 0 ? (
              <Button asChild size="lg" className="text-base h-12 px-8">
                <Link href="#exam-sets">
                  <Zap className="mr-2 h-5 w-5" />
                  Browse Exam Sets
                </Link>
              </Button>
            ) : null}
            <Button asChild size="lg" variant="outline" className="text-base h-12 px-6">
              <Link href="#about-exam">
                <BookOpen className="mr-2 h-5 w-5" />
                About This Exam
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Exam Feature Cards ──────────────────────────────── */}
      <section className="pb-10">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-5 text-center">
                <FileQuestion className="h-6 w-6 mx-auto text-primary mb-2" />
                <div className="text-2xl font-bold">
                  {examRecord._count.children > 0 ? examRecord._count.children : examRecord._count.questions}
                </div>
                <div className="text-xs text-muted-foreground">
                  {examRecord._count.children > 0 ? "Exam Sets" : "Questions"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 text-center">
                <Clock className="h-6 w-6 mx-auto text-primary mb-2" />
                <div className="text-2xl font-bold">{examRecord.durationMin}</div>
                <div className="text-xs text-muted-foreground">Minutes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 text-center">
                <Trophy className="h-6 w-6 mx-auto text-primary mb-2" />
                <div className="text-2xl font-bold">{examRecord.totalMarks}</div>
                <div className="text-xs text-muted-foreground">Total Marks</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 text-center">
                <Target className="h-6 w-6 mx-auto text-primary mb-2" />
                <div className="text-2xl font-bold">
                  {examRecord.passingMarks ?? Math.round(examRecord.totalMarks * 0.4)}
                </div>
                <div className="text-xs text-muted-foreground">Pass Marks</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Why Take This Mock Exam? ────────────────────────── */}
      {benefits.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container-app max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 text-center">
              Why Take This Mock Exam?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, idx) => {
                const icons = [
                  <Target key="0" className="h-5 w-5" />,
                  <Clock key="1" className="h-5 w-5" />,
                  <TrendingUp key="2" className="h-5 w-5" />,
                  <Zap key="3" className="h-5 w-5" />,
                  <Smartphone key="4" className="h-5 w-5" />,
                  <Repeat key="5" className="h-5 w-5" />,
                  <Award key="6" className="h-5 w-5" />,
                  <CheckCircle2 key="7" className="h-5 w-5" />,
                ];
                return (
                  <Card key={idx} className="border-0 shadow-sm">
                    <CardContent className="pt-5 flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                        {icons[idx % icons.length]}
                      </div>
                      <p className="text-sm font-medium pt-1.5">{benefit}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── About This Exam (SEO Content) ───────────────────── */}
      {examRecord.seoContent && (
        <section id="about-exam" className="py-12 md:py-16">
          <div className="container-app max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
              About the {examRecord.title}
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              {examRecord.seoContent.split("\n").map((line, idx) => {
                const trimmed = line.trim();
                if (!trimmed) return null;
                if (trimmed.startsWith("### ")) {
                  return (
                    <h3 key={idx} className="text-xl font-semibold text-foreground mt-6 mb-3">
                      {trimmed.slice(4)}
                    </h3>
                  );
                }
                if (trimmed.startsWith("## ")) {
                  return (
                    <h2 key={idx} className="text-2xl font-semibold text-foreground mt-8 mb-4">
                      {trimmed.slice(3)}
                    </h2>
                  );
                }
                if (trimmed.startsWith("# ")) {
                  return (
                    <h2 key={idx} className="text-2xl font-semibold text-foreground mt-8 mb-4">
                      {trimmed.slice(2)}
                    </h2>
                  );
                }
                if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                  return (
                    <li key={idx} className="ml-6 mb-1">
                      {trimmed.slice(2)}
                    </li>
                  );
                }
                return (
                  <p key={idx} className="mb-4 leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── Instructions ────────────────────────────────────── */}
      {instructions.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container-app max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
              Exam Instructions
            </h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {instructions.map((inst, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            {examRecord.negativeMarking && (
              <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-900">Negative Marking Applies</p>
                  <p className="text-amber-700 mt-1">
                    {examRecord.negativeMarkValue} marks will be deducted for each wrong answer.
                    Attempt carefully.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── CTA Banner ──────────────────────────────────────── */}
      {canStartDirectly && (
        <section className="py-12 md:py-16">
          <div className="container-app max-w-4xl">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
              <CardContent className="pt-8 pb-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                  Ready to Test Your Knowledge?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Start your free mock exam now. Get instant results, detailed explanations, and
                  performance analysis.
                </p>
                <Button asChild size="lg" className="text-base h-12 px-10">
                  <Link href={`/exams/${examRecord.slug}/take`}>
                    <Zap className="mr-2 h-5 w-5" />
                    {ctaText}
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  No registration required • Instant results • 100% free
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* ─── Exam Sets (if parent) ───────────────────────────── */}
      {childSets.length > 0 && (
        <section id="exam-sets" className="py-12 bg-muted/30">
          <div className="container-app max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Available Exam Sets
            </h2>
            <p className="text-muted-foreground mb-8">
              Choose a set to start practicing. Each set has unique questions.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {childSets.map((set) => (
                <Card key={set.id} className="card-hover flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{set.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
                      {set.description}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <FileQuestion className="h-3 w-3" />{set._count.questions} Q
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />{set.durationMin} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" />{set.totalMarks} marks
                      </span>
                    </div>
                    <Button asChild size="sm" className="w-full">
                      <Link href={`/exams/${set.slug}/take`}>
                        Start Set
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FAQ Section ─────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container-app max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left text-base font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* ─── Related Mock Exams ──────────────────────────────── */}
      {relatedExams.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container-app max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Related Mock Exams
            </h2>
            <p className="text-muted-foreground mb-8">
              More practice tests in {cat.name}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedExams.map((rel) => (
                <Card key={rel.id} className="card-hover flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm leading-snug">
                      <Link
                        href={`/mock-exams/${cat.slug}/${rel.slug}`}
                        className="hover:text-primary"
                      >
                        {rel.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
                      {rel.description}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <FileQuestion className="h-3 w-3" />
                        {rel._count.children > 0 ? `${rel._count.children} sets` : `${rel._count.questions} Q`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />{rel.durationMin} min
                      </span>
                    </div>
                    <Button asChild size="sm" variant="outline" className="w-full">
                      <Link href={`/mock-exams/${cat.slug}/${rel.slug}`}>
                        View Details
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Related Resources ───────────────────────────────── */}
      {relatedResources.length > 0 && (
        <section className="py-12">
          <div className="container-app max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Related Resources</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedResources.map((res, idx) => (
                <Link
                  key={idx}
                  href={res.url}
                  className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <BookOpen className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">{res.title}</span>
                  <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Separator className="my-0" />

      {/* ─── Final CTA ───────────────────────────────────────── */}
      <section className="py-12">
        <div className="container-app text-center max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight mb-3">
            Start Your Exam Preparation Today
          </h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of Nepali students using Khojney for free exam preparation.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/mock-exams">Browse All Mock Exams</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/blog">Read Study Guides</Link>
            </Button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
