import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CollegeForm } from "@/components/admin/college-form";
import { parseCollegeInitial } from "@/lib/admin-parsers";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCollegePage({ params }: PageProps) {
  const { id } = await params;

  const [college, categories] = await Promise.all([
    db.college.findUnique({ where: { id } }),
    db.category.findMany({
      where: { module: "COLLEGE" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!college) notFound();

  return (
    <div>
      <BackToAdminLink href="/admin/colleges" label="Back to Colleges" />
      <AdminFormHeader
        title={`Edit: ${college.name}`}
        description="Update this college listing."
      />
      <CollegeForm
        mode="edit"
        categories={categories}
        initial={parseCollegeInitial(college as unknown as Record<string, unknown>)}
      />
    </div>
  );
}
