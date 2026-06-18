"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, TrendingUp, Sparkles, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrendingSearch {
  id: string;
  query: string;
  module?: string | null;
}

export function HomeHero({ trending }: { trending: TrendingSearch[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-white via-red-50/40 to-blue-50/30">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" aria-hidden />
      <div className="container-app py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Nepal's largest information & education ecosystem</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Everything About Nepal,
            <br />
            <span className="text-gradient-red">In One Place</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Prepare for exams, discover colleges, compare banks, explore careers, find resources,
            and access knowledge from across Nepal.
          </p>

          <form onSubmit={onSubmit} className="mt-8 mx-auto max-w-2xl">
            <div className="relative flex items-center gap-2 rounded-xl border border-border bg-white shadow-lg shadow-red-100/40 p-2 focus-within:ring-2 focus-within:ring-ring focus-within:border-primary transition-all">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="flex-1 bg-transparent px-12 py-2 text-base outline-none placeholder:text-muted-foreground/70"
                aria-label="Search Khojney"
              />
              <Button type="submit" size="lg" className="rounded-lg">
                Search
              </Button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> Trending:
            </span>
            {trending.slice(0, 6).map((t) => (
              <button
                key={t.id}
                onClick={() => router.push(`/search?q=${encodeURIComponent(t.query)}`)}
                className="rounded-full border border-border bg-white px-3 py-1 text-xs text-foreground hover:bg-accent hover:border-primary/30 transition-colors"
              >
                {t.query}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
