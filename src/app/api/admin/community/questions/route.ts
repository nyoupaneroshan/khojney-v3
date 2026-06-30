import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { handlePrismaError } from "@/lib/prisma-error";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/community/questions
 * Paginated list of community question submissions. Capped to 100 per page.
 */
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(sp.get("pageSize") ?? "50", 10) || 50));
  const status = sp.get("status");
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  try {
    const [items, total] = await Promise.all([
      db.communityQuestion.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        select: {
          id: true,
          question: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
          correctAnswer: true,
          explanation: true,
          status: true,
          submitterName: true,
          upvotes: true,
          createdAt: true,
          reviewedAt: true,
          exam: { select: { title: true } },
          category: { select: { name: true } },
        },
      }),
      db.communityQuestion.count({ where }),
    ]);
    return NextResponse.json({ items, total, page, pageSize });
  } catch (err) {
    const handled = handlePrismaError(err, "community question");
    if (handled) return handled;
    console.error("community-questions list error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/**
 * POST /api/admin/community/questions
 * Approve / import / reject a community question.
 */
export async function POST(req: NextRequest) {
  const { user, error } = await requireAdmin();
  if (error) return error;

  let body: { id?: string; action?: string; adminNotes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id, action, adminNotes } = body;
  if (!id || !action) {
    return NextResponse.json({ error: "id and action are required" }, { status: 400 });
  }
  if (!["approve", "import", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  try {
    const item = await db.communityQuestion.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (action === "import" && item.examId) {
      const ci = ["A", "B", "C", "D"].indexOf(item.correctAnswer);
      const lq = await db.examQuestion.findFirst({
        where: { examId: item.examId },
        orderBy: { order: "desc" },
      });
      const no = (lq?.order ?? -1) + 1;
      await db.examQuestion.create({
        data: {
          examId: item.examId,
          type: "MCQ",
          question: item.question,
          options: JSON.stringify([item.optionA, item.optionB, item.optionC, item.optionD]),
          correctIdx: ci,
          explanation: item.explanation || `Answer: ${item.correctAnswer}`,
          marks: 1,
          order: no,
        },
      });
      const cnt = await db.examQuestion.count({ where: { examId: item.examId } });
      await db.exam.update({ where: { id: item.examId }, data: { totalMarks: cnt } });
    }

    const status = action === "reject" ? "REJECTED" : "APPROVED";
    const u = await db.communityQuestion.update({
      where: { id },
      data: {
        status,
        adminNotes: adminNotes || null,
        reviewedBy: user!.id,
        reviewedAt: new Date(),
      },
    });
    return NextResponse.json({ ok: true, item: u });
  } catch (err) {
    const handled = handlePrismaError(err, "community question");
    if (handled) return handled;
    console.error("community-questions action error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
