import { db } from "@/lib/db";
import { AdminList, type AdminListColumn, type AdminListRow } from "@/components/admin/admin-list";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function AdminSchoolsPage({ searchParams }: PageProps) {
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
    db.school.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: { category: { select: { id: true, name: true } } },
    }),
    db.school.count({ where }),
  ]);

  const columns: AdminListColumn[] = [
    { label: "Name" },
    { label: "Category" },
    { label: "Level" },
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
          <a href={`/admin/schools/${item.id}`} className="font-medium hover:text-primary">
            {item.name}
          </a>
          <span className="text-xs text-muted-foreground">{item.slug}</span>
        </div>
      ),
      item.category ? (
        <Badge variant="outline" key="cat">{item.category.name}</Badge>
      ) : (
        <span className="text-muted-foreground text-xs" key="cat">—</span>
      ),
      item.level ? (
        <Badge variant="secondary" key="lvl">{item.level.replace(/_/g, " ")}</Badge>
      ) : (
        "—" as const
      ),
      <Badge variant="outline" key="type">{item.type}</Badge>,
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
      title="Schools"
      description="Manage all school listings on the platform"
      columns={columns}
      rows={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      basePath="/admin/schools"
      apiPath="/api/admin/schools"
      searchPlaceholder="Search schools by name, city, affiliation..."
      searchQuery={q}
      newLabel="Add School"
    />
  );
}
