"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MODULES } from "@/lib/constants";

export interface TrendingInitial {
  id?: string;
  query: string;
  count: number;
  module: string | null;
  isActive: boolean;
  order: number;
}

interface Props {
  mode: "create" | "edit";
  initial?: Partial<TrendingInitial>;
}

export function TrendingForm({ mode, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<TrendingInitial>({
    query: initial?.query ?? "",
    count: initial?.count ?? 0,
    module: initial?.module ?? null,
    isActive: initial?.isActive ?? true,
    order: initial?.order ?? 0,
  });

  function setField<K extends keyof TrendingInitial>(key: K, value: TrendingInitial[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.query.trim()) {
      toast.error("Query is required");
      return;
    }
    setSaving(true);
    try {
      const url =
        mode === "create" ? "/api/admin/trending" : `/api/admin/trending/${initial?.id}`;
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
      toast.success(mode === "create" ? "Trending search created" : "Trending search updated");
      router.push("/admin/trending");
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
          <CardTitle>Trending Search</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label>Query *</Label>
            <Input
              value={form.query}
              onChange={(e) => setField("query", e.target.value)}
              placeholder="e.g. CMAT Mock Test"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Module</Label>
            <Select
              value={form.module ?? "none"}
              onValueChange={(v) => setField("module", v === "none" ? null : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="No module" />
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
            <Label>Display Count</Label>
            <Input
              type="number"
              value={form.count}
              onChange={(e) => setField("count", Number(e.target.value) || 0)}
              placeholder="e.g. 1250"
            />
            <p className="text-xs text-muted-foreground">
              Visible count shown next to the search query
            </p>
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
          <div className="space-y-2 flex items-end">
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={form.isActive}
                onCheckedChange={(v) => setField("isActive", v === true)}
              />
              <div>
                <span className="text-sm font-medium">Active</span>
                <p className="text-xs text-muted-foreground">Show on homepage</p>
              </div>
            </label>
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
              <Save className="h-4 w-4" /> {mode === "create" ? "Create" : "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function parseTrendingInitial(raw: Record<string, unknown>): Partial<TrendingInitial> {
  return {
    id: raw.id as string,
    query: raw.query as string,
    count: raw.count != null ? Number(raw.count) : 0,
    module: (raw.module as string) || null,
    isActive: raw.isActive !== false,
    order: raw.order != null ? Number(raw.order) : 0,
  };
}
