import Link from "next/link";
import { Clock, FileText, Trophy, ArrowRight, Users, Play, Zap, Layers } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface FeaturedExam {
  id: string;
  slug: string;
  title: string;
  description: string;
  durationMin: number;
  totalMarks: number;
  difficulty: string;
  examType: string;
  isParent?: boolean;
  _count: { questions: number; attempts: number; children?: number };
}

export function FeaturedExams({ exams }: { exams: FeaturedExam[] }) {
  if (!exams.length) return null;

  const difficultyStyle: Record<string, string> = {
    EASY: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    MEDIUM: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    HARD: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };

  return (
    <section className="py-16 md:py-20 border-b border-border bg-muted/20">
      <div className="container-app">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
              <Zap className="h-3.5 w-3.5 fill-current" /> Instant Entrance Engine
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Free Mock Exams &amp; Tests
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl">
              Practice real syllabus questions with timed simulation, negative marking, and instant result cards. 100% free with no sign-in required.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex shadow-2xs">
            <Link href="/exams">All 45+ exams <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((e) => {
            const isMultiSet = e.isParent || (e._count.children !== undefined && e._count.children > 0);
            const childSetsCount = e._count.children && e._count.children > 0 ? e._count.children : 5;

            return (
              <Card key={e.id} className="group flex flex-col justify-between rounded-2xl border border-border bg-card shadow-xs hover:border-primary/50 hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="secondary" className="text-[11px] font-semibold uppercase tracking-wider">
                      {isMultiSet ? "Mock Series" : e.examType.replace("_", " ")}
                    </Badge>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${difficultyStyle[e.difficulty] ?? difficultyStyle.MEDIUM}`}>
                      {e.difficulty}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold leading-snug">
                    <Link href={`/exams/${e.slug}`} className="hover:text-primary transition-colors line-clamp-2">
                      {e.title}
                    </Link>
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 pb-3">
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {e.description}
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
                    <div className="flex flex-col items-center p-2 rounded-xl bg-muted/50 border border-border/40">
                      <Clock className="h-4 w-4 text-primary mb-1" />
                      <span className="font-bold text-foreground tabular-nums">{e.durationMin}m</span>
                      <span className="text-[10px] text-muted-foreground">Timer</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-xl bg-muted/50 border border-border/40">
                      {isMultiSet ? (
                        <Layers className="h-4 w-4 text-primary mb-1" />
                      ) : (
                        <FileText className="h-4 w-4 text-primary mb-1" />
                      )}
                      <span className="font-bold text-foreground tabular-nums">
                        {isMultiSet ? `${childSetsCount} Sets` : e._count.questions}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {isMultiSet ? "Series" : "Questions"}
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-xl bg-muted/50 border border-border/40">
                      <Trophy className="h-4 w-4 text-primary mb-1" />
                      <span className="font-bold text-foreground tabular-nums">{e.totalMarks || 100}</span>
                      <span className="text-[10px] text-muted-foreground">Total Marks</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/60">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-primary" /> {e._count.attempts.toLocaleString()} taken
                    </span>
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      Immediate Scoring
                    </span>
                  </div>
                </CardContent>

                {/* Dual-Action Split: 1-Click Fast Path + Syllabus Link */}
                <CardFooter className="pt-2 pb-4 flex items-center gap-2">
                  <Button asChild size="sm" className="flex-1 font-semibold gap-1.5 shadow-xs">
                    <Link href={`/exams/${e.slug}/take`}>
                      <Play className="h-3.5 w-3.5 fill-current" />
                      {isMultiSet ? "Start Mock Series" : "1-Click Take"}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="px-3 shadow-2xs">
                    <Link href={`/exams/${e.slug}`}>
                      Syllabus
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline" className="w-full">
            <Link href="/exams">Browse all mock exams <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
