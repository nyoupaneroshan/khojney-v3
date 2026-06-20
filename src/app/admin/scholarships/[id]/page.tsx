import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ScholarshipForm } from "@/components/admin/scholarship-form";
import { parseScholarshipInitial } from "@/lib/admin-parsers";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditScholarshipPage({ params }: PageProps) {
  const { id } = await params;

  const [scholarship, categories] = await Promise.all([
    db.scholarship.findUnique({ where: { id } }),
    db.category.findMany({
      where: { module: "SCHOLARSHIP" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!scholarship) notFound();

  return (
    <div>
      <BackToAdminLink href="/admin/scholarships" label="Back to Scholarships" />
      <AdminFormHeader
        title={`Edit: ${scholarship.title}`}
        description="Update this scholarship listing."
      />
      <ScholarshipForm
        mode="edit"
        categories={categories}
        initial={parseScholarshipInitial(scholarship as unknown as Record<string, unknown>)}
      />
    </div>
  );
}
