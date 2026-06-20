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
import type { BankInitial } from "@/lib/admin-parsers";

const BANK_TYPES = ["COMMERCIAL", "DEVELOPMENT", "FINANCE", "MICROFINANCE"];

interface Props {
  mode: "create" | "edit";
  initial?: Partial<BankInitial>;
}

export function BankForm({ mode, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<BankInitial>({
    id: initial?.id,
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    shortName: initial?.shortName ?? "",
    description: initial?.description ?? "",
    type: initial?.type ?? "COMMERCIAL",
    establishedYear: initial?.establishedYear ?? null,
    headquarters: initial?.headquarters ?? null,
    website: initial?.website ?? null,
    phone: initial?.phone ?? null,
    email: initial?.email ?? null,
    logo: initial?.logo ?? null,
    swiftCode: initial?.swiftCode ?? null,
    savingsRateMin: initial?.savingsRateMin ?? null,
    savingsRateMax: initial?.savingsRateMax ?? null,
    fixedDepositRateMin: initial?.fixedDepositRateMin ?? null,
    fixedDepositRateMax: initial?.fixedDepositRateMax ?? null,
    branchCount: initial?.branchCount ?? null,
    atmCount: initial?.atmCount ?? null,
    mobileBanking: initial?.mobileBanking ?? false,
    internetBanking: initial?.internetBanking ?? false,
    cards: initial?.cards ?? [],
    loans: initial?.loans ?? [],
    isFeatured: initial?.isFeatured ?? false,
    isPublished: initial?.isPublished ?? true,
  });

  function setField<K extends keyof BankInitial>(key: K, value: BankInitial[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!form.shortName.trim()) {
      toast.error("Short name is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }
    setSaving(true);
    try {
      const url =
        mode === "create" ? "/api/admin/banks" : `/api/admin/banks/${initial?.id}`;
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
      toast.success(mode === "create" ? "Bank created" : "Bank updated");
      router.push("/admin/banks");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Basic information */}
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
              placeholder="e.g. Nepal Investment Bank Ltd."
              required
            />
          </div>
          <SlugField
            value={form.slug}
            onChange={(v) => setField("slug", v)}
            titleValue={form.name}
          />
          <div className="space-y-2">
            <Label>Short Name *</Label>
            <Input
              value={form.shortName}
              onChange={(e) => setField("shortName", e.target.value)}
              placeholder="e.g. NIBL"
              required
            />
            <p className="text-xs text-muted-foreground">
              Abbreviation shown on cards &amp; badges.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => setField("type", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BANK_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0) + t.slice(1).toLowerCase()}
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
              placeholder="e.g. 1986"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={4}
              placeholder="Brief overview of the bank, its history, and services."
            />
          </div>
        </CardContent>
      </Card>

      {/* Headquarters & contact */}
      <Card>
        <CardHeader>
          <CardTitle>Headquarters &amp; Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Headquarters</Label>
            <Input
              value={form.headquarters ?? ""}
              onChange={(e) => setField("headquarters", e.target.value || null)}
              placeholder="e.g. Durbar Marg, Kathmandu"
            />
          </div>
          <div className="space-y-2">
            <Label>SWIFT Code</Label>
            <Input
              value={form.swiftCode ?? ""}
              onChange={(e) => setField("swiftCode", e.target.value || null)}
              placeholder="e.g. NIBLNPKA"
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
              placeholder="info@bank.com.np"
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
        </CardContent>
      </Card>

      {/* Interest rates */}
      <Card>
        <CardHeader>
          <CardTitle>Interest Rates (%)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Savings Rate — Min</Label>
            <Input
              type="number"
              step="0.01"
              value={form.savingsRateMin ?? ""}
              onChange={(e) =>
                setField("savingsRateMin", e.target.value ? Number(e.target.value) : null)
              }
              placeholder="e.g. 2.5"
            />
          </div>
          <div className="space-y-2">
            <Label>Savings Rate — Max</Label>
            <Input
              type="number"
              step="0.01"
              value={form.savingsRateMax ?? ""}
              onChange={(e) =>
                setField("savingsRateMax", e.target.value ? Number(e.target.value) : null)
              }
              placeholder="e.g. 8.0"
            />
          </div>
          <div className="space-y-2">
            <Label>Fixed Deposit Rate — Min</Label>
            <Input
              type="number"
              step="0.01"
              value={form.fixedDepositRateMin ?? ""}
              onChange={(e) =>
                setField(
                  "fixedDepositRateMin",
                  e.target.value ? Number(e.target.value) : null,
                )
              }
              placeholder="e.g. 5.0"
            />
          </div>
          <div className="space-y-2">
            <Label>Fixed Deposit Rate — Max</Label>
            <Input
              type="number"
              step="0.01"
              value={form.fixedDepositRateMax ?? ""}
              onChange={(e) =>
                setField(
                  "fixedDepositRateMax",
                  e.target.value ? Number(e.target.value) : null,
                )
              }
              placeholder="e.g. 11.0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Network & digital banking */}
      <Card>
        <CardHeader>
          <CardTitle>Network &amp; Digital Banking</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Branch Count</Label>
            <Input
              type="number"
              value={form.branchCount ?? ""}
              onChange={(e) =>
                setField("branchCount", e.target.value ? Number(e.target.value) : null)
              }
              placeholder="e.g. 275"
            />
          </div>
          <div className="space-y-2">
            <Label>ATM Count</Label>
            <Input
              type="number"
              value={form.atmCount ?? ""}
              onChange={(e) =>
                setField("atmCount", e.target.value ? Number(e.target.value) : null)
              }
              placeholder="e.g. 312"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={form.mobileBanking}
              onCheckedChange={(v) => setField("mobileBanking", v === true)}
            />
            <div>
              <span className="text-sm font-medium">Mobile Banking</span>
              <p className="text-xs text-muted-foreground">Bank offers a mobile banking app</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={form.internetBanking}
              onCheckedChange={(v) => setField("internetBanking", v === true)}
            />
            <div>
              <span className="text-sm font-medium">Internet Banking</span>
              <p className="text-xs text-muted-foreground">Bank offers internet/web banking</p>
            </div>
          </label>
        </CardContent>
      </Card>

      {/* Cards & loans */}
      <Card>
        <CardHeader>
          <CardTitle>Cards &amp; Loans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <JsonListEditor
            label="Cards"
            description="Credit, debit, prepaid, and other card types offered."
            values={form.cards}
            onChange={(v) => setField("cards", v)}
            placeholder="e.g. Visa Credit Card"
          />
          <JsonListEditor
            label="Loans"
            description="Home, auto, education, business, and other loan types."
            values={form.loans}
            onChange={(v) => setField("loans", v)}
            placeholder="e.g. Home Loan"
          />
        </CardContent>
      </Card>

      {/* Status */}
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
              <p className="text-xs text-muted-foreground">Show on homepage &amp; top of lists</p>
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
              <Save className="h-4 w-4" /> {mode === "create" ? "Create Bank" : "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
