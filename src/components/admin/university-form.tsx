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
import { ProgramsEditor, type ProgramItem } from "@/components/admin/programs-editor";
import { JsonListEditor } from "@/components/admin/json-list-editor";
import { NoticesEditor, type NoticeItem } from "@/components/admin/notices-editor";
import { parseJson } from "@/lib/admin-utils";
import { NEPAL_PROVINCES } from "@/lib/constants";

export interface UniversityInitial {
  id?: string;
  name: string;
  slug: string;
  description: string;
  establishedYear: number | null;
  province: string | null;
  city: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo: string | null;
  coverImage: string | null;
  type: string;
  ranking: number | null;
  totalCampuses: number;
  totalStudents: number | null;
  faculties: string[];
  programs: ProgramItem[];
  admissionProcess: string | null;
  notices: NoticeItem[];
  results: NoticeItem[];
  isFeatured: boolean;
  isPublished: boolean;
}

interface Props {
  mode: "create" | "edit";
  initial?: Partial<UniversityInitial>;
}

const UNI_TYPES = ["PUBLIC", "PRIVATE"];

export function UniversityForm({ mode, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<UniversityInitial>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    establishedYear: initial?.establishedYear ?? null,
    province: initial?.province ?? null,
    city: initial?.city ?? null,
    address: initial?.address ?? null,
    phone: initial?.phone ?? null,
    email: initial?.email ?? null,
    website: initial?.website ?? null,
    logo: initial?.logo ?? null,
    coverImage: initial?.coverImage ?? null,
    type: initial?.type ?? "PUBLIC",
    ranking: initial?.ranking ?? null,
    totalCampuses: initial?.totalCampuses ?? 0,
    totalStudents: initial?.totalStudents ?? null,
    faculties: initial?.faculties ?? [],
    programs: initial?.programs ?? [],
    admissionProcess: initial?.admissionProcess ?? null,
    notices: initial?.notices ?? [],
    results: initial?.results ?? [],
    isFeatured: initial?.isFeatured ?? false,
    isPublished: initial?.isPublished ?? true,
  });

  function setField<K extends keyof UniversityInitial>(key: K, value: UniversityInitial[K]) {
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
        mode === "create"
          ? "/api/admin/universities"
          : `/api/admin/universities/${initial?.id}`;
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
      toast.success(mode === "create" ? "University created" : "University updated");
      router.push("/admin/universities");
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
            <Label>Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="e.g. Tribhuvan University"
              required
            />
          </div>
          <SlugField
            value={form.slug}
            onChange={(v) => setField("slug", v)}
            titleValue={form.name}
          />
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => setField("type", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNI_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
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
              placeholder="Brief overview of the university"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location & Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Province</Label>
            <Select
              value={form.province ?? "none"}
              onValueChange={(v) => setField("province", v === "none" ? null : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="none">— None —</SelectItem>
                {NEPAL_PROVINCES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input
              value={form.city ?? ""}
              onChange={(e) => setField("city", e.target.value || null)}
              placeholder="e.g. Kirtipur"
            />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              value={form.address ?? ""}
              onChange={(e) => setField("address", e.target.value || null)}
              placeholder="Street address"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={form.phone ?? ""}
              onChange={(e) => setField("phone", e.target.value || null)}
              placeholder="01-XXXXXXX"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email ?? ""}
              onChange={(e) => setField("email", e.target.value || null)}
              placeholder="info@university.edu.np"
            />
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <Input
              value={form.website ?? ""}
              onChange={(e) => setField("website", e.target.value || null)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stats & Media</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Established Year</Label>
            <Input
              type="number"
              value={form.establishedYear ?? ""}
              onChange={(e) =>
                setField("establishedYear", e.target.value ? Number(e.target.value) : null)
              }
              placeholder="e.g. 1959"
            />
          </div>
          <div className="space-y-2">
            <Label>Ranking</Label>
            <Input
              type="number"
              value={form.ranking ?? ""}
              onChange={(e) =>
                setField("ranking", e.target.value ? Number(e.target.value) : null)
              }
              placeholder="e.g. 1 (top Nepali university)"
            />
          </div>
          <div className="space-y-2">
            <Label>Total Campuses</Label>
            <Input
              type="number"
              value={form.totalCampuses}
              onChange={(e) => setField("totalCampuses", Number(e.target.value) || 0)}
              placeholder="e.g. 1080"
            />
          </div>
          <div className="space-y-2">
            <Label>Total Students</Label>
            <Input
              type="number"
              value={form.totalStudents ?? ""}
              onChange={(e) =>
                setField("totalStudents", e.target.value ? Number(e.target.value) : null)
              }
              placeholder="e.g. 500000"
            />
          </div>
          <ImageUrlField
            label="Logo URL"
            value={form.logo ?? ""}
            onChange={(v) => setField("logo", v || null)}
          />
          <ImageUrlField
            label="Cover Image URL"
            value={form.coverImage ?? ""}
            onChange={(v) => setField("coverImage", v || null)}
          />
          <div className="md:col-span-2 space-y-2">
            <Label>Admission Process</Label>
            <Textarea
              value={form.admissionProcess ?? ""}
              onChange={(e) => setField("admissionProcess", e.target.value || null)}
              rows={3}
              placeholder="Describe how to apply"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Faculties & Programs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <JsonListEditor
            label="Faculties"
            description="Engineering, Medicine, Management, etc."
            values={form.faculties}
            onChange={(v) => setField("faculties", v)}
            placeholder="e.g. Engineering"
          />
          <ProgramsEditor
            label="Programs"
            description="Programs offered across faculties"
            items={form.programs}
            onChange={(items) => setField("programs", items)}
            variant="university"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notices & Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <NoticesEditor
            label="Notices"
            description="Latest official notices"
            items={form.notices}
            onChange={(items) => setField("notices", items)}
          />
          <NoticesEditor
            label="Results"
            description="Published exam results"
            items={form.results}
            onChange={(items) => setField("results", items)}
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
              <Save className="h-4 w-4" /> {mode === "create" ? "Create University" : "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function parseUniversityInitial(raw: Record<string, unknown>): Partial<UniversityInitial> {
  return {
    id: raw.id as string,
    name: raw.name as string,
    slug: raw.slug as string,
    description: raw.description as string,
    establishedYear: raw.establishedYear != null ? Number(raw.establishedYear) : null,
    province: (raw.province as string) || null,
    city: (raw.city as string) || null,
    address: (raw.address as string) || null,
    phone: (raw.phone as string) || null,
    email: (raw.email as string) || null,
    website: (raw.website as string) || null,
    logo: (raw.logo as string) || null,
    coverImage: (raw.coverImage as string) || null,
    type: (raw.type as string) || "PUBLIC",
    ranking: raw.ranking != null ? Number(raw.ranking) : null,
    totalCampuses: raw.totalCampuses != null ? Number(raw.totalCampuses) : 0,
    totalStudents: raw.totalStudents != null ? Number(raw.totalStudents) : null,
    faculties: parseJson<string[]>(raw.faculties as string, []),
    programs: parseJson<ProgramItem[]>(raw.programs as string, []),
    admissionProcess: (raw.admissionProcess as string) || null,
    notices: parseJson<NoticeItem[]>(raw.notices as string, []),
    results: parseJson<NoticeItem[]>(raw.results as string, []),
    isFeatured: Boolean(raw.isFeatured),
    isPublished: raw.isPublished !== false,
  };
}
