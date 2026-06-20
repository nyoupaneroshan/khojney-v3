import Link from "next/link";
import { db } from "@/lib/db";
import { AdminList, type AdminListColumn, type AdminListRow } from "@/components/admin/admin-list";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/admin-utils";
import { formatSalary } from "@/lib/job-utils";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function AdminJobsPage({ searchParams }: PageProps) {
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
          { company: { contains: q } },
          { location: { contains: q } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    db.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.job.count({ where }),
  ]);

  const columns: AdminListColumn[] = [
    { label: "Title" },
    { label: "Company" },
    { label: "Type" },
    { label: "Category" },
    { label: "Location" },
    { label: "Experience" },
    { label: "Salary" },
    { label: "Deadline" },
    { label: "Featured" },
    { label: "Status" },
  ];

  const rows: AdminListRow[] = items.map((item) => ({
    id: item.id,
    cells: [
      (
        <div className="flex flex-col" key="title">
          <Link
            href={`/admin/jobs/${item.id}`}
            className="font-medium hover:text-primary"
          >
            {item.title}
          </Link>
          <span className="text-xs text-muted-foreground">{item.slug}</span>
        </div>
      ),
      <span key="company" className="text-sm">{item.company || "—"}</span>,
      <Badge variant="secondary" key="type">{item.jobType}</Badge>,
      item.category ? (
        <Badge variant="outline" key="cat">{item.category}</Badge>
      ) : (
        <span className="text-muted-foreground text-xs" key="cat">—</span>
      ),
      <span key="loc" className="text-xs">{item.location ?? "—"}</span>,
      <Badge variant="outline" key="exp">{item.experienceLevel}</Badge>,
      (
        <span key="salary" className="text-xs">
          {formatSalary(item.salaryMin, item.salaryMax, item.salaryCurrency) ?? "—"}
        </span>
      ),
      <span className="text-xs text-muted-foreground" key="deadline">
        {item.deadline ? formatDate(item.deadline) : "—"}
      </span>,
      (
        <span key="featured">
          {item.isFeatured ? (
            <Badge variant="default">Yes</Badge>
          ) : (
            <span className="text-muted-foreground text-xs">—</span>
          )}
        </span>
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
      title="Jobs"
      description="Manage all job listings on the platform"
      columns={columns}
      rows={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      basePath="/admin/jobs"
      apiPath="/api/admin/jobs"
      searchPlaceholder="Search jobs by title, company, location..."
      searchQuery={q}
      newLabel="Add Job"
    />
  );
}
