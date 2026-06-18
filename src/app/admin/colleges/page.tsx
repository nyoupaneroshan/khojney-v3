import Link from "next/link";
import { db } from "@/lib/db";
import { AdminList, type AdminListColumn, type AdminListRow } from "@/components/admin/admin-list";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function AdminCollegesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const pageSize = 20;
  const q = (sp.q ?? "").trim();
  const skip = (page - 1) * pageSize;

  const where = q
    ? {
        OR: [
          { name: { contains: q } },
          { slug: { contains: q } },
          { city: { contains: q } },
          { affiliation: { contains: q } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    db.college.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: { category: { select: { id: true, name: true } } },
    }),
    db.college.count({ where }),
  ]);

  const columns: AdminListColumn[] = [
    { label: "Name" },
    { label: "Category" },
    { label: "Type" },
    { label: "Location" },
    { label: "Affiliation" },
    { label: "Status" },
    { label: "Created" },
  ];

  const rows: AdminListRow[] = items.map((item) => ({
    id: item.id,
    cells: [
      (
        <div className="flex flex-col" key="name">
          <Link
            href={`/admin/colleges/${item.id}`}
            className="font-medium hover:text-primary"
          >
            {item.name}
          </Link>
          <span className="text-xs text-muted-foreground">{item.slug}</span>
        </div>
      ),
      item.category ? (
        <Badge variant="outline" key="cat">{item.category.name}</Badge>
      ) : (
        <span className="text-muted-foreground text-xs" key="cat">—</span>
      ),
      <Badge variant="secondary" key="type">{item.type}</Badge>,
      item.city ?? "—",
      item.affiliation ?? "—",
      (
        <div className="flex flex-wrap gap-1" key="status">
          {item.isFeatured && <Badge variant="default">Featured</Badge>}
          {!item.isPublished && <Badge variant="outline">Draft</Badge>}
          {item.isPublished && <Badge variant="secondary">Published</Badge>}
        </div>
      ),
      <span className="text-xs text-muted-foreground" key="created">
        {formatDate(item.createdAt)}
      </span>,
    ],
  }));

  return (
    <AdminList
      title="Colleges"
      description="Manage all college listings on the platform"
      columns={columns}
      rows={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      basePath="/admin/colleges"
      apiPath="/api/admin/colleges"
      searchPlaceholder="Search colleges by name, city, affiliation..."
      searchQuery={q}
      newLabel="Add College"
    />
  );
}
