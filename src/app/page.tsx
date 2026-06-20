import Link from "next/link";
import { db } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { HomeHero } from "@/components/khojney/home-hero";
import { TrendingSearches } from "@/components/khojney/trending-searches";
import { CategoryGrid } from "@/components/khojney/category-grid";
import { FeaturedColleges } from "@/components/khojney/featured-colleges";
import { FeaturedExams } from "@/components/khojney/featured-exams";
import { FeaturedScholarships } from "@/components/khojney/featured-scholarships";
import { RecentPosts } from "@/components/khojney/recent-posts";
import { StatsRow } from "@/components/khojney/stats-row";
import { FeaturedBanks, FeaturedJobs, FeaturedGovtServices } from "@/components/khojney/featured-phase2";
import { getSession } from "@/lib/auth-server";

export const revalidate = 3600;

export default async function HomePage() {
  const user = await getSession();

  const [trending, featuredColleges, featuredExams, featuredScholarships, recentPosts, categories, featuredBanks, featuredJobs, featuredGovtServices] =
    await Promise.all([
      db.trendingSearch.findMany({
        where: { isActive: true },
        orderBy: [{ order: "asc" }, { count: "desc" }],
        take: 10,
      }),
      db.college.findMany({
        where: { isFeatured: true, isPublished: true },
        orderBy: { rating: "desc" },
        take: 4,
      }),
      db.exam.findMany({
        where: { isFeatured: true, isPublished: true },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { _count: { select: { questions: true, attempts: true } } },
      }),
      db.scholarship.findMany({
        where: { isFeatured: true, isPublished: true },
        orderBy: { deadline: "asc" },
        take: 4,
      }),
      db.blogPost.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 6,
        include: { category: true, author: true },
      }),
      db.category.findMany({
        where: { module: { in: ["EXAM", "COLLEGE", "SCHOOL"] } },
        orderBy: [{ module: "asc" }, { order: "asc" }],
      }),
      db.bank.findMany({
        where: { isFeatured: true, isPublished: true },
        orderBy: { rating: "desc" },
        take: 4,
      }),
      db.job.findMany({
        where: { isFeatured: true, isPublished: true },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      db.governmentService.findMany({
        where: { isFeatured: true, isPublished: true },
        orderBy: { views: "desc" },
        take: 4,
      }),
    ]);

  const stats = {
    colleges: await db.college.count(),
    schools: await db.school.count(),
    universities: await db.university.count(),
    exams: await db.exam.count({ where: { isPublished: true } }),
    scholarships: await db.scholarship.count(),
    posts: await db.blogPost.count({ where: { status: "PUBLISHED" } }),
    banks: await db.bank.count(),
    jobs: await db.job.count({ where: { isPublished: true } }),
    govtServices: await db.governmentService.count({ where: { isPublished: true } }),
  };

  return (
    <AppShell user={user}>
      <HomeHero trending={trending} />
      <StatsRow stats={stats} />
      <CategoryGrid />
      <FeaturedExams exams={featuredExams} />
      <FeaturedColleges colleges={featuredColleges} />
      <FeaturedScholarships scholarships={featuredScholarships} />
      <FeaturedBanks banks={featuredBanks} />
      <FeaturedJobs jobs={featuredJobs} />
      <FeaturedGovtServices services={featuredGovtServices} />
      <RecentPosts posts={recentPosts} />
      <TrendingSearches trending={trending} />

      <section className="bg-muted/30 py-16">
        <div className="container-app text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Build the Wikipedia of Nepal, together.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Khojney is on a mission to organize every exam, college, scholarship, and resource in Nepal
            into one accessible platform. Join thousands of students and educators already using Khojney.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/login?mode=register"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-sm font-medium shadow-sm hover:bg-accent transition-colors"
            >
              Read the Blog
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
