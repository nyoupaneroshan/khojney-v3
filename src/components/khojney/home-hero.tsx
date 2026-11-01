"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, TrendingUp, Play, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TrendingSearch {
  id: string;
  query: string;
  module?: string | null;
}

const SEARCH_TABS = [
  { id: "all", label: "All Directory", placeholder: "Search exams, colleges, scholarships, banks, jobs..." },
  { id: "exams", label: "Mock Exams", placeholder: "Search IOE, CEE, CMAT, Loksewa, Driving License..." },
  { id: "colleges", label: "Colleges", placeholder: "Search engineering, medical, +2 colleges in Nepal..." },
  { id: "scholarships", label: "Scholarships", placeholder: "Search domestic and foreign scholarships..." },
  { id: "government", label: "Govt Services", placeholder: "Search Nagarikta, passport, driving license, PAN..." },
];

const FAST_TRACK_EXAMS = [
  {
    title: "IOE Entrance Exam",
    category: "Engineering",
    slug: "ioe-entrance",
    questions: 140,
    duration: 120,
    marks: 140,
  },
  {
    title: "CEE MBBS Entrance",
    category: "Medical",
    slug: "mbbs-cee",
    questions: 200,
    duration: 180,
    marks: 200,
  },
  {
    title: "CMAT Entrance Mock",
    category: "Management",
    slug: "cmat-full",
    questions: 100,
    duration: 90,
    marks: 100,
  },
  {
    title: "Loksewa Kharidar",
    category: "Civil Service",
    slug: "loksewa-kharidar",
    questions: 50,
    duration: 45,
    marks: 100,
  },
];

export function HomeHero({ trending }: { trending: TrendingSearch[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(SEARCH_TABS[0]);
  const [query, setQuery] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const moduleParam = activeTab.id !== "all" ? `&module=${activeTab.id}` : "";
      router.push(`/search?q=${encodeURIComponent(query.trim())}${moduleParam}`);
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-muted/40 via-background to-background py-12 md:py-20">
      {/* Decorative subtle ambient glows */}
      <div className="absolute top-0 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/3 right-10 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="container-app relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Command Center (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Live Trust Beacon */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-6 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Nepal's Verified Education & Career Engine</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.08]">
              Everything About Nepal,{" "}
              <span className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 bg-clip-text text-transparent">
                In One Place.
              </span>
            </h1>

            {/* Subtext */}
            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Take free 1-click entrance mock exams, explore accredited colleges across all 7 provinces, discover verified scholarships, and navigate citizen government services.
            </p>

            {/* Scope / Filter Tabs */}
            <div className="mt-8 flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/80">
              {SEARCH_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    activeTab.id === tab.id
                      ? "bg-card text-foreground font-semibold shadow-xs border border-border/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* High-Target Search Bar */}
            <form onSubmit={onSubmit} className="mt-3 w-full max-w-xl">
              <div className="relative flex items-center rounded-2xl border border-input bg-card shadow-sm hover:border-border transition-all focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent p-1.5">
                <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={activeTab.placeholder}
                  className="w-full bg-transparent pl-11 pr-24 py-3 text-sm sm:text-base text-foreground outline-none placeholder:text-muted-foreground/70"
                  aria-label="Search Khojney directory"
                />
                <Button type="submit" size="default" className="rounded-xl px-5 font-semibold shrink-0 shadow-xs">
                  Search
                </Button>
              </div>
            </form>

            {/* Trending Quick Chips (Left-anchored) */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-primary" /> Trending:
              </span>
              {trending.slice(0, 5).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => router.push(`/search?q=${encodeURIComponent(t.query)}`)}
                  className="rounded-lg border border-border bg-card/70 px-2.5 py-1 text-xs text-foreground hover:bg-muted hover:border-primary/40 transition-colors shadow-2xs"
                >
                  {t.query}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Live 1-Click Launchpad (5 cols) */}
          <div className="lg:col-span-5 w-full">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-border/80">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Zap className="h-4 w-4 fill-current" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">1-Click Exam Launchpad</h3>
                    <p className="text-[11px] text-muted-foreground">Start timed test immediately • No account needed</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" /> Free
                </span>
              </div>

              {/* Fast-Track Exam List */}
              <div className="mt-4 space-y-3">
                {FAST_TRACK_EXAMS.map((exam) => (
                  <div
                    key={exam.slug}
                    className="group flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3 hover:bg-muted/50 hover:border-primary/40 transition-all"
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          {exam.category}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          • {exam.questions} Q • {exam.duration}m
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {exam.title}
                      </h4>
                    </div>

                    <Link
                      href={`/exams/${exam.slug}/take`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 text-xs font-semibold shadow-xs shrink-0 transition-transform active:scale-95"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      Take Test
                    </Link>
                  </div>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="mt-5 pt-4 border-t border-border/80 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Looking for other faculty tests?</span>
                <Link
                  href="/exams"
                  className="font-semibold text-primary inline-flex items-center gap-1 hover:underline"
                >
                  View All 45+ Exams <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
