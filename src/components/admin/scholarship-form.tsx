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
import { toDateInputValue } from "@/lib/admin-utils";
import { NEPAL_PROVINCES } from "@/lib/constants";

export interface ScholarshipInitial {
  id?: string;
  title: string;
  slug: string;
  description: string;
  provider: string | null;
  providerUrl: string | null;
  categoryId: string | null;
  level: string | null;
  field: string | null;
  amount: string | null;
  eligibility: string[];
  deadline: string | null; // yyyy-MM-dd
  applicationOpen: string | null;
  applicationUrl: string | null;
  country: string;
  province: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  coverImage: string | null;
}

const SCHOLARSHIP_LEVELS = ["SCHOOL", "+2", "BACHELORS", "MASTERS", "PHD", "ANY"];

interface Props {
  mode: "create" | "edit";
  initial?: Partial<ScholarshipInitial>;
  categories: { id: string; name: string }[];
}

export function ScholarshipForm({ mode, initial, categories }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<ScholarshipInitial>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    provider: initial?.provider ?? null,
    providerUrl: initial?.providerUrl ?? null,
    categoryId: initial?.categoryId ?? null,
    level: initial?.level ?? null,
    field: initial?.field ?? null,
    amount: initial?.amount ?? null,
    eligibility: initial?.eligibility ?? [],
    deadline: initial?.deadline ?? null,
    applicationOpen: initial?.applicationOpen ?? null,
    applicationUrl: initial?.applicationUrl ?? null,
    country: initial?.country ?? "Nepal",
    province: initial?.province ?? null,
    isFeatured: initial?.isFeatured ?? false,
    isPublished: initial?.isPublished ?? true,
    coverImage: initial?.coverImage ?? null,
  });

  function setField<K extends keyof ScholarshipInitial>(key: K, value: ScholarshipInitial[K]) {
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
      const url =
        mode === "create"
          ? "/api/admin/scholarships"
          : `/api/admin/scholarships/${initial?.id}`;
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
      toast.success(mode === "create" ? "Scholarship created" : "Scholarship updated");
      router.push("/admin/scholarships");
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
              placeholder="e.g. Japanese Government (MEXT) Scholarship"
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
              rows={4}
              placeholder="Describe the scholarship, eligibility, benefits, etc."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Provider & Amount</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Provider</Label>
            <Input
              value={form.provider ?? ""}
              onChange={(e) => setField("provider", e.target.value || null)}
              placeholder="e.g. Government of Japan"
            />
          </div>
          <div className="space-y-2">
            <Label>Provider URL</Label>
            <Input
              value={form.providerUrl ?? ""}
              onChange={(e) => setField("providerUrl", e.target.value || null)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label>Level</Label>
            <Select
              value={form.level ?? "none"}
              onValueChange={(v) => setField("level", v === "none" ? null : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— Any —</SelectItem>
                {SCHOLARSHIP_LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Field</Label>
            <Input
              value={form.field ?? ""}
              onChange={(e) => setField("field", e.target.value || null)}
              placeholder="e.g. Engineering, Medicine, Any"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Amount</Label>
            <Input
              value={form.amount ?? ""}
              onChange={(e) => setField("amount", e.target.value || null)}
              placeholder="e.g. NPR 200,000/year or Full tuition"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eligibility</CardTitle>
        </CardHeader>
        <CardContent>
          <JsonListEditor
            label="Eligibility Criteria"
            description="List each criterion as a separate item"
            values={form.eligibility}
            onChange={(v) => setField("eligibility", v)}
            placeholder="e.g. Must be a Nepali citizen"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dates & Application</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Application Open</Label>
            <Input
              type="date"
              value={form.applicationOpen ?? ""}
              onChange={(e) => setField("applicationOpen", e.target.value || null)}
            />
          </div>
          <div className="space-y-2">
            <Label>Deadline</Label>
            <Input
              type="date"
              value={form.deadline ?? ""}
              onChange={(e) => setField("deadline", e.target.value || null)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Application URL</Label>
            <Input
              value={form.applicationUrl ?? ""}
              onChange={(e) => setField("applicationUrl", e.target.value || null)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location & Media</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Country</Label>
            <Input
              value={form.country}
              onChange={(e) => setField("country", e.target.value)}
              placeholder="Nepal"
            />
          </div>
          <div className="space-y-2">
            <Label>Province</Label>
            <Select
              value={form.province ?? "none"}
              onValueChange={(v) => setField("province", v === "none" ? null : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— Any —</SelectItem>
                {NEPAL_PROVINCES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <Save className="h-4 w-4" /> {mode === "create" ? "Create Scholarship" : "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function parseScholarshipInitial(raw: Record<string, unknown>): Partial<ScholarshipInitial> {
  return {
    id: raw.id as string,
    title: raw.title as string,
    slug: raw.slug as string,
    description: raw.description as string,
    provider: (raw.provider as string) || null,
    providerUrl: (raw.providerUrl as string) || null,
    categoryId: (raw.categoryId as string) || null,
    level: (raw.level as string) || null,
    field: (raw.field as string) || null,
    amount: (raw.amount as string) || null,
    eligibility: (() => {
      try {
        return raw.eligibility ? JSON.parse(raw.eligibility as string) : [];
      } catch {
        return [];
      }
    })(),
    deadline: raw.deadline ? toDateInputValue(raw.deadline as string) : null,
    applicationOpen: raw.applicationOpen
      ? toDateInputValue(raw.applicationOpen as string)
      : null,
    applicationUrl: (raw.applicationUrl as string) || null,
    country: (raw.country as string) || "Nepal",
    province: (raw.province as string) || null,
    isFeatured: Boolean(raw.isFeatured),
    isPublished: raw.isPublished !== false,
    coverImage: (raw.coverImage as string) || null,
  };
}
