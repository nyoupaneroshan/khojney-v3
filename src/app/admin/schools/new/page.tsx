import { db } from "@/lib/db";
import { SchoolForm } from "@/components/admin/school-form";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

export default async function NewSchoolPage() {
  const categories = await db.category.findMany({
    where: { module: "SCHOOL" },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <BackToAdminLink href="/admin/schools" label="Back to Schools" />
      <AdminFormHeader
        title="Add New School"
        description="Create a new school listing."
      />
      <SchoolForm mode="create" categories={categories} />
    </div>
  );
}
