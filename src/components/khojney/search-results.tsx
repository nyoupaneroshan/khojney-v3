import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Building2,
  School,
  GraduationCap,
  Award,
  Newspaper,
  MapPin,
  Clock,
  Calendar,
  Star,
} from "lucide-react";

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

const TYPE_META: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  EXAM: { label: "Exam", icon: FileText, color: "bg-red-100 text-red-700" },
  COLLEGE: { label: "College", icon: Building2, color: "bg-blue-100 text-blue-700" },
  SCHOOL: { label: "School", icon: School, color: "bg-teal-100 text-teal-700" },
  UNIVERSITY: { label: "University", icon: GraduationCap, color: "bg-purple-100 text-purple-700" },
  SCHOLARSHIP: { label: "Scholarship", icon: Award, color: "bg-emerald-100 text-emerald-700" },
  BLOG: { label: "Article", icon: Newspaper, color: "bg-amber-100 text-amber-700" },
};

export function SearchResults({ results }: { results: SearchHit[] }) {
  if (!results.length) {
    return (
      <div className="rounded-lg border border-dashed py-16 text-center">
        <p className="text-lg font-semibold">No results found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try different keywords or remove module filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((r) => {
        const meta = TYPE_META[r.type] ?? TYPE_META.EXAM;
        const Icon = meta.icon;
        return (
          <Card key={`${r.type}-${r.id}`} className="card-hover">
            <CardContent className="py-4">
              <Link href={r.url} className="block group">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${meta.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {meta.label}
                      </Badge>
                      {r.meta.category && (
                        <span className="text-xs text-muted-foreground">
                          {r.meta.category}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold group-hover:text-primary transition-colors line-clamp-1">
                      {r.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                      {r.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {r.meta.city && (
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-3 w-3" /> {r.meta.city}
                          {r.meta.district ? `, ${r.meta.district}` : ""}
                        </span>
                      )}
                      {r.meta.difficulty && <span>{r.meta.difficulty}</span>}
                      {r.meta.duration && (
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-3 w-3" /> {r.meta.duration}
                        </span>
                      )}
                      {r.meta.provider && <span>{r.meta.provider}</span>}
                      {r.meta.amount && <span>{r.meta.amount}</span>}
                      {r.meta.readTime && <span>{r.meta.readTime}</span>}
                      {r.meta.publishedAt && (
                        <span className="flex items-center gap-0.5">
                          <Calendar className="h-3 w-3" /> {r.meta.publishedAt}
                        </span>
                      )}
                      {typeof r.meta.rating === "number" && r.meta.rating > 0 && (
                        <span className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {r.meta.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
