import { db } from "@/lib/db";
import { CategoryForm } from "@/components/admin/category-form";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

export default async function NewCategoryPage() {
  const parentOptions = await db.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, module: true },
  });

  return (
    <div>
      <BackToAdminLink href="/admin/categories" label="Back to Categories" />
      <AdminFormHeader
        title="Add New Category"
        description="Create a new category for any module."
      />
      <CategoryForm mode="create" parentOptions={parentOptions} />
    </div>
  );
}
