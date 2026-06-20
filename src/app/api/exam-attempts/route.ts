import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";

interface StartPayload {
  examId: string;
  action: "start";
}

interface SubmitPayload {
  action: "submit";
  attemptId: string;
  answers: Record<string, number | null>;
}

type Payload = Partial<StartPayload & SubmitPayload>;

/**
 * Exam attempts API.
 *
 * POST /api/exam-attempts
 *   Body: { examId, action: "start" } -> creates an attempt, returns { attemptId }
 *   Body: { action: "submit", attemptId, answers } -> grades & returns result
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.action === "start") {
    return handleStart(session.id, body.examId);
  }
  if (body.action === "submit") {
    return handleSubmit(session.id, body.attemptId, body.answers ?? {});
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

async function handleStart(userId: string, examId?: string) {
  if (!examId) {
    return NextResponse.json({ error: "examId is required" }, { status: 400 });
  }
  const exam = await db.exam.findUnique({
    where: { id: examId },
    select: { id: true, totalMarks: true, isPublished: true },
  });
  if (!exam || !exam.isPublished) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }

  const attempt = await db.examAttempt.create({
    data: {
      userId,
      examId: exam.id,
      totalMarks: exam.totalMarks,
      startedAt: new Date(),
    },
  });

  return NextResponse.json({ attemptId: attempt.id });
}

async function handleSubmit(
  userId: string,
  attemptId: string | undefined,
  answers: Record<string, number | null>,
) {
  if (!attemptId) {
    return NextResponse.json({ error: "attemptId is required" }, { status: 400 });
  }

  const attempt = await db.examAttempt.findUnique({
    where: { id: attemptId },
    include: {
      exam: { include: { questions: { orderBy: { order: "asc" } } } },
    },
  });

  if (!attempt) {
    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  }
  if (attempt.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (attempt.finishedAt) {
    return NextResponse.json(
      { error: "Attempt already submitted" },
      { status: 400 },
    );
  }

  // Compute score
  let correctCount = 0;
  let wrongCount = 0;
  let score = 0;
  const perQuestion: Array<{
    questionId: string;
    selectedIdx: number | null;
    isCorrect: boolean;
    correctIdx: number;
  }> = [];

  for (const q of attempt.exam.questions) {
    const selectedIdx = answers[q.id] ?? null;
    const isCorrect = selectedIdx !== null && selectedIdx === q.correctIdx;
    if (selectedIdx === null) {
      perQuestion.push({
        questionId: q.id,
        selectedIdx: null,
        isCorrect: false,
        correctIdx: q.correctIdx,
      });
      continue;
    }
    if (isCorrect) {
      correctCount++;
      score += q.marks;
    } else {
      wrongCount++;
    }
    perQuestion.push({
      questionId: q.id,
      selectedIdx,
      isCorrect,
      correctIdx: q.correctIdx,
    });
  }

  const now = new Date();
  const durationSec = Math.max(
    0,
    Math.round((now.getTime() - attempt.startedAt.getTime()) / 1000),
  );

  // Rank: count attempts on this exam with strictly higher score, then +1
  const higherCount = await db.examAttempt.count({
    where: {
      examId: attempt.examId,
      finishedAt: { not: null },
      score: { gt: score },
    },
  });
  const rank = higherCount + 1;

  await db.examAttempt.update({
    where: { id: attempt.id },
    data: {
      score,
      correctCount,
      wrongCount,
      durationSec,
      finishedAt: now,
      answers: JSON.stringify(perQuestion),
      rank,
    },
  });

  // Notify user of their result
  await db.notification.create({
    data: {
      userId,
      title: "Exam Result Published",
      message: `You scored ${score}/${attempt.totalMarks} on ${attempt.exam.title}.`,
      type: "EXAM_RESULT",
      link: `/exams/${attempt.exam.slug}`,
    },
  });

  return NextResponse.json({
    score,
    correctCount,
    wrongCount,
    unansweredCount: attempt.exam.questions.length - correctCount - wrongCount,
    totalMarks: attempt.totalMarks,
    durationSec,
    rank,
    passingMarks: attempt.exam.passingMarks,
    perQuestion,
  });
}
