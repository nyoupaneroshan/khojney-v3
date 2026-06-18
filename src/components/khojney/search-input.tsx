"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  initialQuery: string;
}

export function SearchInput({ initialQuery }: SearchInputProps) {
  const router = useRouter();
  const sp = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(sp.toString());
    const q = query.trim();
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="relative max-w-2xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search exams, colleges, schools, scholarships..."
        aria-label="Search query"
        className="w-full rounded-lg border border-border bg-background pl-10 pr-24 py-3 text-base shadow-sm outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-20 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <Button
        type="submit"
        size="sm"
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        Search
      </Button>
    </form>
  );
}
