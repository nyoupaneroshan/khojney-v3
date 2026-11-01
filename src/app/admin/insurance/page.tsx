import Link from "next/link";
import { db } from "@/lib/db";
import { AdminList, type AdminListColumn, type AdminListRow } from "@/components/admin/admin-list";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function AdminInsurancePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const pageSize = 20;
  const q = (sp.q ?? "").trim();
  const skip = (page - 1) * pageSize;

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { shortName: { contains: q, mode: "insensitive" as const } },
          { type: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    db.insuranceCompany.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.insuranceCompany.count({ where }),
  ]);

  const columns: AdminListColumn[] = [
    { label: "Company Name" },
    { label: "Code" },
    { label: "Type" },
    { label: "Claim Ratio" },
    { label: "Capital" },
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
            href={`/admin/insurance/${item.id}`}
            className="font-medium hover:text-primary"
          >
            {item.name}
          </Link>
          <span className="text-xs text-muted-foreground">{item.slug}</span>
        </div>
      ),
      <Badge variant="outline" key="short">{item.shortName}</Badge>,
      <Badge variant="secondary" key="type">{item.type.replace(/_/g, " ")}</Badge>,
      (
        <span key="claim" className="text-sm font-semibold text-emerald-600">
          {item.claimSettlementRatio != null ? `${item.claimSettlementRatio}%` : "—"}
        </span>
      ),
      <span key="cap" className="text-sm">
        {item.paidUpCapital != null ? `${item.paidUpCapital} Cr` : "—"}
      </span>,
      <span key="br" className="text-sm">
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
      title="Insurance Companies"
      description="Compare and manage Life, Non-Life, and Micro-Insurance companies in Nepal."
      columns={columns}
      rows={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      basePath="/admin/insurance"
      apiPath="/api/admin/insurance"
      searchPlaceholder="Search by name, short code, or type..."
      searchQuery={q}
      newLabel="Add insurance company"
      emptyMessage="No insurance companies found."
    />
  );
}
