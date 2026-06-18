import { db } from "@/lib/db";
import { AdminList, type AdminListColumn, type AdminListRow } from "@/components/admin/admin-list";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string; module?: string }>;
}

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const pageSize = 30;
  const q = (sp.q ?? "").trim();
  const moduleFilter = sp.module;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [{ name: { contains: q } }, { slug: { contains: q } }];
  }
  if (moduleFilter) where.module = moduleFilter;

  const [items, total] = await Promise.all([
    db.category.findMany({
      where,
      orderBy: [{ module: "asc" }, { order: "asc" }],
      skip,
      take: pageSize,
      include: {
        parent: { select: { id: true, name: true } },
        _count: { select: { children: true } },
      },
    }),
    db.category.count({ where }),
  ]);

  const columns: AdminListColumn[] = [
    { label: "Name" },
    { label: "Module" },
    { label: "Parent" },
    { label: "Icon" },
    { label: "Sub-categories" },
    { label: "Order" },
  ];

  const rows: AdminListRow[] = items.map((item) => ({
    id: item.id,
    cells: [
      (
        <div className="flex flex-col" key="name">
          <a href={`/admin/categories/${item.id}`} className="font-medium hover:text-primary">
            {item.color && (
              <span className={`inline-block h-2 w-2 rounded-full bg-${item.color}-500 mr-2`} />
            )}
            {item.name}
          </a>
          <span className="text-xs text-muted-foreground">{item.slug}</span>
        </div>
      ),
      item.module ? (
        <Badge variant="secondary" key="mod">{item.module}</Badge>
      ) : (
        <span className="text-muted-foreground text-xs" key="mod">—</span>
      ),
      item.parent ? <span className="text-xs" key="par">{item.parent.name}</span> : "—" as const,
      item.icon ? <code className="text-xs" key="icon">{item.icon}</code> : "—" as const,
      item._count.children,
      item.order,
    ],
  }));

  return (
    <AdminList
      title="Categories"
      description="Organize content into categories for each module"
      columns={columns}
      rows={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      basePath="/admin/categories"
      apiPath="/api/admin/categories"
      searchPlaceholder="Search categories by name..."
      searchQuery={q}
      newLabel="Add Category"
    />
  );
}
