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
  Bookmark,
  Sparkles,
  User,
  ArrowRight,
  Keyboard,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface ExamRunnerQuestion {
  id: string;
  question: string;
  options: string[];
  correctIdx?: number;
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
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  questions: ExamRunnerQuestion[];
}

interface PerQuestionResult {
  questionId: string;
  selectedIdx: number | null;
  isCorrect: boolean;
  correctIdx: number;
  explanation: string | null;
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
  isGuest?: boolean;
}

interface ExamRunnerProps {
  exam: ExamRunnerExam;
  userId?: string;
}

type Phase = "loading" | "active" | "submitting" | "result";

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface ProcessedQuestion extends ExamRunnerQuestion {
  displayOptions: string[];
  displayToOriginal: number[];
}

function processQuestions(
  questions: ExamRunnerQuestion[],
  shuffleQs: boolean,
  shuffleOpts: boolean,
): ProcessedQuestion[] {
  let qs = questions;
  if (shuffleQs && qs.length > 1) {
    qs = shuffle(qs);
  }
  return qs.map((q) => {
    const originalIndices = q.options.map((_, i) => i);
    const shuffledIndices =
      shuffleOpts && originalIndices.length > 1
        ? shuffle(originalIndices)
        : originalIndices;
    const displayOptions = shuffledIndices.map((i) => q.options[i]);
    return {
      ...q,
      displayOptions,
      displayToOriginal: shuffledIndices,
    };
  });
}

