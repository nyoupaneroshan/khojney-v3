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
import { SlugField } from "@/components/admin/form-fields";
import { JsonListEditor } from "@/components/admin/json-list-editor";
import { slugify, stringifyJson } from "@/lib/admin-utils";
import type { GovernmentServiceInitial } from "@/lib/admin-parsers";
import { GOV_CATEGORIES, GOV_CATEGORY_LABELS } from "@/lib/government-categories";

interface Props {
  mode: "create" | "edit";
  initial?: Partial<GovernmentServiceInitial>;
}

export function GovernmentServiceForm({ mode, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<GovernmentServiceInitial>({
    id: initial?.id,
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? "CITIZENSHIP",
    ministry: initial?.ministry ?? null,
    department: initial?.department ?? null,
    office: initial?.office ?? null,
    applicationUrl: initial?.applicationUrl ?? null,
    applicationFee: initial?.applicationFee ?? null,
    processingTime: initial?.processingTime ?? null,
    requiredDocuments: initial?.requiredDocuments ?? [],
    steps: initial?.steps ?? [],
    contactPhone: initial?.contactPhone ?? null,
    contactEmail: initial?.contactEmail ?? null,
    isFeatured: initial?.isFeatured ?? false,
    isPublished: initial?.isPublished ?? true,
  });

  function setField<K extends keyof GovernmentServiceInitial>(
    key: K,
    value: GovernmentServiceInitial[K],
  ) {
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
          ? "/api/admin/government"
          : `/api/admin/government/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: slugify(form.slug),
          description: form.description,
          category: form.category,
          ministry: form.ministry,
          department: form.department,
          office: form.office,
          applicationUrl: form.applicationUrl,
          applicationFee: form.applicationFee,
          processingTime: form.processingTime,
          // JSON-string columns: serialize on the client.
          requiredDocuments: stringifyJson(form.requiredDocuments),
          steps: stringifyJson(form.steps),
          contactPhone: form.contactPhone,
          contactEmail: form.contactEmail,
          isFeatured: form.isFeatured,
          isPublished: form.isPublished,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save");
      }
      toast.success(
        mode === "create"
          ? "Government service created"
          : "Government service updated",
      );
      router.push("/admin/government");
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
              placeholder="e.g. Apply for Nepali Citizenship Certificate"
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
              value={form.category}
              onValueChange={(v) => setField("category", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {GOV_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {GOV_CATEGORY_LABELS[c]}
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
              rows={5}
              placeholder="Describe what this service is, who it is for, and any key background."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Issuing Authority</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Ministry</Label>
            <Input
              value={form.ministry ?? ""}
              onChange={(e) => setField("ministry", e.target.value || null)}
              placeholder="e.g. Ministry of Home Affairs"
            />
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Input
              value={form.department ?? ""}
              onChange={(e) => setField("department", e.target.value || null)}
              placeholder="e.g. Department of Passports"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Office</Label>
            <Input
              value={form.office ?? ""}
              onChange={(e) => setField("office", e.target.value || null)}
              placeholder="e.g. District Administration Office, Kathmandu"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Application Fee</Label>
            <Input
              value={form.applicationFee ?? ""}
              onChange={(e) => setField("applicationFee", e.target.value || null)}
              placeholder="e.g. NPR 5,000 (regular) / NPR 10,000 (fast-track)"
            />
          </div>
          <div className="space-y-2">
            <Label>Processing Time</Label>
            <Input
              value={form.processingTime ?? ""}
              onChange={(e) => setField("processingTime", e.target.value || null)}
              placeholder="e.g. 3–5 working days"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Application URL</Label>
            <Input
              value={form.applicationUrl ?? ""}
              onChange={(e) => setField("applicationUrl", e.target.value || null)}
              placeholder="https://online portal link..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Process &amp; Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <JsonListEditor
            label="Process Steps"
            description="Add each step in order — they will be shown as a numbered list."
            values={form.steps}
            onChange={(v) => setField("steps", v)}
            placeholder="e.g. Fill out the application form"
          />
          <JsonListEditor
            label="Required Documents"
            description="List each document the applicant must bring/submit."
            values={form.requiredDocuments}
            onChange={(v) => setField("requiredDocuments", v)}
            placeholder="e.g. Citizenship copy of parent"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Contact Phone</Label>
            <Input
              value={form.contactPhone ?? ""}
              onChange={(e) => setField("contactPhone", e.target.value || null)}
              placeholder="e.g. 01-4211950"
            />
          </div>
          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input
              type="email"
              value={form.contactEmail ?? ""}
              onChange={(e) => setField("contactEmail", e.target.value || null)}
              placeholder="e.g. info@dao.gov.np"
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
              <p className="text-xs text-muted-foreground">
                Show on homepage / highlights
              </p>
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
              <Save className="h-4 w-4" />{" "}
              {mode === "create" ? "Create Service" : "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
