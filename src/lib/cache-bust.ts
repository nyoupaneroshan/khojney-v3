/**
 * Cache invalidation helpers.
 *
 * Call these after admin mutations to bust the corresponding `unstable_cache`
 * entries so the next request re-fetches fresh data from the DB.
 *
 * Note: Next.js 16's `revalidateTag` requires a `profile` argument specifying
 * the cache-life profile to invalidate. We use `"default"` for all busts.
 */
import "server-only";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";

const PROFILE = "default" as const;

/** Bust all category caches (used after create/update/delete of any category). */
export function bustCategories() {
  revalidateTag(CACHE_TAGS.categories, PROFILE);
}

/** Bust featured-colleges cache (after create/update/delete of a college). */
export function bustFeaturedColleges() {
  revalidateTag(CACHE_TAGS.featuredColleges, PROFILE);
}

/** Bust featured-exams cache. */
export function bustFeaturedExams() {
  revalidateTag(CACHE_TAGS.featuredExams, PROFILE);
}

/** Bust featured-scholarships cache. */
export function bustFeaturedScholarships() {
  revalidateTag(CACHE_TAGS.featuredScholarships, PROFILE);
}

/** Bust featured-jobs cache. */
export function bustFeaturedJobs() {
  revalidateTag(CACHE_TAGS.featuredJobs, PROFILE);
}

/** Bust featured-banks cache. */
export function bustFeaturedBanks() {
  revalidateTag(CACHE_TAGS.featuredBanks, PROFILE);
}

/** Bust featured-government cache. */
export function bustFeaturedGovernment() {
  revalidateTag(CACHE_TAGS.featuredGovernment, PROFILE);
}

/** Bust featured-schools cache. */
export function bustFeaturedSchools() {
  revalidateTag(CACHE_TAGS.featuredSchools, PROFILE);
}

/** Bust featured-universities cache. */
export function bustFeaturedUniversities() {
  revalidateTag(CACHE_TAGS.featuredUniversities, PROFILE);
}

/** Bust featured-blog cache. */
export function bustFeaturedBlog() {
  revalidateTag(CACHE_TAGS.featuredBlog, PROFILE);
}

/** Bust trending-searches cache. */
export function bustTrendingSearches() {
  revalidateTag(CACHE_TAGS.trendingSearches, PROFILE);
}

/** Bust blog-tags cache. */
export function bustBlogTags() {
  revalidateTag(CACHE_TAGS.blogTags, PROFILE);
}

/** Bust homepage-stats cache (after any count-changing mutation). */
export function bustHomepageStats() {
  revalidateTag(CACHE_TAGS.homepageStats, PROFILE);
}

/**
 * Bust all caches for a given module. Call from admin CRUD routes after
 * create/update/delete.
 *
 *   bustModule("college");  // → featured-colleges + homepage-stats
 */
export function bustModule(module: string) {
  switch (module.toLowerCase()) {
    case "exam":
      bustExam();
      break;
    case "college":
      bustCollege();
      break;
    case "school":
      bustSchool();
      break;
    case "university":
      bustUniversity();
      break;
    case "scholarship":
      bustScholarship();
      break;
    case "bank":
      bustBank();
      break;
    case "job":
      bustJob();
      break;
    case "government":
    case "government_service":
      bustGovernmentService();
      break;
    case "blog":
    case "post":
      bustBlogPost();
      break;
    case "category":
      bustCategories();
      break;
    case "trending":
      bustTrendingSearches();
      break;
    case "tag":
      bustBlogTags();
      break;
    default:
      // Unknown module — bust homepage stats as a safe default.
      bustHomepageStats();
  }
}

// ── Per-entity cache busting ─────────────────────────────────────────
// These bust a single entity's cache by revalidating the slug-scoped tag.
// Call after admin updates/deletes a specific entity.

/** Bust the cache for a single exam (by slug) + all exam-related caches. */
export function bustExam(slug?: string) {
  revalidateTag("exam-by-slug", PROFILE);
  revalidateTag("exam-landing", PROFILE);
  revalidateTag("exam-children", PROFILE);
  revalidateTag("related-exams", PROFILE);
  bustFeaturedExams();
  bustHomepageStats();
}

/** Bust the cache for a single college. */
export function bustCollege(slug?: string) {
  revalidateTag("college-by-slug", PROFILE);
  bustFeaturedColleges();
  bustHomepageStats();
}

/** Bust the cache for a single school. */
export function bustSchool(slug?: string) {
  revalidateTag("school-by-slug", PROFILE);
  bustFeaturedSchools();
  bustHomepageStats();
}

/** Bust the cache for a single university. */
export function bustUniversity(slug?: string) {
  revalidateTag("university-by-slug", PROFILE);
  bustFeaturedUniversities();
  bustHomepageStats();
}

/** Bust the cache for a single bank. */
export function bustBank(slug?: string) {
  revalidateTag("bank-by-slug", PROFILE);
  bustFeaturedBanks();
  bustHomepageStats();
}

/** Bust the cache for a single scholarship. */
export function bustScholarship(slug?: string) {
  revalidateTag("scholarship-by-slug", PROFILE);
  bustFeaturedScholarships();
  bustHomepageStats();
}

/** Bust the cache for a single job. */
export function bustJob(slug?: string) {
  revalidateTag("job-by-slug", PROFILE);
  bustFeaturedJobs();
  bustHomepageStats();
}

/** Bust the cache for a single government service. */
export function bustGovernmentService(slug?: string) {
  revalidateTag("govt-by-slug", PROFILE);
  bustFeaturedGovernment();
  bustHomepageStats();
}

/** Bust the cache for a single blog post. */
export function bustBlogPost(slug?: string) {
  revalidateTag("blog-by-slug", PROFILE);
  bustFeaturedBlog();
  bustHomepageStats();
}
