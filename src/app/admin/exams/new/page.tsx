import { db } from "@/lib/db";
import { ExamForm } from "@/components/admin/exam-form";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

export default async function NewExamPage() {
  const categories = await db.category.findMany({
    where: { module: "EXAM" },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <BackToAdminLink href="/admin/exams" label="Back to Exams" />
      <AdminFormHeader
        title="Add New Exam"
        description="Create a new exam. You'll be able to add questions after creation."
      />
      <ExamForm mode="create" categories={categories} />
    </div>
  );
}
