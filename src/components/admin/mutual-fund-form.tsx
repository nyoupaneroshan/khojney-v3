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
import { MUTUAL_FUND_TYPES, MUTUAL_FUND_CATEGORIES } from "@/lib/constants";
import type { MutualFundInitial } from "@/lib/admin-parsers";

interface Props {
  mode: "create" | "edit";
  initial?: Partial<MutualFundInitial>;
}

export function MutualFundForm({ mode, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<MutualFundInitial>({
    id: initial?.id,
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    schemeCode: initial?.schemeCode ?? "",
    fundManager: initial?.fundManager ?? "",
    sponsor: initial?.sponsor ?? "",
    description: initial?.description ?? "",
    fundType: initial?.fundType ?? "CLOSE_ENDED",
    category: initial?.category ?? "EQUITY",
    nav: initial?.nav ?? null,
    navDate: initial?.navDate ?? null,
    fundSize: initial?.fundSize ?? null,
    totalUnits: initial?.totalUnits ?? null,
    maturityDate: initial?.maturityDate ?? null,
    launchDate: initial?.launchDate ?? null,
    dividendYield: initial?.dividendYield ?? null,
    latestDividend: initial?.latestDividend ?? "",
    topHoldings: initial?.topHoldings ?? [],
    website: initial?.website ?? "",
    contactPhone: initial?.contactPhone ?? "",
    isFeatured: initial?.isFeatured ?? false,
    isPublished: initial?.isPublished ?? true,
  });

  function setField<K extends keyof MutualFundInitial>(key: K, value: MutualFundInitial[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Scheme name is required");
      return;
    }
    if (!form.fundManager.trim()) {
      toast.error("Fund manager is required");
      return;
    }
    setSaving(true);
    try {
      const url =
        mode === "create" ? "/api/admin/mutual-funds" : `/api/admin/mutual-funds/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save mutual fund");
      }
      toast.success(mode === "create" ? "Mutual fund created" : "Mutual fund updated");
      router.push("/admin/mutual-funds");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-4xl pb-12">
      {/* Scheme Basics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Scheme Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Scheme Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Nabil Balanced Fund-2"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="schemeCode">Scheme Code / Symbol</Label>
              <Input
                id="schemeCode"
                value={form.schemeCode ?? ""}
                onChange={(e) => setField("schemeCode", e.target.value || null)}
                placeholder="NBF2"
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
              <Label htmlFor="fundManager">Fund Manager (Merchant Banker) *</Label>
              <Input
                id="fundManager"
                value={form.fundManager}
                onChange={(e) => setField("fundManager", e.target.value)}
                placeholder="Nabil Investment Banking Limited"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sponsor">Sponsor</Label>
              <Input
                id="sponsor"
                value={form.sponsor ?? ""}
                onChange={(e) => setField("sponsor", e.target.value || null)}
                placeholder="Nabil Bank Limited"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Fund Type</Label>
              <Select value={form.fundType} onValueChange={(v) => setField("fundType", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MUTUAL_FUND_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setField("category", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MUTUAL_FUND_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Scheme Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Investment objective, asset allocation, and strategy..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Financials & NAV */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">NAV & Financial Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="nav">Net Asset Value (NPR / unit)</Label>
              <Input
                id="nav"
                type="number"
                step="0.01"
                value={form.nav ?? ""}
                onChange={(e) =>
                  setField("nav", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="11.45"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="navDate">NAV Date</Label>
              <Input
                id="navDate"
                type="date"
                value={form.navDate ?? ""}
                onChange={(e) => setField("navDate", e.target.value || null)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fundSize">Fund Size (NPR Crore)</Label>
              <Input
                id="fundSize"
                type="number"
                step="0.1"
                value={form.fundSize ?? ""}
                onChange={(e) =>
                  setField("fundSize", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="100.0"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="totalUnits">Total Units (Crore)</Label>
              <Input
                id="totalUnits"
                type="number"
                step="0.1"
                value={form.totalUnits ?? ""}
                onChange={(e) =>
                  setField("totalUnits", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="10.0"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="launchDate">Launch Date</Label>
              <Input
                id="launchDate"
                type="date"
                value={form.launchDate ?? ""}
                onChange={(e) => setField("launchDate", e.target.value || null)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="maturityDate">Maturity Date (if closed)</Label>
              <Input
                id="maturityDate"
                type="date"
                value={form.maturityDate ?? ""}
                onChange={(e) => setField("maturityDate", e.target.value || null)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="dividendYield">Dividend Yield (%)</Label>
              <Input
                id="dividendYield"
                type="number"
                step="0.01"
                value={form.dividendYield ?? ""}
                onChange={(e) =>
                  setField("dividendYield", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="9.5"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="latestDividend">Latest Dividend</Label>
              <Input
                id="latestDividend"
                value={form.latestDividend ?? ""}
                onChange={(e) => setField("latestDividend", e.target.value || null)}
                placeholder="10.5% cash (FY 2080/81)"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <JsonListEditor
              label="Top Stock Holdings (Ticker symbols)"
              values={form.topHoldings}
              onChange={(holdings) => setField("topHoldings", holdings)}
              placeholder="e.g. NABIL, CIT, CHCL, EBL, NICA"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact & Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact & Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={form.website ?? ""}
                onChange={(e) => setField("website", e.target.value || null)}
                placeholder="https://nabilinvest.com.np"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={form.contactPhone ?? ""}
                onChange={(e) => setField("contactPhone", e.target.value || null)}
                placeholder="+977-1-4411160"
              />
            </div>
          </div>
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
              Featured Scheme
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
          onClick={() => router.push("/admin/mutual-funds")}
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
              {mode === "create" ? "Create Scheme" : "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
