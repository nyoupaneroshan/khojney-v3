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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlugField, ImageUrlField, MarkdownEditor } from "@/components/admin/form-fields";
import { toDateTimeInputValue } from "@/lib/admin-utils";

export interface BlogPostInitial {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  categoryId: string | null;
  tagIds: string[];
  status: string;
  featured: boolean;
  readTimeMin: number;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: string; // datetime-local string
}

interface Tag {
  id: string;
  name: string;
}

interface Props {
  mode: "create" | "edit";
  initial?: Partial<BlogPostInitial>;
  categories: { id: string; name: string }[];
  tags: Tag[];
}

const POST_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export function BlogPostForm({ mode, initial, categories, tags }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<BlogPostInitial>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    coverImage: initial?.coverImage ?? null,
    categoryId: initial?.categoryId ?? null,
    tagIds: initial?.tagIds ?? [],
    status: initial?.status ?? "DRAFT",
    featured: initial?.featured ?? false,
    readTimeMin: initial?.readTimeMin ?? 5,
    metaTitle: initial?.metaTitle ?? null,
    metaDescription: initial?.metaDescription ?? null,
    publishedAt: initial?.publishedAt ?? toDateTimeInputValue(new Date()),
  });

  function setField<K extends keyof BlogPostInitial>(key: K, value: BlogPostInitial[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleTag(id: string) {
    setForm((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(id)
        ? prev.tagIds.filter((t) => t !== id)
        : [...prev.tagIds, id],
    }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const url = mode === "create" ? "/api/admin/blog" : `/api/admin/blog/${initial?.id}`;
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
      toast.success(mode === "create" ? "Post created" : "Post updated");
      router.push("/admin/blog");
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
              placeholder="e.g. Top 10 Engineering Colleges in Nepal 2025"
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
            <Label>Excerpt</Label>
            <Textarea
              value={form.excerpt}
              onChange={(e) => setField("excerpt", e.target.value)}
              rows={2}
              placeholder="Short summary shown in cards and search results"
            />
          </div>
          <div className="md:col-span-2">
            <MarkdownEditor
              label="Content (Markdown)"
              value={form.content}
              onChange={(v) => setField("content", v)}
              minHeight={360}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-40 rounded-md border p-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {tags.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-full text-center py-4">
                  No tags available. Create some in the Categories section first.
                </p>
              )}
              {tags.map((tag) => {
                const checked = form.tagIds.includes(tag.id);
                return (
                  <label
                    key={tag.id}
                    className="flex items-center gap-2 cursor-pointer text-sm hover:bg-accent rounded px-2 py-1"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleTag(tag.id)}
                    />
                    <span>{tag.name}</span>
                  </label>
                );
              })}
            </div>
          </ScrollArea>
          {form.tagIds.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {form.tagIds.map((id) => {
                const tag = tags.find((t) => t.id === id);
                if (!tag) return null;
                return (
                  <Badge key={id} variant="secondary">
                    {tag.name}
                  </Badge>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publishing & SEO</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setField("status", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POST_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Read Time (minutes)</Label>
            <Input
              type="number"
              value={form.readTimeMin}
              onChange={(e) => setField("readTimeMin", Number(e.target.value) || 5)}
              placeholder="e.g. 7"
            />
          </div>
          <div className="space-y-2">
            <Label>Published At</Label>
            <Input
              type="datetime-local"
              value={form.publishedAt}
              onChange={(e) => setField("publishedAt", e.target.value)}
            />
          </div>
          <div className="space-y-2 flex items-end">
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={form.featured}
                onCheckedChange={(v) => setField("featured", v === true)}
              />
              <div>
                <span className="text-sm font-medium">Featured post</span>
                <p className="text-xs text-muted-foreground">Highlight on blog page</p>
              </div>
            </label>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Meta Title (optional)</Label>
            <Input
              value={form.metaTitle ?? ""}
              onChange={(e) => setField("metaTitle", e.target.value || null)}
              placeholder="SEO title — defaults to post title"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Meta Description (optional)</Label>
            <Textarea
              value={form.metaDescription ?? ""}
              onChange={(e) => setField("metaDescription", e.target.value || null)}
              rows={2}
              placeholder="SEO description — defaults to excerpt"
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
              <Save className="h-4 w-4" /> {mode === "create" ? "Create Post" : "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function parseBlogPostInitial(raw: Record<string, unknown>): Partial<BlogPostInitial> {
  const tags = (raw.tags as { id: string }[] | undefined) ?? [];
  return {
    id: raw.id as string,
    title: raw.title as string,
    slug: raw.slug as string,
    excerpt: (raw.excerpt as string) ?? "",
    content: raw.content as string,
    coverImage: (raw.coverImage as string) || null,
    categoryId: (raw.categoryId as string) || null,
    tagIds: tags.map((t) => t.id),
    status: (raw.status as string) || "DRAFT",
    featured: Boolean(raw.featured),
    readTimeMin: raw.readTimeMin != null ? Number(raw.readTimeMin) : 5,
    metaTitle: (raw.metaTitle as string) || null,
    metaDescription: (raw.metaDescription as string) || null,
    publishedAt: raw.publishedAt
      ? toDateTimeInputValue(raw.publishedAt as string)
      : toDateTimeInputValue(new Date()),
  };
}
