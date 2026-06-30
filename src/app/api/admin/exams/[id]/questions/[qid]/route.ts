import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { stringifyJson } from "@/lib/admin-utils";
import { reconcileExamSets } from "@/lib/exam-sets";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string; qid: string }>;
}

// PUT /api/admin/exams/[id]/questions/[qid]
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { qid } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const existing = await db.examQuestion.findUnique({
    where: { id: qid },
    select: { id: true, examId: true, type: true, question: true, options: true, correctIdx: true, explanation: true, marks: true, order: true },
  });
  if (!existing) return NextResponse.json({ error: "Question not found" }, { status: 404 });

  // Validate inputs that are present.
  if (body.question !== undefined) {
    const q = String(body.question).trim();
    if (q.length < 5) {
      return NextResponse.json(
        { error: "Question text must be at least 5 characters" },
        { status: 400 }
      );
    }
    body.question = q;
  }
  if (body.options !== undefined) {
    if (!Array.isArray(body.options) || body.options.length !== 4) {
      return NextResponse.json(
        { error: "Exactly 4 options are required" },
        { status: 400 }
      );
    }
  }
  if (body.correctIdx !== undefined) {
    const ci = Number(body.correctIdx);
    if (!Number.isInteger(ci) || ci < 0 || ci > 3) {
      return NextResponse.json(
        { error: "correctIdx must be an integer 0–3" },
        { status: 400 }
      );
    }
  }

  const updated = await db.examQuestion.update({
    where: { id: qid },
    data: {
      type: body.type ?? existing.type,
      question: body.question ?? existing.question,
      options:
        body.options !== undefined ? stringifyJson(body.options) : existing.options,
      correctIdx:
        body.correctIdx !== undefined ? Number(body.correctIdx) : existing.correctIdx,
      explanation: body.explanation !== undefined ? body.explanation : existing.explanation,
      marks: body.marks !== undefined ? Number(body.marks) : existing.marks,
      order: body.order !== undefined ? Number(body.order) : existing.order,
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/admin/exams/[id]/questions/[qid]
// After deletion, reconciles the parent exam's set structure — may rebalance
// remaining questions across sets, or un-convert the parent if all questions
// are gone.
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { qid } = await params;

  // Fetch the question first so we know which exam (and possibly parent) to reconcile.
  const question = await db.examQuestion.findUnique({
    where: { id: qid },
    select: { id: true, examId: true },
  });
  if (!question) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.examQuestion.delete({ where: { id: qid } });

  // Find the top-level parent exam (or self if the question was on a top-level exam).
  const exam = await db.exam.findUnique({
    where: { id: question.examId },
    select: { id: true, parentId: true },
  });
  const parentIdForReconcile = exam?.parentId ?? question.examId;

  // Reconcile sets — non-blocking, best-effort.
  try {
    await reconcileExamSets(parentIdForReconcile);
  } catch (err) {
    console.error(
      "reconcileExamSets after delete failed (non-blocking):",
      err instanceof Error ? err.message : String(err)
    );
  }

  return NextResponse.json({ success: true });
}
