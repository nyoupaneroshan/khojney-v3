import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BlogPostForm, parseBlogPostInitial } from "@/components/admin/blog-post-form";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: PageProps) {
  const { id } = await params;

  const [post, categories, tags] = await Promise.all([
    db.blogPost.findUnique({
      where: { id },
      include: { tags: true },
    }),
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

  if (!post) notFound();

  return (
    <div>
      <BackToAdminLink href="/admin/blog" label="Back to Blog Posts" />
      <AdminFormHeader
        title={`Edit: ${post.title}`}
        description="Update this blog post."
      />
      <BlogPostForm
        mode="edit"
        categories={categories}
        tags={tags}
        initial={parseBlogPostInitial(post as unknown as Record<string, unknown>)}
      />
    </div>
  );
}
