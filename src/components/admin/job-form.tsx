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
import { JsonListEditor } from "@/components/admin/json-list-editor";
import { slugify, stringifyJson, toDateInputValue } from "@/lib/admin-utils";
import type { JobInitial } from "@/lib/admin-parsers";

interface Props {
  mode: "create" | "edit";
  initial?: Partial<JobInitial>;
}

const JOB_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"];
const JOB_CATEGORIES = ["IT", "FINANCE", "MARKETING", "ENGINEERING", "HEALTHCARE", "EDUCATION", "OTHER"];
const EXPERIENCE_LEVELS = ["ENTRY", "MID", "SENIOR", "LEAD"];

export function JobForm({ mode, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<JobInitial>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    company: initial?.company ?? "",
    companyLogo: initial?.companyLogo ?? null,
    location: initial?.location ?? null,
    jobType: initial?.jobType ?? "FULL_TIME",
    category: initial?.category ?? null,
    experienceLevel: initial?.experienceLevel ?? "ENTRY",
    salaryMin: initial?.salaryMin ?? null,
    salaryMax: initial?.salaryMax ?? null,
    salaryCurrency: initial?.salaryCurrency ?? "NPR",
    applicationUrl: initial?.applicationUrl ?? null,
    applicationEmail: initial?.applicationEmail ?? null,
    deadline: initial?.deadline ?? null,
    skills: initial?.skills ?? [],
    qualifications: initial?.qualifications ?? [],
    isFeatured: initial?.isFeatured ?? false,
    isPublished: initial?.isPublished ?? true,
  });

  function setField<K extends keyof JobInitial>(key: K, value: JobInitial[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.company.trim()) {
      toast.error("Company is required");
      return;
    }
    setSaving(true);
    try {
      // Build the payload — keep nulls explicit so the PUT handler can
      // clear optional fields, but stringify the JSON-array columns.
      const payload: Record<string, unknown> = {
        ...form,
        slug: form.slug ? slugify(form.slug) : slugify(form.title),
        skills: stringifyJson(form.skills ?? []),
        qualifications: stringifyJson(form.qualifications ?? []),
        salaryMin: form.salaryMin === null || form.salaryMin === undefined || form.salaryMin === ("" as unknown as number) ? null : Number(form.salaryMin),
        salaryMax: form.salaryMax === null || form.salaryMax === undefined || form.salaryMax === ("" as unknown as number) ? null : Number(form.salaryMax),
        deadline: form.deadline || null,
      };

      const url =
        mode === "create"
          ? "/api/admin/jobs"
          : `/api/admin/jobs/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save");
      }
      toast.success(mode === "create" ? "Job created" : "Job updated");
      router.push("/admin/jobs");
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
            <Label>Job Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              required
            />
          </div>
          <SlugField
            value={form.slug}
            onChange={(v) => setField("slug", v)}
            titleValue={form.title}
          />
          <div className="space-y-2">
            <Label>Company *</Label>
            <Input
              value={form.company}
              onChange={(e) => setField("company", e.target.value)}
              placeholder="e.g. F1Soft International"
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Location</Label>
            <Input
              value={form.location ?? ""}
              onChange={(e) => setField("location", e.target.value || null)}
              placeholder="e.g. Kathmandu, Nepal"
            />
          </div>
          <div className="md:col-span-2">
            <ImageUrlField
              label="Company Logo URL"
              value={form.companyLogo ?? ""}
              onChange={(v) => setField("companyLogo", v || null)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={6}
              placeholder="Describe the role, responsibilities, what the day-to-day looks like, team, etc."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classification</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Job Type</Label>
            <Select value={form.jobType} onValueChange={(v) => setField("jobType", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JOB_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.category ?? "none"}
              onValueChange={(v) => setField("category", v === "none" ? null : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— No category —</SelectItem>
                {JOB_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Experience Level</Label>
            <Select
              value={form.experienceLevel}
              onValueChange={(v) => setField("experienceLevel", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Salary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Salary Min</Label>
            <Input
              type="number"
              value={form.salaryMin ?? ""}
              onChange={(e) =>
                setField("salaryMin", e.target.value ? Number(e.target.value) : null)
              }
              placeholder="e.g. 50000"
            />
          </div>
          <div className="space-y-2">
            <Label>Salary Max</Label>
            <Input
              type="number"
              value={form.salaryMax ?? ""}
              onChange={(e) =>
                setField("salaryMax", e.target.value ? Number(e.target.value) : null)
              }
              placeholder="e.g. 80000"
            />
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Input
              value={form.salaryCurrency}
              onChange={(e) => setField("salaryCurrency", e.target.value || "NPR")}
              placeholder="NPR"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application & Deadline</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Application URL</Label>
            <Input
              value={form.applicationUrl ?? ""}
              onChange={(e) => setField("applicationUrl", e.target.value || null)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label>Application Email</Label>
            <Input
              type="email"
              value={form.applicationEmail ?? ""}
              onChange={(e) => setField("applicationEmail", e.target.value || null)}
              placeholder="careers@company.com"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Deadline</Label>
            <Input
              type="date"
              value={form.deadline ? toDateInputValue(form.deadline) : ""}
              onChange={(e) => setField("deadline", e.target.value || null)}
            />
            <p className="text-xs text-muted-foreground">
              Leave blank if the job is open until filled.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills & Qualifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <JsonListEditor
            label="Skills"
            description="Add each skill as a separate tag (e.g. React, TypeScript, SQL)"
            values={form.skills ?? []}
            onChange={(v) => setField("skills", v)}
            placeholder="e.g. React"
          />
          <JsonListEditor
            label="Qualifications"
            description="Add each qualification or requirement as a separate item"
            values={form.qualifications ?? []}
            onChange={(v) => setField("qualifications", v)}
            placeholder="e.g. Bachelor's degree in Computer Science"
          />
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
              <p className="text-xs text-muted-foreground">Show on homepage / highlight in lists</p>
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
              <Save className="h-4 w-4" /> {mode === "create" ? "Create Job" : "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
