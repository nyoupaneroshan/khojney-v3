import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "../../../../../../../../_lib/require-admin";
import { stringifyJson } from "@/lib/admin-utils";

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
  });
  return NextResponse.json({ items: questions });
}

// POST /api/admin/exams/[id]/questions
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const exam = await db.exam.findUnique({ where: { id } });
  if (!exam) return NextResponse.json({ error: "Exam not found" }, { status: 404 });

  const count = await db.examQuestion.count({ where: { examId: id } });

  const question = await db.examQuestion.create({
    data: {
      examId: id,
      type: body.type ?? "MCQ",
      question: body.question ?? "",
      options: stringifyJson(body.options ?? ["", "", "", ""]),
      correctIdx: Number(body.correctIdx ?? 0),
      explanation: body.explanation ?? null,
      marks: body.marks ? Number(body.marks) : 1,
      order: body.order ?? count,
    },
  });

  return NextResponse.json(question, { status: 201 });
}
