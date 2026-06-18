import Link from "next/link";
import { Clock, FileText, Trophy, Users, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ExamCardProps {
  exam: {
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
  };
}

const difficultyColor: Record<string, string> = {
  EASY: "bg-emerald-100 text-emerald-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HARD: "bg-red-100 text-red-700",
};

export function ExamCard({ exam }: ExamCardProps) {
  return (
    <Card className="card-hover flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {exam.examType.replace("_", " ")}
          </Badge>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              difficultyColor[exam.difficulty] ?? difficultyColor.MEDIUM
            }`}
          >
            {exam.difficulty}
          </span>
          {exam.categoryName && (
            <Badge variant="outline" className="text-xs">
              {exam.categoryName}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg leading-snug">
          <Link href={`/exams/${exam.slug}`} className="hover:text-primary line-clamp-2">
            {exam.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{exam.description}</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="flex flex-col items-center p-2 rounded-md bg-muted">
            <Clock className="h-4 w-4 text-muted-foreground mb-0.5" />
            <span className="font-medium">{exam.durationMin} min</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-md bg-muted">
            <FileText className="h-4 w-4 text-muted-foreground mb-0.5" />
            <span className="font-medium">{exam.questionCount} Q</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-md bg-muted">
            <Trophy className="h-4 w-4 text-muted-foreground mb-0.5" />
            <span className="font-medium">{exam.totalMarks}</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3 w-3" /> {exam.attemptCount.toLocaleString()} attempts
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild size="sm" className="w-full">
          <Link href={`/exams/${exam.slug}`}>
            Start Practice <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
