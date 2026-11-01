import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardTabs } from "@/components/khojney/dashboard-tabs";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Dashboard",
  description: "View your exam history, saved bookmarks, achievements, and notifications.",
};

interface BookmarkWithData {
  id: string;
  entity: string;
  entityId: string;
  createdAt: Date;
  data: {
    title: string;
    slug?: string;
    description?: string;
    image?: string | null;
    meta?: string;
  } | null;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link: string | null;
  createdAt: Date;
}

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const [attempts, bookmarks, notifications, attemptCount, certificatesCount] =
    await Promise.all([
      db.examAttempt.findMany({
        where: { userId: user.id, finishedAt: { not: null } },
        orderBy: { finishedAt: "desc" },
        take: 50,
        include: { exam: { select: { title: true, slug: true, totalMarks: true } } },
      }),
      db.bookmark.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      db.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      db.examAttempt.count({
        where: { userId: user.id, finishedAt: { not: null } },
      }),
      // certificates count proxy: attempts where pct >= 80
      db.examAttempt.count({
        where: {
          userId: user.id,
          finishedAt: { not: null },
        },
      }),
    ]);

  // Resolve bookmark related records
  const bookmarkByEntity: Record<string, string[]> = {};
  for (const b of bookmarks) {
    if (!bookmarkByEntity[b.entity]) bookmarkByEntity[b.entity] = [];
    bookmarkByEntity[b.entity].push(b.entityId);
  }

  const resolveBookmarks = async (): Promise<BookmarkWithData[]> => {
    const results: BookmarkWithData[] = [];
    const tasks: Promise<void>[] = [];

    if (bookmarkByEntity.EXAM?.length) {
      tasks.push(
        db.exam
          .findMany({ where: { id: { in: bookmarkByEntity.EXAM } } })
          .then((rows) => {
            for (const r of rows) {
              const bm = bookmarks.find(
                (b) => b.entity === "EXAM" && b.entityId === r.id,
              );
              if (!bm) continue;
              results.push({
                id: bm.id,
                entity: bm.entity,
                entityId: bm.entityId,
                createdAt: bm.createdAt,
                data: {
                  title: r.title,
                  slug: r.slug,
                  description: r.description,
                  image: r.coverImage,
                  meta: `${r.difficulty} · ${r.durationMin} min`,
                },
              });
            }
          }),
      );
    }
    if (bookmarkByEntity.COLLEGE?.length) {
      tasks.push(
        db.college
          .findMany({ where: { id: { in: bookmarkByEntity.COLLEGE } } })
          .then((rows) => {
            for (const r of rows) {
              const bm = bookmarks.find(
                (b) => b.entity === "COLLEGE" && b.entityId === r.id,
              );
              if (!bm) continue;
              results.push({
                id: bm.id,
                entity: bm.entity,
                entityId: bm.entityId,
                createdAt: bm.createdAt,
                data: {
                  title: r.name,
                  slug: r.slug,
                  description: r.description,
                  image: r.logo ?? r.coverImage,
                  meta: [r.city, r.affiliation].filter(Boolean).join(" · "),
                },
              });
            }
          }),
      );
    }
    if (bookmarkByEntity.SCHOOL?.length) {
      tasks.push(
        db.school
          .findMany({ where: { id: { in: bookmarkByEntity.SCHOOL } } })
          .then((rows) => {
            for (const r of rows) {
              const bm = bookmarks.find(
                (b) => b.entity === "SCHOOL" && b.entityId === r.id,
              );
              if (!bm) continue;
              results.push({
                id: bm.id,
                entity: bm.entity,
                entityId: bm.entityId,
                createdAt: bm.createdAt,
                data: {
                  title: r.name,
                  slug: r.slug,
                  description: r.description,
                  image: r.logo ?? r.coverImage,
                  meta: [r.city, r.level].filter(Boolean).join(" · "),
                },
              });
            }
          }),
      );
    }
    if (bookmarkByEntity.UNIVERSITY?.length) {
      tasks.push(
        db.university
          .findMany({ where: { id: { in: bookmarkByEntity.UNIVERSITY } } })
          .then((rows) => {
            for (const r of rows) {
              const bm = bookmarks.find(
                (b) => b.entity === "UNIVERSITY" && b.entityId === r.id,
              );
              if (!bm) continue;
              results.push({
                id: bm.id,
                entity: bm.entity,
                entityId: bm.entityId,
                createdAt: bm.createdAt,
                data: {
                  title: r.name,
                  slug: r.slug,
                  description: r.description,
                  image: r.logo ?? r.coverImage,
                  meta: [r.city, r.type].filter(Boolean).join(" · "),
                },
              });
            }
          }),
      );
    }
    if (bookmarkByEntity.SCHOLARSHIP?.length) {
      tasks.push(
        db.scholarship
          .findMany({ where: { id: { in: bookmarkByEntity.SCHOLARSHIP } } })
          .then((rows) => {
            for (const r of rows) {
              const bm = bookmarks.find(
                (b) => b.entity === "SCHOLARSHIP" && b.entityId === r.id,
              );
              if (!bm) continue;
              results.push({
                id: bm.id,
                entity: bm.entity,
                entityId: bm.entityId,
                createdAt: bm.createdAt,
                data: {
                  title: r.title,
                  slug: r.slug,
                  description: r.description,
                  image: r.coverImage,
                  meta: [r.provider, r.amount].filter(Boolean).join(" · "),
                },
              });
            }
          }),
      );
    }
    if (bookmarkByEntity.POST?.length) {
      tasks.push(
        db.blogPost
          .findMany({ where: { id: { in: bookmarkByEntity.POST } } })
          .then((rows) => {
            for (const r of rows) {
              const bm = bookmarks.find(
                (b) => b.entity === "POST" && b.entityId === r.id,
              );
              if (!bm) continue;
              results.push({
                id: bm.id,
                entity: bm.entity,
                entityId: bm.entityId,
                createdAt: bm.createdAt,
                data: {
                  title: r.title,
                  slug: r.slug,
                  description: r.excerpt ?? r.content.slice(0, 150),
                  image: r.coverImage,
                  meta: `${r.readTimeMin} min read`,
                },
              });
            }
          }),
      );
    }
    if (bookmarkByEntity.BANK?.length) {
      tasks.push(
        db.bank
          .findMany({ where: { id: { in: bookmarkByEntity.BANK } } })
          .then((rows) => {
            for (const r of rows) {
              const bm = bookmarks.find(
                (b) => b.entity === "BANK" && b.entityId === r.id,
              );
              if (!bm) continue;
              results.push({
                id: bm.id,
                entity: bm.entity,
                entityId: bm.entityId,
                createdAt: bm.createdAt,
                data: {
                  title: r.name,
                  slug: r.slug,
                  description: r.description,
                  image: r.logo,
                  meta: r.branchCount ? `${r.branchCount} branches` : undefined,
                },
              });
            }
          }),
      );
    }
    if (bookmarkByEntity.JOB?.length) {
      tasks.push(
        db.job
          .findMany({ where: { id: { in: bookmarkByEntity.JOB } } })
          .then((rows) => {
            for (const r of rows) {
              const bm = bookmarks.find(
                (b) => b.entity === "JOB" && b.entityId === r.id,
              );
              if (!bm) continue;
              results.push({
                id: bm.id,
                entity: bm.entity,
                entityId: bm.entityId,
                createdAt: bm.createdAt,
                data: {
                  title: r.title,
                  slug: r.slug,
                  description: r.description,
                  image: r.companyLogo,
                  meta: [r.company, r.location].filter(Boolean).join(" · "),
                },
              });
            }
          }),
      );
    }
    if (bookmarkByEntity.GOVERNMENT_SERVICE?.length) {
      tasks.push(
        db.governmentService
          .findMany({ where: { id: { in: bookmarkByEntity.GOVERNMENT_SERVICE } } })
          .then((rows) => {
            for (const r of rows) {
              const bm = bookmarks.find(
                (b) => b.entity === "GOVERNMENT_SERVICE" && b.entityId === r.id,
              );
              if (!bm) continue;
              results.push({
                id: bm.id,
                entity: bm.entity,
                entityId: bm.entityId,
                createdAt: bm.createdAt,
                data: {
                  title: r.title,
                  slug: r.slug,
                  description: r.description,
                  meta: [r.ministry, r.department].filter(Boolean).join(" · "),
                },
              });
            }
          }),
      );
    }
    if (bookmarkByEntity.HOSPITAL?.length) {
      tasks.push(
        db.hospital
          .findMany({ where: { id: { in: bookmarkByEntity.HOSPITAL } } })
          .then((rows) => {
            for (const r of rows) {
              const bm = bookmarks.find(
                (b) => b.entity === "HOSPITAL" && b.entityId === r.id,
              );
              if (!bm) continue;
              results.push({
                id: bm.id,
                entity: bm.entity,
                entityId: bm.entityId,
                createdAt: bm.createdAt,
                data: {
                  title: r.name,
                  slug: r.slug,
                  description: r.description,
                  image: r.logo || r.coverImage,
                  meta: [r.city, r.bedCount ? `${r.bedCount} beds` : null].filter(Boolean).join(" · "),
                },
              });
            }
          }),
      );
    }
    if (bookmarkByEntity.MUTUAL_FUND?.length) {
      tasks.push(
        db.mutualFund
          .findMany({ where: { id: { in: bookmarkByEntity.MUTUAL_FUND } } })
          .then((rows) => {
            for (const r of rows) {
              const bm = bookmarks.find(
                (b) => b.entity === "MUTUAL_FUND" && b.entityId === r.id,
              );
              if (!bm) continue;
              results.push({
                id: bm.id,
                entity: bm.entity,
                entityId: bm.entityId,
                createdAt: bm.createdAt,
                data: {
                  title: r.name,
                  slug: r.slug,
                  description: r.description,
                  meta: [r.fundManager, r.nav ? `NAV: NPR ${r.nav}` : null].filter(Boolean).join(" · "),
                },
              });
            }
          }),
      );
    }
    const nepseIds = [...(bookmarkByEntity.NEPSE_STOCK || []), ...(bookmarkByEntity.NEPSE || [])];
    if (nepseIds.length) {
      tasks.push(
        db.nepseStock
          .findMany({ where: { id: { in: nepseIds } } })
          .then((rows) => {
            for (const r of rows) {
              const bm = bookmarks.find(
                (b) => (b.entity === "NEPSE_STOCK" || b.entity === "NEPSE") && b.entityId === r.id,
              );
              if (!bm) continue;
              results.push({
                id: bm.id,
                entity: bm.entity,
                entityId: bm.entityId,
                createdAt: bm.createdAt,
                data: {
                  title: `${r.symbol} (${r.companyName})`,
                  slug: r.slug,
                  description: r.description,
                  meta: r.ltp ? `LTP: NPR ${r.ltp} (${r.sector})` : r.sector,
                },
              });
            }
          }),
      );
    }
    if (bookmarkByEntity.INSURANCE?.length) {
      tasks.push(
        db.insuranceCompany
          .findMany({ where: { id: { in: bookmarkByEntity.INSURANCE } } })
          .then((rows) => {
            for (const r of rows) {
              const bm = bookmarks.find(
                (b) => b.entity === "INSURANCE" && b.entityId === r.id,
              );
              if (!bm) continue;
              results.push({
                id: bm.id,
                entity: bm.entity,
                entityId: bm.entityId,
                createdAt: bm.createdAt,
                data: {
                  title: r.name,
                  slug: r.slug,
                  description: r.description,
                  image: r.logo,
                  meta: [r.type, r.claimSettlementRatio ? `CSR: ${r.claimSettlementRatio}%` : null].filter(Boolean).join(" · "),
                },
              });
            }
          }),
      );
    }

    await Promise.all(tasks);
    // Sort by createdAt desc
    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return results;
  };

  const resolvedBookmarks = await resolveBookmarks();

  // Compute avg score
  const avgScore = attempts.length
    ? Math.round(
        (attempts.reduce((sum, a) => sum + (a.score / a.totalMarks) * 100, 0) /
          attempts.length) *
          10,
      ) / 10
    : 0;

  // Compute achievements from attempts
  const totalAttempts = attemptCount;
  const bestPct = attempts.length
    ? Math.max(...attempts.map((a) => (a.score / a.totalMarks) * 100))
    : 0;
  const perfectScores = attempts.filter(
    (a) => a.score === a.totalMarks,
  ).length;
  const distinctExams = new Set(attempts.map((a) => a.examId)).size;

  const achievements = [
    {
      id: "first-exam",
      title: "First Exam",
      desc: "Take your first mock exam",
      icon: "Flag",
      unlocked: totalAttempts >= 1,
    },
    {
      id: "five-exams",
      title: "Getting Serious",
      desc: "Take 5 mock exams",
      icon: "BookOpen",
      unlocked: totalAttempts >= 5,
    },
    {
      id: "ten-exams",
      title: "Exam Pro",
      desc: "Take 10 mock exams",
      icon: "Trophy",
      unlocked: totalAttempts >= 10,
    },
    {
      id: "five-distinct",
      title: "Explorer",
      desc: "Try 5 different exams",
      icon: "Compass",
      unlocked: distinctExams >= 5,
    },
    {
      id: "score-80",
      title: "High Scorer",
      desc: "Score 80% or above in any exam",
      icon: "Star",
      unlocked: bestPct >= 80,
    },
    {
      id: "perfect-score",
      title: "Perfectionist",
      desc: "Get a perfect score in any exam",
      icon: "Award",
      unlocked: perfectScores > 0,
    },
    {
      id: "bookmarks-5",
      title: "Collector",
      desc: "Save 5 bookmarks",
      icon: "Bookmark",
      unlocked: bookmarks.length >= 5,
    },
    {
      id: "bookmarks-20",
      title: "Archivist",
      desc: "Save 20 bookmarks",
      icon: "BookmarkCheck",
      unlocked: bookmarks.length >= 20,
    },
  ];

  const stats = {
    examsTaken: totalAttempts,
    avgScore,
    bookmarksCount: bookmarks.length,
    certificatesCount, // proxy: total completed exams (>= 80% would be better, but use total)
  };

  const serializedAttempts = attempts.map((a) => ({
    id: a.id,
    score: a.score,
    totalMarks: a.totalMarks,
    correctCount: a.correctCount,
    wrongCount: a.wrongCount,
    durationSec: a.durationSec,
    rank: a.rank,
    finishedAt: a.finishedAt?.toISOString() ?? null,
    exam: {
      title: a.exam.title,
      slug: a.exam.slug,
    },
  }));

  const serializedNotifications: NotificationItem[] = notifications.map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type,
    read: n.read,
    link: n.link,
    createdAt: n.createdAt,
  }));

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <AppShell user={user}>
      <div className="container-app py-8 md:py-12">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Hello, {user.name ?? user.email.split("@")[0]}!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Welcome to your dashboard. Track your progress, manage bookmarks, and view achievements.
          </p>
        </header>

        <DashboardTabs
          stats={stats}
          attempts={serializedAttempts}
          bookmarks={resolvedBookmarks.map((b) => ({
            id: b.id,
            entity: b.entity,
            entityId: b.entityId,
            createdAt: b.createdAt.toISOString(),
            data: b.data,
          }))}
          achievements={achievements}
          notifications={serializedNotifications.map((n) => ({
            ...n,
            createdAt: n.createdAt.toISOString(),
          }))}
          unreadCount={unreadNotifications}
          user={{ name: user.name, email: user.email }}
        />
      </div>
    </AppShell>
  );
}
