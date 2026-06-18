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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlugField } from "@/components/admin/form-fields";
import { MODULES } from "@/lib/constants";

export interface CategoryInitial {
  id?: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  parentId: string | null;
  module: string | null;
  order: number;
}

interface Props {
  mode: "create" | "edit";
  initial?: Partial<CategoryInitial>;
  parentOptions: { id: string; name: string; module: string | null }[];
}

const COLORS = ["red", "blue", "green", "amber", "purple", "pink", "teal", "orange", "rose", "indigo", "cyan", "emerald"];

export function CategoryForm({ mode, initial, parentOptions }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<CategoryInitial>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    icon: initial?.icon ?? "",
    color: initial?.color ?? "",
    parentId: initial?.parentId ?? null,
    module: initial?.module ?? null,
    order: initial?.order ?? 0,
  });

  function setField<K extends keyof CategoryInitial>(key: K, value: CategoryInitial[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const url =
        mode === "create" ? "/api/admin/categories" : `/api/admin/categories/${initial?.id}`;
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
      toast.success(mode === "create" ? "Category created" : "Category updated");
      router.push("/admin/categories");
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
          <CardTitle>Category Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="e.g. Engineering Entrance"
              required
            />
          </div>
          <SlugField
            value={form.slug}
            onChange={(v) => setField("slug", v)}
            titleValue={form.name}
          />
          <div className="space-y-2">
            <Label>Module</Label>
            <Select
              value={form.module ?? "none"}
              onValueChange={(v) => setField("module", v === "none" ? null : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— None —</SelectItem>
                {MODULES.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Parent Category</Label>
            <Select
              value={form.parentId ?? "none"}
              onValueChange={(v) => setField("parentId", v === "none" ? null : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Top-level category" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="none">— Top-level (no parent) —</SelectItem>
                {parentOptions
                  .filter((p) => p.id !== initial?.id)
                  .map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} {p.module ? `(${p.module})` : ""}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Icon (lucide name)</Label>
            <Input
              value={form.icon}
              onChange={(e) => setField("icon", e.target.value)}
              placeholder="e.g. GraduationCap, FileText, Building2"
            />
            <p className="text-xs text-muted-foreground">
              Use a name from{" "}
              <a
                href="https://lucide.dev/icons"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                lucide.dev/icons
              </a>
              .
            </p>
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <Select
              value={form.color || "none"}
              onValueChange={(v) => setField("color", v === "none" ? "" : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="No color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— No color —</SelectItem>
                {COLORS.map((c) => (
                  <SelectItem key={c} value={c}>
                    <span className="flex items-center gap-2">
                      <span className={`h-3 w-3 rounded-full bg-${c}-500`} />
                      {c}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={3}
              placeholder="Optional description"
            />
          </div>
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
              <Save className="h-4 w-4" /> {mode === "create" ? "Create Category" : "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function parseCategoryInitial(raw: Record<string, unknown>): Partial<CategoryInitial> {
  return {
    id: raw.id as string,
    name: raw.name as string,
    slug: raw.slug as string,
    description: (raw.description as string) ?? "",
    icon: (raw.icon as string) ?? "",
    color: (raw.color as string) ?? "",
    parentId: (raw.parentId as string) || null,
    module: (raw.module as string) || null,
    order: raw.order != null ? Number(raw.order) : 0,
  };
}
