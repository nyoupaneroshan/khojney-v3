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
import { INSURANCE_TYPES } from "@/lib/constants";
import type { InsuranceCompanyInitial } from "@/lib/admin-parsers";

interface Props {
  mode: "create" | "edit";
  initial?: Partial<InsuranceCompanyInitial>;
}

export function InsuranceCompanyForm({ mode, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<InsuranceCompanyInitial>({
    id: initial?.id,
    slug: initial?.slug ?? "",
    name: initial?.name ?? "",
    shortName: initial?.shortName ?? "",
    description: initial?.description ?? "",
    type: initial?.type ?? "LIFE",
    establishedYear: initial?.establishedYear ?? null,
    headquarters: initial?.headquarters ?? "",
    website: initial?.website ?? "",
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
    logo: initial?.logo ?? "",
    paidUpCapital: initial?.paidUpCapital ?? null,
    claimSettlementRatio: initial?.claimSettlementRatio ?? null,
    branchCount: initial?.branchCount ?? null,
    solvencyRatio: initial?.solvencyRatio ?? null,
    popularPlans: initial?.popularPlans ?? [],
    coverageTypes: initial?.coverageTypes ?? [],
    isFeatured: initial?.isFeatured ?? false,
    isPublished: initial?.isPublished ?? true,
  });

  function setField<K extends keyof InsuranceCompanyInitial>(key: K, value: InsuranceCompanyInitial[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Company name is required");
      return;
    }
    if (!form.shortName.trim()) {
      toast.error("Short name / acronym is required");
      return;
    }
    setSaving(true);
    try {
      const url =
        mode === "create" ? "/api/admin/insurance" : `/api/admin/insurance/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save insurance company");
      }
      toast.success(mode === "create" ? "Insurance company created" : "Insurance company updated");
      router.push("/admin/insurance");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-4xl pb-12">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Company Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Insurance Company Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Nepal Life Insurance Company Limited"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shortName">Short Name / Code *</Label>
              <Input
                id="shortName"
                value={form.shortName}
                onChange={(e) => setField("shortName", e.target.value)}
                placeholder="NLIC"
                required
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
              <Label>Insurance Category</Label>
              <Select value={form.type} onValueChange={(v) => setField("type", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INSURANCE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="establishedYear">Established Year</Label>
              <Input
                id="establishedYear"
                type="number"
                value={form.establishedYear ?? ""}
                onChange={(e) =>
                  setField("establishedYear", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="2001"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Company Profile</Label>
            <Textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Overview of company history, market share, policies..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Financials & Settlement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Financial Strength & Settlement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="claimSettlementRatio">Claim Settlement Ratio (%)</Label>
              <Input
                id="claimSettlementRatio"
                type="number"
                step="0.01"
                value={form.claimSettlementRatio ?? ""}
                onChange={(e) =>
                  setField("claimSettlementRatio", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="97.8"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="solvencyRatio">Solvency Ratio</Label>
              <Input
                id="solvencyRatio"
                type="number"
                step="0.01"
                value={form.solvencyRatio ?? ""}
                onChange={(e) =>
                  setField("solvencyRatio", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="2.1"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="paidUpCapital">Paid-Up Capital (NPR Crore)</Label>
              <Input
                id="paidUpCapital"
                type="number"
                step="0.1"
                value={form.paidUpCapital ?? ""}
                onChange={(e) =>
                  setField("paidUpCapital", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="820.7"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="branchCount">Branch Count Across Nepal</Label>
              <Input
                id="branchCount"
                type="number"
                value={form.branchCount ?? ""}
                onChange={(e) =>
                  setField("branchCount", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="195"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <JsonListEditor
              label="Coverage Types Offered"
              values={form.coverageTypes}
              onChange={(types) => setField("coverageTypes", types)}
              placeholder="e.g. Term Life, Endowment, Health, Child Education, Foreign Employment"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact & Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Location & Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="headquarters">Headquarters</Label>
              <Input
                id="headquarters"
                value={form.headquarters ?? ""}
                onChange={(e) => setField("headquarters", e.target.value || null)}
                placeholder="Kamaladi, Kathmandu"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Contact Phone</Label>
              <Input
                id="phone"
                value={form.phone ?? ""}
                onChange={(e) => setField("phone", e.target.value || null)}
                placeholder="+977-1-4247000"
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
                placeholder="info@nepallife.com.np"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={form.website ?? ""}
                onChange={(e) => setField("website", e.target.value || null)}
                placeholder="https://nepallife.com.np"
              />
            </div>
          </div>

          <ImageUrlField
            label="Logo URL"
            value={form.logo ?? ""}
            onChange={(logo) => setField("logo", logo || null)}
          />
        </CardContent>
      </Card>

      {/* Visibility */}
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
              Featured Insurance Company
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

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/insurance")}
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
              {mode === "create" ? "Create Company" : "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
