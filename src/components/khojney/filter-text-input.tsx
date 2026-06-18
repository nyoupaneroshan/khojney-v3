"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface FilterTextInputProps {
  basePath: string;
  param: string;
  label?: string;
  placeholder?: string;
  resetPage?: boolean;
  className?: string;
}

/**
 * Debounced text input filter — used for free-form fields like
 * "affiliation", "field", "country".
 */
export function FilterTextInput({
  basePath,
  param,
  label,
  placeholder,
  resetPage = true,
  className,
}: FilterTextInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get(param) ?? "";
  const [value, setValue] = useState(current);

  useEffect(() => {
    setValue(current);
  }, [current]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (value === current) return;
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(param, value);
      else params.delete(param);
      if (resetPage) params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${basePath}?${qs}` : basePath);
    }, 350);
    return () => clearTimeout(t);
  }, [value, current, param, resetPage, router, searchParams, basePath]);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
      )}
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
      />
    </div>
  );
}
