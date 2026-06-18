import { db } from "@/lib/db";
import { AdminList, type AdminListColumn, type AdminListRow } from "@/components/admin/admin-list";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function AdminExamsPage({ searchParams }: PageProps) {
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
          { tags: { contains: q } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    db.exam.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { questions: true, attempts: true } },
      },
    }),
    db.exam.count({ where }),
  ]);

  const columns: AdminListColumn[] = [
    { label: "Title" },
    { label: "Category" },
    { label: "Type" },
    { label: "Difficulty" },
    { label: "Questions" },
    { label: "Attempts" },
    { label: "Duration" },
    { label: "Status" },
    { label: "Created" },
  ];

  const rows: AdminListRow[] = items.map((item) => {
    const diffVariant =
      item.difficulty === "HARD"
        ? "destructive"
        : item.difficulty === "EASY"
          ? "default"
          : "secondary";
    return {
      id: item.id,
      cells: [
        (
          <div className="flex flex-col" key="title">
            <a href={`/admin/exams/${item.id}`} className="font-medium hover:text-primary">
              {item.title}
            </a>
            <span className="text-xs text-muted-foreground">{item.slug}</span>
          </div>
        ),
        item.category ? (
          <Badge variant="outline" key="cat">{item.category.name}</Badge>
        ) : (
          <span className="text-muted-foreground text-xs" key="cat">—</span>
        ),
        <Badge variant="secondary" key="type">{item.examType.replace(/_/g, " ")}</Badge>,
        <Badge variant={diffVariant} key="diff">{item.difficulty}</Badge>,
        `${item._count.questions} Qs`,
        item._count.attempts,
        `${item.durationMin}m`,
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
    };
  });

  return (
    <AdminList
      title="Exams"
      description="Manage mock exams, practice tests, and previous-year papers"
      columns={columns}
      rows={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      basePath="/admin/exams"
      apiPath="/api/admin/exams"
      searchPlaceholder="Search exams by title or tags..."
      searchQuery={q}
      newLabel="Add Exam"
    />
  );
}
