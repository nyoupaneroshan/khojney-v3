import Link from "next/link";
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
import {
  getCachedTrendingSearches,
  getCachedFeaturedColleges,
  getCachedFeaturedExams,
  getCachedFeaturedScholarships,
  getCachedFeaturedBlogPosts,
  getCachedFeaturedBanks,
  getCachedFeaturedJobs,
  getCachedFeaturedGovernment,
  getCachedHomepageStats,
  getCachedCategories,
} from "@/lib/cache";

// Page-level ISR: revalidate the entire homepage every hour.
// Per-query caches (in @/lib/cache) layer on top with their own windows.
export const revalidate = 3600;

export default async function HomePage() {
  // getSession is cached per-request via React cache() — calling it here is
  // free even if child components also call it. The page content itself is
  // fully public; only the AppShell avatar uses the user.
  const user = await getSession();

  // Batch all featured-content fetches in parallel. Each call hits the
  // unstable_cache layer first, falling back to the DB only on cache miss.
  const [
    trending,
    featuredColleges,
    featuredExams,
    featuredScholarships,
    recentPosts,
    featuredBanks,
    featuredJobs,
    featuredGovtServices,
    stats,
  ] = await Promise.all([
    getCachedTrendingSearches(10),
    getCachedFeaturedColleges(4),
    getCachedFeaturedExams(6),
    getCachedFeaturedScholarships(4),
    getCachedFeaturedBlogPosts(6),
    getCachedFeaturedBanks(4),
    getCachedFeaturedJobs(4),
    getCachedFeaturedGovernment(4),
    getCachedHomepageStats(),
  ]);

  // Adapt the stats shape to what the StatsRow component expects.
  const statsProps = {
    colleges: stats.colleges,
    schools: stats.schools,
    universities: stats.universities,
    exams: stats.exams,
    scholarships: stats.scholarships,
    posts: stats.blogPosts,
    banks: stats.banks,
    jobs: stats.jobs,
    govtServices: stats.government,
  };

  return (
    <AppShell user={user}>
      <HomeHero trending={trending} />
      <StatsRow stats={statsProps} />

      {/* Quick Start — one-click access to top mock tests */}
      <section className="py-10 bg-muted/30">
        <div className="container-app">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Quick Start — Free Mock Tests</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Start practicing immediately — no signup required.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "IOE Mock Test", href: "/mock-exams/engineering-entrance-parent/ioe-entrance", emoji: "⚙️" },
              { label: "CEE / MBBS", href: "/mock-exams/medical-entrance-parent/mbbs-cee", emoji: "⚕️" },
              { label: "CMAT Mock", href: "/mock-exams/management-entrance-parent/cmat-full", emoji: "📊" },
              { label: "Loksewa", href: "/mock-exams/loksewa/loksewa-kharidar", emoji: "🏛️" },
              { label: "Driving License", href: "/mock-exams/driving-license/driving-license-parent", emoji: "🚗" },
              { label: "All Exams", href: "/mock-exams", emoji: "📚" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-xs font-medium text-foreground group-hover:text-primary">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
