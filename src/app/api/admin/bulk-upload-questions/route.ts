import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { reconcileExamSets } from "@/lib/exam-sets";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/bulk-upload-questions
 * Body: { examId, questions: [...], duplicateStrategy: "skip"|"replace"|"add_all" }
 *
 * After upload, triggers `reconcileExamSets` which auto-creates child "Set N"
 * exams if the total question count crosses the threshold (10 per set).
 */
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  let body: {
    examId?: string;
    questions?: Array<{
      question?: string;
      options?: string[];
      correctIdx?: number;
      explanation?: string;
      marks?: number;
    }>;
    duplicateStrategy?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { examId, questions, duplicateStrategy } = body;
  if (!examId || !Array.isArray(questions) || !questions.length) {
    return NextResponse.json({ error: "examId and questions[] are required" }, { status: 400 });
  }
  if (!["skip", "replace", "add_all"].includes(duplicateStrategy ?? "")) {
    return NextResponse.json({ error: "Invalid duplicateStrategy" }, { status: 400 });
  }

  const exam = await db.exam.findUnique({
    where: { id: examId },
    select: { id: true, isParent: true, parentId: true },
  });
  if (!exam) return NextResponse.json({ error: "Exam not found" }, { status: 404 });

  // Validate every row first — fail fast before any DB writes.
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q.question || q.question.trim().length < 5) {
      return NextResponse.json(
        { error: `Row ${i + 1}: Question text must be at least 5 characters` },
        { status: 400 }
      );
    }
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      return NextResponse.json(
        { error: `Row ${i + 1}: Need exactly 4 options` },
        { status: 400 }
      );
    }
    if (q.correctIdx === undefined || q.correctIdx < 0 || q.correctIdx > 3) {
      return NextResponse.json(
        { error: `Row ${i + 1}: correctIdx must be 0–3` },
        { status: 400 }
      );
    }
  }

  // Determine the target exam ID for new questions.
  // If the exam is already a parent, new questions go to the latest non-full
  // child (or to the parent temporarily; reconcileExamSets will move them).
  let targetExamId = examId;
  if (exam.isParent && !exam.parentId) {
    const children = await db.exam.findMany({
      where: { parentId: examId },
      select: { id: true, _count: { select: { questions: true } } },
      orderBy: { createdAt: "asc" },
    });
    const lastNonFull = children.find((c) => c._count.questions < 10);
    targetExamId = lastNonFull?.id ?? examId;
  }

  // Fetch existing questions on the target exam for duplicate detection.
  const existing = await db.examQuestion.findMany({
    where: { examId: targetExamId },
    select: { id: true, question: true, order: true },
    orderBy: { order: "desc" },
  });
  const exMap = new Map(
    existing.map((e) => [e.question.trim().toLowerCase(), { id: e.id, order: e.order }])
  );

  let next = existing.length > 0 ? existing[0].order + 1 : 0;
  let added = 0;
  let replaced = 0;
  let skipped = 0;

  for (const q of questions) {
    const dup = exMap.get(q.question!.trim().toLowerCase());
    if (dup && duplicateStrategy === "skip") {
      skipped++;
      continue;
    }
    if (dup && duplicateStrategy === "replace") {
      await db.examQuestion.delete({ where: { id: dup.id } });
      await db.examQuestion.create({
        data: {
          examId: targetExamId,
          type: "MCQ",
          question: q.question!.trim(),
          options: JSON.stringify(q.options!.map((o) => o.trim())),
          correctIdx: q.correctIdx!,
          explanation: q.explanation?.trim() || null,
          marks: q.marks ?? 1,
          order: dup.order,
        },
      });
      replaced++;
      continue;
    }
    await db.examQuestion.create({
      data: {
        examId: targetExamId,
        type: "MCQ",
        question: q.question!.trim(),
        options: JSON.stringify(q.options!.map((o) => o.trim())),
        correctIdx: q.correctIdx!,
        explanation: q.explanation?.trim() || null,
        marks: q.marks ?? 1,
        order: next++,
      },
    });
    added++;
  }

  // Update the target exam's totalMarks.
  const cnt = await db.examQuestion.count({ where: { examId: targetExamId } });
  await db.exam.update({ where: { id: targetExamId }, data: { totalMarks: cnt } });

  // Auto-create / reconcile child sets on the top-level parent.
  const parentIdForReconcile = exam.parentId ?? examId;
  let reconcileResult: { converted: boolean; childSetsCreated: number; questionsReorganized: number } | null = null;
  try {
    reconcileResult = await reconcileExamSets(parentIdForReconcile);
  } catch (err) {
    console.error(
      "reconcileExamSets failed (non-blocking):",
      err instanceof Error ? err.message : String(err)
    );
  }

  return NextResponse.json({
    ok: true,
    summary: { added, replaced, skipped, total: questions.length },
    sets: reconcileResult,
  });
}

/** GET — returns a CSV template for the bulk upload format. */
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  return NextResponse.json({
    csvTemplate:
      "question,optionA,optionB,optionC,optionD,correctAnswer,explanation,marks\n" +
      '"Test?","A","B","C","D","B","Explain",1',
  });
}
