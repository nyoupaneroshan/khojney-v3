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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  isParent: boolean;
  tags: string | null;
  coverImage: string | null;
  order: number;
  // SEO fields
  seoTitle: string | null;
  seoDescription: string | null;
  seoContent: string | null;
  keywords: string | null;
  canonicalUrl: string | null;
  // Landing page content
  featuredImage: string | null;
  heroTitle: string | null;
  heroDescription: string | null;
  benefits: string | null; // JSON array
  instructions: string | null; // JSON array
  faqs: string | null; // JSON array
  ctaText: string | null;
  relatedResources: string | null; // JSON array
  // Scoring
  negativeMarking: boolean;
  negativeMarkValue: number;
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
    isParent: initial?.isParent ?? false,
    tags: initial?.tags ?? null,
    coverImage: initial?.coverImage ?? null,
    order: initial?.order ?? 0,
    seoTitle: initial?.seoTitle ?? null,
    seoDescription: initial?.seoDescription ?? null,
    seoContent: initial?.seoContent ?? null,
    keywords: initial?.keywords ?? null,
    canonicalUrl: initial?.canonicalUrl ?? null,
    featuredImage: initial?.featuredImage ?? null,
    heroTitle: initial?.heroTitle ?? null,
    heroDescription: initial?.heroDescription ?? null,
    benefits: initial?.benefits ?? null,
    instructions: initial?.instructions ?? null,
    faqs: initial?.faqs ?? null,
    ctaText: initial?.ctaText ?? null,
    relatedResources: initial?.relatedResources ?? null,
    negativeMarking: initial?.negativeMarking ?? false,
    negativeMarkValue: initial?.negativeMarkValue ?? 0,
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
      {/* ─── Basic Information ──────────────────────────────── */}
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
              placeholder="Short description shown in cards and meta tags"
            />
          </div>
          <div className="space-y-2">
            <Label>Display Order</Label>
            <Input
              type="number"
              value={form.order}
              onChange={(e) => setField("order", Number(e.target.value) || 0)}
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">Lower numbers appear first</p>
          </div>
        </CardContent>
      </Card>

      {/* ─── Exam Settings ──────────────────────────────────── */}
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

      {/* ─── Negative Marking ───────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Scoring</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={form.negativeMarking}
              onCheckedChange={(v) => setField("negativeMarking", v === true)}
            />
            <div>
              <span className="text-sm font-medium">Negative Marking</span>
              <p className="text-xs text-muted-foreground">Deduct marks for wrong answers</p>
            </div>
          </label>
          {form.negativeMarking && (
            <div className="space-y-2">
              <Label>Negative Mark Value (per wrong answer)</Label>
              <Input
                type="number"
                step="0.05"
                value={form.negativeMarkValue}
                onChange={(e) => setField("negativeMarkValue", Number(e.target.value) || 0)}
                placeholder="e.g. 0.25"
              />
              <p className="text-xs text-muted-foreground">e.g. 0.25 means 0.25 marks deducted per wrong answer</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── Status ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
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
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={form.isParent}
              onCheckedChange={(v) => setField("isParent", v === true)}
            />
            <div>
              <span className="text-sm font-medium">Parent Exam</span>
              <p className="text-xs text-muted-foreground">Grouping page for child sets</p>
            </div>
          </label>
        </CardContent>
      </Card>

      {/* ─── Landing Page Content ───────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Landing Page Content</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label>Hero Title (overrides Title on landing page)</Label>
            <Input
              value={form.heroTitle ?? ""}
              onChange={(e) => setField("heroTitle", e.target.value || null)}
              placeholder="e.g. IOE Free Mock Exam — Online Practice Test"
            />
            <p className="text-xs text-muted-foreground">Leave empty to use the Title field</p>
          </div>
          <div className="space-y-2">
            <Label>Hero Description (subtitle below H1)</Label>
            <Textarea
              value={form.heroDescription ?? ""}
              onChange={(e) => setField("heroDescription", e.target.value || null)}
              rows={3}
              placeholder="e.g. Prepare for your IOE entrance examination with our completely free online mock exams..."
            />
          </div>
          <div className="space-y-2">
            <Label>Featured Image URL (for OG/Twitter cards)</Label>
            <Input
              value={form.featuredImage ?? ""}
              onChange={(e) => setField("featuredImage", e.target.value || null)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label>CTA Button Text</Label>
            <Input
              value={form.ctaText ?? ""}
              onChange={(e) => setField("ctaText", e.target.value || null)}
              placeholder="Start Free Mock Exam"
            />
          </div>
          <div className="space-y-2">
            <Label>Benefits (one per line)</Label>
            <Textarea
              value={form.benefits ? (JSON.parse(form.benefits) as string[]).join("\n") : ""}
              onChange={(e) => {
                const lines = e.target.value.split("\n").filter((l) => l.trim());
                setField("benefits", lines.length > 0 ? JSON.stringify(lines) : null);
              }}
              rows={6}
              placeholder={"Real exam simulation\nTimed practice\nInstant results\nPerformance analysis"}
            />
            <p className="text-xs text-muted-foreground">Each line becomes a benefit card on the landing page</p>
          </div>
          <div className="space-y-2">
            <Label>Instructions (one per line)</Label>
            <Textarea
              value={form.instructions ? (JSON.parse(form.instructions) as string[]).join("\n") : ""}
              onChange={(e) => {
                const lines = e.target.value.split("\n").filter((l) => l.trim());
                setField("instructions", lines.length > 0 ? JSON.stringify(lines) : null);
              }}
              rows={6}
              placeholder={"Read every question carefully\nTimer starts immediately\nDo not refresh the page\nResults appear instantly"}
            />
          </div>
          <div className="space-y-2">
            <Label>SEO Content (markdown — shown as &quot;About This Exam&quot;)</Label>
            <Textarea
              value={form.seoContent ?? ""}
              onChange={(e) => setField("seoContent", e.target.value || null)}
              rows={10}
              placeholder={"## About the IOE Entrance Exam\n\nThe Institute of Engineering (IOE) entrance exam is...\n\n### Exam Pattern\n\nThe IOE exam has 140 MCQs..."}
            />
            <p className="text-xs text-muted-foreground">
              Use ## for H2, ### for H3. Aim for 500–1500 words for SEO.
            </p>
          </div>
          <div className="space-y-2">
            <Label>FAQs (one FAQ per line, format: Question? | Answer)</Label>
            <Textarea
              value={
                form.faqs
                  ? (JSON.parse(form.faqs) as Array<{ question: string; answer: string }>)
                      .map((f) => `${f.question} | ${f.answer}`)
                      .join("\n")
                  : ""
              }
              onChange={(e) => {
                const lines = e.target.value.split("\n").filter((l) => l.trim());
                const parsed = lines.map((line) => {
                  const [question, ...answerParts] = line.split("|");
                  return {
                    question: question.trim(),
                    answer: answerParts.join("|").trim(),
                  };
                }).filter((f) => f.question && f.answer);
                setField("faqs", parsed.length > 0 ? JSON.stringify(parsed) : null);
              }}
              rows={6}
              placeholder={"Is this mock test free? | Yes, all mock tests on Khojney are 100% free.\nHow many questions are there? | 140 MCQs to be completed in 3 hours."}
            />
            <p className="text-xs text-muted-foreground">Format: Question | Answer (separate each FAQ with a new line)</p>
          </div>
          <div className="space-y-2">
            <Label>Related Resources (one per line, format: Title | URL)</Label>
            <Textarea
              value={
                form.relatedResources
                  ? (JSON.parse(form.relatedResources) as Array<{ title: string; url: string }>)
                      .map((r) => `${r.title} | ${r.url}`)
                      .join("\n")
                  : ""
              }
              onChange={(e) => {
                const lines = e.target.value.split("\n").filter((l) => l.trim());
                const parsed = lines.map((line) => {
                  const [title, ...urlParts] = line.split("|");
                  return {
                    title: title.trim(),
                    url: urlParts.join("|").trim(),
                  };
                }).filter((r) => r.title && r.url);
                setField("relatedResources", parsed.length > 0 ? JSON.stringify(parsed) : null);
              }}
              rows={4}
              placeholder={"IOE Preparation Guide | /blog/ioe-entrance-preparation\nBest Engineering Colleges | /blog/best-engineering-colleges-nepal"}
            />
          </div>
        </CardContent>
      </Card>

      {/* ─── SEO Settings ───────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label>SEO Title (meta title)</Label>
            <Input
              value={form.seoTitle ?? ""}
              onChange={(e) => setField("seoTitle", e.target.value || null)}
              placeholder="e.g. IOE Mock Test Free Online 2025 — Instant Scoring | Khojney"
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground">{(form.seoTitle ?? "").length}/60 characters</p>
          </div>
          <div className="space-y-2">
            <Label>SEO Description (meta description)</Label>
            <Textarea
              value={form.seoDescription ?? ""}
              onChange={(e) => setField("seoDescription", e.target.value || null)}
              rows={2}
              placeholder="Take free IOE mock tests online with real exam patterns. Complete IOE entrance preparation guide with syllabus, tips, and instant scoring."
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground">{(form.seoDescription ?? "").length}/160 characters</p>
          </div>
          <div className="space-y-2">
            <Label>Meta Keywords (comma-separated)</Label>
            <Input
              value={form.keywords ?? ""}
              onChange={(e) => setField("keywords", e.target.value || null)}
              placeholder="ioe mock test, ioe entrance, free ioe mock test, ioe practice online"
            />
          </div>
          <div className="space-y-2">
            <Label>Canonical URL (override auto-generated)</Label>
            <Input
              value={form.canonicalUrl ?? ""}
              onChange={(e) => setField("canonicalUrl", e.target.value || null)}
              placeholder="/mock-exams/ioe/ioe-entrance"
            />
            <p className="text-xs text-muted-foreground">Leave empty to use /mock-exams/[category]/[slug]</p>
          </div>
        </CardContent>
      </Card>

      {/* ─── Submit ─────────────────────────────────────────── */}
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
    isParent: Boolean(raw.isParent),
    tags: (raw.tags as string) || null,
    coverImage: (raw.coverImage as string) || null,
    order: raw.order != null ? Number(raw.order) : 0,
    seoTitle: (raw.seoTitle as string) || null,
    seoDescription: (raw.seoDescription as string) || null,
    seoContent: (raw.seoContent as string) || null,
    keywords: (raw.keywords as string) || null,
    canonicalUrl: (raw.canonicalUrl as string) || null,
    featuredImage: (raw.featuredImage as string) || null,
    heroTitle: (raw.heroTitle as string) || null,
    heroDescription: (raw.heroDescription as string) || null,
    benefits: (raw.benefits as string) || null,
    instructions: (raw.instructions as string) || null,
    faqs: (raw.faqs as string) || null,
    ctaText: (raw.ctaText as string) || null,
    relatedResources: (raw.relatedResources as string) || null,
    negativeMarking: Boolean(raw.negativeMarking),
    negativeMarkValue: raw.negativeMarkValue != null ? Number(raw.negativeMarkValue) : 0,
  };
}
