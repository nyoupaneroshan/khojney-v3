"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle2,
  XCircle,
  Circle,
  Trophy,
  RotateCcw,
  ListChecks,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export interface ExamRunnerQuestion {
  id: string;
  question: string;
  options: string[];
  correctIdx: number;
  explanation?: string | null;
  marks: number;
  order: number;
}

export interface ExamRunnerExam {
  id: string;
  slug: string;
  title: string;
  description: string;
  durationMin: number;
  totalMarks: number;
  passingMarks: number | null;
  difficulty: string;
  examType: string;
  questions: ExamRunnerQuestion[];
}

interface PerQuestionResult {
  questionId: string;
  selectedIdx: number | null;
  isCorrect: boolean;
  correctIdx: number;
}

interface SubmitResult {
  score: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  totalMarks: number;
  durationSec: number;
  rank: number;
  passingMarks: number | null;
  perQuestion: PerQuestionResult[];
}

interface ExamRunnerProps {
  exam: ExamRunnerExam;
  userId: string;
}

type Phase = "loading" | "active" | "submitting" | "result";

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function ExamRunner({ exam, userId }: ExamRunnerProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("loading");
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [timeLeft, setTimeLeft] = useState(exam.durationMin * 60);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submittedRef = useRef(false);

  const totalQuestions = exam.questions.length;

  // Tag user id for any client-side analytics / debugging
  useEffect(() => {
    if (userId && typeof window !== "undefined") {
      (window as Window & { __khojneyUserId?: string }).__khojneyUserId = userId;
    }
  }, [userId]);

  // Start attempt on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/exam-attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examId: exam.id, action: "start" }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}) as { error?: string });
          throw new Error(data.error ?? "Failed to start exam");
        }
        const data = (await res.json()) as { attemptId: string };
        if (cancelled) return;
        setAttemptId(data.attemptId);
        setPhase("active");
      } catch (err) {
        if (cancelled) return;
        setStartError(err instanceof Error ? err.message : "Failed to start exam");
        toast.error(err instanceof Error ? err.message : "Failed to start exam");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [exam.id]);

  // Countdown timer
  useEffect(() => {
    if (phase !== "active") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto-submit
          if (!submittedRef.current) {
            submittedRef.current = true;
            void submitExam(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const submitExam = useCallback(
    async (auto = false) => {
      if (!attemptId) return;
      if (submittedRef.current) return;
      submittedRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);

      setPhase("submitting");
      try {
        const res = await fetch("/api/exam-attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "submit",
            attemptId,
            answers,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}) as { error?: string });
          throw new Error(data.error ?? "Failed to submit exam");
        }
        const data = (await res.json()) as SubmitResult;
        setResult(data);
        setPhase("result");
        if (auto) {
          toast.info("Time's up! Your exam has been auto-submitted.");
        } else {
          toast.success("Exam submitted successfully!");
        }
      } catch (err) {
        submittedRef.current = false;
        setPhase("active");
        toast.error(err instanceof Error ? err.message : "Failed to submit exam");
      }
    },
    [attemptId, answers],
  );

  const selectOption = (questionId: string, optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const clearAnswer = (questionId: string) => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const currentQuestion = exam.questions[currentIdx];
  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers],
  );
  const progressPct = totalQuestions ? (answeredCount / totalQuestions) * 100 : 0;

  // -------- Loading state --------
  if (phase === "loading") {
    return (
      <div className="container-app py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6 flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="font-medium">Starting your exam...</p>
            <p className="text-sm text-muted-foreground">Preparing questions and timer</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // -------- Start error state --------
  if (startError) {
    return (
      <div className="container-app py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Could not start exam</CardTitle>
            <CardDescription>{startError}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center gap-2">
            <Button asChild variant="outline">
              <Link href={`/exams/${exam.slug}`}>Back to overview</Link>
            </Button>
            <Button onClick={() => window.location.reload()}>Try again</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // -------- Submitting state --------
  if (phase === "submitting") {
    return (
      <div className="container-app py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6 flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="font-medium">Submitting your exam...</p>
            <p className="text-sm text-muted-foreground">Calculating your score</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // -------- Result state --------
  if (phase === "result" && result) {
    return (
      <ResultView
        exam={exam}
        result={result}
        onRetake={() => {
          submittedRef.current = false;
          setAttemptId(null);
          setAnswers({});
          setCurrentIdx(0);
          setTimeLeft(exam.durationMin * 60);
          setResult(null);
          setPhase("loading");
          // Re-trigger the start effect
          setTimeout(() => {
            (async () => {
              try {
                const res = await fetch("/api/exam-attempts", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ examId: exam.id, action: "start" }),
                });
                if (!res.ok) throw new Error("Failed to start exam");
                const data = (await res.json()) as { attemptId: string };
                setAttemptId(data.attemptId);
                setPhase("active");
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to start exam");
              }
            })();
          }, 50);
        }}
        onExit={() => router.push(`/exams/${exam.slug}`)}
      />
    );
  }

  // -------- Active exam state --------
  const lowTime = timeLeft <= 60;
  const selectedOption = currentQuestion ? answers[currentQuestion.id] ?? null : null;

  return (
    <div className="bg-muted/30 min-h-[calc(100vh-4rem)]">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b bg-white">
        <div className="container-app flex items-center justify-between h-14 gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{exam.title}</p>
            <p className="text-xs text-muted-foreground">
              Question {currentIdx + 1} of {totalQuestions}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-mono font-semibold",
                lowTime
                  ? "bg-destructive/10 text-destructive animate-pulse"
                  : "bg-primary/10 text-primary",
              )}
              aria-label={`Time remaining: ${formatTime(timeLeft)}`}
            >
              <Clock className="h-4 w-4" />
              {formatTime(timeLeft)}
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="default" size="sm">
                  <Flag className="h-3.5 w-3.5" /> Submit
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Submit your exam?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {answeredCount < totalQuestions
                      ? `You have answered ${answeredCount} of ${totalQuestions} questions. Unanswered questions will be marked as wrong.`
                      : "You have answered all questions. Are you ready to see your results?"}
                    {" This action cannot be undone."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep practicing</AlertDialogCancel>
                  <AlertDialogAction onClick={() => submitExam(false)}>
                    Submit now
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="container-app pb-2">
          <Progress value={progressPct} className="h-1" />
        </div>
      </div>

      <div className="container-app py-6 grid lg:grid-cols-[1fr_280px] gap-6">
        {/* Main question card */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  Q{currentIdx + 1} · {currentQuestion.marks} mark
                  {currentQuestion.marks !== 1 ? "s" : ""}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {answeredCount} / {totalQuestions} answered
                </span>
              </div>
              <CardTitle className="text-lg leading-relaxed pt-2">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectOption(currentQuestion.id, idx)}
                      className={cn(
                        "w-full text-left rounded-lg border p-3.5 text-sm transition-all flex items-start gap-3",
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/40 hover:bg-accent/40",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground",
                        )}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 pt-0.5">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearAnswer(currentQuestion.id)}
                  className="mt-3 text-xs"
                >
                  Clear selection
                </Button>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                disabled={currentIdx === 0}
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              {currentIdx < totalQuestions - 1 ? (
                <Button onClick={() => setCurrentIdx((i) => Math.min(totalQuestions - 1, i + 1))}>
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      <Flag className="h-3.5 w-3.5" /> Finish &amp; Submit
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Submit your exam?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {answeredCount < totalQuestions
                          ? `You have answered ${answeredCount} of ${totalQuestions} questions.`
                          : "You have answered all questions."}
                        {" This action cannot be undone."}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep practicing</AlertDialogCancel>
                      <AlertDialogAction onClick={() => submitExam(false)}>
                        Submit now
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar: question navigator */}
        <aside className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <ListChecks className="h-4 w-4" /> Question Navigator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2">
                {exam.questions.map((q, idx) => {
                  const answered = answers[q.id] !== undefined;
                  const isCurrent = idx === currentIdx;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIdx(idx)}
                      className={cn(
                        "h-9 w-9 rounded-md text-xs font-semibold border transition-all",
                        isCurrent
                          ? "border-primary bg-primary text-primary-foreground"
                          : answered
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border-border bg-white text-muted-foreground hover:bg-accent",
                      )}
                      aria-label={`Go to question ${idx + 1}${answered ? " (answered)" : ""}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm border border-emerald-300 bg-emerald-50" />
                  <span className="text-muted-foreground">Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm border border-border bg-white" />
                  <span className="text-muted-foreground">
                    Unanswered ({totalQuestions - answeredCount})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm border border-primary bg-primary" />
                  <span className="text-muted-foreground">Current</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Clock
                className={cn(
                  "h-6 w-6 mb-1",
                  lowTime ? "text-destructive" : "text-primary",
                )}
              />
              <p className="text-2xl font-mono font-bold">
                {formatTime(timeLeft)}
              </p>
              <p className="text-xs text-muted-foreground">time remaining</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

// =================================================================
// Result view
// =================================================================

function ResultView({
  exam,
  result,
  onRetake,
  onExit,
}: {
  exam: ExamRunnerExam;
  result: SubmitResult;
  onRetake: () => void;
  onExit: () => void;
}) {
  const pct = result.totalMarks
    ? Math.round((result.score / result.totalMarks) * 100)
    : 0;
  const passed = result.passingMarks
    ? result.score >= result.passingMarks
    : pct >= 40;

  // Build a lookup of perQuestion by questionId
  const resultMap = useMemo(() => {
    const m = new Map<string, PerQuestionResult>();
    for (const r of result.perQuestion) m.set(r.questionId, r);
    return m;
  }, [result]);

  return (
    <div className="bg-muted/30 min-h-[calc(100vh-4rem)]">
      <div className="container-app py-8 md:py-12">
        {/* Score card */}
        <Card className="max-w-3xl mx-auto overflow-hidden">
          <div
            className={cn(
              "bg-gradient-to-br p-8 text-center text-white",
              passed
                ? "from-emerald-500 to-emerald-700"
                : "from-red-500 to-red-700",
            )}
          >
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/20 mb-3">
              {passed ? (
                <Trophy className="h-8 w-8" />
              ) : (
                <AlertTriangle className="h-8 w-8" />
              )}
            </div>
            <p className="text-sm uppercase tracking-wide opacity-90">
              {passed ? "Congratulations!" : "Keep practicing!"}
            </p>
            <p className="text-6xl font-bold mt-1">
              {result.score}
              <span className="text-2xl opacity-80">/{result.totalMarks}</span>
            </p>
            <p className="text-lg mt-1 opacity-90">{pct}% · {passed ? "PASSED" : "NOT PASSED"}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm">
              <Trophy className="h-4 w-4" /> Rank #{result.rank}
            </div>
          </div>

          <CardContent className="pt-6">
            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-3 text-center mb-6">
              <Breakdown
                icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                label="Correct"
                value={result.correctCount}
                color="text-emerald-600"
              />
              <Breakdown
                icon={<XCircle className="h-4 w-4 text-destructive" />}
                label="Wrong"
                value={result.wrongCount}
                color="text-destructive"
              />
              <Breakdown
                icon={<Circle className="h-4 w-4 text-muted-foreground" />}
                label="Skipped"
                value={result.unansweredCount}
                color="text-muted-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground text-xs">Time taken</p>
                <p className="font-semibold">
                  {Math.floor(result.durationSec / 60)}m {result.durationSec % 60}s
                  <span className="text-muted-foreground text-xs font-normal">
                    {" "}/ {exam.durationMin}m
                  </span>
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground text-xs">Passing marks</p>
                <p className="font-semibold">
                  {result.passingMarks ?? "—"}
                  <span className="text-muted-foreground text-xs font-normal">
                    {" "}/ {result.totalMarks}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <Button onClick={onRetake} variant="outline">
                <RotateCcw className="h-4 w-4" /> Retake exam
              </Button>
              <Button onClick={onExit}>
                Back to exam overview
              </Button>
              <Button asChild variant="ghost">
                <Link href={`/exams/${exam.slug}`}>View leaderboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Review answers */}
        <Card className="max-w-3xl mx-auto mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" /> Review Answers &amp; Explanations
            </CardTitle>
            <CardDescription>
              See your answers, the correct answers, and explanations for each question.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {exam.questions.map((q, idx) => {
                const r = resultMap.get(q.id);
                const selectedIdx = r?.selectedIdx ?? null;
                const isCorrect = r?.isCorrect ?? false;
                return (
                  <AccordionItem key={q.id} value={`q-${q.id}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <span
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shrink-0",
                            isCorrect
                              ? "bg-emerald-100 text-emerald-700"
                              : selectedIdx === null
                                ? "bg-muted text-muted-foreground"
                                : "bg-destructive/10 text-destructive",
                          )}
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : selectedIdx === null ? (
                            <Circle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </span>
                        <span className="text-sm font-medium">
                          Q{idx + 1}. {q.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pl-10">
                        {q.options.map((opt, oIdx) => {
                          const isCorrectOpt = oIdx === q.correctIdx;
                          const isUserOpt = oIdx === selectedIdx;
                          return (
                            <div
                              key={oIdx}
                              className={cn(
                                "flex items-start gap-2 rounded-md border p-2 text-sm",
                                isCorrectOpt
                                  ? "border-emerald-300 bg-emerald-50"
                                  : isUserOpt
                                    ? "border-destructive/40 bg-destructive/5"
                                    : "border-border",
                              )}
                            >
                              <span
                                className={cn(
                                  "flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium shrink-0",
                                  isCorrectOpt
                                    ? "bg-emerald-600 text-white"
                                    : isUserOpt
                                      ? "bg-destructive text-white"
                                      : "bg-muted text-muted-foreground",
                                )}
                              >
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className="flex-1">{opt}</span>
                              {isCorrectOpt && (
                                <Badge className="bg-emerald-600 text-xs">Correct</Badge>
                              )}
                              {isUserOpt && !isCorrectOpt && (
                                <Badge variant="destructive" className="text-xs">
                                  Your answer
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                        {q.explanation && (
                          <div className="mt-3 rounded-md bg-muted p-3 text-sm">
                            <p className="font-medium text-xs text-muted-foreground mb-1">
                              Explanation
                            </p>
                            <p className="text-foreground">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Breakdown({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={cn("text-2xl font-bold", color)}>{value}</p>
    </div>
  );
}
