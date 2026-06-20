"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Check, X, Star, MapPin, Award, GraduationCap, School as SchoolIcon, ArrowRight, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CompareItem {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  district: string | null;
  province: string | null;
  affiliation: string | null;
  type: string;
  establishedYear: number | null;
  feesRange: string | null;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  programs: string | null;
  facilities: string | null;
  scholarshipsAvailable?: boolean | null;
  level?: string | null;
  kind: "COLLEGE" | "SCHOOL";
}

interface CompareToolProps {
  colleges: Omit<CompareItem, "kind">[];
  schools: Omit<CompareItem, "kind">[];
}

function parseJsonArray(s: string | null): string[] {
  if (!s) return [];
  try {
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function parsePrograms(s: string | null): { name?: string; level?: string; duration?: string; fees?: string }[] {
  if (!s) return [];
  try {
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CompareTool({ colleges, schools }: CompareToolProps) {
  const [kind, setKind] = useState<"COLLEGE" | "SCHOOL">("COLLEGE");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pickerId, setPickerId] = useState<string>("");

  const allItems: CompareItem[] = useMemo(() => {
    const data = kind === "COLLEGE" ? colleges : schools;
    return data.map((d) => ({ ...d, kind }));
  }, [kind, colleges, schools]);

  const selected = useMemo(
    () => selectedIds.map((id) => allItems.find((i) => i.id === id)).filter(Boolean) as CompareItem[],
    [selectedIds, allItems],
  );

  const switchKind = (newKind: "COLLEGE" | "SCHOOL") => {
    setKind(newKind);
    setSelectedIds([]);
    setPickerId("");
  };

  const addItem = (id: string) => {
    if (!id || selectedIds.includes(id) || selectedIds.length >= 3) return;
    setSelectedIds([...selectedIds, id]);
    setPickerId("");
  };

  const removeItem = (id: string) => setSelectedIds(selectedIds.filter((x) => x !== id));
  const clearAll = () => setSelectedIds([]);
  const available = allItems.filter((i) => !selectedIds.includes(i.id));

  const rows: { label: string; render: (item: CompareItem) => React.ReactNode }[] = [
    {
      label: "Location",
      render: (i) => (
        <span className="flex items-center gap-1.5 text-sm">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          {[i.city, i.district].filter(Boolean).join(", ") || "—"}
        </span>
      ),
    },
    { label: "Type", render: (i) => <Badge variant="outline">{i.type}</Badge> },
    { label: "Affiliation", render: (i) => <span className="text-sm">{i.affiliation ?? "—"}</span> },
    { label: "Established", render: (i) => <span className="text-sm tabular-nums">{i.establishedYear ?? "—"}</span> },
    {
      label: "Rating",
      render: (i) => (
        <span className="flex items-center gap-1 text-sm">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-medium">{i.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">({i.reviewCount})</span>
        </span>
      ),
    },
    { label: "Fees", render: (i) => <span className="text-sm font-medium text-emerald-700">{i.feesRange ?? "Contact for fees"}</span> },
    {
      label: "Verified",
      render: (i) => i.isVerified ? (
        <Badge variant="secondary" className="gap-1"><Check className="h-3 w-3" /> Verified</Badge>
      ) : (
        <span className="text-xs text-muted-foreground">Unverified</span>
      ),
    },
    {
      label: "Scholarships",
      render: (i) => i.scholarshipsAvailable ? (
        <Badge variant="outline" className="gap-1 text-emerald-700 border-emerald-200"><Award className="h-3 w-3" /> Available</Badge>
      ) : (
        <span className="text-xs text-muted-foreground">Not offered</span>
      ),
    },
    {
      label: "Programs",
      render: (i) => {
        const progs = parsePrograms(i.programs);
        if (!progs.length) return <span className="text-sm text-muted-foreground">—</span>;
        return (
          <ul className="text-xs space-y-1">
            {progs.slice(0, 5).map((p, idx) => (
              <li key={idx} className="flex flex-col">
                <span className="font-medium">{p.name}</span>
                {(p.level || p.duration) && (
                  <span className="text-muted-foreground">{[p.level, p.duration].filter(Boolean).join(" · ")}</span>
                )}
              </li>
            ))}
            {progs.length > 5 && <li className="text-muted-foreground">+{progs.length - 5} more</li>}
          </ul>
        );
      },
    },
    {
      label: "Facilities",
      render: (i) => {
        const facs = parseJsonArray(i.facilities);
        if (!facs.length) return <span className="text-sm text-muted-foreground">—</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {facs.slice(0, 6).map((f, idx) => (
              <Badge key={idx} variant="outline" className="text-[10px]">{f}</Badge>
            ))}
            {facs.length > 6 && <span className="text-xs text-muted-foreground">+{facs.length - 6}</span>}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Select institutions to compare</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Choose up to 3 {kind === "COLLEGE" ? "colleges" : "schools"}.</p>
            </div>
            <Tabs value={kind} onValueChange={(v) => switchKind(v as "COLLEGE" | "SCHOOL")}>
              <TabsList>
                <TabsTrigger value="COLLEGE" className="gap-1.5"><GraduationCap className="h-3.5 w-3.5" /> Colleges</TabsTrigger>
                <TabsTrigger value="SCHOOL" className="gap-1.5"><SchoolIcon className="h-3.5 w-3.5" /> Schools</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={pickerId} onValueChange={addItem} disabled={selectedIds.length >= 3 || available.length === 0}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={selectedIds.length >= 3 ? "Max 3 selected — remove one to add more" : `Select a ${kind === "COLLEGE" ? "college" : "school"} to add...`} />
              </SelectTrigger>
              <SelectContent>
                {available.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} {item.city ? `· ${item.city}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedIds.length > 0 && (
              <Button variant="outline" onClick={clearAll}>
                <Trash2 className="h-4 w-4 mr-2" /> Clear all
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {selected.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium">No institutions selected</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Use the dropdown above to add {kind === "COLLEGE" ? "colleges" : "schools"} and see them compared side by side.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 min-w-[140px] text-sm font-medium text-muted-foreground">Attribute</th>
                  {selected.map((item) => (
                    <th key={item.id} className="text-left p-4 min-w-[240px] align-top">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              {item.kind === "COLLEGE" ? <GraduationCap className="h-4 w-4" /> : <SchoolIcon className="h-4 w-4" />}
                            </div>
                            <div>
                              <Link href={`/${item.kind === "COLLEGE" ? "colleges" : "schools"}/${item.slug}`} className="font-semibold hover:text-primary line-clamp-2">
                                {item.name}
                              </Link>
                              {item.isVerified && (
                                <Badge variant="secondary" className="mt-1 gap-0.5 text-[10px]">
                                  <Check className="h-2.5 w-2.5" /> Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive shrink-0" aria-label={`Remove ${item.name}`}>
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <Button asChild size="sm" variant="outline" className="w-full">
                          <Link href={`/${item.kind === "COLLEGE" ? "colleges" : "schools"}/${item.slug}`}>
                            View Details <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0">
                    <td className="p-4 text-sm font-medium text-muted-foreground align-top">{row.label}</td>
                    {selected.map((item) => (
                      <td key={item.id} className="p-4 align-top">{row.render(item)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
