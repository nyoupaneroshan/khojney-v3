import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { ExamFilters } from "@/components/khojney/exam-filters";
import { ExamListPagination } from "@/components/khojney/exam-list-pagination";
import { ExamCard } from "@/components/khojney/exam-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DIFFICULTIES, EXAM_TYPES } from "@/lib/constants";
import { FileQuestion } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mock Exams & Practice Tests",
  description:
    "Free online mock exams and practice tests for IOE, MBBS, CMAT, Loksewa, Driving License, and more. Instant scoring, detailed explanations.",
  alternates: { canonical: "/exams" },
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

interface SearchParams {
  q?: string;
  category?: string;
  difficulty?: string;
  examType?: string;
  sort?: string;
  page?: string;
  pageSize?: string;
}

export default async function ExamsListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await getSession();
  const sp = await searchParams;

  const q = sp.q?.trim() ?? "";
  const categorySlugs = (sp.category ?? "")
    .split(",")
    .filter(Boolean);
  const difficulty = sp.difficulty ?? "";
  const examType = sp.examType ?? "";
  const sort = sp.sort ?? "newest";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(sp.pageSize ?? String(PAGE_SIZE), 10) || PAGE_SIZE),
  );

  // Build where clause — show parent exams + standalone exams (no parent)
  const where: Record<string, unknown> = {
    isPublished: true,
    parentId: null, // Only show top-level exams (parent or standalone)
  };
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { tags: { contains: q } },
    ];
  }
  if (categorySlugs.length > 0) {
    where.category = { slug: { in: categorySlugs } };
  }
  if (difficulty && DIFFICULTIES.includes(difficulty as never)) {
    where.difficulty = difficulty;
  }
  if (examType && EXAM_TYPES.includes(examType as never)) {
    where.examType = examType;
  }

  // Build orderBy
  let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
  if (sort === "popular") {
    orderBy = { attempts: { _count: "desc" } };
  } else if (sort === "difficulty") {
    orderBy = { difficulty: "asc" };
  }

  const [total, exams, categories] = await Promise.all([
    db.exam.count({ where }),
    db.exam.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        category: true,
        _count: { select: { questions: true, attempts: true, children: true } },
      },
    }),
    db.category.findMany({
      where: { module: "EXAM" },
      orderBy: { order: "asc" },
      include: { _count: { select: { exams: true } } },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AppShell user={user}>
      <div className="container-app py-8 md:py-12">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Exams</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Mock Exams & Practice Tests
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Practice with exam-pattern tests for IOE, MBBS, CMAT, Loksewa, Driving
            License, and more. Free, instant scoring with detailed explanations.
          </p>
        </header>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <Suspense fallback={null}>
            <ExamFilters
              categories={categories.map((c) => ({
                id: c.id,
                slug: c.slug,
                name: c.name,
                _count: { exams: c._count.exams },
              }))}
              difficulties={DIFFICULTIES}
              examTypes={EXAM_TYPES}
            />
          </Suspense>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {total.toLocaleString()} exam{total !== 1 ? "s" : ""} found
                {q && (
                  <>
                    {" "}
                    for <span className="font-medium text-foreground">&ldquo;{q}&rdquo;</span>
                  </>
                )}
              </p>
            </div>

            {exams.length === 0 ? (
              <div className="rounded-lg border border-dashed py-16 text-center">
                <FileQuestion className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No exams found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try removing some filters or searching for something else.
                </p>
                <Link
                  href="/exams"
                  className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Clear all filters
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {exams.map((e) => (
                  <ExamCard
                    key={e.id}
                    exam={{
                      id: e.id,
                      slug: e.slug,
                      title: e.title,
                      description: e.description,
                      durationMin: e.durationMin,
                      totalMarks: e.totalMarks,
                      difficulty: e.difficulty,
                      examType: e.examType,
                      categoryName: e.category?.name ?? null,
                      questionCount: e._count.questions,
                      attemptCount: e._count.attempts,
                    }}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8">
                <ExamListPagination
                  currentPage={page}
                  totalPages={totalPages}
                  searchParams={sp}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
