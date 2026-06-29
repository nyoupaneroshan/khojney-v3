"use client";

import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface ProgramItem {
  name: string;
  level?: string;
  duration?: string;
  fees?: string;
  description?: string;
  // University programs use `faculty` instead of `fees`
  faculty?: string;
}

interface ProgramsEditorProps {
  label: string;
  description?: string;
  items: ProgramItem[];
  onChange: (items: ProgramItem[]) => void;
  /** "college" → fields: name/level/duration/fees/description; "university" → faculty/level/name/duration */
  variant?: "college" | "university";
}

/** Editor for an array of program objects (colleges/universities). */
export function ProgramsEditor({
  label,
  description,
  items,
  onChange,
  variant = "college",
}: ProgramsEditorProps) {
  function update(idx: number, patch: Partial<ProgramItem>) {
    onChange(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }
  function add() {
    onChange([
      ...items,
      { name: "", level: "", duration: "", fees: "", description: "", faculty: "" },
    ]);
  }
  function remove(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }
  function move(idx: number, dir: -1 | 1) {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label>{label}</Label>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={add}>
          <Plus className="h-4 w-4" /> Add program
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground px-3 py-6 text-center rounded-md border border-dashed">
          No programs yet. Click &quot;Add program&quot; to begin.
        </p>
      )}

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="rounded-md border border-border p-4 bg-card space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Program {idx + 1}
              </span>
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  aria-label="Move up"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => move(idx, 1)}
                  disabled={idx === items.length - 1}
                  aria-label="Move down"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => remove(idx)}
                  aria-label="Remove program"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {variant === "university" && (
                <div className="space-y-1">
                  <Label className="text-xs">Faculty</Label>
                  <Input
                    value={item.faculty ?? ""}
                    onChange={(e) => update(idx, { faculty: e.target.value })}
                    placeholder="e.g. Engineering"
                  />
                </div>
              )}
              <div className="space-y-1">
                <Label className="text-xs">Program name</Label>
                <Input
                  value={item.name}
                  onChange={(e) => update(idx, { name: e.target.value })}
                  placeholder="e.g. BSc Computer Science"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Level</Label>
                <Input
                  value={item.level}
                  onChange={(e) => update(idx, { level: e.target.value })}
                  placeholder="e.g. Bachelor"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Duration</Label>
                <Input
                  value={item.duration}
                  onChange={(e) => update(idx, { duration: e.target.value })}
                  placeholder="e.g. 4 years"
                />
              </div>
              {variant === "college" && (
                <div className="space-y-1">
                  <Label className="text-xs">Fees</Label>
                  <Input
                    value={item.fees}
                    onChange={(e) => update(idx, { fees: e.target.value })}
                    placeholder="e.g. NPR 8,00,000"
                  />
                </div>
              )}
            </div>
            {variant === "college" && (
              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => update(idx, { description: e.target.value })}
                  placeholder="Brief description of the program"
                  rows={2}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
