import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { SchoolForm } from "@/components/admin/school-form";
import { parseSchoolInitial } from "@/lib/admin-parsers";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSchoolPage({ params }: PageProps) {
  const { id } = await params;

  const [school, categories] = await Promise.all([
    db.school.findUnique({ where: { id } }),
    db.category.findMany({
      where: { module: "SCHOOL" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!school) notFound();

  return (
    <div>
      <BackToAdminLink href="/admin/schools" label="Back to Schools" />
      <AdminFormHeader
        title={`Edit: ${school.name}`}
        description="Update this school listing."
      />
      <SchoolForm
        mode="edit"
        categories={categories}
        initial={parseSchoolInitial(school as unknown as Record<string, unknown>)}
      />
    </div>
  );
}
