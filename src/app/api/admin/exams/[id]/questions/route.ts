import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { stringifyJson } from "@/lib/admin-utils";
import { reconcileExamSets } from "@/lib/exam-sets";
import { handlePrismaError } from "@/lib/prisma-error";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/exams/[id]/questions
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const questions = await db.examQuestion.findMany({
    where: { examId: id },
    orderBy: { order: "asc" },
    select: {
      id: true,
      type: true,
      question: true,
      options: true,
      correctIdx: true,
      explanation: true,
      marks: true,
      order: true,
    },
  });
  return NextResponse.json({ items: questions });
}

// POST /api/admin/exams/[id]/questions
// Creates a single question. If the exam's question count crosses the
// QUESTIONS_PER_SET threshold (10), the exam is auto-converted into a parent
// with child sets — see `reconcileExamSets`.
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Validate required fields.
  const questionText = String(body.question ?? "").trim();
  if (!questionText || questionText.length < 5) {
    return NextResponse.json(
      { error: "Question text must be at least 5 characters" },
      { status: 400 }
    );
  }
  let options: string[] = [];
  if (Array.isArray(body.options)) {
    options = body.options.map((o) => String(o).trim());
  }
  if (options.length !== 4) {
    return NextResponse.json(
      { error: "Exactly 4 options are required" },
      { status: 400 }
    );
  }
  const correctIdx = Number(body.correctIdx);
  if (!Number.isInteger(correctIdx) || correctIdx < 0 || correctIdx > 3) {
    return NextResponse.json(
      { error: "correctIdx must be an integer 0–3" },
      { status: 400 }
    );
  }

  const exam = await db.exam.findUnique({
    where: { id },
    select: { id: true, isParent: true, parentId: true },
  });
  if (!exam) return NextResponse.json({ error: "Exam not found" }, { status: 404 });

  // If the exam is already a parent, the new question should go to the
  // latest child set that has < 10 questions, OR create a new child set.
  let targetExamId = id;
  if (exam.isParent && !exam.parentId) {
    const children = await db.exam.findMany({
      where: { parentId: id },
      select: { id: true, _count: { select: { questions: true } } },
      orderBy: { createdAt: "asc" },
    });
    const lastNonFull = children.find((c) => c._count.questions < 10);
    targetExamId = lastNonFull?.id ?? id;
    // If no non-full child exists, the question goes to the parent temporarily
    // — reconcileExamSets will create a new child and move it.
  }

  // If this exam IS itself a child (has parentId), just add directly.
  if (exam.parentId) {
    targetExamId = id;
  }

  const count = await db.examQuestion.count({ where: { examId: targetExamId } });

  let created;
  try {
    created = await db.examQuestion.create({
      data: {
        examId: targetExamId,
        type: String(body.type ?? "MCQ"),
        question: questionText,
        options: stringifyJson(options),
        correctIdx,
        explanation: body.explanation ? String(body.explanation) : null,
        marks: body.marks ? Number(body.marks) : 1,
        order: typeof body.order === "number" ? body.order : count,
      },
    });
  } catch (err) {
    const handled = handlePrismaError(err, "question");
    if (handled) return handled;
    throw err;
  }

  // After adding, reconcile the parent exam's set structure. This is a no-op
  // if the exam doesn't yet cross the threshold; otherwise it splits into
  // child sets. We reconcile the top-level parent (or self if not a child).
  const parentIdForReconcile = exam.parentId ?? id;
  let reconcileResult: { converted: boolean; childSetsCreated: number } | null = null;
  try {
    reconcileResult = await reconcileExamSets(parentIdForReconcile);
  } catch (err) {
    // Reconciliation is best-effort — don't fail the question creation if it
    // errors. Log and continue.
    console.error(
      "reconcileExamSets failed (non-blocking):",
      err instanceof Error ? err.message : String(err)
    );
  }

  return NextResponse.json(
    {
      ...created,
      _sets: reconcileResult,
    },
    { status: 201 }
  );
}
