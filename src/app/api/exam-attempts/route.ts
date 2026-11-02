import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { examAttemptLimiter } from "@/lib/rate-limit";

const startSchema = z.object({
  action: z.literal("start"),
  examId: z.string().min(1, "examId is required"),
});

const submitSchema = z.object({
  action: z.literal("submit"),
  attemptId: z.string().min(1, "attemptId is required"),
  answers: z.record(z.string(), z.number().nullable()).default({}),
  examId: z.string().optional(),
  durationSec: z.number().optional(),
});

const guestSubmitSchema = z.object({
  action: z.literal("guest-submit"),
  examId: z.string().min(1, "examId is required"),
  answers: z.record(z.string(), z.number().nullable()).default({}),
  durationSec: z.number().optional(),
});

/**
 * Exam attempts API.
 *
 * POST /api/exam-attempts
 *   - Start: { examId, action: "start" }
 *     Creates an attempt for logged-in users, or returns guest token for guest users.
 *   - Submit: { action: "submit", attemptId, answers }
 *     Grades and persists attempt for logged-in users.
 *   - Guest Submit: { action: "guest-submit" | "submit" (with attemptId="guest"), examId, answers }
 *     Instant server grading for guest users without account barrier.
 */
export async function POST(req: NextRequest) {
  // Rate limiting per IP / User
  const session = await getSession();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  const limit = examAttemptLimiter.check(session?.id ?? ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a moment before trying again." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Determine action
  const action = typeof body === "object" && body !== null && "action" in body ? (body as { action: unknown }).action : null;

  if (action === "start") {
    const parse = startSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0]?.message ?? "Invalid start payload" }, { status: 400 });
    }
    return handleStart(session?.id, parse.data.examId);
  }

  if (action === "guest-submit") {
    const parse = guestSubmitSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0]?.message ?? "Invalid guest submission payload" }, { status: 400 });
    }
    return handleGuestSubmit(parse.data.examId, parse.data.answers, parse.data.durationSec);
  }

  if (action === "submit") {
    const parse = submitSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0]?.message ?? "Invalid submit payload" }, { status: 400 });
    }

    // Guest submission routed through "submit" action with attemptId: "guest"
    if (parse.data.attemptId === "guest" || !session) {
      if (!parse.data.examId) {
        return NextResponse.json({ error: "examId is required for guest evaluation" }, { status: 400 });
      }
      return handleGuestSubmit(parse.data.examId, parse.data.answers, parse.data.durationSec);
    }

    return handleSubmit(session.id, parse.data.attemptId, parse.data.answers);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

async function handleStart(userId?: string, examId?: string) {
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

  // If user is guest (not authenticated), return guest mode token immediately without blocking
  if (!userId) {
    return NextResponse.json({ attemptId: "guest", isGuest: true });
  }

  const attempt = await db.examAttempt.create({
    data: {
      userId,
      examId: exam.id,
      totalMarks: exam.totalMarks,
      startedAt: new Date(),
    },
  });

  return NextResponse.json({ attemptId: attempt.id, isGuest: false });
}

async function handleGuestSubmit(
  examId: string,
  answers: Record<string, number | null>,
  durationSec?: number
) {
  const exam = await db.exam.findUnique({
    where: { id: examId },
    include: {
      questions: { orderBy: { order: "asc" } },
    },
  });

  if (!exam || !exam.isPublished) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }

  let correctCount = 0;
  let wrongCount = 0;
  let score = 0;
  const perQuestion: Array<{
    questionId: string;
    selectedIdx: number | null;
    isCorrect: boolean;
    correctIdx: number;
    explanation: string | null;
  }> = [];

  for (const q of exam.questions) {
    const selectedIdx = answers[q.id] ?? null;
    const isCorrect = selectedIdx !== null && selectedIdx === q.correctIdx;
    if (selectedIdx === null) {
      perQuestion.push({
        questionId: q.id,
        selectedIdx: null,
        isCorrect: false,
        correctIdx: q.correctIdx,
        explanation: q.explanation,
      });
      continue;
    }

    if (isCorrect) {
      correctCount++;
      score += q.marks;
    } else {
      wrongCount++;
      if (exam.negativeMarking && exam.negativeMarkValue > 0) {
        score = Math.max(0, score - exam.negativeMarkValue);
      }
    }

    perQuestion.push({
      questionId: q.id,
      selectedIdx,
      isCorrect,
      correctIdx: q.correctIdx,
      explanation: q.explanation,
    });
  }

  // Estimate rank against historical submissions
  const higherCount = await db.examAttempt.count({
    where: {
      examId: exam.id,
      finishedAt: { not: null },
      score: { gt: score },
    },
  });
  const rank = higherCount + 1;

  return NextResponse.json({
    score: Math.round(score * 100) / 100,
    correctCount,
    wrongCount,
    unansweredCount: exam.questions.length - correctCount - wrongCount,
    totalMarks: exam.totalMarks,
    durationSec: durationSec ?? 0,
    rank,
    passingMarks: exam.passingMarks,
    perQuestion,
    isGuest: true,
  });
}

async function handleSubmit(
  userId: string,
  attemptId: string,
  answers: Record<string, number | null>
) {
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
      { status: 400 }
    );
  }

  let correctCount = 0;
  let wrongCount = 0;
  let score = 0;
  const perQuestion: Array<{
    questionId: string;
    selectedIdx: number | null;
    isCorrect: boolean;
    correctIdx: number;
    explanation: string | null;
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
        explanation: q.explanation,
      });
      continue;
    }
    if (isCorrect) {
      correctCount++;
      score += q.marks;
    } else {
      wrongCount++;
      if (attempt.exam.negativeMarking && attempt.exam.negativeMarkValue > 0) {
        score = Math.max(0, score - attempt.exam.negativeMarkValue);
      }
    }
    perQuestion.push({
      questionId: q.id,
      selectedIdx,
      isCorrect,
      correctIdx: q.correctIdx,
      explanation: q.explanation,
    });
  }

  const now = new Date();
  const durationSec = Math.max(
    0,
    Math.round((now.getTime() - attempt.startedAt.getTime()) / 1000)
  );

  const higherCount = await db.examAttempt.count({
    where: {
      examId: attempt.examId,
      finishedAt: { not: null },
      score: { gt: score },
    },
  });
  const rank = higherCount + 1;

  const roundedScore = Math.round(score * 100) / 100;

  await db.examAttempt.update({
    where: { id: attempt.id },
    data: {
      score: roundedScore,
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
      message: `You scored ${roundedScore}/${attempt.totalMarks} on ${attempt.exam.title}.`,
      type: "EXAM_RESULT",
      link: `/exams/${attempt.exam.slug}`,
    },
  });

  return NextResponse.json({
    score: roundedScore,
    correctCount,
    wrongCount,
    unansweredCount: attempt.exam.questions.length - correctCount - wrongCount,
    totalMarks: attempt.totalMarks,
    durationSec,
    rank,
    passingMarks: attempt.exam.passingMarks,
    perQuestion,
    isGuest: false,
  });
}
