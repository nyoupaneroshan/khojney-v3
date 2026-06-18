"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlugField, ImageUrlField } from "@/components/admin/form-fields";
import { EXAM_TYPES, DIFFICULTIES } from "@/lib/constants";

export interface ExamInitial {
  id?: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string | null;
  examType: string;
  durationMin: number;
  totalMarks: number;
  passingMarks: number | null;
  difficulty: string;
  isFeatured: boolean;
  isPublished: boolean;
  tags: string | null;
  coverImage: string | null;
}

interface Props {
  mode: "create" | "edit";
  initial?: Partial<ExamInitial>;
  categories: { id: string; name: string }[];
}

export function ExamForm({ mode, initial, categories }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<ExamInitial>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    categoryId: initial?.categoryId ?? null,
    examType: initial?.examType ?? "MOCK",
    durationMin: initial?.durationMin ?? 60,
    totalMarks: initial?.totalMarks ?? 100,
    passingMarks: initial?.passingMarks ?? null,
    difficulty: initial?.difficulty ?? "MEDIUM",
    isFeatured: initial?.isFeatured ?? false,
    isPublished: initial?.isPublished ?? true,
    tags: initial?.tags ?? null,
    coverImage: initial?.coverImage ?? null,
  });

  function setField<K extends keyof ExamInitial>(key: K, value: ExamInitial[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const url = mode === "create" ? "/api/admin/exams" : `/api/admin/exams/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save");
      }
      const data = await res.json();
      toast.success(mode === "create" ? "Exam created" : "Exam updated");
      if (mode === "create") {
        router.push(`/admin/exams/${data.id}`);
      } else {
        router.push("/admin/exams");
      }
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="e.g. CMAT Mock Test 2025 — Set A"
              required
            />
          </div>
          <SlugField
            value={form.slug}
            onChange={(v) => setField("slug", v)}
            titleValue={form.title}
          />
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.categoryId ?? "none"}
              onValueChange={(v) => setField("categoryId", v === "none" ? null : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— No category —</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={3}
              placeholder="Describe what this exam covers"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exam Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Exam Type</Label>
            <Select value={form.examType} onValueChange={(v) => setField("examType", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXAM_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select value={form.difficulty} onValueChange={(v) => setField("difficulty", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              value={form.durationMin}
              onChange={(e) => setField("durationMin", Number(e.target.value) || 60)}
              placeholder="e.g. 90"
            />
          </div>
          <div className="space-y-2">
            <Label>Total Marks</Label>
            <Input
              type="number"
              value={form.totalMarks}
              onChange={(e) => setField("totalMarks", Number(e.target.value) || 100)}
              placeholder="e.g. 100"
            />
          </div>
          <div className="space-y-2">
            <Label>Passing Marks</Label>
            <Input
              type="number"
              value={form.passingMarks ?? ""}
              onChange={(e) =>
                setField("passingMarks", e.target.value ? Number(e.target.value) : null)
              }
              placeholder="e.g. 40"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Tags (comma-separated)</Label>
            <Input
              value={form.tags ?? ""}
              onChange={(e) => setField("tags", e.target.value || null)}
              placeholder="e.g. cmat, management, entrance"
            />
          </div>
          <div className="md:col-span-2">
            <ImageUrlField
              label="Cover Image URL"
              value={form.coverImage ?? ""}
              onChange={(v) => setField("coverImage", v || null)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={form.isFeatured}
              onCheckedChange={(v) => setField("isFeatured", v === true)}
            />
            <div>
              <span className="text-sm font-medium">Featured</span>
              <p className="text-xs text-muted-foreground">Show on homepage</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={form.isPublished}
              onCheckedChange={(v) => setField("isPublished", v === true)}
            />
            <div>
              <span className="text-sm font-medium">Published</span>
              <p className="text-xs text-muted-foreground">Visible publicly</p>
            </div>
          </label>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-background/95 backdrop-blur py-3 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> {mode === "create" ? "Create Exam" : "Save Changes"}
            </>
          )}
        </Button>
      </div>

      {mode === "create" && (
        <p className="text-xs text-muted-foreground text-center">
          After creating the exam, you&apos;ll be redirected to add questions.
        </p>
      )}
    </form>
  );
}

export function parseExamInitial(raw: Record<string, unknown>): Partial<ExamInitial> {
  return {
    id: raw.id as string,
    title: raw.title as string,
    slug: raw.slug as string,
    description: raw.description as string,
    categoryId: (raw.categoryId as string) || null,
    examType: (raw.examType as string) || "MOCK",
    durationMin: raw.durationMin != null ? Number(raw.durationMin) : 60,
    totalMarks: raw.totalMarks != null ? Number(raw.totalMarks) : 100,
    passingMarks: raw.passingMarks != null ? Number(raw.passingMarks) : null,
    difficulty: (raw.difficulty as string) || "MEDIUM",
    isFeatured: Boolean(raw.isFeatured),
    isPublished: raw.isPublished !== false,
    tags: (raw.tags as string) || null,
    coverImage: (raw.coverImage as string) || null,
  };
}
