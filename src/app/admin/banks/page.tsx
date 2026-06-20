import Link from "next/link";
import { db } from "@/lib/db";
import { AdminList, type AdminListColumn, type AdminListRow } from "@/components/admin/admin-list";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function AdminBanksPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const pageSize = 20;
  const q = (sp.q ?? "").trim();
  const skip = (page - 1) * pageSize;

  const where = q
    ? {
        OR: [
          { name: { contains: q } },
          { shortName: { contains: q } },
          { slug: { contains: q } },
          { headquarters: { contains: q } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    db.bank.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.bank.count({ where }),
  ]);

  const columns: AdminListColumn[] = [
    { label: "Name" },
    { label: "Short Name" },
    { label: "Type" },
    { label: "Established" },
    { label: "Branches" },
    { label: "Rating" },
    { label: "Featured" },
    { label: "Status" },
    { label: "Created" },
  ];

  const rows: AdminListRow[] = items.map((item) => ({
    id: item.id,
    cells: [
      (
        <div className="flex flex-col" key="name">
          <Link
            href={`/admin/banks/${item.id}`}
            className="font-medium hover:text-primary"
          >
            {item.name}
          </Link>
          <span className="text-xs text-muted-foreground">{item.slug}</span>
        </div>
      ),
      item.shortName || (
        <span className="text-muted-foreground text-xs" key="short">—</span>
      ),
      <Badge variant="secondary" key="type">{item.type}</Badge>,
      <span key="est" className="text-sm text-muted-foreground">
        {item.establishedYear ?? "—"}
      </span>,
      <span key="branches" className="text-sm">
        {item.branchCount ?? "—"}
      </span>,
      (
        <span key="rating" className="text-sm">
          {item.rating > 0 ? item.rating.toFixed(1) : "—"}
          {item.reviewCount > 0 && (
            <span className="text-xs text-muted-foreground"> ({item.reviewCount})</span>
          )}
        </span>
      ),
      item.isFeatured ? (
        <Badge variant="default" key="feat">Yes</Badge>
      ) : (
        <span className="text-xs text-muted-foreground" key="feat">No</span>
      ),
      (
        <div className="flex flex-wrap gap-1" key="status">
          {item.isPublished ? (
            <Badge variant="secondary">Published</Badge>
          ) : (
            <Badge variant="outline">Draft</Badge>
          )}
        </div>
      ),
      <span className="text-xs text-muted-foreground" key="created">
        {formatDate(item.createdAt)}
      </span>,
    ],
  }));

  return (
    <AdminList
      title="Banks"
      description="Manage all bank listings on the platform"
      columns={columns}
      rows={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      basePath="/admin/banks"
      apiPath="/api/admin/banks"
      searchPlaceholder="Search banks by name, short name, or city..."
      searchQuery={q}
      newLabel="Add Bank"
    />
  );
}
