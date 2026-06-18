"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  basePath: string;
  param: string;
  label?: string;
  placeholder?: string;
  options: FilterOption[];
  /** Include an "All" option as the first item with empty value. */
  includeAll?: string;
  resetPage?: boolean;
  className?: string;
}

/**
 * Auto-submitting Select that updates a single URL param.
 * All other params (filters, sort, search) are preserved.
 */
export function FilterSelect({
  basePath,
  param,
  label,
  placeholder = "Select...",
  options,
  includeAll,
  resetPage = true,
  className,
}: FilterSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get(param) ?? "";

  const handleChange = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "__all__" || next === "") {
      params.delete(param);
    } else {
      params.set(param, next);
    }
    if (resetPage) params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
      )}
      <Select value={current || "__all__"} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {includeAll && (
            <SelectItem value="__all__">{includeAll}</SelectItem>
          )}
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
