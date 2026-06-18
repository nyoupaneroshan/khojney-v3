"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2, ChevronUp, ChevronDown, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { parseJson } from "@/lib/admin-utils";

interface ExamQuestion {
  id: string;
  examId: string;
  type: string;
  question: string;
  options: string;
  correctIdx: number;
  explanation: string | null;
  marks: number;
  order: number;
}

interface Props {
  examId: string;
  initialQuestions: ExamQuestion[];
}

interface DraftQuestion {
  id?: string;
  type: string;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
  marks: number;
  order: number;
  dirty?: boolean;
  saving?: boolean;
}

function toDraft(q: ExamQuestion): DraftQuestion {
  return {
    id: q.id,
    type: q.type,
    question: q.question,
    options: parseJson<string[]>(q.options, ["", "", "", ""]),
    correctIdx: q.correctIdx,
    explanation: q.explanation ?? "",
    marks: q.marks,
    order: q.order,
  };
}

const QUESTION_TYPES = ["MCQ", "TRUE_FALSE", "FILL_BLANK"];

export function ExamQuestionsEditor({ examId, initialQuestions }: Props) {
  const [questions, setQuestions] = useState<DraftQuestion[]>(() =>
    initialQuestions
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(toDraft)
  );
  const [adding, setAdding] = useState(false);

  function updateDraft(idx: number, patch: Partial<DraftQuestion>) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, ...patch, dirty: true } : q))
    );
  }

  function updateOption(idx: number, optIdx: number, value: string) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== idx) return q;
        const next = [...q.options];
        next[optIdx] = value;
        return { ...q, options: next, dirty: true };
      })
    );
  }

  function addOption(idx: number) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === idx ? { ...q, options: [...q.options, ""], dirty: true } : q
      )
    );
  }

  function removeOption(idx: number, optIdx: number) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== idx) return q;
        if (q.options.length <= 2) return q; // keep at least 2 options
        const next = q.options.filter((_, j) => j !== optIdx);
        const correctIdx =
          q.correctIdx === optIdx
            ? 0
            : q.correctIdx > optIdx
              ? q.correctIdx - 1
              : q.correctIdx;
        return { ...q, options: next, correctIdx, dirty: true };
      })
    );
  }

  async function saveQuestion(idx: number) {
    const q = questions[idx];
    if (!q.id) return;
    setQuestions((prev) =>
      prev.map((qq, i) => (i === idx ? { ...qq, saving: true } : qq))
    );
    try {
      const res = await fetch(`/api/admin/exams/${examId}/questions/${q.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: q.type,
          question: q.question,
          options: q.options,
          correctIdx: q.correctIdx,
          explanation: q.explanation || null,
          marks: q.marks,
          order: q.order,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save");
      }
      toast.success("Question saved");
      setQuestions((prev) =>
        prev.map((qq, i) => (i === idx ? { ...qq, dirty: false, saving: false } : qq))
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
      setQuestions((prev) =>
        prev.map((qq, i) => (i === idx ? { ...qq, saving: false } : qq))
      );
    }
  }

  async function deleteQuestion(idx: number) {
    const q = questions[idx];
    if (!q.id) return;
    if (!confirm("Delete this question?")) return;
    try {
      const res = await fetch(`/api/admin/exams/${examId}/questions/${q.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Question deleted");
      setQuestions((prev) => prev.filter((_, i) => i !== idx));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function moveQuestion(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= questions.length) return;
    // Optimistic reorder
    const next = [...questions];
    [next[idx], next[target]] = [next[target], next[idx]];
    // Reassign order field
    const reordered = next.map((q, i) => ({ ...q, order: i }));
    setQuestions(reordered);

    // Persist new order for the two swapped questions
    await Promise.all(
      [idx, target].map(async (i) => {
        const q = reordered[i];
        if (!q.id) return;
        await fetch(`/api/admin/exams/${examId}/questions/${q.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: q.order }),
        });
      })
    );
  }

  async function addNew() {
    setAdding(true);
    try {
      const res = await fetch(`/api/admin/exams/${examId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "MCQ",
          question: "",
          options: ["", "", "", ""],
          correctIdx: 0,
          marks: 1,
          order: questions.length,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to add question");
      }
      const created = await res.json();
      setQuestions((prev) => [
        ...prev,
        {
          id: created.id,
          type: created.type,
          question: created.question,
          options: parseJson<string[]>(created.options, ["", "", "", ""]),
          correctIdx: created.correctIdx,
          explanation: created.explanation ?? "",
          marks: created.marks,
          order: created.order,
        },
      ]);
      toast.success("Question added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Add failed");
    } finally {
      setAdding(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Questions ({questions.length})</CardTitle>
          </div>
          <Button type="button" size="sm" onClick={addNew} disabled={adding}>
            {adding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Add Question
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground border border-dashed rounded-md">
            No questions yet. Click &quot;Add Question&quot; to start building this exam.
          </div>
        )}
        {questions.map((q, idx) => (
          <div
            key={q.id ?? idx}
            className="rounded-md border border-border p-4 bg-card space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Q{idx + 1}</Badge>
                {q.dirty && (
                  <Badge variant="outline" className="text-amber-600 border-amber-300">
                    Unsaved
                  </Badge>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => moveQuestion(idx, -1)}
                  disabled={idx === 0}
                  aria-label="Move up"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => moveQuestion(idx, 1)}
                  disabled={idx === questions.length - 1}
                  aria-label="Move down"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => deleteQuestion(idx)}
                  aria-label="Delete question"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-xs">Type</Label>
                <Select value={q.type} onValueChange={(v) => updateDraft(idx, { type: v })}>
                  <SelectTrigger className="w-full h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUESTION_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Marks</Label>
                <Input
                  type="number"
                  className="h-8"
                  value={q.marks}
                  onChange={(e) =>
                    updateDraft(idx, { marks: Number(e.target.value) || 1 })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Order</Label>
                <Input
                  type="number"
                  className="h-8"
                  value={q.order}
                  onChange={(e) =>
                    updateDraft(idx, { order: Number(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Question text *</Label>
              <Textarea
                value={q.question}
                onChange={(e) => updateDraft(idx, { question: e.target.value })}
                rows={2}
                placeholder="Enter the question"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Options (select the correct answer)</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={() => addOption(idx)}
                >
                  <Plus className="h-3 w-3" /> Add option
                </Button>
              </div>
              <RadioGroup
                value={String(q.correctIdx)}
                onValueChange={(v) => updateDraft(idx, { correctIdx: Number(v) })}
                className="space-y-2"
              >
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <RadioGroupItem value={String(optIdx)} id={`q-${q.id ?? idx}-opt-${optIdx}`} />
                    <Label
                      htmlFor={`q-${q.id ?? idx}-opt-${optIdx}`}
                      className="text-xs text-muted-foreground w-4"
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </Label>
                    <Input
                      value={opt}
                      onChange={(e) => updateOption(idx, optIdx, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                      className="h-8 flex-1"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => removeOption(idx, optIdx)}
                      disabled={q.options.length <= 2}
                      aria-label="Remove option"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Explanation (optional)</Label>
              <Textarea
                value={q.explanation}
                onChange={(e) => updateDraft(idx, { explanation: e.target.value })}
                rows={2}
                placeholder="Explanation shown after the exam is submitted"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                size="sm"
                onClick={() => saveQuestion(idx)}
                disabled={!q.dirty || q.saving}
              >
                {q.saving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" /> Save Question
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}


