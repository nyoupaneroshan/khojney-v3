/**
 * Next.js caching utilities for public, non-user-specific data.
 *
 * Use `unstable_cache` from `next/cache` to memoize DB queries at the data
 * layer. Cached results are scoped by the cache tags returned alongside the
 * data, so we can selectively revalidate when content changes.
 *
 * Rules:
 *   - Only cache PUBLIC data (no user-specific fields, no auth checks).
 *   - Never cache admin or dashboard queries.
 *   - Tag every cache so we can call `revalidateTag("...")` after mutations.
 *
 * Usage in a server component:
 *   const categories = await getCachedCategories("COLLEGE");
 *   // ...render UI with categories
 *
 * Usage in an admin POST handler (to bust the cache):
 *   import { revalidateTag } from "next/cache";
 *   revalidateTag("categories");
 */
import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";

// ── Cache tags (used by revalidateTag) ─────────────────────────────────────
export const CACHE_TAGS = {
  categories: "categories",
  featuredColleges: "featured-colleges",
  featuredExams: "featured-exams",
  featuredScholarships: "featured-scholarships",
  featuredJobs: "featured-jobs",
  featuredBanks: "featured-banks",
  featuredGovernment: "featured-government",
  featuredSchools: "featured-schools",
  featuredUniversities: "featured-universities",
  featuredBlog: "featured-blog",
  trendingSearches: "trending-searches",
  blogTags: "blog-tags",
  homepageStats: "homepage-stats",
} as const;

// ── Revalidation windows ───────────────────────────────────────────────────
const ONE_HOUR = 3600;
const ONE_DAY = 86_400;
const FIVE_MINUTES = 300;

// ── Cached queries ─────────────────────────────────────────────────────────

/** Categories for a given module. Cached 1 hour. */
export const getCachedCategories = unstable_cache(
  async (module: string) => {
    return db.category.findMany({
      where: { module },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        icon: true,
        color: true,
      },
    });
  },
  ["categories-by-module"],
  {
    revalidate: ONE_HOUR,
    tags: [CACHE_TAGS.categories],
  }
);

/** Featured + published colleges for the homepage. Cached 1 hour. */
export const getCachedFeaturedColleges = unstable_cache(
  async (limit = 6) => {
    return db.college.findMany({
      where: { isFeatured: true, isPublished: true },
      orderBy: [{ rating: "desc" }, { reviewCount: "desc" }],
      take: limit,
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        logo: true,
        city: true,
        district: true,
        province: true,
        affiliation: true,
        type: true,
        rating: true,
        isVerified: true,
        feesRange: true,
      },
    });
  },
  ["featured-colleges"],
  {
    revalidate: ONE_HOUR,
    tags: [CACHE_TAGS.featuredColleges],
  }
);

/** Featured + published exams for the homepage. Cached 5 minutes. */
export const getCachedFeaturedExams = unstable_cache(
  async (limit = 8) => {
    return db.exam.findMany({
      where: { isFeatured: true, isPublished: true, parentId: null },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        coverImage: true,
        difficulty: true,
        durationMin: true,
        totalMarks: true,
        examType: true,
        _count: { select: { questions: true, attempts: true } },
      },
    });
  },
  ["featured-exams"],
  {
    revalidate: FIVE_MINUTES,
    tags: [CACHE_TAGS.featuredExams],
  }
);

/** Featured + published scholarships (sorted by deadline asc). Cached 1 hour. */
export const getCachedFeaturedScholarships = unstable_cache(
  async (limit = 6) => {
    return db.scholarship.findMany({
      where: { isPublished: true, isFeatured: true },
      orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        provider: true,
        amount: true,
        level: true,
        field: true,
        deadline: true,
        coverImage: true,
        country: true,
      },
    });
  },
  ["featured-scholarships"],
  {
    revalidate: ONE_HOUR,
    tags: [CACHE_TAGS.featuredScholarships],
  }
);

/** Featured + published jobs. Cached 5 minutes (deadlines change). */
export const getCachedFeaturedJobs = unstable_cache(
  async (limit = 6) => {
    return db.job.findMany({
      where: { isFeatured: true, isPublished: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        company: true,
        companyLogo: true,
        location: true,
        jobType: true,
        category: true,
        experienceLevel: true,
        salaryMin: true,
        salaryMax: true,
        salaryCurrency: true,
        deadline: true,
      },
    });
  },
  ["featured-jobs"],
  {
    revalidate: FIVE_MINUTES,
    tags: [CACHE_TAGS.featuredJobs],
  }
);

