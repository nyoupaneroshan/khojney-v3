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
import { NEPSE_SECTORS } from "@/lib/constants";
import type { NepseStockInitial } from "@/lib/admin-parsers";

interface Props {
  mode: "create" | "edit";
  initial?: Partial<NepseStockInitial>;
}

export function NepseStockForm({ mode, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<NepseStockInitial>({
    id: initial?.id,
    slug: initial?.slug ?? "",
    symbol: initial?.symbol ?? "",
    companyName: initial?.companyName ?? "",
    description: initial?.description ?? "",
    sector: initial?.sector ?? "COMMERCIAL_BANK",
    ltp: initial?.ltp ?? null,
    pointChange: initial?.pointChange ?? null,
    percentChange: initial?.percentChange ?? null,
    high52: initial?.high52 ?? null,
    low52: initial?.low52 ?? null,
    peRatio: initial?.peRatio ?? null,
    eps: initial?.eps ?? null,
    bookValue: initial?.bookValue ?? null,
    marketCap: initial?.marketCap ?? null,
    paidUpCapital: initial?.paidUpCapital ?? null,
    dividendYield: initial?.dividendYield ?? null,
    bonusShare: initial?.bonusShare ?? "",
    cashDividend: initial?.cashDividend ?? "",
    website: initial?.website ?? "",
    headquarters: initial?.headquarters ?? "",
    establishedYear: initial?.establishedYear ?? null,
    isFeatured: initial?.isFeatured ?? false,
    isPublished: initial?.isPublished ?? true,
  });

  function setField<K extends keyof NepseStockInitial>(key: K, value: NepseStockInitial[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.symbol.trim()) {
      toast.error("Symbol is required");
      return;
    }
    if (!form.companyName.trim()) {
      toast.error("Company name is required");
      return;
    }
    setSaving(true);
    try {
      const url =
        mode === "create" ? "/api/admin/nepse" : `/api/admin/nepse/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save stock");
      }
      toast.success(mode === "create" ? "Stock created" : "Stock updated");
      router.push("/admin/nepse");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-4xl pb-12">
      {/* Company Basics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Company & Listing Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="symbol">NEPSE Symbol (Ticker) *</Label>
              <Input
                id="symbol"
                value={form.symbol}
                onChange={(e) => setField("symbol", e.target.value.toUpperCase())}
                placeholder="NABIL"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={form.companyName}
                onChange={(e) => setField("companyName", e.target.value)}
                placeholder="Nabil Bank Limited"
                required
              />
            </div>
          </div>

          <SlugField
            titleValue={`${form.symbol} ${form.companyName}`}
            value={form.slug}
            onChange={(slug) => setField("slug", slug)}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Sector</Label>
              <Select value={form.sector} onValueChange={(v) => setField("sector", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NEPSE_SECTORS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace(/_/g, " ")}
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
                placeholder="1984"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Business Overview</Label>
            <Textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Business profile, major projects, operations..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Market Prices & Ratios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trading & Valuation Ratios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="ltp">LTP (NPR) *</Label>
              <Input
                id="ltp"
                type="number"
                step="0.1"
                value={form.ltp ?? ""}
                onChange={(e) =>
                  setField("ltp", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="540.0"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pointChange">Point Change</Label>
              <Input
                id="pointChange"
                type="number"
                step="0.1"
                value={form.pointChange ?? ""}
                onChange={(e) =>
                  setField("pointChange", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="+12.5"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="percentChange">% Change</Label>
              <Input
                id="percentChange"
                type="number"
                step="0.01"
                value={form.percentChange ?? ""}
                onChange={(e) =>
                  setField("percentChange", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="+2.37"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="high52">52-Week High (NPR)</Label>
              <Input
                id="high52"
                type="number"
                step="0.1"
                value={form.high52 ?? ""}
                onChange={(e) =>
                  setField("high52", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="630.0"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="low52">52-Week Low (NPR)</Label>
              <Input
                id="low52"
                type="number"
                step="0.1"
                value={form.low52 ?? ""}
                onChange={(e) =>
                  setField("low52", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="420.0"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="peRatio">P/E Ratio</Label>
              <Input
                id="peRatio"
                type="number"
                step="0.01"
                value={form.peRatio ?? ""}
                onChange={(e) =>
                  setField("peRatio", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="18.5"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="eps">EPS (NPR)</Label>
              <Input
                id="eps"
                type="number"
                step="0.01"
                value={form.eps ?? ""}
                onChange={(e) =>
                  setField("eps", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="29.2"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bookValue">Book Value (NPR)</Label>
              <Input
                id="bookValue"
                type="number"
                step="0.01"
                value={form.bookValue ?? ""}
                onChange={(e) =>
                  setField("bookValue", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="215.4"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="marketCap">Market Cap (NPR Crore)</Label>
              <Input
                id="marketCap"
                type="number"
                step="0.1"
                value={form.marketCap ?? ""}
                onChange={(e) =>
                  setField("marketCap", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="14500.0"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="paidUpCapital">Paid-Up Capital (Crore)</Label>
              <Input
                id="paidUpCapital"
                type="number"
                step="0.1"
                value={form.paidUpCapital ?? ""}
                onChange={(e) =>
                  setField("paidUpCapital", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="2705.0"
              />
            </div>
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
                placeholder="3.2"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="bonusShare">Bonus Share</Label>
              <Input
                id="bonusShare"
                value={form.bonusShare ?? ""}
                onChange={(e) => setField("bonusShare", e.target.value || null)}
                placeholder="10% (FY 2080/81)"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cashDividend">Cash Dividend</Label>
              <Input
                id="cashDividend"
                value={form.cashDividend ?? ""}
                onChange={(e) => setField("cashDividend", e.target.value || null)}
                placeholder="4.5% (FY 2080/81)"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Info */}
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
                placeholder="Kathmandu"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={form.website ?? ""}
                onChange={(e) => setField("website", e.target.value || null)}
                placeholder="https://nabilbank.com"
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
              Featured on Share Market list
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
          onClick={() => router.push("/admin/nepse")}
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
              {mode === "create" ? "Create Stock" : "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
