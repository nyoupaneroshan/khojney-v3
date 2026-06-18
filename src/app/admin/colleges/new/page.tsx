import { db } from "@/lib/db";
import { CollegeForm, parseCollegeInitial } from "@/components/admin/college-form";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

export default async function NewCollegePage() {
  const categories = await db.category.findMany({
    where: { module: "COLLEGE" },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <BackToAdminLink href="/admin/colleges" label="Back to Colleges" />
      <AdminFormHeader
        title="Add New College"
        description="Create a new college listing. Slug is auto-generated from name."
      />
      <CollegeForm mode="create" categories={categories} />
    </div>
  );
}
