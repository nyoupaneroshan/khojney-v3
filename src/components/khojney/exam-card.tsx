import Link from "next/link";
import { Clock, FileText, Trophy, Users, ArrowRight, Layers, Play } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ExamCardItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  durationMin: number;
  totalMarks: number;
  difficulty: string;
  examType: string;
  categoryName: string | null;
  questionCount: number;
  attemptCount: number;
  isParent?: boolean;
  setCount?: number;
}

interface ExamCardProps {
  exam: ExamCardItem;
}

const difficultyColor: Record<string, string> = {
  EASY: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  MEDIUM: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  HARD: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

export function ExamCard({ exam }: ExamCardProps) {
  const isMultiSet = exam.isParent || (exam.setCount !== undefined && exam.setCount > 0);

  return (
    <Card className="card-hover flex flex-col justify-between border-border/80 shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge variant="secondary" className="text-[11px] font-semibold">
            {isMultiSet ? "Mock Series" : exam.examType.replace("_", " ")}
          </Badge>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
              difficultyColor[exam.difficulty] ?? difficultyColor.MEDIUM
            }`}
          >
            {exam.difficulty}
          </span>
          {exam.categoryName && (
            <Badge variant="outline" className="text-[10px]">
              {exam.categoryName}
            </Badge>
          )}
        </div>
        <CardTitle className="text-base font-bold leading-snug">
          <Link href={`/exams/${exam.slug}`} className="hover:text-primary transition-colors line-clamp-2">
            {exam.title}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">{exam.description}</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-center">
          <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50 border border-border/40">
            <Clock className="h-3.5 w-3.5 text-primary mb-1" />
            <span className="font-bold text-foreground">{exam.durationMin}m</span>
            <span className="text-[10px] text-muted-foreground">Duration</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50 border border-border/40">
            {isMultiSet ? (
              <Layers className="h-3.5 w-3.5 text-primary mb-1" />
            ) : (
              <FileText className="h-3.5 w-3.5 text-primary mb-1" />
            )}
            <span className="font-bold text-foreground">
              {isMultiSet
                ? `${exam.setCount && exam.setCount > 0 ? exam.setCount : 5} Sets`
                : `${exam.questionCount} Q`}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {isMultiSet ? "Series" : "Questions"}
            </span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50 border border-border/40">
            <Trophy className="h-3.5 w-3.5 text-primary mb-1" />
            <span className="font-bold text-foreground">{exam.totalMarks || 100}</span>
            <span className="text-[10px] text-muted-foreground">Marks</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground pt-2.5 border-t border-border/50">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3 text-primary" /> {exam.attemptCount.toLocaleString()} attempts
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">100% Free</span>
        </div>
      </CardContent>

      <CardFooter className="pt-1 pb-4">
        <Button asChild size="sm" className="w-full font-semibold shadow-xs">
          <Link href={isMultiSet ? `/exams/${exam.slug}` : `/exams/${exam.slug}/take`}>
            {isMultiSet ? (
              <>Choose Test Set <ArrowRight className="ml-1 h-3.5 w-3.5" /></>
            ) : (
              <><Play className="h-3 w-3 fill-current mr-1.5" /> Start Practice</>
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
