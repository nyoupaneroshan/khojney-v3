// Khojney Nepal Homepage
import Link from "next/link";
import { Play, ArrowRight, Sparkles, ShieldCheck, Cog, Stethoscope, GraduationCap, Landmark, Car, BookOpen } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { HomeHero } from "@/components/khojney/home-hero";
import { TrendingSearches } from "@/components/khojney/trending-searches";
import { CategoryGrid } from "@/components/khojney/category-grid";
import { FeaturedColleges } from "@/components/khojney/featured-colleges";
import { FeaturedExams } from "@/components/khojney/featured-exams";
import { FeaturedScholarships } from "@/components/khojney/featured-scholarships";
import { RecentPosts } from "@/components/khojney/recent-posts";
import { StatsRow } from "@/components/khojney/stats-row";
import { JsonLd } from "@/components/khojney/json-ld";
import { FeaturedBanks, FeaturedJobs, FeaturedGovtServices } from "@/components/khojney/featured-phase2";
import {
  FeaturedHospitals,
  FeaturedNepseStocks,
  FeaturedMutualFunds,
  FeaturedInsurance,
} from "@/components/khojney/featured-phase3";
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
  getCachedFeaturedHospitals,
  getCachedFeaturedNepseStocks,
  getCachedFeaturedMutualFunds,
  getCachedFeaturedInsurance,
  getCachedHomepageStats,
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
    featuredHospitals,
    featuredNepseStocks,
    featuredMutualFunds,
    featuredInsurance,
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
    getCachedFeaturedHospitals(4),
    getCachedFeaturedNepseStocks(4),
    getCachedFeaturedMutualFunds(4),
    getCachedFeaturedInsurance(4),
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
    hospitals: stats.hospitals,
    mutualFunds: stats.mutualFunds,
    nepseStocks: stats.nepseStocks,
    insurance: stats.insurance,
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Khojney",
    alternateName: ["Khojney Nepal", "खोज्ने"],
    url: "https://khojney.com",
    description:
      "Nepal's knowledge & preparation platform for mock tests, colleges, scholarships, hospitals, banks, and public resources.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://khojney.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Khojney",
    url: "https://khojney.com",
    logo: "https://khojney.com/logo.svg",
    description:
      "Khojney is on a mission to organize every exam, college, scholarship, and public resource in Nepal into one accessible platform.",
    sameAs: [
      "https://facebook.com/khojney",
      "https://twitter.com/khojney",
    ],
  };

  return (
    <AppShell user={user}>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={organizationJsonLd} />
      <HomeHero trending={trending} />
      <StatsRow stats={statsProps} />

      {/* 1-Click Fast-Track Tests Section */}
      <section className="py-16 md:py-20 border-b border-border bg-background">
        <div className="container-app">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                <Sparkles className="h-3.5 w-3.5" /> High-Velocity Practice
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Quick Start — Free Entrance Tests
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl">
                Jump directly into Question #1. Real exam timer, negative marking simulation, and zero signup barrier.
              </p>
            </div>

            <Link
              href="/exams"
              className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline self-start sm:self-auto"
            >
              Browse all 45+ exams <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: "IOE Pulchowk Entrance",
                subtitle: "Engineering • Set 1 Mock Test • 30 Min",
                takeHref: "/exams/ioe-entrance-set-1/take",
                infoHref: "/exams/ioe-entrance",
                badge: "Engineering",
                icon: Cog,
              },
              {
                title: "CEE MBBS Entrance Exam",
                subtitle: "Medical • Set 1 Mock Test • 30 Min",
                takeHref: "/exams/mbbs-cee-set-1/take",
                infoHref: "/exams/mbbs-cee",
                badge: "Medical",
                icon: Stethoscope,
              },
              {
                title: "CMAT Entrance Mock Test",
                subtitle: "Management • Set 1 Mock Test • 30 Min",
                takeHref: "/exams/cmat-full-set-1/take",
                infoHref: "/exams/cmat-full",
                badge: "Management",
                icon: GraduationCap,
              },
              {
                title: "Loksewa Kharidar Exam",
                subtitle: "Civil Service • Set 1 Mock Test • 20 Min",
                takeHref: "/exams/loksewa-kharidar-set-1/take",
                infoHref: "/exams/loksewa-kharidar",
                badge: "PSC / Loksewa",
                icon: Landmark,
              },
              {
                title: "Driving License Written Exam",
                subtitle: "Category A (Bike) • Set 1 • 20 Min",
                takeHref: "/exams/driving-bike-set-1/take",
                infoHref: "/exams/driving-license-parent",
                badge: "Transport",
                icon: Car,
              },
              {
                title: "All Mock Test Series",
                subtitle: "45+ Faculty Sets • Instant Scorecards",
                takeHref: "/exams",
                infoHref: "/exams",
                badge: "All Faculties",
                icon: BookOpen,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-md transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-border/60 flex items-center gap-2">
                    <Link
                      href={item.takeHref}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-3 text-xs font-semibold shadow-xs transition-transform active:scale-95"
                    >
                      <Play className="h-3 w-3 fill-current" /> 1-Click Take
                    </Link>
                    <Link
                      href={item.infoHref}
                      className="inline-flex items-center justify-center rounded-xl border border-border bg-muted/40 hover:bg-muted py-2 px-3 text-xs font-medium text-foreground transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CategoryGrid />
      <FeaturedExams exams={featuredExams} />
      <FeaturedColleges colleges={featuredColleges} />
      <FeaturedScholarships scholarships={featuredScholarships} />
      <FeaturedNepseStocks stocks={featuredNepseStocks} />
      <FeaturedMutualFunds funds={featuredMutualFunds} />
      <FeaturedBanks banks={featuredBanks} />
      <FeaturedInsurance companies={featuredInsurance} />
      <FeaturedHospitals hospitals={featuredHospitals} />
      <FeaturedJobs jobs={featuredJobs} />
      <FeaturedGovtServices services={featuredGovtServices} />
      <RecentPosts posts={recentPosts} />
      <TrendingSearches trending={trending} />

      {/* Community & Mission Banner */}
      <section className="border-t border-border bg-gradient-to-b from-muted/30 to-background py-16 md:py-24">
        <div className="container-app text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-6 shadow-xs">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Open, Accessible Knowledge for Every Nepali Student</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
            Building Nepal's Most Reliable Education Ecosystem.
          </h2>

          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Khojney is on a mission to map every exam syllabus, accredited college, scholarship, and public citizen service into one searchable, accessible platform.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <Link
              href="/login?mode=register"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-95"
            >
              Create Free Student Account
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-xs hover:bg-muted transition-all"
            >
              Read Editorial Guides
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
