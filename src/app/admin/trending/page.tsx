import { db } from "@/lib/db";
import { AdminList, type AdminListColumn, type AdminListRow } from "@/components/admin/admin-list";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function AdminTrendingPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const pageSize = 30;
  const q = (sp.q ?? "").trim();
  const skip = (page - 1) * pageSize;

  const where = q ? { query: { contains: q } } : {};

  const [items, total] = await Promise.all([
    db.trendingSearch.findMany({
      where,
      orderBy: [{ order: "asc" }, { count: "desc" }],
      skip,
      take: pageSize,
    }),
    db.trendingSearch.count({ where }),
  ]);

  const columns: AdminListColumn[] = [
    { label: "Query" },
    { label: "Module" },
    { label: "Count" },
    { label: "Order" },
    { label: "Status" },
  ];

  const rows: AdminListRow[] = items.map((item) => ({
    id: item.id,
    cells: [
      (
        <a href={`/admin/trending/${item.id}`} className="font-medium hover:text-primary" key="q">
          {item.query}
        </a>
      ),
      item.module ? <Badge variant="secondary" key="m">{item.module}</Badge> : "—" as const,
      item.count.toLocaleString(),
      item.order,
      item.isActive ? (
        <Badge variant="default" key="s">Active</Badge>
      ) : (
        <Badge variant="outline" key="s">Inactive</Badge>
      ),
    ],
  }));

  return (
    <AdminList
      title="Trending Searches"
      description="Manage the trending search terms shown on the homepage"
      columns={columns}
      rows={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      basePath="/admin/trending"
      apiPath="/api/admin/trending"
      searchPlaceholder="Search trending queries..."
      searchQuery={q}
      newLabel="Add Trending Search"
    />
  );
}
