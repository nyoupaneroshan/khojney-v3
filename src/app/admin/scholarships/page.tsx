import { db } from "@/lib/db";
import { AdminList, type AdminListColumn, type AdminListRow } from "@/components/admin/admin-list";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function AdminScholarshipsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const pageSize = 20;
  const q = (sp.q ?? "").trim();
  const skip = (page - 1) * pageSize;

  const where = q
    ? {
        OR: [
          { title: { contains: q } },
          { slug: { contains: q } },
          { provider: { contains: q } },
          { field: { contains: q } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    db.scholarship.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: { category: { select: { id: true, name: true } } },
    }),
    db.scholarship.count({ where }),
  ]);

  const columns: AdminListColumn[] = [
    { label: "Title" },
    { label: "Category" },
    { label: "Provider" },
    { label: "Level" },
    { label: "Amount" },
    { label: "Deadline" },
    { label: "Status" },
  ];

  const rows: AdminListRow[] = items.map((item) => ({
    id: item.id,
    cells: [
      (
        <div className="flex flex-col" key="title">
          <a href={`/admin/scholarships/${item.id}`} className="font-medium hover:text-primary">
            {item.title}
          </a>
          <span className="text-xs text-muted-foreground">{item.slug}</span>
        </div>
      ),
      item.category ? (
        <Badge variant="outline" key="cat">{item.category.name}</Badge>
      ) : (
        <span className="text-muted-foreground text-xs" key="cat">—</span>
      ),
      item.provider ?? "—",
      item.level ? <Badge variant="secondary" key="lvl">{item.level}</Badge> : "—" as const,
      item.amount ?? "—",
      item.deadline ? formatDate(item.deadline) : "—",
      (
        <div className="flex flex-wrap gap-1" key="status">
          {item.isFeatured && <Badge variant="default">Featured</Badge>}
          {!item.isPublished && <Badge variant="outline">Draft</Badge>}
          {item.isPublished && <Badge variant="secondary">Published</Badge>}
        </div>
      ),
    ],
  }));

  return (
    <AdminList
      title="Scholarships"
      description="Manage all scholarship listings on the platform"
      columns={columns}
      rows={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      basePath="/admin/scholarships"
      apiPath="/api/admin/scholarships"
      searchPlaceholder="Search scholarships..."
      searchQuery={q}
      newLabel="Add Scholarship"
    />
  );
}
