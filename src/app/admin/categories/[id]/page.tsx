import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CategoryForm, parseCategoryInitial } from "@/components/admin/category-form";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;

  const [category, parentOptions] = await Promise.all([
    db.category.findUnique({ where: { id } }),
    db.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, module: true },
    }),
  ]);

  if (!category) notFound();

  return (
    <div>
      <BackToAdminLink href="/admin/categories" label="Back to Categories" />
      <AdminFormHeader
        title={`Edit: ${category.name}`}
        description="Update this category."
      />
      <CategoryForm
        mode="edit"
        parentOptions={parentOptions}
        initial={parseCategoryInitial(category as unknown as Record<string, unknown>)}
      />
    </div>
  );
}