export function ExamRunner({ exam, userId }: ExamRunnerProps) {
  const router = useRouter();
  const isGuest = !userId || userId === "guest";

  const [phase, setPhase] = useState<Phase>("loading");
  const [attemptId, setAttemptId] = useState<string | null>(isGuest ? "guest" : null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(Math.max(1, exam.durationMin) * 60);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const [navFilter, setNavFilter] = useState<"all" | "answered" | "flagged" | "unanswered">("all");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submittedRef = useRef(false);

  // Shuffle questions once per mount
  const processedQuestions = useMemo(
    () => processQuestions(exam.questions, exam.shuffleQuestions, exam.shuffleOptions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const totalQuestions = processedQuestions.length;

  // Start attempt on mount (Instant for guest, API for logged-in)
  useEffect(() => {
    if (exam.questions.length === 0) {
      setPhase("active");
      return;
    }

    if (isGuest) {
      setPhase("active");
      return;
    }

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
  }, [exam.id, exam.questions.length, isGuest]);

  // Countdown timer
  useEffect(() => {
    if (phase !== "active") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const submitExam = useCallback(
    async (auto = false) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);

      setPhase("submitting");
      const durationSec = Math.max(1, Math.round(exam.durationMin * 60 - timeLeft));

      try {
        const payload = isGuest
          ? {
              action: "guest-submit",
              examId: exam.id,
              answers,
              durationSec,
            }
          : {
              action: "submit",
              attemptId,
              answers,
              durationSec,
            };

        const res = await fetch("/api/exam-attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
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
    [attemptId, answers, exam.id, exam.durationMin, isGuest, timeLeft],
  );

  const selectOption = (questionId: string, displayIdx: number) => {
    const q = processedQuestions.find((pq) => pq.id === questionId);
    if (!q) return;
    const originalIdx = q.displayToOriginal[displayIdx];
    setAnswers((prev) => ({ ...prev, [questionId]: originalIdx }));
  };

  const clearAnswer = (questionId: string) => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const toggleFlag = (questionId: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const currentQuestion = processedQuestions[currentIdx];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const progressPct = totalQuestions ? (answeredCount / totalQuestions) * 100 : 0;

  // Keyboard shortcut listeners
  useEffect(() => {
    if (phase !== "active") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

      const key = e.key.toLowerCase();

      // Number keys 1-4
      if (currentQuestion && ["1", "2", "3", "4"].includes(key)) {
        const idx = parseInt(key, 10) - 1;
        if (idx < currentQuestion.displayOptions.length) {
          selectOption(currentQuestion.id, idx);
        }
      }

      // Letter keys a-d
      if (currentQuestion && ["a", "b", "c", "d"].includes(key)) {
        const idx = key.charCodeAt(0) - 97;
        if (idx < currentQuestion.displayOptions.length) {
          selectOption(currentQuestion.id, idx);
        }
      }

      // Navigation
      if (key === "arrowright" || key === "j") {
        setCurrentIdx((i) => Math.min(totalQuestions - 1, i + 1));
      }
      if (key === "arrowleft" || key === "k") {
        setCurrentIdx((i) => Math.max(0, i - 1));
      }

      // Flag
      if (key === "f" || key === "m") {
        if (currentQuestion) toggleFlag(currentQuestion.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, currentQuestion, totalQuestions]);

  // -------- Loading state --------
  if (phase === "loading") {
    return (
      <div className="container-app py-16">
        <Card className="max-w-md mx-auto text-center border-border/80 shadow-md">
          <CardContent className="pt-8 pb-8 flex flex-col items-center gap-3">
            <Loader2 className="h-9 w-9 animate-spin text-primary" />
            <h3 className="font-bold text-lg text-foreground">Preparing Your Exam</h3>
            <p className="text-xs text-muted-foreground">
              Randomizing question order, configuring timer, and preparing instant scorecards...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // -------- Start error state --------
  if (startError) {
    return (
      <div className="container-app py-16">
        <Card className="max-w-md mx-auto text-center border-destructive/20 shadow-md">
          <CardHeader>
            <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Could Not Start Exam</CardTitle>
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
        <Card className="max-w-md mx-auto text-center border-border/80 shadow-md">
          <CardContent className="pt-8 pb-8 flex flex-col items-center gap-3">
            <Loader2 className="h-9 w-9 animate-spin text-primary" />
            <h3 className="font-bold text-lg text-foreground">Grading Your Exam</h3>
            <p className="text-xs text-muted-foreground">
              Checking syllabus answers, calculating accuracy, and generating detailed explanations...
            </p>
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
        isGuest={isGuest}
        onRetake={() => {
          submittedRef.current = false;
          setAnswers({});
          setFlagged(new Set());
          setCurrentIdx(0);
          setTimeLeft(exam.durationMin * 60);
          setResult(null);

          if (isGuest) {
            setPhase("active");
          } else {
            setPhase("loading");
            setTimeout(async () => {
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
            }, 50);
          }
        }}
        onExit={() => router.push(`/exams/${exam.slug}`)}
      />
    );
  }

  // -------- Empty questions state --------
  if (totalQuestions === 0) {
    return (
      <div className="container-app py-16">
        <Card className="max-w-md mx-auto text-center border-border/80">
          <CardHeader>
            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-2">
              <ListChecks className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>No Questions Available</CardTitle>
            <CardDescription>
              This mock test does not have any questions available to take at this time.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center gap-2">
            <Button asChild variant="default">
              <Link href={`/exams/${exam.slug}`}>View Overview</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/exams">Browse All Exams</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // -------- Active exam state --------
  const lowTime = timeLeft <= 60;
  const criticalTime = timeLeft <= 30;
  const selectedOption = currentQuestion ? answers[currentQuestion.id] ?? null : null;
  const selectedDisplayIdx =
    selectedOption !== null && currentQuestion
      ? currentQuestion.displayToOriginal.indexOf(selectedOption)
      : null;
  const isCurrentFlagged = currentQuestion ? flagged.has(currentQuestion.id) : false;

  // Question filtering in navigator
  const filteredIndices = processedQuestions
    .map((q, idx) => ({ q, idx }))
    .filter(({ q, idx }) => {
      if (navFilter === "answered") return answers[q.id] !== undefined;
      if (navFilter === "flagged") return flagged.has(q.id);
      if (navFilter === "unanswered") return answers[q.id] === undefined;
      return true;
    });

  return (
    <div className="bg-muted/20 min-h-[calc(100vh-4rem)] pb-24 lg:pb-12">
      {/* Top sticky test control bar */}
      <div className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur-md shadow-xs">
        <div className="container-app flex items-center justify-between h-14 gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold truncate text-foreground">{exam.title}</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                Question <strong>{currentIdx + 1}</strong> of {totalQuestions}
              </span>
              <span>•</span>
              <span className="text-primary font-semibold">
                {answeredCount} Answered
              </span>
              {flagged.size > 0 && (
                <>
                  <span>•</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5">
                    <Bookmark className="h-3 w-3 fill-current" /> {flagged.size} Flagged
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Timer */}
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-mono font-bold tracking-tight border transition-colors shadow-2xs",
                criticalTime
                  ? "bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400 animate-pulse"
                  : lowTime
                    ? "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400"
                    : "bg-primary/10 border-primary/20 text-primary",
              )}
              aria-label={`Time remaining: ${formatTime(timeLeft)}`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            {/* Submit Confirmation Dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="default" size="sm" className="font-semibold shadow-xs text-xs sm:text-sm">
                  <Flag className="h-3.5 w-3.5 fill-current mr-1" /> Finish
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Submit Your Mock Exam?</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2 pt-1 text-sm">
                    <p>
                      You have answered <strong>{answeredCount}</strong> of <strong>{totalQuestions}</strong> questions.
                    </p>
                    {totalQuestions - answeredCount > 0 && (
                      <p className="text-amber-600 dark:text-amber-400 font-medium">
                        ⚠️ {totalQuestions - answeredCount} questions are still unanswered.
                      </p>
                    )}
                    {flagged.size > 0 && (
                      <p className="text-muted-foreground">
                        ℹ️ You still have {flagged.size} questions flagged for review.
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground pt-1">
                      Once submitted, your responses will be evaluated instantly and complete answer explanations will be displayed.
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Practicing</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => submitExam(false)}
                    className="bg-primary text-primary-foreground font-semibold"
                  >
                    Yes, Submit Now
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Progress bar */}
        <Progress value={progressPct} className="h-1 rounded-none bg-muted" />
      </div>

      <div className="container-app py-6 grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Main question card */}
        <div className="space-y-4">
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="pb-4 border-b border-border/40">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-semibold text-xs">
                    Question {currentIdx + 1}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium">
                    {currentQuestion.marks} Mark{currentQuestion.marks !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={isCurrentFlagged ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => toggleFlag(currentQuestion.id)}
                    className={cn(
                      "h-7 px-2 text-xs gap-1 font-medium",
                      isCurrentFlagged && "text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30",
                    )}
                    title="Press 'F' to toggle flag"
                  >
                    <Bookmark className={cn("h-3.5 w-3.5", isCurrentFlagged && "fill-current")} />
                    {isCurrentFlagged ? "Flagged" : "Flag (F)"}
                  </Button>
                </div>
              </div>
              <CardTitle className="text-base sm:text-lg font-bold leading-relaxed pt-2 text-foreground">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-5 pb-5">
              <div className="space-y-2.5">
                {currentQuestion.displayOptions.map((opt, idx) => {
                  const isSelected = selectedDisplayIdx === idx;
                  const keyLetter = String.fromCharCode(65 + idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectOption(currentQuestion.id, idx)}
                      className={cn(
                        "w-full text-left rounded-xl border p-3.5 text-sm transition-all flex items-start gap-3.5 group cursor-pointer focus:outline-hidden",
                        isSelected
                          ? "border-primary bg-primary/10 ring-2 ring-primary/40 font-medium text-foreground shadow-xs"
                          : "border-border/80 bg-card hover:border-primary/50 hover:bg-muted/40 text-foreground/90",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition-colors",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border/80 bg-muted/60 text-muted-foreground group-hover:border-primary/40 group-hover:text-foreground",
                        )}
                      >
                        {keyLetter}
                      </span>
                      <span className="flex-1 pt-1 leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {selectedDisplayIdx !== null && (
                <div className="mt-4 pt-3 border-t border-border/50 flex justify-between items-center text-xs">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Option saved
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearAnswer(currentQuestion.id)}
                    className="h-7 text-xs text-muted-foreground hover:text-destructive"
                  >
                    Clear selection
                  </Button>
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t border-border/60 pt-4 pb-4 flex items-center justify-between bg-muted/10 rounded-b-xl">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                disabled={currentIdx === 0}
                className="font-medium gap-1 text-xs sm:text-sm"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>

              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Keyboard className="h-3 w-3" /> Keys: 1-4 or A-D to select • ← → to move
              </div>

              {currentIdx < totalQuestions - 1 ? (
                <Button
                  size="sm"
                  onClick={() => setCurrentIdx((i) => Math.min(totalQuestions - 1, i + 1))}
                  className="font-semibold gap-1 text-xs sm:text-sm"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" className="font-semibold gap-1 text-xs sm:text-sm">
                      <Flag className="h-3.5 w-3.5 fill-current" /> Submit Exam
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Submit Your Mock Exam?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You have reached the final question. Are you ready to see your score and explanations?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Review Questions</AlertDialogCancel>
                      <AlertDialogAction onClick={() => submitExam(false)}>
                        Submit Now
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar: question navigator */}
        <aside className="hidden lg:block space-y-4">
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                  <ListChecks className="h-4 w-4 text-primary" /> Question Grid
                </CardTitle>
                <span className="text-xs text-muted-foreground font-medium">
                  {answeredCount}/{totalQuestions}
                </span>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-1 pt-2">
                {(["all", "flagged", "unanswered"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setNavFilter(filter)}
                    className={cn(
                      "flex-1 text-[11px] font-medium py-1 px-1.5 rounded-md text-center transition-colors capitalize",
                      navFilter === filter
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                    )}
                  >
                    {filter === "all" ? `All (${totalQuestions})` : filter === "flagged" ? `Flagged (${flagged.size})` : `Remaining (${totalQuestions - answeredCount})`}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              <div className="grid grid-cols-5 gap-2">
                {filteredIndices.map(({ q, idx }) => {
                  const answered = answers[q.id] !== undefined;
                  const isCurrent = idx === currentIdx;
                  const isQFlagged = flagged.has(q.id);

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIdx(idx)}
                      className={cn(
                        "relative h-9 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center justify-center",
                        isCurrent
                          ? "border-primary bg-primary text-primary-foreground shadow-xs ring-2 ring-primary/30"
                          : isQFlagged
                            ? "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-extrabold"
                            : answered
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                              : "border-border/80 bg-card text-muted-foreground hover:bg-accent/60",
                      )}
                      aria-label={`Question ${idx + 1}`}
                    >
                      {idx + 1}
                      {isQFlagged && (
                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-background" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Status legend */}
              <div className="mt-5 space-y-1.5 text-[11px] pt-4 border-t border-border/50 text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500/60" /> Answered
                  </span>
                  <span className="font-semibold text-foreground">{answeredCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-amber-500/70" /> Flagged for Review
                  </span>
                  <span className="font-semibold text-foreground">{flagged.size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm border border-border bg-card" /> Unanswered
                  </span>
                  <span className="font-semibold text-foreground">{totalQuestions - answeredCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Mobile Floating Bottom Bar for Smooth Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border/80 px-4 py-3 flex items-center justify-between shadow-lg">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="h-9 px-3"
        >
          <ChevronLeft className="h-4 w-4 mr-0.5" /> Prev
        </Button>

        {/* Mobile Quick Question Selector Dialog */}
        <Dialog open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm" className="h-9 px-3 text-xs font-semibold gap-1">
              <ListChecks className="h-3.5 w-3.5" />
              Q {currentIdx + 1} / {totalQuestions}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Jump to Question</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-5 gap-2 pt-2">
              {processedQuestions.map((q, idx) => {
                const answered = answers[q.id] !== undefined;
                const isCurrent = idx === currentIdx;
                const isQFlagged = flagged.has(q.id);
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setCurrentIdx(idx);
                      setMobileNavOpen(false);
                    }}
                    className={cn(
                      "h-10 rounded-lg text-xs font-bold border transition-all flex items-center justify-center relative",
                      isCurrent
                        ? "border-primary bg-primary text-primary-foreground font-black"
                        : isQFlagged
                          ? "border-amber-500 bg-amber-500/15 text-amber-700"
                          : answered
                            ? "border-emerald-500 bg-emerald-500/15 text-emerald-700"
                            : "border-border bg-card text-muted-foreground",
                    )}
                  >
                    {idx + 1}
                    {isQFlagged && (
                      <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-background" />
                    )}
                  </button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>

        {currentIdx < totalQuestions - 1 ? (
          <Button
            size="sm"
            onClick={() => setCurrentIdx((i) => Math.min(totalQuestions - 1, i + 1))}
            className="h-9 px-3"
          >
            Next <ChevronRight className="h-4 w-4 ml-0.5" />
          </Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" className="h-9 px-3 font-semibold">
                Finish <Flag className="h-3.5 w-3.5 ml-1 fill-current" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ready to Submit?</AlertDialogTitle>
                <AlertDialogDescription>
                  You have answered {answeredCount} of {totalQuestions} questions. Unanswered questions will receive 0 marks.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Review</AlertDialogCancel>
                <AlertDialogAction onClick={() => submitExam(false)}>
                  Submit
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
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
  isGuest,
  onRetake,
  onExit,
}: {
  exam: ExamRunnerExam;
  result: SubmitResult;
  isGuest: boolean;
  onRetake: () => void;
  onExit: () => void;
}) {
  const [reviewFilter, setReviewFilter] = useState<"all" | "incorrect" | "correct" | "skipped">("all");

  const pct = result.totalMarks
    ? Math.round((result.score / result.totalMarks) * 100)
    : 0;
  const passed = result.passingMarks
    ? result.score >= result.passingMarks
    : pct >= 40;

  // Questions for review
  const reviewQuestions = useMemo(
    () => [...exam.questions].sort((a, b) => a.order - b.order),
    [exam.questions],
  );

  const resultMap = useMemo(() => {
    const m = new Map<string, PerQuestionResult>();
    for (const r of result.perQuestion) m.set(r.questionId, r);
    return m;
  }, [result]);

  const filteredReviewQuestions = reviewQuestions.filter((q) => {
    const r = resultMap.get(q.id);
    if (!r) return true;
    if (reviewFilter === "incorrect") return r.selectedIdx !== null && !r.isCorrect;
    if (reviewFilter === "correct") return r.isCorrect;
    if (reviewFilter === "skipped") return r.selectedIdx === null;
    return true;
  });

  return (
    <div className="bg-muted/20 min-h-[calc(100vh-4rem)] pb-16">
      <div className="container-app py-8 md:py-12">
        {/* Scorecard Hero */}
        <Card className="max-w-3xl mx-auto overflow-hidden border-border/80 shadow-md">
          <div
            className={cn(
              "bg-gradient-to-br p-8 text-center text-white relative overflow-hidden",
              passed
                ? "from-emerald-600 via-emerald-700 to-teal-800"
                : "from-rose-600 via-rose-700 to-amber-800",
            )}
          >
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/20 mb-3 shadow-inner">
              {passed ? <Trophy className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}
            </div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-90">
              {passed ? "Congratulations • Test Passed!" : "Needs Improvement • Keep Practicing"}
            </p>
            <div className="text-6xl font-black mt-1 tracking-tight">
              {result.score}
              <span className="text-2xl font-semibold opacity-80"> / {result.totalMarks}</span>
            </div>
            <p className="text-sm mt-1 font-medium opacity-90">
              Score: {pct}% • {passed ? "PASSED" : "FAILED"}
              {result.passingMarks ? ` (Passing: ${result.passingMarks} marks)` : ""}
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold">
              <Trophy className="h-3.5 w-3.5" /> Leaderboard Rank #{result.rank}
            </div>
          </div>

          <CardContent className="pt-6 pb-6">
            {/* Metric Breakdown */}
            <div className="grid grid-cols-3 gap-3 text-center mb-6">
              <Breakdown
                icon={<CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                label="Correct"
                value={result.correctCount}
                color="text-emerald-600 dark:text-emerald-400"
              />
              <Breakdown
                icon={<XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />}
                label="Wrong"
                value={result.wrongCount}
                color="text-rose-600 dark:text-rose-400"
              />
              <Breakdown
                icon={<Circle className="h-4 w-4 text-muted-foreground" />}
                label="Skipped"
                value={result.unansweredCount}
                color="text-muted-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="rounded-xl border border-border/80 bg-muted/20 p-3">
                <p className="text-muted-foreground text-[11px]">Time Spent</p>
                <p className="font-bold text-foreground mt-0.5">
                  {Math.floor(result.durationSec / 60)}m {result.durationSec % 60}s
                  <span className="text-muted-foreground text-xs font-normal">
                    {" "}/ {exam.durationMin}m
                  </span>
                </p>
              </div>
              <div className="rounded-xl border border-border/80 bg-muted/20 p-3">
                <p className="text-muted-foreground text-[11px]">Accuracy Rate</p>
                <p className="font-bold text-foreground mt-0.5">
                  {result.correctCount + result.wrongCount > 0
                    ? Math.round((result.correctCount / (result.correctCount + result.wrongCount)) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5 justify-center">
              <Button onClick={onRetake} variant="outline" className="font-semibold gap-1.5 shadow-2xs">
                <RotateCcw className="h-4 w-4" /> Retake Mock Exam
              </Button>
              <Button onClick={onExit} className="font-semibold shadow-xs">
                Back to Syllabus Overview
              </Button>
              <Button asChild variant="ghost" className="text-xs">
                <Link href="/exams">Browse Other Mock Tests</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Guest Conversion Callout Card */}
        {isGuest && (
          <Card className="max-w-3xl mx-auto mt-6 border-primary/40 bg-gradient-to-r from-primary/10 via-background to-primary/10 shadow-xs">
            <CardContent className="pt-6 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 fill-current" /> Save Your Test History
                </div>
                <h3 className="font-bold text-base text-foreground">
                  Want to record your scores and appear on the official leaderboard?
                </h3>
                <p className="text-xs text-muted-foreground max-w-md">
                  Create a free student account on Khojney to bookmark difficult questions, track your weekly score trends, and compete with peers across Nepal.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button asChild size="sm" className="font-semibold shadow-xs">
                  <Link href={`/login?mode=register&callbackUrl=/exams/${exam.slug}`}>
                    Sign Up Free <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="shadow-2xs">
                  <Link href={`/login?callbackUrl=/exams/${exam.slug}`}>
                    Log In
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Review Answers & Explanations */}
        <Card className="max-w-3xl mx-auto mt-6 border-border/80 shadow-xs">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-primary" /> Review Answers &amp; Explanations
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Learn from your mistakes with step-by-step reasoning for each question.
                </CardDescription>
              </div>

              {/* Review Filter Tabs */}
              <div className="flex gap-1 bg-muted p-1 rounded-lg text-xs font-medium self-start sm:self-auto">
                {(["all", "incorrect", "correct", "skipped"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setReviewFilter(f)}
                    className={cn(
                      "px-2.5 py-1 rounded-md transition-colors capitalize",
                      reviewFilter === f
                        ? "bg-background text-foreground font-semibold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            {filteredReviewQuestions.length === 0 ? (
              <div className="py-10 text-center text-xs text-muted-foreground">
                No questions match the &ldquo;{reviewFilter}&rdquo; filter.
              </div>
            ) : (
              <Accordion type="multiple" className="w-full">
                {filteredReviewQuestions.map((q, idx) => {
                  const r = resultMap.get(q.id);
                  const selectedIdx = r?.selectedIdx ?? null;
                  const isCorrect = r?.isCorrect ?? false;
                  const correctIdx = r?.correctIdx;
                  const explanation = r?.explanation;

                  return (
                    <AccordionItem key={q.id} value={`q-${q.id}`} className="border-border/60">
                      <AccordionTrigger className="hover:no-underline py-3 px-2 rounded-lg hover:bg-muted/40 transition-colors">
                        <div className="flex items-center gap-3 text-left">
                          <span
                            className={cn(
                              "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shrink-0",
                              isCorrect
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                : selectedIdx === null
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-rose-500/15 text-rose-600 dark:text-rose-400",
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
                          <span className="text-sm font-medium leading-snug line-clamp-2">
                            Q{idx + 1}. {q.question}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <div className="space-y-2 pl-10 pr-2">
                          {q.options.map((opt, oIdx) => {
                            const isCorrectOpt = correctIdx !== undefined && oIdx === correctIdx;
                            const isUserOpt = oIdx === selectedIdx;

                            return (
                              <div
                                key={oIdx}
                                className={cn(
                                  "flex items-start gap-2.5 rounded-xl border p-2.5 text-xs sm:text-sm",
                                  isCorrectOpt
                                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100 font-medium"
                                    : isUserOpt
                                      ? "border-rose-500/50 bg-rose-500/10 text-rose-950 dark:text-rose-100 font-medium"
                                      : "border-border/60 bg-card text-muted-foreground",
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shrink-0 mt-0.5",
                                    isCorrectOpt
                                      ? "bg-emerald-600 text-white"
                                      : isUserOpt
                                        ? "bg-rose-600 text-white"
                                        : "bg-muted text-muted-foreground",
                                  )}
                                >
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span className="flex-1">{opt}</span>
                                {isCorrectOpt && (
                                  <Badge className="bg-emerald-600 text-white text-[10px] py-0 px-2 shrink-0">
                                    Correct Answer
                                  </Badge>
                                )}
                                {isUserOpt && !isCorrectOpt && (
                                  <Badge variant="destructive" className="text-[10px] py-0 px-2 shrink-0">
                                    Your Choice
                                  </Badge>
                                )}
                              </div>
                            );
                          })}

                          {explanation && (
                            <div className="mt-3 rounded-xl bg-muted/60 border border-border/60 p-3.5 text-xs">
                              <p className="font-bold text-foreground mb-1 flex items-center gap-1">
                                <Sparkles className="h-3.5 w-3.5 text-primary" /> Syllabus Explanation
                              </p>
                              <p className="text-muted-foreground leading-relaxed">{explanation}</p>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
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
    <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        {icon}
        <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
      </div>
      <p className={cn("text-2xl font-black", color)}>{value}</p>
    </div>
  );
}
