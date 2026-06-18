import { db } from "@/lib/db";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  const [categories, tags] = await Promise.all([
    db.category.findMany({
      where: { module: "BLOG" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    db.tag.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div>
      <BackToAdminLink href="/admin/blog" label="Back to Blog Posts" />
      <AdminFormHeader
        title="Add New Blog Post"
        description="Create a new article. Markdown is supported for content."
      />
      <BlogPostForm mode="create" categories={categories} tags={tags} />
    </div>
  );
}
