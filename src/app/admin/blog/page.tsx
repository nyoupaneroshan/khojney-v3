import { db } from "@/lib/db";
import { AdminList, type AdminListColumn, type AdminListRow } from "@/components/admin/admin-list";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string; status?: string }>;
}

export default async function AdminBlogPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const pageSize = 20;
  const q = (sp.q ?? "").trim();
  const status = sp.status;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { slug: { contains: q } },
      { excerpt: { contains: q } },
    ];
  }
  if (status) where.status = status;

  const [items, total] = await Promise.all([
    db.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: {
        category: { select: { id: true, name: true } },
        author: { select: { id: true, name: true, email: true } },
        tags: { select: { id: true, name: true } },
      },
    }),
    db.blogPost.count({ where }),
  ]);

  const columns: AdminListColumn[] = [
    { label: "Title" },
    { label: "Category" },
    { label: "Author" },
    { label: "Tags" },
    { label: "Views" },
    { label: "Status" },
    { label: "Published" },
  ];

  const rows: AdminListRow[] = items.map((item) => {
    const statusVariant =
      item.status === "PUBLISHED"
        ? "default"
        : item.status === "ARCHIVED"
          ? "destructive"
          : "outline";
    return {
      id: item.id,
      cells: [
        (
          <div className="flex flex-col max-w-md" key="title">
            <a href={`/admin/blog/${item.id}`} className="font-medium hover:text-primary line-clamp-1">
              {item.title}
            </a>
            <span className="text-xs text-muted-foreground line-clamp-1">/{item.slug}</span>
          </div>
        ),
        item.category ? (
          <Badge variant="outline" key="cat">{item.category.name}</Badge>
        ) : (
          <span className="text-muted-foreground text-xs" key="cat">—</span>
        ),
        item.author ? (
          <span className="text-xs" key="author">{item.author.name ?? item.author.email}</span>
        ) : (
          <span className="text-muted-foreground text-xs" key="author">—</span>
        ),
        item.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1" key="tags">
            {item.tags.slice(0, 3).map((t) => (
              <Badge key={t.id} variant="secondary" className="text-[10px]">
                {t.name}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-[10px]">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground text-xs" key="tags">—</span>
        ),
        item.views.toLocaleString(),
        <Badge variant={statusVariant} key="status">{item.status}</Badge>,
        <span className="text-xs text-muted-foreground" key="pub">
          {formatDate(item.publishedAt)}
        </span>,
      ],
    };
  });

  return (
    <AdminList
      title="Blog Posts"
      description="Manage all articles and blog content"
      columns={columns}
      rows={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      basePath="/admin/blog"
      apiPath="/api/admin/blog"
      searchPlaceholder="Search posts by title or excerpt..."
      searchQuery={q}
      newLabel="Add Blog Post"
    />
  );
}
