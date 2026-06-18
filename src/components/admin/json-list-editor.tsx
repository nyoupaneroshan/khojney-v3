"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JsonListEditorProps {
  label: string;
  description?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

/** Tag-style editor for a string array (e.g. facilities, eligibility, faculties). */
export function JsonListEditor({
  label,
  description,
  values,
  onChange,
  placeholder = "Type a value and press Enter",
}: JsonListEditorProps) {
  function add(value: string) {
    const v = value.trim();
    if (!v) return;
    if (values.includes(v)) return;
    onChange([...values, v]);
  }
  function remove(idx: number) {
    onChange(values.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-2">
      <div>
        <Label>{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-2 min-h-9 p-2 rounded-md border border-input bg-background">
        {values.length === 0 && (
          <span className="text-xs text-muted-foreground self-center px-1">
            No items yet — add one below.
          </span>
        )}
        {values.map((v, idx) => (
          <span
            key={`${v}-${idx}`}
            className="inline-flex items-center gap-1 rounded-md bg-secondary text-secondary-foreground px-2 py-1 text-xs font-medium"
          >
            {v}
            <button
              type="button"
              onClick={() => remove(idx)}
              className="ml-1 rounded-sm hover:bg-secondary-foreground/20"
              aria-label={`Remove ${v}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <AddItemInput onAdd={add} placeholder={placeholder} />
    </div>
  );
}

function AddItemInput({
  onAdd,
  placeholder,
}: {
  onAdd: (value: string) => void;
  placeholder: string;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem("item") as HTMLInputElement;
        onAdd(input.value);
        input.value = "";
      }}
      className="flex gap-2"
    >
      <Input name="item" placeholder={placeholder} className="flex-1" />
      <Button type="submit" variant="secondary" size="sm">
        <Plus className="h-4 w-4" /> Add
      </Button>
    </form>
  );
}
