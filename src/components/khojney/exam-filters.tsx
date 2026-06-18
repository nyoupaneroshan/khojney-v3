"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface CategoryOption {
  id: string;
  slug: string;
  name: string;
  _count: { exams: number };
}

interface ExamFiltersProps {
  categories: CategoryOption[];
  difficulties: readonly string[];
  examTypes: readonly string[];
  className?: string;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

const EXAM_TYPE_LABELS: Record<string, string> = {
  MOCK: "Mock Test",
  PRACTICE: "Practice",
  PREVIOUS_YEAR: "Previous Year",
};

export function ExamFilters({
  categories,
  difficulties,
  examTypes,
  className,
}: ExamFiltersProps) {
  const router = useRouter();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(sp.get("q") ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedCategories = useMemo(
    () => (sp.get("category") ?? "").split(",").filter(Boolean),
    [sp],
  );
  const selectedDifficulty = sp.get("difficulty") ?? "ALL";
  const selectedExamType = sp.get("examType") ?? "ALL";
  const sort = sp.get("sort") ?? "newest";

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(sp.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "ALL") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      params.delete("page"); // reset to page 1 on filter change
      startTransition(() => router.push(`/exams?${params.toString()}`));
    },
    [router, sp, startTransition],
  );

  const toggleCategory = (slug: string) => {
    const next = selectedCategories.includes(slug)
      ? selectedCategories.filter((c) => c !== slug)
      : [...selectedCategories, slug];
    updateParams({ category: next.join(",") });
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchInput.trim() || null });
  };

  const clearAll = () => {
    setSearchInput("");
    startTransition(() => router.push("/exams"));
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedDifficulty !== "ALL" ||
    selectedExamType !== "ALL" ||
    !!sp.get("q");

  const FilterBody = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Categories</h3>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {categories.map((c) => {
            const checked = selectedCategories.includes(c.slug);
            return (
              <div key={c.id} className="flex items-center gap-2">
                <Checkbox
                  id={`cat-${c.slug}`}
                  checked={checked}
                  onCheckedChange={() => toggleCategory(c.slug)}
                />
                <Label
                  htmlFor={`cat-${c.slug}`}
                  className="text-sm font-normal cursor-pointer flex-1 flex items-center justify-between"
                >
                  <span>{c.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {c._count.exams}
                  </span>
                </Label>
              </div>
            );
          })}
          {categories.length === 0 && (
            <p className="text-xs text-muted-foreground">No categories.</p>
          )}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Difficulty</h3>
        <Select
          value={selectedDifficulty}
          onValueChange={(v) => updateParams({ difficulty: v })}
        >
          <SelectTrigger className="w-full" size="sm">
            <SelectValue placeholder="All difficulties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All difficulties</SelectItem>
            {difficulties.map((d) => (
              <SelectItem key={d} value={d}>
                {DIFFICULTY_LABELS[d] ?? d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Exam type */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Exam Type</h3>
        <Select
          value={selectedExamType}
          onValueChange={(v) => updateParams({ examType: v })}
        >
          <SelectTrigger className="w-full" size="sm">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All types</SelectItem>
            {examTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {EXAM_TYPE_LABELS[t] ?? t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="w-full"
        >
          <X className="h-3.5 w-3.5" /> Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search bar */}
      <form onSubmit={onSearchSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search exams..."
          className="pl-9"
          aria-label="Search exams"
        />
      </form>

      {/* Sort */}
      <Select value={sort} onValueChange={(v) => updateParams({ sort: v })}>
        <SelectTrigger className="w-full" size="sm">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest first</SelectItem>
          <SelectItem value="popular">Most attempts</SelectItem>
          <SelectItem value="difficulty">By difficulty</SelectItem>
        </SelectContent>
      </Select>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="rounded-lg border bg-card p-4">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </h2>
          {FilterBody}
        </div>
      </aside>

      {/* Mobile filter drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden w-full">
            <SlidersHorizontal className="h-4 w-4" /> Filters
            {hasActiveFilters && (
              <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                {selectedCategories.length +
                  (selectedDifficulty !== "ALL" ? 1 : 0) +
                  (selectedExamType !== "ALL" ? 1 : 0)}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-4">{FilterBody}</div>
        </SheetContent>
      </Sheet>

      {isPending && (
        <p className="text-xs text-muted-foreground" aria-live="polite">
          Updating...
        </p>
      )}
    </div>
  );
}
