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
import { parseJson } from "@/lib/admin-utils";
import { NEPAL_PROVINCES, NEPAL_DISTRICTS } from "@/lib/constants";

export interface SchoolInitial {
  id?: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string | null;
  province: string | null;
  district: string | null;
  city: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  level: string | null;
  type: string;
  affiliation: string | null;
  establishedYear: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo: string | null;
  coverImage: string | null;
  programs: string[];
  facilities: string[];
  feesRange: string | null;
  admissionProcess: string | null;
  isFeatured: boolean;
  isVerified: boolean;
  isPublished: boolean;
}

const SCHOOL_LEVELS = ["PRIMARY", "LOWER_SECONDARY", "SECONDARY", "HIGHER_SECONDARY"];
const SCHOOL_TYPES = ["PUBLIC", "PRIVATE", "COMMUNITY"];

interface Props {
  mode: "create" | "edit";
  initial?: Partial<SchoolInitial>;
  categories: { id: string; name: string }[];
}

export function SchoolForm({ mode, initial, categories }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<SchoolInitial>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    categoryId: initial?.categoryId ?? null,
    province: initial?.province ?? null,
    district: initial?.district ?? null,
    city: initial?.city ?? null,
    address: initial?.address ?? null,
    latitude: initial?.latitude ?? null,
    longitude: initial?.longitude ?? null,
    level: initial?.level ?? null,
    type: initial?.type ?? "PRIVATE",
    affiliation: initial?.affiliation ?? null,
    establishedYear: initial?.establishedYear ?? null,
    phone: initial?.phone ?? null,
    email: initial?.email ?? null,
    website: initial?.website ?? null,
    logo: initial?.logo ?? null,
    coverImage: initial?.coverImage ?? null,
    programs: initial?.programs ?? [],
    facilities: initial?.facilities ?? [],
    feesRange: initial?.feesRange ?? null,
    admissionProcess: initial?.admissionProcess ?? null,
    isFeatured: initial?.isFeatured ?? false,
    isVerified: initial?.isVerified ?? false,
    isPublished: initial?.isPublished ?? true,
  });

  function setField<K extends keyof SchoolInitial>(key: K, value: SchoolInitial[K]) {
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
      const url = mode === "create" ? "/api/admin/schools" : `/api/admin/schools/${initial?.id}`;
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
      toast.success(mode === "create" ? "School created" : "School updated");
      router.push("/admin/schools");
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
              placeholder="e.g. Budhanilkantha School"
              required
            />
          </div>
          <SlugField
            value={form.slug}
            onChange={(v) => setField("slug", v)}
            titleValue={form.name}
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
              placeholder="Brief overview of the school"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location & Type</CardTitle>
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
            <Label>District</Label>
            <Select
              value={form.district ?? "none"}
              onValueChange={(v) => setField("district", v === "none" ? null : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="none">— None —</SelectItem>
                {NEPAL_DISTRICTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
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
              placeholder="e.g. Kathmandu"
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
            <Label>Latitude</Label>
            <Input
              type="number"
              step="any"
              value={form.latitude ?? ""}
              onChange={(e) => setField("latitude", e.target.value ? Number(e.target.value) : null)}
              placeholder="e.g. 27.7322"
            />
          </div>
          <div className="space-y-2">
            <Label>Longitude</Label>
            <Input
              type="number"
              step="any"
              value={form.longitude ?? ""}
              onChange={(e) => setField("longitude", e.target.value ? Number(e.target.value) : null)}
              placeholder="e.g. 85.3363"
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
                <SelectItem value="none">— None —</SelectItem>
                {SCHOOL_LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => setField("type", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCHOOL_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Affiliation</Label>
            <Input
              value={form.affiliation ?? ""}
              onChange={(e) => setField("affiliation", e.target.value || null)}
              placeholder="e.g. NEB, CDC"
            />
          </div>
          <div className="space-y-2">
            <Label>Established Year</Label>
            <Input
              type="number"
              value={form.establishedYear ?? ""}
              onChange={(e) =>
                setField("establishedYear", e.target.value ? Number(e.target.value) : null)
              }
              placeholder="e.g. 1972"
            />
          </div>
          <div className="space-y-2">
            <Label>Fees Range</Label>
            <Input
              value={form.feesRange ?? ""}
              onChange={(e) => setField("feesRange", e.target.value || null)}
              placeholder="e.g. NPR 50-90k/year"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact & Media</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
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
              placeholder="info@school.edu.np"
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
          <ImageUrlField
            label="Logo URL"
            value={form.logo ?? ""}
            onChange={(v) => setField("logo", v || null)}
          />
          <div className="md:col-span-2">
            <ImageUrlField
              label="Cover Image URL"
              value={form.coverImage ?? ""}
              onChange={(v) => setField("coverImage", v || null)}
            />
          </div>
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
          <CardTitle>Programs & Facilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <JsonListEditor
            label="Programs / Courses"
            description="List of classes/courses offered (e.g. +2 Science, A-Levels)"
            values={form.programs}
            onChange={(v) => setField("programs", v)}
            placeholder="e.g. +2 Science"
          />
          <JsonListEditor
            label="Facilities"
            description="Library, lab, hostel, sports, transport, etc."
            values={form.facilities}
            onChange={(v) => setField("facilities", v)}
            placeholder="e.g. Library"
          />
        </CardContent>
      </Card>

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
              checked={form.isVerified}
              onCheckedChange={(v) => setField("isVerified", v === true)}
            />
            <div>
              <span className="text-sm font-medium">Verified</span>
              <p className="text-xs text-muted-foreground">Mark as officially verified</p>
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
              <Save className="h-4 w-4" /> {mode === "create" ? "Create School" : "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function parseSchoolInitial(raw: Record<string, unknown>): Partial<SchoolInitial> {
  return {
    id: raw.id as string,
    name: raw.name as string,
    slug: raw.slug as string,
    description: raw.description as string,
    categoryId: (raw.categoryId as string) || null,
    province: (raw.province as string) || null,
    district: (raw.district as string) || null,
    city: (raw.city as string) || null,
    address: (raw.address as string) || null,
    latitude: raw.latitude != null ? Number(raw.latitude) : null,
    longitude: raw.longitude != null ? Number(raw.longitude) : null,
    level: (raw.level as string) || null,
    type: (raw.type as string) || "PRIVATE",
    affiliation: (raw.affiliation as string) || null,
    establishedYear: raw.establishedYear != null ? Number(raw.establishedYear) : null,
    phone: (raw.phone as string) || null,
    email: (raw.email as string) || null,
    website: (raw.website as string) || null,
    logo: (raw.logo as string) || null,
    coverImage: (raw.coverImage as string) || null,
    programs: parseJson<string[]>(raw.programs as string, []),
    facilities: parseJson<string[]>(raw.facilities as string, []),
    feesRange: (raw.feesRange as string) || null,
    admissionProcess: (raw.admissionProcess as string) || null,
    isFeatured: Boolean(raw.isFeatured),
    isVerified: Boolean(raw.isVerified),
    isPublished: raw.isPublished !== false,
  };
}
