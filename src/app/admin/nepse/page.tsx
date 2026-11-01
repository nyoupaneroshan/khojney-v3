import Link from "next/link";
import { db } from "@/lib/db";
import { AdminList, type AdminListColumn, type AdminListRow } from "@/components/admin/admin-list";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function AdminNepsePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const pageSize = 20;
  const q = (sp.q ?? "").trim();
  const skip = (page - 1) * pageSize;

  const where = q
    ? {
        OR: [
          { symbol: { contains: q, mode: "insensitive" as const } },
          { companyName: { contains: q, mode: "insensitive" as const } },
          { sector: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    db.nepseStock.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.nepseStock.count({ where }),
  ]);

  const columns: AdminListColumn[] = [
    { label: "Symbol" },
    { label: "Company Name" },
    { label: "Sector" },
    { label: "LTP (NPR)" },
    { label: "Change" },
    { label: "P/E" },
    { label: "EPS" },
    { label: "Market Cap" },
    { label: "Featured" },
    { label: "Status" },
    { label: "Created" },
  ];

  const rows: AdminListRow[] = items.map((item) => ({
    id: item.id,
    cells: [
      (
        <Link
          key="sym"
          href={`/admin/nepse/${item.id}`}
          className="font-bold text-primary hover:underline"
        >
          {item.symbol}
        </Link>
      ),
      (
        <div className="flex flex-col" key="name">
          <span className="font-medium">{item.companyName}</span>
          <span className="text-xs text-muted-foreground">{item.slug}</span>
        </div>
      ),
      <Badge variant="secondary" key="sec">{item.sector.replace(/_/g, " ")}</Badge>,
      (
        <span key="ltp" className="text-sm font-semibold">
          {item.ltp != null ? `Rs. ${item.ltp.toFixed(1)}` : "—"}
        </span>
      ),
      (
        <span
          key="chg"
          className={`text-sm font-medium ${
            (item.percentChange ?? 0) >= 0 ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {item.percentChange != null
            ? `${item.percentChange >= 0 ? "+" : ""}${item.percentChange}%`
            : "—"}
        </span>
      ),
      <span key="pe" className="text-sm">{item.peRatio != null ? item.peRatio.toFixed(1) : "—"}</span>,
      <span key="eps" className="text-sm">{item.eps != null ? `Rs. ${item.eps.toFixed(1)}` : "—"}</span>,
      <span key="mcap" className="text-sm">{item.marketCap != null ? `${item.marketCap} Cr` : "—"}</span>,
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
      title="NEPSE / Share Market"
      description="Manage listed stocks, trading data, sector categorizations, and fundamental ratios."
      columns={columns}
      rows={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      basePath="/admin/nepse"
      apiPath="/api/admin/nepse"
      searchPlaceholder="Search by symbol, company name, or sector..."
      searchQuery={q}
      newLabel="Add stock"
      emptyMessage="No listed companies found."
    />
  );
}
