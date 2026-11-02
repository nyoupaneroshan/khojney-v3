import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { ExamRunner, type ExamRunnerExam } from "@/components/khojney/exam-runner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Clock, Trophy, FileText, CheckCircle2, User } from "lucide-react";
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
    select: { title: true, description: true },
  });
  if (!exam) return { title: "Exam Not Found" };
  return {
    title: `Take ${exam.title} — Free Mock Test | Khojney`,
    description: `Take ${exam.title} online for free. Timed practice, instant results, negative marking simulation, and complete explanations.`,
    robots: { index: false, follow: true }, // Don't index active test runner to avoid search snippet noise
  };
}

export default async function ExamTakePage({
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
          questions: { orderBy: { order: "asc" } },
          children: {
            where: { isPublished: true },
            orderBy: [{ order: "asc" }, { createdAt: "asc" }],
            include: { questions: { orderBy: { order: "asc" } } },
          },
        },
      },
    },
  });

  if (!exam) notFound();

  // If this exam has no direct questions (e.g. parent / faculty container exam),
  // collect playable sets from children and grandchildren.
  if (exam.questions.length === 0) {
    interface PlayableSet {
      id: string;
      slug: string;
      title: string;
      description: string;
      durationMin: number;
      totalMarks: number;
      difficulty: string;
      questionCount: number;
    }

    const playableSets: PlayableSet[] = [];

    for (const child of exam.children) {
      if (child.questions.length > 0) {
        playableSets.push({
          id: child.id,
          slug: child.slug,
          title: child.title,
          description: child.description,
          durationMin: child.durationMin,
          totalMarks: child.totalMarks,
          difficulty: child.difficulty,
          questionCount: child.questions.length,
        });
      }
      for (const grandchild of child.children) {
        if (grandchild.questions.length > 0) {
          playableSets.push({
            id: grandchild.id,
            slug: grandchild.slug,
            title: grandchild.title,
            description: grandchild.description,
            durationMin: grandchild.durationMin,
            totalMarks: grandchild.totalMarks,
            difficulty: grandchild.difficulty,
            questionCount: grandchild.questions.length,
          });
        }
      }
    }

    // Single child set -> auto-redirect directly
    if (playableSets.length === 1) {
      redirect(`/exams/${playableSets[0].slug}/take`);
    }

    // Multiple sets -> render user-friendly selection screen
    if (playableSets.length > 1) {
      return (
        <AppShell user={user}>
          <div className="container-app py-10 max-w-4xl">
            <div className="mb-6">
              <Button asChild variant="ghost" size="sm" className="mb-3">
                <Link href={`/exams/${exam.slug}`}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back to {exam.title} overview
                </Link>
              </Button>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Select a Mock Test Set
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {exam.title} contains {playableSets.length} practice sets. Choose any set to start practicing immediately.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {playableSets.map((set, idx) => (
                <Card key={set.id} className="card-hover flex flex-col justify-between border-border/80">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        Set {idx + 1}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {set.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold leading-snug">
                      {set.title}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {set.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-3 gap-2 text-xs mb-4 text-center">
                      <div className="p-2 rounded-lg bg-muted/60">
                        <FileText className="h-3.5 w-3.5 mx-auto mb-1 text-primary" />
                        <span className="font-semibold">{set.questionCount} Qs</span>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/60">
                        <Clock className="h-3.5 w-3.5 mx-auto mb-1 text-primary" />
                        <span className="font-semibold">{set.durationMin}m</span>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/60">
                        <Trophy className="h-3.5 w-3.5 mx-auto mb-1 text-primary" />
                        <span className="font-semibold">{set.totalMarks} Marks</span>
                      </div>
                    </div>
                    <Button asChild className="w-full font-semibold shadow-xs">
                      <Link href={`/exams/${set.slug}/take`}>
                        <Play className="h-3.5 w-3.5 fill-current mr-1.5" /> Start Test
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </AppShell>
      );
    }

    // No playable questions exist anywhere in hierarchy
    redirect(`/exams/${slug}`);
  }

  // Map DB questions to client-safe shape (parse JSON options)
  const runnerExam: ExamRunnerExam = {
    id: exam.id,
    slug: exam.slug,
    title: exam.title,
    description: exam.description,
    durationMin: exam.durationMin,
    totalMarks: exam.totalMarks,
    passingMarks: exam.passingMarks,
    difficulty: exam.difficulty,
    examType: exam.examType,
    shuffleQuestions: exam.shuffleQuestions,
    shuffleOptions: exam.shuffleOptions,
    questions: exam.questions.map((q) => {
      let options: string[] = [];
      try {
        options = JSON.parse(q.options) as string[];
      } catch {
        options = [];
      }
      // SECURITY: Do NOT ship `correctIdx` or `explanation` to the client.
      // The server re-fetches them in /api/exam-attempts upon submission.
      return {
        id: q.id,
        question: q.question,
        options,
        marks: q.marks,
        order: q.order,
      };
    }),
  };

  return (
    <AppShell user={user}>
      <div className="bg-muted/40 border-b border-border/80">
        <div className="container-app py-2.5 flex items-center justify-between gap-4">
          <Button asChild variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <Link href={`/exams/${exam.slug}`}>
              <ArrowLeft className="h-3.5 w-3.5" /> Exit to overview
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-xs">
            {user ? (
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Logged in as <strong className="text-foreground">{user.name ?? user.email}</strong>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-muted-foreground bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                <User className="h-3 w-3" />
                Guest Mode (Instant Practice)
              </span>
            )}
          </div>
        </div>
      </div>
      <ExamRunner exam={runnerExam} userId={user?.id ?? "guest"} />
    </AppShell>
  );
}
