import Link from "next/link";
import { db } from "@/lib/db";
import { AdminList, type AdminListColumn, type AdminListRow } from "@/components/admin/admin-list";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/admin-utils";
import { getGovCategoryLabel } from "@/lib/government-categories";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function AdminGovernmentPage({ searchParams }: PageProps) {
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
          { ministry: { contains: q } },
          { department: { contains: q } },
          { office: { contains: q } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    db.governmentService.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.governmentService.count({ where }),
  ]);

  const columns: AdminListColumn[] = [
    { label: "Title" },
    { label: "Category" },
    { label: "Ministry" },
    { label: "Office" },
    { label: "Views" },
    { label: "Featured" },
    { label: "Status" },
  ];

  const rows: AdminListRow[] = items.map((item) => ({
    id: item.id,
    cells: [
      (
        <div className="flex flex-col" key="title">
          <Link
            href={`/admin/government/${item.id}`}
            className="font-medium hover:text-primary"
          >
            {item.title}
          </Link>
          <span className="text-xs text-muted-foreground">{item.slug}</span>
        </div>
      ),
      <Badge variant="outline" key="cat">
        {getGovCategoryLabel(item.category)}
      </Badge>,
      item.ministry ?? "—",
      item.office ?? "—",
      <span key="views" className="text-xs tabular-nums text-muted-foreground">
        {item.views.toLocaleString()}
      </span>,
      item.isFeatured ? (
        <Badge variant="default" key="feat">Yes</Badge>
      ) : (
        <span className="text-xs text-muted-foreground" key="feat">—</span>
      ),
      (
        <div className="flex flex-wrap gap-1" key="status">
          {!item.isPublished && <Badge variant="outline">Draft</Badge>}
          {item.isPublished && <Badge variant="secondary">Published</Badge>}
        </div>
      ),
    ],
  }));

  return (
    <AdminList
      title="Government Services"
      description="Manage all government service listings on the platform"
      columns={columns}
      rows={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      basePath="/admin/government"
      apiPath="/api/admin/government"
      searchPlaceholder="Search by title, ministry, department, office..."
      searchQuery={q}
      newLabel="Add Service"
    />
  );
}
