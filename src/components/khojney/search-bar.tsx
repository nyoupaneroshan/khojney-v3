"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  /** Base path of the list page, e.g. "/colleges". */
  basePath: string;
  /** Query string param name, default "q". */
  param?: string;
  /** Placeholder text. */
  placeholder?: string;
  /** Reset page param on submit (default true). */
  resetPage?: boolean;
  className?: string;
}

/**
 * Debounced search input that pushes a new URL with the search query.
 * Preserves all other current search params (filters, sort).
 */
export function SearchBar({
  basePath,
  param = "q",
  placeholder = "Search...",
  resetPage = true,
  className,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get(param) ?? "";
  const [value, setValue] = useState(current);

  // Keep input in sync when URL changes externally (e.g. clear filters)
  useEffect(() => {
    setValue(current);
  }, [current]);

  const pushQuery = useCallback(
    (next: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next) {
        params.set(param, next);
      } else {
        params.delete(param);
      }
      if (resetPage) params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${basePath}?${qs}` : basePath);
    },
    [router, searchParams, param, resetPage, basePath],
  );

  // Debounce submit on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      if (value !== current) pushQuery(value);
    }, 350);
    return () => clearTimeout(t);
  }, [value, current, pushQuery]);

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-9 pr-9"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