/** Featured + published banks. Cached 1 day (rates change rarely). */
export const getCachedFeaturedBanks = unstable_cache(
  async (limit = 6) => {
    return db.bank.findMany({
      where: { isFeatured: true, isPublished: true },
      orderBy: { rating: "desc" },
      take: limit,
      select: {
        id: true,
        slug: true,
        name: true,
        shortName: true,
        description: true,
        logo: true,
        type: true,
        headquarters: true,
        establishedYear: true,
        savingsRateMin: true,
        savingsRateMax: true,
        fixedDepositRateMin: true,
        fixedDepositRateMax: true,
        branchCount: true,
        mobileBanking: true,
        internetBanking: true,
        rating: true,
        isFeatured: true,
      },
    });
  },
  ["featured-banks"],
  {
    revalidate: ONE_DAY,
    tags: [CACHE_TAGS.featuredBanks],
  }
);

/** Featured + published government services. Cached 1 day. */
export const getCachedFeaturedGovernment = unstable_cache(
  async (limit = 6) => {
    return db.governmentService.findMany({
      where: { isFeatured: true, isPublished: true },
      orderBy: { views: "desc" },
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        category: true,
        ministry: true,
        department: true,
        processingTime: true,
        applicationFee: true,
        views: true,
      },
    });
  },
  ["featured-government"],
  {
    revalidate: ONE_DAY,
    tags: [CACHE_TAGS.featuredGovernment],
  }
);

/** Featured + published schools. Cached 1 hour. */
export const getCachedFeaturedSchools = unstable_cache(
  async (limit = 6) => {
    return db.school.findMany({
      where: { isFeatured: true, isPublished: true },
      orderBy: [{ rating: "desc" }, { reviewCount: "desc" }],
      take: limit,
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        logo: true,
        city: true,
        district: true,
        level: true,
        affiliation: true,
        type: true,
        rating: true,
      },
    });
  },
  ["featured-schools"],
  {
    revalidate: ONE_HOUR,
    tags: [CACHE_TAGS.featuredSchools],
  }
);

/** Featured + published universities. Cached 1 hour. */
export const getCachedFeaturedUniversities = unstable_cache(
  async (limit = 6) => {
    return db.university.findMany({
      where: { isFeatured: true, isPublished: true },
      orderBy: [{ rating: "desc" }, { ranking: "asc" }],
      take: limit,
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        logo: true,
        city: true,
        type: true,
        ranking: true,
        totalStudents: true,
      },
    });
  },
  ["featured-universities"],
  {
    revalidate: ONE_HOUR,
    tags: [CACHE_TAGS.featuredUniversities],
  }
);

/** Featured published blog posts. Cached 5 minutes. */
export const getCachedFeaturedBlogPosts = unstable_cache(
  async (limit = 6) => {
    return db.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: limit,
      include: {
        category: true,
        author: { select: { name: true, image: true } },
        tags: true,
      },
    });
  },
  ["featured-blog"],
  {
    revalidate: FIVE_MINUTES,
    tags: [CACHE_TAGS.featuredBlog],
  }
);

/** Active trending searches. Cached 1 hour. */
export const getCachedTrendingSearches = unstable_cache(
  async (limit = 10) => {
    return db.trendingSearch.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { count: "desc" }],
      take: limit,
      select: {
        id: true,
        query: true,
        module: true,
        count: true,
      },
    });
  },
  ["trending-searches"],
  {
    revalidate: ONE_HOUR,
    tags: [CACHE_TAGS.trendingSearches],
  }
);

/** Blog tags for the blog list page sidebar. Cached 1 day. */
export const getCachedBlogTags = unstable_cache(
  async () => {
    return db.tag.findMany({
      orderBy: { name: "asc" },
      select: { id: true, slug: true, name: true },
    });
  },
  ["blog-tags"],
  {
    revalidate: ONE_DAY,
    tags: [CACHE_TAGS.blogTags],
  }
);

