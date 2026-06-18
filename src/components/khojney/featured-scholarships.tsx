import Link from "next/link";
import { Calendar, Globe, Award, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FeaturedScholarship {
  id: string;
  slug: string;
  title: string;
  description: string;
  provider: string | null;
  amount: string | null;
  level: string | null;
  field: string | null;
  deadline: Date | null;
  country: string;
}

function formatDate(date: Date | null) {
  if (!date) return "Rolling";
  return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}

function daysLeft(date: Date | null) {
  if (!date) return null;
  const diff = new Date(date).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function FeaturedScholarships({ scholarships }: { scholarships: FeaturedScholarship[] }) {
  if (!scholarships.length) return null;

  return (
    <section className="py-16">
      <div className="container-app">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Scholarships</h2>
            <p className="mt-2 text-muted-foreground">Don't miss these funding opportunities.</p>
          </div>
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/scholarships">All scholarships <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {scholarships.map((s) => {
            const days = daysLeft(s.deadline);
            return (
              <Card key={s.id} className="card-hover flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <Award className="h-5 w-5" />
                    </div>
                    {s.level && <Badge variant="outline" className="text-xs">{s.level}</Badge>}
                  </div>
                  <CardTitle className="text-base leading-snug">
                    <Link href={`/scholarships/${s.slug}`} className="hover:text-primary line-clamp-2">
                      {s.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-3 space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>
                  {s.amount && (
                    <div className="text-sm font-medium text-emerald-700">{s.amount}</div>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Deadline: {formatDate(s.deadline)}
                    {days !== null && days <= 30 && (
                      <Badge variant="destructive" className="ml-1 text-xs">{days}d left</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" /> {s.country}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild size="sm" variant="ghost" className="ml-auto">
                    <Link href={`/scholarships/${s.slug}`}>Apply now</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/scholarships">All scholarships <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
