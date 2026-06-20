import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const revalidate = 3600;

export default async function sitemap(): MetadataRoute.Sitemap {
  const base = "https://khojney.com";
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/exams`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/colleges`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/schools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/universities`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/scholarships`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/banks`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/jobs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/government`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/compare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/search`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
  ];

  const [exams, colleges, schools, universities, scholarships, posts, banks, jobs, govtServices] = await Promise.all([
    db.exam.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    db.college.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    db.school.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    db.university.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    db.scholarship.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    db.blogPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, publishedAt: true } }),
    db.bank.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    db.job.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    db.governmentService.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const dynamic: MetadataRoute.Sitemap = [
    ...exams.map((e) => ({ url: `${base}/exams/${e.slug}`, lastModified: e.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...colleges.map((c) => ({ url: `${base}/colleges/${c.slug}`, lastModified: c.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...schools.map((s) => ({ url: `${base}/schools/${s.slug}`, lastModified: s.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...universities.map((u) => ({ url: `${base}/universities/${u.slug}`, lastModified: u.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...scholarships.map((s) => ({ url: `${base}/scholarships/${s.slug}`, lastModified: s.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...banks.map((b) => ({ url: `${base}/banks/${b.slug}`, lastModified: b.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...jobs.map((j) => ({ url: `${base}/jobs/${j.slug}`, lastModified: j.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...govtServices.map((g) => ({ url: `${base}/government/${g.slug}`, lastModified: g.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.publishedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  return [...staticRoutes, ...dynamic];
}