/** Homepage stats (counts for each module). Cached 1 hour. */
export const getCachedHomepageStats = unstable_cache(
  async () => {
    const [colleges, schools, universities, exams, scholarships, blogPosts, banks, jobs, government] =
      await Promise.all([
        db.college.count({ where: { isPublished: true } }),
        db.school.count({ where: { isPublished: true } }),
        db.university.count({ where: { isPublished: true } }),
        db.exam.count({ where: { isPublished: true, parentId: null } }),
        db.scholarship.count({ where: { isPublished: true } }),
        db.blogPost.count({ where: { status: "PUBLISHED" } }),
        db.bank.count({ where: { isPublished: true } }),
        db.job.count({ where: { isPublished: true } }),
        db.governmentService.count({ where: { isPublished: true } }),
      ]);
    return {
      colleges,
      schools,
      universities,
      exams,
      scholarships,
      blogPosts,
      banks,
      jobs,
      government,
    };
  },
  ["homepage-stats"],
  {
    revalidate: ONE_HOUR,
    tags: [CACHE_TAGS.homepageStats],
  }
);

// ── Entity-level cached queries (by slug) ──────────────────────────────
// These cache individual entity fetches so detail pages don't hit the DB
// on every ISR revalidation. Each is tagged by entity type + slug so admin
// mutations can bust a single entity's cache.

/** Cached exam fetch by slug. Tagged so admin edits bust just this exam. */
export const getCachedExamBySlug = unstable_cache(
  async (slug: string) => {
    return db.exam.findUnique({
      where: { slug, isPublished: true },
      include: {
        category: { select: { name: true, slug: true } },
        questions: { orderBy: { order: "asc" }, select: { id: true, question: true, options: true, marks: true, order: true } },
        _count: { select: { questions: true, attempts: true, children: true } },
      },
    });
  },
  ["exam-by-slug"],
  {
    revalidate: FIVE_MINUTES,
    tags: [CACHE_TAGS.featuredExams, "exam-by-slug"],
  }
);

/** Cached full exam fetch by slug (for landing pages — includes all SEO fields). */
export const getCachedExamForLanding = unstable_cache(
  async (slug: string) => {
    return db.exam.findUnique({
      where: { slug, isPublished: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { questions: true, attempts: true, children: true } },
      },
    });
  },
  ["exam-for-landing"],
  {
    revalidate: FIVE_MINUTES,
    tags: [CACHE_TAGS.featuredExams, "exam-landing"],
  }
);

/** Cached child sets for a parent exam. */
export const getCachedExamChildSets = unstable_cache(
  async (parentId: string) => {
    return db.exam.findMany({
      where: { parentId, isPublished: true },
      select: {
        id: true, slug: true, title: true, description: true,
        durationMin: true, totalMarks: true, difficulty: true, order: true,
        _count: { select: { questions: true, attempts: true } },
      },
      orderBy: { order: "asc" },
    });
  },
  ["exam-child-sets"],
  { revalidate: FIVE_MINUTES, tags: [CACHE_TAGS.featuredExams, "exam-children"] }
);

/** Cached related exams (same category, different slug). */
export const getCachedRelatedExams = unstable_cache(
  async (categoryId: string, excludeSlug: string) => {
    return db.exam.findMany({
      where: { isPublished: true, categoryId, slug: { not: excludeSlug }, parentId: null },
      select: {
        id: true, slug: true, title: true, description: true,
        durationMin: true, totalMarks: true, difficulty: true,
        _count: { select: { questions: true, children: true } },
      },
      take: 6,
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
    });
  },
  ["related-exams"],
  { revalidate: ONE_HOUR, tags: [CACHE_TAGS.featuredExams, "related-exams"] }
);

/** Cached published top-level exams grouped for listing pages. */
export const getCachedPublishedExams = unstable_cache(
  async () => {
    return db.exam.findMany({
      where: { isPublished: true, parentId: null },
      select: {
        id: true, slug: true, title: true, description: true,
        difficulty: true, durationMin: true, totalMarks: true,
        isParent: true, isFeatured: true, categoryId: true,
        coverImage: true, heroDescription: true, order: true,
        _count: { select: { questions: true, attempts: true, children: true } },
      },
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { title: "asc" }],
    });
  },
  ["published-exams"],
  { revalidate: FIVE_MINUTES, tags: [CACHE_TAGS.featuredExams] }
);

