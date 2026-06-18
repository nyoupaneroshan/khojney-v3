"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface SearchTabsProps {
  tabs: { key: string; label: string }[];
  activeKey: string;
  query: string;
}

export function SearchTabs({ tabs, activeKey, query }: SearchTabsProps) {
  const router = useRouter();
  const sp = useSearchParams();

  const onChange = (key: string) => {
    const params = new URLSearchParams(sp.toString());
    params.set("q", query);
    if (key === "ALL") {
      params.delete("module");
    } else {
      params.set("module", key);
    }
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div
      role="tablist"
      aria-label="Filter results by module"
      className="flex flex-wrap gap-1 rounded-lg border bg-muted/40 p-1 w-fit max-w-full overflow-x-auto"
    >
      {tabs.map((t) => {
        const isActive = activeKey === t.key;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.key)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
