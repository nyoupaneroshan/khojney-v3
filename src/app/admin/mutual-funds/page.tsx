import Link from "next/link";
import { db } from "@/lib/db";
import { AdminList, type AdminListColumn, type AdminListRow } from "@/components/admin/admin-list";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function AdminMutualFundsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const pageSize = 20;
  const q = (sp.q ?? "").trim();
  const skip = (page - 1) * pageSize;

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { schemeCode: { contains: q, mode: "insensitive" as const } },
          { fundManager: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    db.mutualFund.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.mutualFund.count({ where }),
  ]);

  const columns: AdminListColumn[] = [
    { label: "Scheme Name" },
    { label: "Code" },
    { label: "Manager" },
    { label: "Type" },
    { label: "Category" },
    { label: "NAV (NPR)" },
    { label: "Fund Size" },
    { label: "Yield" },
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
            href={`/admin/mutual-funds/${item.id}`}
            className="font-medium hover:text-primary"
          >
            {item.name}
          </Link>
          <span className="text-xs text-muted-foreground">{item.slug}</span>
        </div>
      ),
      item.schemeCode ? (
        <Badge variant="outline" key="code">{item.schemeCode}</Badge>
      ) : (
        <span className="text-muted-foreground text-xs" key="code">—</span>
      ),
      <span key="mgr" className="text-sm font-medium text-muted-foreground truncate max-w-[150px]">{item.fundManager}</span>,
      <Badge variant="secondary" key="type">{item.fundType.replace(/_/g, " ")}</Badge>,
      <Badge variant="outline" key="cat">{item.category}</Badge>,
      (
        <span key="nav" className="text-sm font-semibold text-emerald-600">
          {item.nav != null ? `Rs. ${item.nav.toFixed(2)}` : "—"}
        </span>
      ),
      <span key="size" className="text-sm">
        {item.fundSize != null ? `${item.fundSize} Cr` : "—"}
      </span>,
      <span key="yield" className="text-sm">
        {item.dividendYield != null ? `${item.dividendYield}%` : "—"}
      </span>,
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
      title="Mutual Funds"
      description="Track and manage open-ended & close-ended mutual fund schemes, NAVs, and fund managers."
      columns={columns}
      rows={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      basePath="/admin/mutual-funds"
      apiPath="/api/admin/mutual-funds"
      searchPlaceholder="Search by scheme name, code, or manager..."
      searchQuery={q}
      newLabel="Add mutual fund"
      emptyMessage="No mutual funds found."
    />
  );
}
