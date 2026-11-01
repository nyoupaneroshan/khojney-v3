"use client";

import { useEffect, useState } from "react";
import { Share2, Check, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
}

interface BlogArticleShellProps {
  toc: TocItem[];
  title: string;
  children: React.ReactNode;
}

export function BlogArticleShell({ toc, title, children }: BlogArticleShellProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Track window scroll progress for top progress bar & active TOC heading
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const current = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
            setReadingProgress(current);
          }

          // Determine which heading is currently in viewport
          const headingElements = toc.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
          const scrollPos = window.scrollY + 120; // 120px offset for header

          for (let i = headingElements.length - 1; i >= 0; i--) {
            const el = headingElements[i];
            if (el.offsetTop <= scrollPos) {
              setActiveHeadingId(el.id);
              break;
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [toc]);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Fallback to clipboard if user cancels or share fails
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-border/20 pointer-events-none">
        <div
          className="h-full bg-primary transition-[width] duration-75 ease-out"
          style={{ width: `${readingProgress}%` }}
          aria-hidden="true"
        />
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_260px] items-start">
        {/* Main Content Column */}
        <article className="min-w-0 max-w-full">
          {/* Mobile Collapsible TOC */}
          {toc.length > 0 && (
            <div className="lg:hidden mb-8 rounded-xl border border-border bg-card p-4 shadow-sm">
              <button
                type="button"
                onClick={() => setMobileTocOpen((prev) => !prev)}
                className="flex w-full items-center justify-between text-left font-semibold text-sm text-foreground"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Table of Contents ({toc.length} sections)
                </span>
                {mobileTocOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {mobileTocOpen && (
                <nav className="mt-4 pt-3 border-t border-border space-y-1 max-h-64 overflow-y-auto">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setMobileTocOpen(false)}
                      className={cn(
                        "block rounded-md px-2.5 py-1.5 text-xs transition-colors",
                        activeHeadingId === item.id
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              )}
            </div>
          )}

          {/* Actual Article Body */}
          {children}
        </article>

        {/* Desktop Sticky Sidebar */}
        <aside className="hidden lg:block sticky top-24 self-start space-y-6">
          {/* Interactive TOC */}
          {toc.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-primary" /> On This Page
                </h3>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {Math.round(readingProgress)}%
                </span>
              </div>
              <nav className="mt-3.5 space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 text-sm">
                {toc.map((item) => {
                  const isActive = activeHeadingId === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={cn(
                        "group block rounded-md px-2.5 py-1.5 text-xs leading-relaxed transition-all",
                        isActive
                          ? "bg-primary/10 text-primary font-bold border-l-2 border-primary pl-2"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {item.text}
                    </a>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Quick Share Widget */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Share Article
            </h4>
            <button
              type="button"
              onClick={handleShare}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 hover:bg-muted py-2 px-3 text-xs font-medium text-foreground transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share or Copy Link</span>
                </>
              )}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
