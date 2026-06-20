"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FileText,
  GraduationCap,
  School,
  University,
  Award,
  Newspaper,
  Landmark,
  Briefcase,
  Building,
  CornerDownLeft,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SearchResult {
  type: string;
  id: string;
  slug: string;
  title: string;
  description?: string;
  url: string;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  EXAM: FileText,
  COLLEGE: GraduationCap,
  SCHOOL: School,
  UNIVERSITY: University,
  SCHOLARSHIP: Award,
  BLOG: Newspaper,
  BANK: Landmark,
  JOB: Briefcase,
  GOVERNMENT_SERVICE: Building,
};

const TYPE_LABELS: Record<string, string> = {
  EXAM: "Exam",
  COLLEGE: "College",
  SCHOOL: "School",
  UNIVERSITY: "University",
  SCHOLARSHIP: "Scholarship",
  BLOG: "Article",
  BANK: "Bank",
  JOB: "Job",
  GOVERNMENT_SERVICE: "Govt Service",
};

const QUICK_LINKS = [
  { label: "All Mock Exams", url: "/exams", type: "EXAM" },
  { label: "Colleges", url: "/colleges", type: "COLLEGE" },
  { label: "Schools", url: "/schools", type: "SCHOOL" },
  { label: "Universities", url: "/universities", type: "UNIVERSITY" },
  { label: "Scholarships", url: "/scholarships", type: "SCHOLARSHIP" },
  { label: "Banks of Nepal", url: "/banks", type: "BANK" },
  { label: "Jobs in Nepal", url: "/jobs", type: "JOB" },
  { label: "Government Services", url: "/government", type: "GOVERNMENT_SERVICE" },
  { label: "Latest Articles", url: "/blog", type: "BLOG" },
];

export function GlobalSearchLauncher() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setActiveIdx(0);
    }
  }, [open]);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim() || q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&pageSize=8`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results ?? []);
        setActiveIdx(0);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => doSearch(query), 250);
    return () => clearTimeout(t);
  }, [query, doSearch]);

  const navigateTo = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIdx]) {
      e.preventDefault();
      navigateTo(results[activeIdx].url);
    }
  };

  const showResults = query.trim().length >= 2;
  const hasResults = results.length > 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent transition-colors"
        aria-label="Open search (Cmd+K)"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search...</span>
        <kbd className="ml-2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-accent"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl top-[20%] translate-y-0 p-0 gap-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Search Khojney</DialogTitle>
            <DialogDescription>
              Search across exams, colleges, schools, universities, scholarships, banks, jobs, and government services.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center border-b border-border px-4">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search exams, colleges, banks, jobs, services..."
              className="border-0 focus-visible:ring-0 h-12 text-base"
              aria-label="Search query"
            />
            <kbd className="ml-2 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
              ESC
            </kbd>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {!showResults && (
              <div className="p-4">
                <div className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Quick Links
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {QUICK_LINKS.map((link) => {
                    const Icon = TYPE_ICONS[link.type] ?? FileText;
                    return (
                      <button
                        key={link.url}
                        type="button"
                        onClick={() => navigateTo(link.url)}
                        className="flex items-center gap-3 rounded-md p-2 hover:bg-accent text-left transition-colors"
                      >
                        <Icon className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm flex-1 truncate">{link.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {showResults && loading && (
              <div className="p-8 text-center text-sm text-muted-foreground">Searching...</div>
            )}

            {showResults && !loading && !hasResults && (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
                <button
                  type="button"
                  onClick={() => navigateTo(`/search?q=${encodeURIComponent(query)}`)}
                  className="mt-3 text-sm text-primary hover:underline"
                >
                  See all results on search page →
                </button>
              </div>
            )}

            {showResults && !loading && hasResults && (
              <div className="p-2">
                {results.map((r, i) => {
                  const Icon = TYPE_ICONS[r.type] ?? FileText;
                  return (
                    <button
                      key={`${r.type}-${r.id}`}
                      type="button"
                      onClick={() => navigateTo(r.url)}
                      onMouseEnter={() => setActiveIdx(i)}
                      className={cn(
                        "w-full flex items-start gap-3 rounded-md p-3 text-left transition-colors",
                        activeIdx === i ? "bg-accent" : "hover:bg-accent/50",
                      )}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{r.title}</span>
                          <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                            {TYPE_LABELS[r.type] ?? r.type}
                          </Badge>
                        </div>
                        {r.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{r.description}</p>
                        )}
                      </div>
                      {activeIdx === i && (
                        <CornerDownLeft className="h-3 w-3 text-muted-foreground shrink-0 mt-2" />
                      )}
                    </button>
                  );
                })}
                <div className="border-t border-border mt-2 pt-2 px-3 py-2 text-xs text-muted-foreground">
                  Press <kbd className="font-mono">Enter</kbd> to open ·
                  <button
                    type="button"
                    onClick={() => navigateTo(`/search?q=${encodeURIComponent(query)}`)}
                    className="ml-2 text-primary hover:underline"
                  >
                    View all results →
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
