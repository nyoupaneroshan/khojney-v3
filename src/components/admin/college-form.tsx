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
import { parseJson } from "@/lib/admin-utils";
import { NEPAL_PROVINCES, NEPAL_DISTRICTS } from "@/lib/constants";

export interface CollegeInitial {
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
  affiliation: string | null;
  type: string;
  establishedYear: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo: string | null;
  coverImage: string | null;
  programs: ProgramItem[];
  facilities: string[];
  admissionProcess: string | null;
  feesRange: string | null;
  scholarshipsAvailable: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  isPublished: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface Props {
  mode: "create" | "edit";
  initial?: Partial<CollegeInitial>;
  categories: Category[];
}

const COLLEGE_TYPES = ["PUBLIC", "PRIVATE", "COMMUNITY", "INTERNATIONAL"];

export function CollegeForm({ mode, initial, categories }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<CollegeInitial>({
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
    affiliation: initial?.affiliation ?? null,
    type: initial?.type ?? "PRIVATE",
    establishedYear: initial?.establishedYear ?? null,
    phone: initial?.phone ?? null,
    email: initial?.email ?? null,
    website: initial?.website ?? null,
    logo: initial?.logo ?? null,
    coverImage: initial?.coverImage ?? null,
    programs: initial?.programs ?? [],
    facilities: initial?.facilities ?? [],
    admissionProcess: initial?.admissionProcess ?? null,
    feesRange: initial?.feesRange ?? null,
    scholarshipsAvailable: initial?.scholarshipsAvailable ?? false,
    isFeatured: initial?.isFeatured ?? false,
    isVerified: initial?.isVerified ?? false,
    isPublished: initial?.isPublished ?? true,
  });

  function setField<K extends keyof CollegeInitial>(key: K, value: CollegeInitial[K]) {
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
      const url = mode === "create" ? "/api/admin/colleges" : `/api/admin/colleges/${initial?.id}`;
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
      toast.success(mode === "create" ? "College created" : "College updated");
      router.push("/admin/colleges");
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
              placeholder="e.g. Pulchowk Engineering Campus"
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
              placeholder="Brief overview of the college"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
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
              placeholder="e.g. Lalitpur"
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
              onChange={(e) =>
                setField("latitude", e.target.value ? Number(e.target.value) : null)
              }
              placeholder="e.g. 27.6776"
            />
          </div>
          <div className="space-y-2">
            <Label>Longitude</Label>
            <Input
              type="number"
              step="any"
              value={form.longitude ?? ""}
              onChange={(e) =>
                setField("longitude", e.target.value ? Number(e.target.value) : null)
              }
              placeholder="e.g. 85.3146"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Affiliation</Label>
            <Input
              value={form.affiliation ?? ""}
              onChange={(e) => setField("affiliation", e.target.value || null)}
              placeholder="e.g. TU, KU, PU, CTEVT"
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => setField("type", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COLLEGE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Established Year</Label>
            <Input
              type="number"
              value={form.establishedYear ?? ""}
              onChange={(e) =>
                setField("establishedYear", e.target.value ? Number(e.target.value) : null)
              }
              placeholder="e.g. 1984"
            />
          </div>
          <div className="space-y-2">
            <Label>Fees Range</Label>
            <Input
              value={form.feesRange ?? ""}
              onChange={(e) => setField("feesRange", e.target.value || null)}
              placeholder="e.g. NPR 5-8 lakh"
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
              placeholder="info@college.edu.np"
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
          <ProgramsEditor
            label="Programs"
            description="Add each academic program offered"
            items={form.programs}
            onChange={(items) => setField("programs", items)}
            variant="college"
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
        <CardContent className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={form.scholarshipsAvailable}
              onCheckedChange={(v) => setField("scholarshipsAvailable", v === true)}
            />
            <div>
              <span className="text-sm font-medium">Scholarships Available</span>
              <p className="text-xs text-muted-foreground">College offers scholarships</p>
            </div>
          </label>
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
              <Save className="h-4 w-4" /> {mode === "create" ? "Create College" : "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

/** Helper to parse college JSON-string fields into the form shape. */
export function parseCollegeInitial(raw: Record<string, unknown>): Partial<CollegeInitial> {
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
    affiliation: (raw.affiliation as string) || null,
    type: (raw.type as string) || "PRIVATE",
    establishedYear:
      raw.establishedYear != null ? Number(raw.establishedYear) : null,
    phone: (raw.phone as string) || null,
    email: (raw.email as string) || null,
    website: (raw.website as string) || null,
    logo: (raw.logo as string) || null,
    coverImage: (raw.coverImage as string) || null,
    programs: parseJson<ProgramItem[]>(raw.programs as string, []),
    facilities: parseJson<string[]>(raw.facilities as string, []),
    admissionProcess: (raw.admissionProcess as string) || null,
    feesRange: (raw.feesRange as string) || null,
    scholarshipsAvailable: Boolean(raw.scholarshipsAvailable),
    isFeatured: Boolean(raw.isFeatured),
    isVerified: Boolean(raw.isVerified),
    isPublished: raw.isPublished !== false,
  };
}
