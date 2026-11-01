import React from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { gfmTable } from "micromark-extension-gfm-table";
import { gfmTableFromMarkdown } from "mdast-util-gfm-table";
import { Info, Lightbulb, AlertTriangle, ArrowRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { slugify } from "./format";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

interface UnifiedProcessor {
  data: () => Record<string, unknown[]>;
}

/**
 * Remark plugin that registers GFM table syntax parsing into micromark & mdast.
 * Ensures pipe-delimited tables (| Col | Col |) parse into <table>, <thead>, <tbody>, etc.
 */
function remarkGfmTablePlugin(this: UnifiedProcessor | void) {
  if (!this || typeof this.data !== "function") return;
  const data = this.data();
  function add(field: string, value: unknown) {
    const list = data[field] ? data[field] : (data[field] = []);
    list.push(value);
  }
  add("micromarkExtensions", gfmTable());
  add("fromMarkdownExtensions", gfmTableFromMarkdown());
}

/** Extract plain text from React nodes (for heading slug generation and callout detection). */
function nodeToText(node: React.ReactNode): string {
  if (node === null || node === undefined) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (typeof node === "object" && "props" in node) {
    return nodeToText((node as { props?: { children?: React.ReactNode } }).props?.children);
  }
  return "";
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        "prose-editorial text-[16.5px] leading-[1.8] text-foreground/90 space-y-6 max-w-prose",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfmTablePlugin as any]}
        components={{
          h1: ({ children }) => {
            const id = slugify(nodeToText(children));
            return (
              <h1
                id={id}
                className="mt-10 mb-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground scroll-mt-24 border-b border-border/60 pb-3"
              >
                {children}
              </h1>
            );
          },
          h2: ({ children }) => {
            const id = slugify(nodeToText(children));
            return (
              <h2
                id={id}
                className="group mt-10 mb-4 flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground scroll-mt-24 border-b border-border/40 pb-2.5"
              >
                <span>{children}</span>
                <a
                  href={`#${id}`}
                  aria-label={`Link to ${nodeToText(children)}`}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity text-base font-normal select-none"
                >
                  #
                </a>
              </h2>
            );
          },
          h3: ({ children }) => {
            const id = slugify(nodeToText(children));
            return (
              <h3
                id={id}
                className="group mt-8 mb-3 flex items-center gap-2 text-xl font-bold tracking-tight text-foreground scroll-mt-24"
              >
                <span>{children}</span>
                <a
                  href={`#${id}`}
                  aria-label={`Link to ${nodeToText(children)}`}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity text-sm font-normal select-none"
                >
                  #
                </a>
              </h3>
            );
          },
          h4: ({ children }) => (
            <h4 className="mt-6 mb-2 text-lg font-semibold text-foreground scroll-mt-24">
              {children}
            </h4>
          ),
          p: ({ children }) => <p className="leading-relaxed mb-5">{children}</p>,
          a: ({ href, children }) => {
            if (!href) return <>{children}</>;
            const isExternal = href.startsWith("http");
            if (isExternal) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
                >
                  {children}
                </a>
              );
            }
            return (
              <Link
                href={href}
                className="font-medium text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
              >
                {children}
              </Link>
            );
          },
          ul: ({ children }) => (
            <ul className="my-5 ml-6 list-disc space-y-2 marker:text-primary/70">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-5 ml-6 list-decimal space-y-2 marker:text-foreground/80 marker:font-semibold">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1.5 leading-relaxed">{children}</li>,

          // Editorial Callout Blocks: Transforms generic blockquotes into structured callouts
          blockquote: ({ children }) => {
            const raw = nodeToText(children).trim();
            const lower = raw.toLowerCase();

            const isTip = raw.startsWith("[!TIP]") || lower.startsWith("tip:") || lower.startsWith("pro tip:");
            const isWarning = raw.startsWith("[!WARNING]") || raw.startsWith("[!CAUTION]") || lower.startsWith("warning:") || lower.startsWith("important:");
            const isNote = raw.startsWith("[!NOTE]") || raw.startsWith("[!INFO]") || lower.startsWith("note:") || lower.startsWith("key note:");

            if (isTip) {
              return (
                <aside className="my-6 flex gap-3.5 rounded-xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 text-emerald-950 dark:text-emerald-100 shadow-xs">
                  <Lightbulb className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" aria-hidden="true" />
                  <div className="flex-1 text-sm leading-relaxed not-italic space-y-1.5">
                    <span className="font-bold text-xs uppercase tracking-wider block text-emerald-700 dark:text-emerald-300">
                      Editorial Tip
                    </span>
                    <div>{children}</div>
                  </div>
                </aside>
              );
            }

            if (isWarning) {
              return (
                <aside className="my-6 flex gap-3.5 rounded-xl border border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20 p-4 text-amber-950 dark:text-amber-100 shadow-xs">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" aria-hidden="true" />
                  <div className="flex-1 text-sm leading-relaxed not-italic space-y-1.5">
                    <span className="font-bold text-xs uppercase tracking-wider block text-amber-700 dark:text-amber-300">
                      Important Notice
                    </span>
                    <div>{children}</div>
                  </div>
                </aside>
              );
            }

            if (isNote) {
              return (
                <aside className="my-6 flex gap-3.5 rounded-xl border border-blue-500/30 bg-blue-50/40 dark:bg-blue-950/20 p-4 text-blue-950 dark:text-blue-100 shadow-xs">
                  <Info className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" aria-hidden="true" />
                  <div className="flex-1 text-sm leading-relaxed not-italic space-y-1.5">
                    <span className="font-bold text-xs uppercase tracking-wider block text-blue-700 dark:text-blue-300">
                      Note
                    </span>
                    <div>{children}</div>
                  </div>
                </aside>
              );
            }

            // Journalistic Pull Quote
            return (
              <blockquote className="my-8 relative rounded-r-xl border-l-4 border-primary bg-muted/30 py-4 px-6 italic text-foreground shadow-xs">
                <Quote className="h-5 w-5 text-primary/40 mb-2 rotate-180" aria-hidden="true" />
                <div className="text-base sm:text-lg leading-relaxed font-serif">{children}</div>
              </blockquote>
            );
          },

          code: ({ className, children, ...props }) => {
            const isBlock = className?.startsWith("language-");
            if (isBlock) {
              return (
                <div className="my-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-md">
                  <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-2 text-xs text-slate-400">
                    <span className="font-mono text-[11px]">{className?.replace("language-", "") || "Code"}</span>
                  </div>
                  <pre className="overflow-x-auto p-4 text-sm text-slate-100 font-mono leading-relaxed">
                    <code {...props}>{children}</code>
                  </pre>
                </div>
              );
            }
            return (
              <code className="rounded-md bg-muted px-1.5 py-0.5 text-[0.88em] font-mono text-foreground font-medium border border-border/40">
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
          hr: () => <hr className="my-8 border-border/60" />,
          img: ({ src, alt }) =>
            src ? (
              <figure className="my-8 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <img
                  src={typeof src === "string" ? src : undefined}
                  alt={alt ?? ""}
                  className="w-full object-cover max-h-[500px]"
                />
                {alt && (
                  <figcaption className="p-3 text-center text-xs text-muted-foreground border-t border-border/40 bg-muted/20">
                    {alt}
                  </figcaption>
                )}
              </figure>
            ) : null,

          // Professional GFM Tables
          table: ({ children }) => (
            <div className="my-8 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-2 text-[11px] font-medium text-muted-foreground sm:hidden">
                <span>Swipe table horizontally</span>
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  Scroll <ArrowRight className="h-3 w-3" />
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[540px] border-collapse text-left text-sm">{children}</table>
              </div>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-border bg-muted/60 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border/60 bg-card font-sans">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="transition-colors hover:bg-muted/40 even:bg-muted/15">
              {children}
            </tr>
          ),
          th: ({ children, style }) => (
            <th
              style={style}
              className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-foreground whitespace-nowrap"
            >
              {children}
            </th>
          ),
          td: ({ children, style }) => (
            <td
              style={style}
              className="py-3.5 px-4 text-sm text-foreground/90 align-top leading-relaxed tabular-nums"
            >
              {children}
            </td>
          ),
          strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
