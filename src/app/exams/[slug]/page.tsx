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
  Clock,
  FileText,
  Trophy,
  Users,
  Target,
  BarChart3,
  Medal,
  History,
  LogIn,
  Play,
} from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

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
    },
  });
  if (!exam) {
    return { title: "Exam not found" };
  }
  return {
    title: exam.title,
    description: `${exam.description.slice(0, 150)}`,
    alternates: { canonical: `/exams/${slug}` },
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
        orderBy: { createdAt: "asc" },
        include: {
          _count: { select: { questions: true, attempts: true } },
        },
      },
    },
  });
  if (!exam) notFound();

  // If this is a parent exam (no questions, has children), show the child list
  if (exam.isParent && exam.children.length > 0) {
    return (
      <AppShell user={user}>
        {/* Breadcrumb + hero */}
        <div className="border-b bg-gradient-to-b from-secondary/40 to-background">
          <div className="container-app py-8">
            <BreadcrumbNav
              className="mb-4"
              items={[
                { label: "Home", href: "/" },
                { label: "Exams", href: "/exams" },
                ...(exam.category ? [{ label: exam.category.name, href: `/exams?category=${exam.category.slug}` }] : []),
                { label: exam.title },
              ]}
            />
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <FileText className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{exam.title}</h1>
                <p className="mt-2 text-muted-foreground max-w-2xl">{exam.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <Badge variant="secondary">{exam.children.length} mock tests</Badge>
                  <Badge variant="outline">Shuffled questions & options</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Child exam sets */}
        <section className="py-10">
          <div className="container-app">
            <h2 className="text-xl font-bold mb-4">Available Mock Tests</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {exam.children.map((child) => (
                <Card key={child.id} className="card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px]">{child.examType}</Badge>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        child.difficulty === "EASY" ? "bg-emerald-100 text-emerald-700" :
                        child.difficulty === "HARD" ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {child.difficulty}
                      </span>
                    </div>
                    <CardTitle className="text-base leading-snug">
                      <Link href={`/exams/${child.slug}`} className="hover:text-primary">
                        {child.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{child.description}</p>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <div className="flex flex-col items-center p-2 rounded-md bg-muted">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground mb-0.5" />
                        <span className="font-medium">{child.durationMin}m</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-md bg-muted">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground mb-0.5" />
                        <span className="font-medium">{child._count.questions}Q</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-md bg-muted">
                        <Trophy className="h-3.5 w-3.5 text-muted-foreground mb-0.5" />
                        <span className="font-medium">{child._count.attempts}</span>
                      </div>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4">
                    <Button asChild size="sm" className="w-full">
                      <Link href={`/exams/${child.slug}`}>Start Test</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </AppShell>
    );
  }

  const [attemptCount, topAttempts, recentAttempts] = await Promise.all([
    db.examAttempt.count({
      where: { examId: exam.id, finishedAt: { not: null } },
    }),
    db.examAttempt.findMany({
      where: { examId: exam.id, finishedAt: { not: null } },
      orderBy: [{ score: "desc" }, { durationSec: "asc" }],
      take: 10,
      include: { user: { select: { name: true, email: true } } },
    }),
    db.examAttempt.findMany({
      where: { examId: exam.id, finishedAt: { not: null } },
      orderBy: { finishedAt: "desc" },
      take: 5,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const difficultyColor: Record<string, string> = {
    EASY: "bg-emerald-100 text-emerald-700",
    MEDIUM: "bg-amber-100 text-amber-700",
    HARD: "bg-red-100 text-red-700",
  };

  const examTypeLabel: Record<string, string> = {
    MOCK: "Mock Test",
    PRACTICE: "Practice",
    PREVIOUS_YEAR: "Previous Year",
  };

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: exam.title,
    description: exam.description,
    timeRequired: `PT${exam.durationMin}M`,
    educationalLevel: exam.difficulty,
    learningResourceType: "Exam",
    aggregateRating: attemptCount
      ? {
          "@type": "AggregateRating",
          ratingValue: exam.totalMarks,
          ratingCount: attemptCount,
        }
      : undefined,
  };

  return (
    <AppShell user={user}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{exam.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="secondary">
              {examTypeLabel[exam.examType] ?? exam.examType}
            </Badge>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                difficultyColor[exam.difficulty] ?? difficultyColor.MEDIUM
              }`}
            >
              {exam.difficulty}
            </span>
            {exam.category && (
              <Badge variant="outline">{exam.category.name}</Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {exam.title}
          </h1>
          <p className="mt-3 text-muted-foreground max-w-3xl">{exam.description}</p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat icon={<Clock className="h-4 w-4" />} label="Duration" value={`${exam.durationMin} min`} />
            <Stat icon={<Trophy className="h-4 w-4" />} label="Total Marks" value={String(exam.totalMarks)} />
            <Stat icon={<FileText className="h-4 w-4" />} label="Questions" value={String(exam.questions.length)} />
            <Stat icon={<Users className="h-4 w-4" />} label="Attempts" value={attemptCount.toLocaleString()} />
          </div>
        </section>

        {/* Two-column overview + start */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" /> Exam Overview
              </CardTitle>
              <CardDescription>Everything you need to know before you begin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Row label="Number of Questions" value={`${exam.questions.length} MCQs`} />
              <Row label="Total Marks" value={`${exam.totalMarks}`} />
              <Row label="Duration" value={`${exam.durationMin} minutes`} />
              <Row
                label="Passing Marks"
                value={exam.passingMarks ? `${exam.passingMarks} (${Math.round((exam.passingMarks / exam.totalMarks) * 100)}%)` : "—"}
              />
              <Row label="Difficulty" value={exam.difficulty} />
              <Row label="Exam Type" value={examTypeLabel[exam.examType] ?? exam.examType} />
              <div className="pt-2 border-t">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                  <Target className="h-4 w-4" /> Instructions
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
                  <li>Each question carries 1 mark unless stated otherwise.</li>
                  <li>No negative marking — attempt every question.</li>
                  <li>The exam auto-submits when the timer reaches zero.</li>
                  <li>You can navigate between questions using the question navigator.</li>
                  <li>Results &amp; detailed explanations are shown immediately after submission.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" /> Ready to start?
              </CardTitle>
              <CardDescription>
                {user ? "Begin your exam. Best of luck!" : "Login or create a free account to begin."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <>
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-sm">
                    <p className="font-medium text-foreground">Hi {user.name ?? "there"}!</p>
                    <p className="text-muted-foreground mt-1">
                      You are about to start a {exam.durationMin}-minute exam with {exam.questions.length} questions.
                    </p>
                  </div>
                  <Button asChild size="lg" className="w-full">
                    <Link href={`/exams/${exam.slug}/take`}>
                      <Play className="h-4 w-4" /> Start Exam Now
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Make sure you have a stable internet connection.
                  </p>
                </>
              ) : (
                <>
                  <div className="rounded-lg bg-muted p-4 text-sm">
                    <p className="font-medium text-foreground flex items-center gap-2">
                      <LogIn className="h-4 w-4" /> Login required
                    </p>
                    <p className="text-muted-foreground mt-1">
                      Create a free account to track your progress, save bookmarks, and view your performance history.
                    </p>
                  </div>
                  <Button asChild size="lg" className="w-full">
                    <Link href={`/login?callbackUrl=/exams/${exam.slug}/take`}>
                      Login to Start
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/login?mode=register">Create a free account</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Medal className="h-6 w-6 text-primary" /> Top Performers
          </h2>
          <Card>
            <CardContent className="p-0">
              {topAttempts.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No attempts yet. Be the first to take this exam!
                </div>
              ) : (
                <div className="divide-y">
                  {topAttempts.map((a, idx) => (
                    <LeaderRow
                      key={a.id}
                      rank={idx + 1}
                      name={a.user.name ?? a.user.email}
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
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <History className="h-6 w-6 text-primary" /> Recent Attempts
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentAttempts.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between gap-4 px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {(a.user.name ?? a.user.email)[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {a.user.name ?? a.user.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {a.finishedAt?.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold">
                          {a.score} / {a.totalMarks}
                        </p>
                        {a.rank && (
                          <p className="text-xs text-muted-foreground">
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
    <div className="rounded-lg border bg-card p-3 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className="text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
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
      ? "bg-amber-100 text-amber-700"
      : rank === 2
        ? "bg-slate-100 text-slate-700"
        : rank === 3
          ? "bg-orange-100 text-orange-700"
          : "bg-muted text-muted-foreground";
  const pct = totalMarks ? Math.round((score / totalMarks) * 100) : 0;

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${rankBadge}`}
        >
          {rank}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Clock className="h-3 w-3" />
            {Math.floor(durationSec / 60)}m {durationSec % 60}s
            <span>·</span>
            {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold">
          {score} / {totalMarks}
        </p>
        <p className="text-xs text-muted-foreground">{pct}%</p>
      </div>
    </div>
  );
}
