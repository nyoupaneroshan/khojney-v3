import { db } from "@/lib/db";
import { ScholarshipForm } from "@/components/admin/scholarship-form";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

export default async function NewScholarshipPage() {
  const categories = await db.category.findMany({
    where: { module: "SCHOLARSHIP" },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <BackToAdminLink href="/admin/scholarships" label="Back to Scholarships" />
      <AdminFormHeader
        title="Add New Scholarship"
        description="Create a new scholarship listing."
      />
      <ScholarshipForm mode="create" categories={categories} />
    </div>
  );
}
