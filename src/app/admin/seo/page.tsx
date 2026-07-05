import { db } from "@/lib/db";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

/**
 * SEO admin dashboard.
 *
 * Shows coverage metrics for blog meta tags + exam SEO fields.
 * Score is a weighted average across the two content types.
 */
export default async function SEOAdminPage() {
  const [
    totalBlogs,
    blogsWithMeta,
    totalExams,
    examsWithSeoTitle,
    examsWithSeoContent,
  ] = await Promise.all([
    db.blogPost.count({ where: { status: "PUBLISHED" } }),
    db.blogPost.count({ where: { status: "PUBLISHED", metaTitle: { not: null } } }),
    // Top-level published exams only (exclude child sets).
    db.exam.count({ where: { isPublished: true, parentId: null } }),
    db.exam.count({ where: { isPublished: true, parentId: null, seoTitle: { not: null } } }),
    db.exam.count({ where: { isPublished: true, parentId: null, seoContent: { not: null } } }),
  ]);

  const blogMetaCoverage = Math.round(
    (blogsWithMeta / Math.max(totalBlogs, 1)) * 100
  );
  const examSeoTitleCoverage = Math.round(
    (examsWithSeoTitle / Math.max(totalExams, 1)) * 100
  );
  const examSeoContentCoverage = Math.round(
    (examsWithSeoContent / Math.max(totalExams, 1)) * 100
  );

  // Score: 30% exam SEO title, 20% exam SEO content, 20% blog meta, 30% features.
  const features = [
    "XML sitemap",
    "robots.txt",
    "JSON-LD schema",
    "FAQ schema",
    "Breadcrumbs",
    "Canonical URLs",
    "Open Graph tags",
    "Twitter Card tags",
    "Programmatic location pages",
    "Internal linking",
    "Mobile-first responsive",
    "ISR caching",
  ];
  const featuresScore = Math.round((features.length / 12) * 30);
  const contentScore = Math.round(
    (examSeoTitleCoverage * 0.3 + examSeoContentCoverage * 0.2 + blogMetaCoverage * 0.2) * 0.7
  );
  const score = Math.min(100, contentScore + featuresScore);

  return (
    <div>
      <BackToAdminLink href="/admin" label="Back" />
      <AdminFormHeader
        title="SEO Management"
        description="Monitor SEO coverage across published content."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> SEO Score: {score}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500"}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="text-xl font-bold">
              {examsWithSeoTitle}/{totalExams}
            </div>
            <div className="text-xs text-muted-foreground">
              Exams with SEO title ({examSeoTitleCoverage}%)
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-xl font-bold">
              {examsWithSeoContent}/{totalExams}
            </div>
            <div className="text-xs text-muted-foreground">
              Exams with SEO content ({examSeoContentCoverage}%)
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-xl font-bold">
              {blogsWithMeta}/{totalBlogs}
            </div>
            <div className="text-xs text-muted-foreground">
              Blog posts with meta title ({blogMetaCoverage}%)
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Implemented features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-2 rounded-lg border p-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
