/**
 * Shared SEO metadata helpers.
 *
 * Standardizes OpenGraph, Twitter Card, and canonical URLs across all
 * list + detail pages so search engines and social platforms see consistent
 * metadata everywhere.
 */
import type { Metadata } from "next";

interface SeoMetaInput {
  title: string;
  description: string;
  canonical: string; // path only, e.g. "/colleges"
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
}

/**
 * Build a complete Metadata object with OpenGraph + Twitter Card fields.
 */
export function buildMetadata({
  title,
  description,
  canonical,
  keywords,
  image,
  type = "website",
  publishedTime,
  authors,
}: SeoMetaInput): Metadata {
  const ogImage = image ?? "/og-default.png";
  return {
    title,
    description,
    keywords: keywords ?? undefined,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Khojney",
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(authors ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/** Standard keywords per module — used to seed keyword arrays on list pages. */
export const MODULE_KEYWORDS = {
  exams: [
    "mock test nepal",
    "free online mock test",
    "entrance exam preparation nepal",
    "ioe mock test",
    "cee mock test",
    "cmat mock test",
    "loksewa mock test",
    "driving license mock test",
    "online exam practice nepal",
    "khojney",
  ],
  colleges: [
    "colleges in nepal",
    "best colleges in nepal",
    "top colleges in nepal",
    "engineering colleges nepal",
    "medical colleges nepal",
    "management colleges nepal",
    "it colleges nepal",
    "+2 colleges nepal",
    "college admission nepal",
    "khojney",
  ],
  schools: [
    "schools in nepal",
    "best schools in nepal",
    "top schools in nepal",
    "primary schools nepal",
    "secondary schools nepal",
    "higher secondary schools nepal",
    "boarding schools nepal",
    "school admission nepal",
    "khojney",
  ],
  universities: [
    "universities in nepal",
    "top universities in nepal",
    "tribhuvan university",
    "kathmandu university",
    "pokhara university",
    "purbanchal university",
    "tu affiliation",
    "ku affiliation",
    "higher education nepal",
    "khojney",
  ],
  scholarships: [
    "scholarships in nepal",
    "nepal scholarships",
    "free seats nepal college",
    "see topper scholarship",
    "mbbs scholarship nepal",
    "engineering scholarship nepal",
    "undergraduate scholarship nepal",
    "study abroad scholarship nepali students",
    "khojney",
  ],
  banks: [
    "banks in nepal",
    "best banks in nepal",
    "commercial banks nepal",
    "development banks nepal",
    "bank interest rates nepal",
    "savings interest rate nepal",
    "fixed deposit nepal",
    "mobile banking nepal",
    "khojney",
  ],
  jobs: [
    "jobs in nepal",
    "job vacancy nepal",
    "nepal job portal",
    "employment nepal",
    "it jobs nepal",
    "government jobs nepal",
    "ngo jobs nepal",
    "freshers jobs nepal",
    "career nepal",
    "khojney",
  ],
  government: [
    "government services nepal",
    "nepal government services",
    "citizenship nepal",
    "passport nepal",
    "pan registration nepal",
    "driving license nepal",
    "land registration nepal",
    "government document nepal",
    "khojney",
  ],
  blog: [
    "nepal education blog",
    "exam tips nepal",
    "career advice nepal",
    "college admission guide nepal",
    "scholarship guide nepal",
    "khojney blog",
  ],
} as const;