/** Cached exam categories. */
export const getCachedExamCategories = unstable_cache(
  async () => {
    return db.category.findMany({
      where: { module: "EXAM" },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: { id: true, slug: true, name: true, description: true, icon: true, color: true },
    });
  },
  ["exam-categories"],
  { revalidate: ONE_HOUR, tags: [CACHE_TAGS.categories] }
);

/** Cached college by slug (for detail page). */
export const getCachedCollegeBySlug = unstable_cache(
  async (slug: string) => {
    return db.college.findUnique({
      where: { slug, isPublished: true },
      include: { category: { select: { name: true, slug: true } } },
    });
  },
  ["college-by-slug"],
  { revalidate: ONE_HOUR, tags: [CACHE_TAGS.featuredColleges, "college-by-slug"] }
);

/** Cached school by slug. */
export const getCachedSchoolBySlug = unstable_cache(
  async (slug: string) => {
    return db.school.findUnique({
      where: { slug, isPublished: true },
      include: { category: { select: { name: true, slug: true } } },
    });
  },
  ["school-by-slug"],
  { revalidate: ONE_HOUR, tags: [CACHE_TAGS.featuredSchools, "school-by-slug"] }
);

/** Cached university by slug. */
export const getCachedUniversityBySlug = unstable_cache(
  async (slug: string) => {
    return db.university.findUnique({
      where: { slug, isPublished: true },
    });
  },
  ["university-by-slug"],
  { revalidate: ONE_HOUR, tags: [CACHE_TAGS.featuredUniversities, "university-by-slug"] }
);

/** Cached bank by slug. */
export const getCachedBankBySlug = unstable_cache(
  async (slug: string) => {
    return db.bank.findUnique({
      where: { slug, isPublished: true },
    });
  },
  ["bank-by-slug"],
  { revalidate: ONE_DAY, tags: [CACHE_TAGS.featuredBanks, "bank-by-slug"] }
);

/** Cached scholarship by slug. */
export const getCachedScholarshipBySlug = unstable_cache(
  async (slug: string) => {
    return db.scholarship.findUnique({
      where: { slug, isPublished: true },
      include: { category: { select: { name: true, slug: true } } },
    });
  },
  ["scholarship-by-slug"],
  { revalidate: ONE_HOUR, tags: [CACHE_TAGS.featuredScholarships, "scholarship-by-slug"] }
);

/** Cached job by slug. */
export const getCachedJobBySlug = unstable_cache(
  async (slug: string) => {
    return db.job.findUnique({
      where: { slug, isPublished: true },
    });
  },
  ["job-by-slug"],
  { revalidate: FIVE_MINUTES, tags: [CACHE_TAGS.featuredJobs, "job-by-slug"] }
);

/** Cached government service by slug. */
export const getCachedGovernmentServiceBySlug = unstable_cache(
  async (slug: string) => {
    return db.governmentService.findUnique({
      where: { slug, isPublished: true },
    });
  },
  ["govt-service-by-slug"],
  { revalidate: ONE_DAY, tags: [CACHE_TAGS.featuredGovernment, "govt-by-slug"] }
);

/** Cached blog post by slug. */
export const getCachedBlogPostBySlug = unstable_cache(
  async (slug: string) => {
    return db.blogPost.findUnique({
      where: { slug, status: "PUBLISHED" },
      include: {
        category: { select: { name: true, slug: true } },
        author: { select: { name: true, image: true } },
        tags: { select: { id: true, slug: true, name: true } },
      },
    });
  },
  ["blog-post-by-slug"],
  { revalidate: FIVE_MINUTES, tags: [CACHE_TAGS.featuredBlog, "blog-by-slug"] }
);

/** Cached blog categories (for blog list sidebar). */
export const getCachedBlogCategories = unstable_cache(
  async () => {
    return db.category.findMany({
      where: { module: "BLOG" },
      orderBy: { name: "asc" },
      select: { id: true, slug: true, name: true, description: true },
    });
  },
  ["blog-categories"],
  { revalidate: ONE_DAY, tags: [CACHE_TAGS.categories] }
);
