import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ExamForm, parseExamInitial } from "@/components/admin/exam-form";
import { ExamQuestionsEditor } from "@/components/admin/exam-questions-editor";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExamPage({ params }: PageProps) {
  const { id } = await params;

  const [exam, categories] = await Promise.all([
    db.exam.findUnique({
      where: { id },
      include: { questions: { orderBy: { order: "asc" } } },
    }),
    db.category.findMany({
      where: { module: "EXAM" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!exam) notFound();

  return (
    <div className="space-y-6">
      <BackToAdminLink href="/admin/exams" label="Back to Exams" />
      <AdminFormHeader
        title={`Edit: ${exam.title}`}
        description="Update exam details and manage questions below."
      />

      <ExamForm
        mode="edit"
        categories={categories}
        initial={parseExamInitial(exam as unknown as Record<string, unknown>)}
      />

      <ExamQuestionsEditor examId={exam.id} initialQuestions={exam.questions} />
    </div>
  );
}
