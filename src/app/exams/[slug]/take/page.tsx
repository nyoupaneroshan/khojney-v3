import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { ExamRunner, type ExamRunnerExam } from "@/components/khojney/exam-runner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Params {
  slug: string;
}

export default async function ExamTakePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const user = await getSession();

  // Must be logged in to take exam
  if (!user) {
    redirect(`/login?callbackUrl=/exams/${slug}/take`);
  }

  const exam = await db.exam.findUnique({
    where: { slug, isPublished: true },
    include: {
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
  // automatically redirect to the first playable child mock test set!
  if (exam.questions.length === 0) {
    for (const child of exam.children) {
      if (child.questions.length > 0) {
        redirect(`/exams/${child.slug}/take`);
      }
      for (const grandchild of child.children) {
        if (grandchild.questions.length > 0) {
          redirect(`/exams/${grandchild.slug}/take`);
        }
      }
    }
    // If no playable questions exist anywhere in the hierarchy, redirect to overview
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
      // The server re-fetches them in /api/exam-attempts and returns them in
      // the submit-response — that's the only place they should appear.
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
      <div className="bg-muted/30 border-b">
        <div className="container-app py-2 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/exams/${exam.slug}`}>
              <ArrowLeft className="h-3.5 w-3.5" /> Exit exam
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            Logged in as {user.name ?? user.email}
          </p>
        </div>
      </div>
      <ExamRunner exam={runnerExam} userId={user.id} />
    </AppShell>
  );
}
