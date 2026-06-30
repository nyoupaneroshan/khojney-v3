import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { RateLimiter } from "@/lib/rate-limit";

interface SearchHit {
  type: string;
  id: string;
  slug: string;
  title: string;
  description: string;
  url: string;
  image: string | null;
  meta: Record<string, string | number | null>;
}

const MODULE_LABELS: Record<string, string> = {
  EXAM: "Exam",
  COLLEGE: "College",
  SCHOOL: "School",
  UNIVERSITY: "University",
  SCHOLARSHIP: "Scholarship",
  BLOG: "Article",
  BANK: "Bank",
  JOB: "Job",
  GOVERNMENT_SERVICE: "Government Service",
};

// 30 searches per minute per IP (or per user if logged in).
const searchLimiter = new RateLimiter({ windowMs: 60_000, max: 30 });

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * Universal search API.
 *
 * GET /api/search?q=...&module=...&page=1&pageSize=10
 * Searches across Exams, Colleges, Schools, Universities, Scholarships, BlogPosts.
 *
 * Rate-limited to 30 requests/minute per client to prevent abuse.
 */
export async function GET(req: NextRequest) {
  // Rate limit
  const ip = getClientIp(req);
  const rl = searchLimiter.check(`search:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many searches. Please slow down." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().slice(0, 200); // cap query length
  const moduleParam = searchParams.get("module")?.toUpperCase() ?? null;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "10", 10) || 10),
  );

  if (!q || q.length < 2) {
    return NextResponse.json({
      results: [],
      total: 0,
      page,
      pageSize,
      q,
    });
  }

  // Reuse the cached session — `getSession()` is wrapped in `cache()`, so
  // additional calls within the same request are free.
  const session = await getSession();

  const results: SearchHit[] = [];
  const wantsAll = !moduleParam;

  // Run searches in parallel (batch)
  const tasks: Promise<SearchHit[]>[] = [];

  if (wantsAll || moduleParam === "EXAM") {
    tasks.push(searchExams(q));
  }
  if (wantsAll || moduleParam === "COLLEGE") {
    tasks.push(searchColleges(q));
  }
  if (wantsAll || moduleParam === "SCHOOL") {
    tasks.push(searchSchools(q));
  }
  if (wantsAll || moduleParam === "UNIVERSITY") {
    tasks.push(searchUniversities(q));
  }
  if (wantsAll || moduleParam === "SCHOLARSHIP") {
    tasks.push(searchScholarships(q));
  }
  if (wantsAll || moduleParam === "BLOG") {
    tasks.push(searchPosts(q));
  }
  if (wantsAll || moduleParam === "BANK") {
    tasks.push(searchBanks(q));
  }
  if (wantsAll || moduleParam === "JOB") {
    tasks.push(searchJobs(q));
  }
  if (wantsAll || moduleParam === "GOVERNMENT_SERVICE") {
    tasks.push(searchGovernmentServices(q));
  }

  const allResults = (await Promise.all(tasks)).flat();
  // Stable sort: by relevance proxy — exact title startsWith first, then alphabetical
  allResults.sort((a, b) => {
    const aStarts = a.title.toLowerCase().startsWith(q.toLowerCase()) ? 0 : 1;
    const bStarts = b.title.toLowerCase().startsWith(q.toLowerCase()) ? 0 : 1;
    if (aStarts !== bStarts) return aStarts - bStarts;
    return a.title.localeCompare(b.title);
  });

  const total = allResults.length;
  const start = (page - 1) * pageSize;
  const paged = allResults.slice(start, start + pageSize);

  // Save search history asynchronously (non-blocking fire-and-forget)
  if (session) {
    db.searchHistory
      .create({
        data: {
          userId: session.id,
          query: q,
          module: moduleParam,
          results: total,
        },
      })
      .catch(() => {
        // ignore errors — history is best-effort
      });
  }

  return NextResponse.json({
    results: paged,
    total,
    page,
    pageSize,
    q,
    modules: Object.keys(MODULE_LABELS),
  });
}

// Each search helper uses `select` (not `include`) to fetch only the fields
// the response needs — no `_count` aggregations unless explicitly used.

async function searchExams(q: string): Promise<SearchHit[]> {
  const rows = await db.exam.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: q } },
        { description: { contains: q } },
        { tags: { contains: q } },
      ],
    },
    take: 25,
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      coverImage: true,
      difficulty: true,
      durationMin: true,
      category: { select: { name: true } },
    },
  });
  return rows.map((e) => ({
    type: "EXAM",
    id: e.id,
    slug: e.slug,
    title: e.title,
    description: e.description,
    url: `/exams/${e.slug}`,
    image: e.coverImage ?? null,
    meta: {
      category: e.category?.name ?? null,
      difficulty: e.difficulty,
      duration: `${e.durationMin} min`,
    },
  }));
}

async function searchColleges(q: string): Promise<SearchHit[]> {
  const rows = await db.college.findMany({
    where: {
      isPublished: true,
      OR: [
        { name: { contains: q } },
        { description: { contains: q } },
        { city: { contains: q } },
        { district: { contains: q } },
        { affiliation: { contains: q } },
      ],
    },
    take: 25,
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      logo: true,
      coverImage: true,
      city: true,
      district: true,
      affiliation: true,
      rating: true,
      category: { select: { name: true } },
    },
  });
  return rows.map((c) => ({
    type: "COLLEGE",
    id: c.id,
    slug: c.slug,
    title: c.name,
    description: c.description,
    url: `/colleges/${c.slug}`,
    image: c.logo ?? c.coverImage ?? null,
    meta: {
      category: c.category?.name ?? null,
      city: c.city,
      district: c.district,
      affiliation: c.affiliation,
      rating: c.rating,
    },
  }));
}

async function searchSchools(q: string): Promise<SearchHit[]> {
  const rows = await db.school.findMany({
    where: {
      isPublished: true,
      OR: [
        { name: { contains: q } },
        { description: { contains: q } },
        { city: { contains: q } },
        { district: { contains: q } },
      ],
    },
    take: 25,
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      logo: true,
      coverImage: true,
      city: true,
      district: true,
      level: true,
      rating: true,
      category: { select: { name: true } },
    },
  });
  return rows.map((s) => ({
    type: "SCHOOL",
    id: s.id,
    slug: s.slug,
    title: s.name,
    description: s.description,
    url: `/schools/${s.slug}`,
    image: s.logo ?? s.coverImage ?? null,
    meta: {
      category: s.category?.name ?? null,
      city: s.city,
      district: s.district,
      level: s.level,
      rating: s.rating,
    },
  }));
}

async function searchUniversities(q: string): Promise<SearchHit[]> {
  const rows = await db.university.findMany({
    where: {
      isPublished: true,
      OR: [
        { name: { contains: q } },
        { description: { contains: q } },
        { city: { contains: q } },
        { address: { contains: q } },
      ],
    },
    take: 25,
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      logo: true,
      coverImage: true,
      city: true,
      type: true,
      ranking: true,
      establishedYear: true,
    },
  });
  return rows.map((u) => ({
    type: "UNIVERSITY",
    id: u.id,
    slug: u.slug,
    title: u.name,
    description: u.description,
    url: `/universities/${u.slug}`,
    image: u.logo ?? u.coverImage ?? null,
    meta: {
      city: u.city,
      type: u.type,
      ranking: u.ranking,
      established: u.establishedYear,
    },
  }));
}

async function searchScholarships(q: string): Promise<SearchHit[]> {
  const rows = await db.scholarship.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: q } },
        { description: { contains: q } },
        { provider: { contains: q } },
        { field: { contains: q } },
      ],
    },
    take: 25,
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
      category: { select: { name: true } },
    },
  });
  return rows.map((s) => ({
    type: "SCHOLARSHIP",
    id: s.id,
    slug: s.slug,
    title: s.title,
    description: s.description,
    url: `/scholarships/${s.slug}`,
    image: s.coverImage ?? null,
    meta: {
      provider: s.provider,
      amount: s.amount,
      level: s.level,
      field: s.field,
      deadline: s.deadline ? s.deadline.toISOString().split("T")[0] : null,
    },
  }));
}

async function searchPosts(q: string): Promise<SearchHit[]> {
  const rows = await db.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { content: { contains: q } },
      ],
    },
    take: 25,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      coverImage: true,
      readTimeMin: true,
      publishedAt: true,
      category: { select: { name: true } },
      author: { select: { name: true } },
    },
  });
  return rows.map((p) => ({
    type: "BLOG",
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.excerpt ?? p.content.slice(0, 200),
    url: `/blog/${p.slug}`,
    image: p.coverImage ?? null,
    meta: {
      category: p.category?.name ?? null,
      author: p.author?.name ?? null,
      readTime: `${p.readTimeMin} min read`,
      publishedAt: p.publishedAt.toISOString().split("T")[0],
    },
  }));
}

async function searchBanks(q: string): Promise<SearchHit[]> {
  const rows = await db.bank.findMany({
    where: {
      isPublished: true,
      OR: [
        { name: { contains: q } },
        { shortName: { contains: q } },
        { description: { contains: q } },
        { headquarters: { contains: q } },
      ],
    },
    take: 25,
    select: {
      id: true,
      slug: true,
      name: true,
      shortName: true,
      description: true,
      logo: true,
      type: true,
      headquarters: true,
      savingsRateMax: true,
      branchCount: true,
    },
  });
  return rows.map((b) => ({
    type: "BANK",
    id: b.id,
    slug: b.slug,
    title: b.name,
    description: b.description,
    url: `/banks/${b.slug}`,
    image: b.logo ?? null,
    meta: {
      shortName: b.shortName,
      type: b.type,
      headquarters: b.headquarters,
      savingsRateMax: b.savingsRateMax,
      branchCount: b.branchCount,
    },
  }));
}

async function searchJobs(q: string): Promise<SearchHit[]> {
  const rows = await db.job.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: q } },
        { description: { contains: q } },
        { company: { contains: q } },
        { location: { contains: q } },
        { category: { contains: q } },
      ],
    },
    take: 25,
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
      salaryMax: true,
      deadline: true,
    },
  });
  return rows.map((j) => ({
    type: "JOB",
    id: j.id,
    slug: j.slug,
    title: j.title,
    description: j.description,
    url: `/jobs/${j.slug}`,
    image: j.companyLogo ?? null,
    meta: {
      company: j.company,
      location: j.location,
      jobType: j.jobType,
      category: j.category,
      experienceLevel: j.experienceLevel,
      salaryMax: j.salaryMax,
      deadline: j.deadline ? j.deadline.toISOString().split("T")[0] : null,
    },
  }));
}

async function searchGovernmentServices(q: string): Promise<SearchHit[]> {
  const rows = await db.governmentService.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: q } },
        { description: { contains: q } },
        { ministry: { contains: q } },
        { department: { contains: q } },
        { category: { contains: q } },
      ],
    },
    take: 25,
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      category: true,
      ministry: true,
      department: true,
      office: true,
      processingTime: true,
      applicationFee: true,
    },
  });
  return rows.map((g) => ({
    type: "GOVERNMENT_SERVICE",
    id: g.id,
    slug: g.slug,
    title: g.title,
    description: g.description,
    url: `/government/${g.slug}`,
    image: null,
    meta: {
      category: g.category,
      ministry: g.ministry,
      department: g.department,
      office: g.office,
      processingTime: g.processingTime,
      applicationFee: g.applicationFee,
    },
  }));
}
