import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "../../../../../../../../../_lib/require-admin";
import { stringifyJson } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string; qid: string }>;
}

// PUT /api/admin/exams/[id]/questions/[qid]
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { qid } = await params;
  const body = await req.json().catch(() => ({}));

  const existing = await db.examQuestion.findUnique({ where: { id: qid } });
  if (!existing) return NextResponse.json({ error: "Question not found" }, { status: 404 });

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
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { qid } = await params;
  try {
    await db.examQuestion.delete({ where: { id: qid } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
