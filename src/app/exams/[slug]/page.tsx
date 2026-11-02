import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BreadcrumbNav } from "@/components/khojney/breadcrumb-nav";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Clock,
  FileText,
  Trophy,
  Users,
  Target,
  BarChart3,
  Medal,
  History,
  Play,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Zap,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 300; // ISR: 5 minutes for performance & instant caching

interface Params {
  slug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const exam = await db.exam.findUnique({
    where: { slug },
    select: {
      title: true,
      description: true,
      durationMin: true,
      totalMarks: true,
      difficulty: true,
      examType: true,
      category: { select: { name: true } },
      _count: { select: { questions: true } },
    },
  });

  if (!exam) {
    return { title: "Exam Not Found | Khojney" };
  }

  const title = `${exam.title} — Free Online Mock Test & Practice Nepal | Khojney`;
  const description =
    `Take ${exam.title} online for free. ${exam._count.questions > 0 ? `${exam._count.questions} questions, ` : ""}${exam.durationMin} mins, instant scorecard, Nepal syllabus questions & step-by-step explanations. 100% Free entrance preparation.`;

  return {
    title,
    description,
    keywords: [
      `${exam.title} mock test`,
      `${exam.title} practice questions nepal`,
      `${exam.title} online exam free`,
      "entrance exam preparation nepal",
      "free mock test nepal",
      "khojney exam",
    ],
    alternates: { canonical: `/exams/${slug}` },
    openGraph: {
      title,
      description,
      url: `/exams/${slug}`,
      type: "website",
      siteName: "Khojney",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ExamDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const user = await getSession();

  const exam = await db.exam.findUnique({
    where: { slug, isPublished: true },
    include: {
      category: true,
      questions: { orderBy: { order: "asc" } },
      children: {
        where: { isPublished: true },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        include: {
          _count: { select: { questions: true, attempts: true } },
          children: {
            where: { isPublished: true },
            select: { id: true, slug: true, title: true, _count: { select: { questions: true } } },
          },
        },
      },
    },
  });

  if (!exam) notFound();

  // If this is a parent exam (has children sets or faculty branches), render parent overview
  if (exam.isParent && exam.children.length > 0) {
    const totalChildSets = exam.children.reduce((acc, c) => {
      return acc + (c.children.length > 0 ? c.children.length : 1);
    }, 0);

    return (
      <AppShell user={user}>
        {/* Breadcrumb + hero */}
        <div className="border-b border-border/80 bg-gradient-to-b from-primary/5 via-muted/20 to-background">
          <div className="container-app py-8 md:py-12">
            <BreadcrumbNav
              className="mb-4"
              items={[
                { label: "Home", href: "/" },
                { label: "Exams", href: "/exams" },
                ...(exam.category ? [{ label: exam.category.name, href: `/exams?category=${exam.category.slug}` }] : []),
                { label: exam.title },
              ]}
            />
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 shadow-2xs">
                <FileText className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant="secondary" className="font-semibold text-xs">
                    {exam.category?.name ?? "Entrance & Licensing"}
                  </Badge>
                  <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10 text-xs">
                    100% Free
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {totalChildSets} Mock Test Sets
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">{exam.title}</h1>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">{exam.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Child exam sets */}
        <section className="py-10 md:py-14">
          <div className="container-app">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Available Mock Test Series</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Choose a practice set below. Every set includes timed simulation, real exam questions, and full solutions.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {exam.children.map((child, idx) => {
                const isSubParent = child.children.length > 0;
                const effectiveQCount = isSubParent
                  ? child.children.reduce((acc, gc) => acc + gc._count.questions, 0)
                  : child._count.questions;
                const targetHref = isSubParent ? `/exams/${child.slug}` : `/exams/${child.slug}/take`;

                return (
                  <Card key={child.id} className="card-hover flex flex-col justify-between border-border/80 shadow-xs">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <Badge variant="outline" className="text-[11px] font-semibold">
                          {isSubParent ? "Category Branch" : `Set ${idx + 1}`}
                        </Badge>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          child.difficulty === "EASY" ? "bg-emerald-500/10 text-emerald-600" :
                          child.difficulty === "HARD" ? "bg-rose-500/10 text-rose-600" :
                          "bg-amber-500/10 text-amber-600"
                        }`}>
                          {child.difficulty}
                        </span>
                      </div>
                      <CardTitle className="text-base font-bold leading-snug">
                        <Link href={`/exams/${child.slug}`} className="hover:text-primary transition-colors">
                          {child.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-xs line-clamp-2">
                        {child.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-3">
                      <div className="grid grid-cols-3 gap-2 text-xs text-center">
                        <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50 border border-border/40">
                          <Clock className="h-3.5 w-3.5 text-primary mb-1" />
                          <span className="font-bold">{child.durationMin}m</span>
                        </div>
                        <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50 border border-border/40">
                          <FileText className="h-3.5 w-3.5 text-primary mb-1" />
                          <span className="font-bold">{isSubParent ? `${child.children.length} Sets` : `${effectiveQCount} Qs`}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50 border border-border/40">
                          <Trophy className="h-3.5 w-3.5 text-primary mb-1" />
                          <span className="font-bold">{child._count.attempts.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>

                    <div className="px-6 pb-4">
                      <Button asChild size="sm" className="w-full font-semibold shadow-xs">
                        <Link href={targetHref}>
                          {isSubParent ? (
                            <>Browse Sets <ArrowRight className="h-3.5 w-3.5 ml-1" /></>
                          ) : (
                            <><Play className="h-3.5 w-3.5 fill-current mr-1.5" /> Start Test Set</>
                          )}
                        </Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </AppShell>
    );
  }

  // Single playable test set:
  const [attemptCount, topAttempts, recentAttempts] = await Promise.all([
    db.examAttempt.count({
      where: { examId: exam.id, finishedAt: { not: null } },
    }),
    db.examAttempt.findMany({
      where: { examId: exam.id, finishedAt: { not: null } },
      orderBy: [{ score: "desc" }, { durationSec: "asc" }],
      take: 8,
      include: { user: { select: { name: true } } },
    }),
    db.examAttempt.findMany({
      where: { examId: exam.id, finishedAt: { not: null } },
      orderBy: { finishedAt: "desc" },
      take: 5,
      include: { user: { select: { name: true } } },
    }),
  ]);

  const difficultyColor: Record<string, string> = {
    EASY: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    MEDIUM: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    HARD: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };

  const examTypeLabel: Record<string, string> = {
    MOCK: "Mock Test",
    PRACTICE: "Practice",
    PREVIOUS_YEAR: "Previous Year",
  };

  // Google Quiz & Practice Problems JSON-LD Schema
  const quizJsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: exam.title,
    description: exam.description,
    timeRequired: `PT${exam.durationMin}M`,
    educationalLevel: exam.difficulty,
    learningResourceType: "Quiz",
    isAccessibleForFree: true,
    provider: {
      "@type": "Organization",
      name: "Khojney",
      url: "https://khojney.com",
    },
    hasPart: exam.questions.slice(0, 10).map((q) => {
      let options: string[] = [];
      try {
        options = JSON.parse(q.options);
      } catch {
        options = [];
      }
      return {
        "@type": "Question",
        eduQuestionType: "Multiple choice",
        text: q.question,
        suggestedAnswer: options.map((opt) => ({
          "@type": "Answer",
          text: opt,
        })),
      };
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://khojney.com/" },
      { "@type": "ListItem", position: 2, name: "Exams", item: "https://khojney.com/exams" },
      ...(exam.category
        ? [{ "@type": "ListItem", position: 3, name: exam.category.name, item: `https://khojney.com/exams?category=${exam.category.slug}` }]
        : []),
      { "@type": "ListItem", position: exam.category ? 4 : 3, name: exam.title, item: `https://khojney.com/exams/${slug}` },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is this ${exam.title} mock test free on Khojney?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, this mock test is 100% free with unlimited retakes, instant scoring, and complete step-by-step explanations.`,
        },
      },
      {
        "@type": "Question",
        name: `How much time is allowed for ${exam.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `You have ${exam.durationMin} minutes to answer ${exam.questions.length} multiple-choice questions. The test auto-submits when time expires.`,
        },
      },
      {
        "@type": "Question",
        name: `What are the passing marks for ${exam.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Passing marks are ${exam.passingMarks ? `${exam.passingMarks} marks (${Math.round((exam.passingMarks / exam.totalMarks) * 100)}%)` : "40%"} out of ${exam.totalMarks} total marks.`,
        },
      },
      {
        "@type": "Question",
        name: `Can I practice without signing in?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, anyone can take free practice mock tests on Khojney as a guest without signing in or creating an account.`,
        },
      },
    ],
  };

  return (
    <AppShell user={user}>
      {/* Structured data for Google SERP features */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

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
              <BreadcrumbLink asChild>
                <Link href="/exams">Exams</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {exam.category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/exams?category=${exam.category.slug}`}>{exam.category.name}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{exam.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="secondary">
              {examTypeLabel[exam.examType] ?? exam.examType}
            </Badge>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                difficultyColor[exam.difficulty] ?? difficultyColor.MEDIUM
              }`}
            >
              {exam.difficulty}
            </span>
            <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
              100% Free
            </Badge>
            {exam.category && (
              <Badge variant="outline">{exam.category.name}</Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {exam.title}
          </h1>
          <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">{exam.description}</p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat icon={<Clock className="h-4 w-4" />} label="Time Allowed" value={`${exam.durationMin} min`} />
            <Stat icon={<Trophy className="h-4 w-4" />} label="Total Marks" value={String(exam.totalMarks)} />
            <Stat icon={<FileText className="h-4 w-4" />} label="Questions" value={`${exam.questions.length} MCQs`} />
            <Stat icon={<Users className="h-4 w-4" />} label="Total Attempts" value={attemptCount.toLocaleString()} />
          </div>
        </section>

        {/* Dual-column: Exam Rules + One-Click Start */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" /> Exam Pattern &amp; Guidelines
              </CardTitle>
              <CardDescription>Everything you need to know before you click start.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 pt-4">
              <Row label="Total Questions" value={`${exam.questions.length} Multiple Choice`} />
              <Row label="Duration" value={`${exam.durationMin} minutes (Auto-submits)`} />
              <Row label="Marking per Question" value="1 Mark (Standard)" />
              <Row
                label="Passing Criteria"
                value={exam.passingMarks ? `${exam.passingMarks} Marks (${Math.round((exam.passingMarks / exam.totalMarks) * 100)}%)` : "40%"}
              />
              <Row
                label="Negative Marking"
                value={exam.negativeMarking ? `Yes (-${exam.negativeMarkValue} per wrong)` : "None (Attempt all questions!)"}
              />

              <div className="pt-3 border-t border-border/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-primary" /> Key Instructions
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li>Timed simulation starts as soon as the test opens.</li>
                  <li>Questions and options are randomized on every attempt.</li>
                  <li>Use the Question Navigator to flag questions you want to review.</li>
                  <li>Detailed answer explanations appear immediately upon completion.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Frictionless Instant Start Card */}
          <Card className="border-primary/40 bg-gradient-to-br from-primary/5 via-background to-primary/5 shadow-xs flex flex-col justify-between">
            <CardHeader className="pb-3 border-b border-border/40">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="font-semibold text-xs text-primary bg-primary/10">
                  <Zap className="h-3 w-3 fill-current mr-1" /> Instant Practice
                </Badge>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> No Payment Required
                </span>
              </div>
              <CardTitle className="text-xl font-bold flex items-center gap-2 pt-1 text-foreground">
                Ready to Test Your Knowledge?
              </CardTitle>
              <CardDescription className="text-xs">
                Start your practice test now. No barrier, no credit card, instant scorecard.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              <div className="rounded-xl border border-primary/20 bg-background/80 p-4 text-xs space-y-1.5">
                <p className="font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> Free &amp; Unrestricted Practice
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  You can jump right in as a guest, or login to save your scorecard and rank on Nepal&apos;s leaderboard.
                </p>
              </div>

              <Button asChild size="lg" className="w-full text-base font-bold shadow-md bg-primary hover:bg-primary/90 h-12">
                <Link href={`/exams/${exam.slug}/take`}>
                  <Play className="h-4 w-4 mr-2 fill-current" />
                  {user ? "Start Exam Now" : "Start Free Practice (Instant Mode)"}
                </Link>
              </Button>

              {!user ? (
                <div className="text-center text-xs text-muted-foreground pt-1">
                  Want to record your rank on the leaderboard?{" "}
                  <Link href={`/login?callbackUrl=/exams/${exam.slug}/take`} className="font-semibold text-primary hover:underline">
                    Log in
                  </Link>{" "}
                  or{" "}
                  <Link href="/login?mode=register" className="font-semibold text-primary hover:underline">
                    Create free account
                  </Link>
                </div>
              ) : (
                <p className="text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Logged in as {user.name ?? user.email} • Result will sync to your dashboard
                </p>
              )}
            </CardContent>

            <div className="p-4 bg-muted/30 border-t border-border/40 text-[11px] text-muted-foreground text-center rounded-b-xl">
              ⚡ Instant scoring • Complete solutions • Verified Nepal syllabus questions
            </div>
          </Card>
        </div>

        {/* FAQs for SEO & User Guidance */}
        <section className="mb-10">
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" /> Frequently Asked Questions
              </CardTitle>
              <CardDescription>Common queries about taking this mock test on Khojney.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq-1" className="border-border/60">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    Is this {exam.title} mock test really 100% free?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    Yes! All mock tests on Khojney are completely free to take. You can attempt this exam as many times as you want without any subscription or payment.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2" className="border-border/60">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    Does this mock test match the actual Nepal exam pattern?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    Yes. All questions, timer allocations, and marking systems are modeled after official Nepal curriculum guidelines, past question papers, and entrance examination boards.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3" className="border-border/60">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    Will I get to see the correct answers and explanations?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    Immediately upon submitting your exam, you will receive a comprehensive scorecard with step-by-step solutions and explanations for every single question.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-4" className="border-border/60">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    Can I take this test on my mobile phone?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    Yes! Khojney&apos;s exam engine is fully optimized for mobile smartphones with touch-friendly controls, keyboard shortcuts, and a floating question navigator.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* Top Performers Leaderboard */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
            <Medal className="h-6 w-6 text-primary" /> Top Performers Leaderboard
          </h2>
          <Card className="border-border/80 shadow-xs">
            <CardContent className="p-0">
              {topAttempts.length === 0 ? (
                <div className="py-10 text-center text-xs text-muted-foreground">
                  No attempts yet. Be the first to take this exam and claim rank #1!
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {topAttempts.map((a, idx) => (
                    <LeaderRow
                      key={a.id}
                      rank={idx + 1}
                      name={a.user.name ?? "Anonymous Student"}
                      score={a.score}
                      totalMarks={a.totalMarks}
                      durationSec={a.durationSec ?? 0}
                      date={a.finishedAt ?? a.startedAt}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Recent Attempts */}
        {recentAttempts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
              <History className="h-6 w-6 text-primary" /> Recent Attempts
            </h2>
            <Card className="border-border/80 shadow-xs">
              <CardContent className="p-0">
                <div className="divide-y divide-border/60">
                  {recentAttempts.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between gap-4 px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {(a.user.name ?? "A")[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold truncate text-foreground">
                            {a.user.name ?? "Anonymous Student"}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {a.finishedAt?.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs sm:text-sm font-bold text-foreground">
                          {a.score} / {a.totalMarks}
                        </p>
                        {a.rank && (
                          <p className="text-[11px] text-muted-foreground font-medium">
                            Rank #{a.rank}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </AppShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/80 bg-card p-3 flex items-center gap-3 shadow-2xs">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground truncate font-medium">{label}</p>
        <p className="text-xs sm:text-sm font-bold truncate text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs sm:text-sm py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

function LeaderRow({
  rank,
  name,
  score,
  totalMarks,
  durationSec,
  date,
}: {
  rank: number;
  name: string;
  score: number;
  totalMarks: number;
  durationSec: number;
  date: Date;
}) {
  const rankBadge =
    rank === 1
      ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30"
      : rank === 2
        ? "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
        : rank === 3
          ? "bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-500/30"
          : "bg-muted text-muted-foreground";

  const pct = totalMarks ? Math.round((score / totalMarks) * 100) : 0;

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black shrink-0 ${rankBadge}`}
        >
          {rank}
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-semibold truncate text-foreground">{name}</p>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            {Math.floor(durationSec / 60)}m {durationSec % 60}s
            <span>·</span>
            {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs sm:text-sm font-bold text-foreground">
          {score} / {totalMarks}
        </p>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{pct}%</p>
      </div>
    </div>
  );
}
