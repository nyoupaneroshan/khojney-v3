"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface NoticeItem {
  title: string;
  date: string;
  link: string;
}

interface NoticesEditorProps {
  label: string;
  description?: string;
  items: NoticeItem[];
  onChange: (items: NoticeItem[]) => void;
}

/** Editor for an array of notice/result objects: { title, date, link }. */
export function NoticesEditor({ label, description, items, onChange }: NoticesEditorProps) {
  function update(idx: number, patch: Partial<NoticeItem>) {
    onChange(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }
  function add() {
    onChange([...items, { title: "", date: "", link: "" }]);
  }
  function remove(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
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
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground px-3 py-6 text-center rounded-md border border-dashed">
          No items yet.
        </p>
      )}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-md border border-border p-3 bg-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Item {idx + 1}
              </span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => remove(idx)}
                aria-label="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="space-y-1 sm:col-span-1">
                <Label className="text-xs">Title</Label>
                <Input
                  value={item.title}
                  onChange={(e) => update(idx, { title: e.target.value })}
                  placeholder="Notice title"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Date</Label>
                <Input
                  type="date"
                  value={item.date}
                  onChange={(e) => update(idx, { date: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Link</Label>
                <Input
                  value={item.link}
                  onChange={(e) => update(idx, { link: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
