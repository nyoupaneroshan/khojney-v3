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
import { NEPAL_PROVINCES, HOSPITAL_TYPES } from "@/lib/constants";
import type { HospitalInitial } from "@/lib/admin-parsers";

interface Props {
  mode: "create" | "edit";
  initial?: Partial<HospitalInitial>;
}

export function HospitalForm({ mode, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<HospitalInitial>({
    id: initial?.id,
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    shortName: initial?.shortName ?? "",
    description: initial?.description ?? "",
    type: initial?.type ?? "GENERAL",
    province: initial?.province ?? "Bagmati",
    district: initial?.district ?? "Kathmandu",
    city: initial?.city ?? "Kathmandu",
    address: initial?.address ?? "",
    establishedYear: initial?.establishedYear ?? null,
    website: initial?.website ?? "",
    phone: initial?.phone ?? "",
    emergencyPhone: initial?.emergencyPhone ?? "",
    email: initial?.email ?? "",
    logo: initial?.logo ?? "",
    coverImage: initial?.coverImage ?? "",
    bedCount: initial?.bedCount ?? null,
    icuBeds: initial?.icuBeds ?? null,
    ventilatorCount: initial?.ventilatorCount ?? null,
    hasEmergency: initial?.hasEmergency ?? true,
    hasAmbulance: initial?.hasAmbulance ?? true,
    hasBloodBank: initial?.hasBloodBank ?? false,
    hasPharmacy24x7: initial?.hasPharmacy24x7 ?? true,
    departments: initial?.departments ?? [],
    facilities: initial?.facilities ?? [],
    isFeatured: initial?.isFeatured ?? false,
    isPublished: initial?.isPublished ?? true,
  });

  function setField<K extends keyof HospitalInitial>(key: K, value: HospitalInitial[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Hospital name is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }
    setSaving(true);
    try {
      const url =
        mode === "create" ? "/api/admin/hospitals" : `/api/admin/hospitals/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save hospital");
      }
      toast.success(mode === "create" ? "Hospital created" : "Hospital updated");
      router.push("/admin/hospitals");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-4xl pb-12">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Hospital Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Tribhuvan University Teaching Hospital"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shortName">Short Name / Acronym</Label>
              <Input
                id="shortName"
                value={form.shortName ?? ""}
                onChange={(e) => setField("shortName", e.target.value || null)}
                placeholder="TUTH"
              />
            </div>
          </div>

          <SlugField
            titleValue={form.name}
            value={form.slug}
            onChange={(slug) => setField("slug", slug)}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Hospital Type</Label>
              <Select value={form.type} onValueChange={(v) => setField("type", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOSPITAL_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="establishedYear">Established Year (AD)</Label>
              <Input
                id="establishedYear"
                type="number"
                value={form.establishedYear ?? ""}
                onChange={(e) =>
                  setField("establishedYear", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="1982"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Overview of the hospital, specialties, and healthcare services..."
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Location & Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Location & Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Province</Label>
              <Select
                value={form.province ?? ""}
                onValueChange={(v) => setField("province", v || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  {NEPAL_PROVINCES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                value={form.district ?? ""}
                onChange={(e) => setField("district", e.target.value || null)}
                placeholder="Kathmandu"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">City / Area</Label>
              <Input
                id="city"
                value={form.city ?? ""}
                onChange={(e) => setField("city", e.target.value || null)}
                placeholder="Maharajgunj"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Full Address</Label>
            <Input
              id="address"
              value={form.address ?? ""}
              onChange={(e) => setField("address", e.target.value || null)}
              placeholder="Maharajgunj, Kathmandu, Nepal"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Reception Phone</Label>
              <Input
                id="phone"
                value={form.phone ?? ""}
                onChange={(e) => setField("phone", e.target.value || null)}
                placeholder="+977-1-4412303"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emergencyPhone" className="text-red-600 font-semibold">Emergency / Hotline</Label>
              <Input
                id="emergencyPhone"
                value={form.emergencyPhone ?? ""}
                onChange={(e) => setField("emergencyPhone", e.target.value || null)}
                placeholder="102 or +977-1-4412505"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email ?? ""}
                onChange={(e) => setField("email", e.target.value || null)}
                placeholder="info@hospital.org.np"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="website">Official Website</Label>
              <Input
                id="website"
                type="url"
                value={form.website ?? ""}
                onChange={(e) => setField("website", e.target.value || null)}
                placeholder="https://hospital.org.np"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ImageUrlField
              label="Logo URL"
              value={form.logo ?? ""}
              onChange={(logo) => setField("logo", logo || null)}
            />
            <ImageUrlField
              label="Cover Image URL"
              value={form.coverImage ?? ""}
              onChange={(img) => setField("coverImage", img || null)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Capacity & Key Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Capacity & Facilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="bedCount">Total Bed Count</Label>
              <Input
                id="bedCount"
                type="number"
                value={form.bedCount ?? ""}
                onChange={(e) =>
                  setField("bedCount", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="700"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="icuBeds">ICU Beds</Label>
              <Input
                id="icuBeds"
                type="number"
                value={form.icuBeds ?? ""}
                onChange={(e) =>
                  setField("icuBeds", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="50"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ventilatorCount">Ventilators</Label>
              <Input
                id="ventilatorCount"
                type="number"
                value={form.ventilatorCount ?? ""}
                onChange={(e) =>
                  setField("ventilatorCount", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="25"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasEmergency"
                checked={form.hasEmergency}
                onCheckedChange={(c) => setField("hasEmergency", Boolean(c))}
              />
              <Label htmlFor="hasEmergency" className="cursor-pointer">
                24/7 Emergency Service (ER)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasAmbulance"
                checked={form.hasAmbulance}
                onCheckedChange={(c) => setField("hasAmbulance", Boolean(c))}
              />
              <Label htmlFor="hasAmbulance" className="cursor-pointer">
                Ambulance Service Available
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasBloodBank"
                checked={form.hasBloodBank}
                onCheckedChange={(c) => setField("hasBloodBank", Boolean(c))}
              />
              <Label htmlFor="hasBloodBank" className="cursor-pointer">
                In-house Blood Bank
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasPharmacy24x7"
                checked={form.hasPharmacy24x7}
                onCheckedChange={(c) => setField("hasPharmacy24x7", Boolean(c))}
              />
              <Label htmlFor="hasPharmacy24x7" className="cursor-pointer">
                24/7 Pharmacy
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Departments & Facilities Lists */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Departments & Equipment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <JsonListEditor
              label="Departments & Specialties"
              values={form.departments}
              onChange={(departments) => setField("departments", departments)}
              placeholder="e.g. Cardiology, Neurology, Pediatrics, Oncology"
            />
          </div>

          <div className="space-y-2">
            <JsonListEditor
              label="Facilities & Diagnostic Equipment"
              values={form.facilities}
              onChange={(facilities) => setField("facilities", facilities)}
              placeholder="e.g. 128-Slice CT, 3T MRI, Cath Lab, Dialysis Unit"
            />
          </div>
        </CardContent>
      </Card>

      {/* Publication Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFeatured"
              checked={form.isFeatured}
              onCheckedChange={(c) => setField("isFeatured", Boolean(c))}
            />
            <Label htmlFor="isFeatured" className="cursor-pointer">
              Featured on Home & Directory
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublished"
              checked={form.isPublished}
              onCheckedChange={(c) => setField("isPublished", Boolean(c))}
            />
            <Label htmlFor="isPublished" className="cursor-pointer">
              Published (Visible to public)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/hospitals")}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {mode === "create" ? "Create Hospital" : "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
