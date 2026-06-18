import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { slugify } from "./format";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/** Extract a plain-text string from a React node (for heading id generation). */
function nodeToText(node: React.ReactNode): string {
  if (node === null || node === undefined) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (typeof node === "object" && "props" in node) {
    return nodeToText((node as { props?: { children?: React.ReactNode } }).props?.children);
  }
  return "";
}

/**
 * Renders markdown content with Tailwind-styled elements.
 * Avoids dependency on `@tailwindcss/typography` (which isn't installed
 * in this project) by passing explicit Tailwind classes per element.
 * Adds slugified `id` attributes to H2/H3 headings for in-page navigation.
 */
export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        "text-[15px] leading-7 text-foreground/90 space-y-5",
        className,
      )}
    >
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1
              id={slugify(nodeToText(children))}
              className="mt-8 mb-3 text-3xl font-bold tracking-tight text-foreground scroll-mt-20"
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              id={slugify(nodeToText(children))}
              className="mt-7 mb-3 text-2xl font-bold tracking-tight text-foreground scroll-mt-20"
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              id={slugify(nodeToText(children))}
              className="mt-6 mb-2 text-xl font-semibold text-foreground scroll-mt-20"
            >
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4
              id={slugify(nodeToText(children))}
              className="mt-5 mb-2 text-lg font-semibold text-foreground scroll-mt-20"
            >
              {children}
            </h4>
          ),
          p: ({ children }) => <p className="leading-7">{children}</p>,
          a: ({ href, children }) => {
            if (!href) return <>{children}</>;
            const isExternal = href.startsWith("http");
            if (isExternal) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  {children}
                </a>
              );
            }
            return (
              <Link
                href={href}
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                {children}
              </Link>
            );
          },
          ul: ({ children }) => (
            <ul className="ml-5 list-disc space-y-1.5 marker:text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="ml-5 list-decimal space-y-1.5 marker:text-muted-foreground marker:font-semibold">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1 leading-7">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/40 bg-muted/40 px-4 py-2 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            // Inline vs block: react-markdown passes `inline` prop in older versions,
            // but in v10 we detect block via className (language-xxx) or by checking if
            // the parent is a `pre`. We'll just render as inline here for simplicity;
            // block code is handled by the `pre` override below.
            const isBlock = className?.startsWith("language-");
            if (isBlock) {
              return (
                <code
                  className="block rounded-md bg-slate-900 p-4 text-sm text-slate-100 overflow-x-auto"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className="rounded bg-muted px-1.5 py-0.5 text-[0.85em] font-mono text-primary">
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
          hr: () => <hr className="my-6 border-border" />,
          img: ({ src, alt }) =>
            src ? (
              <img
                src={typeof src === "string" ? src : undefined}
                alt={alt ?? ""}
                className="rounded-lg border bg-muted w-full"
              />
            ) : null,
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
          th: ({ children }) => (
            <th className="border-b px-3 py-2 text-left font-semibold">{children}</th>
          ),
          td: ({ children }) => <td className="border-b px-3 py-2">{children}</td>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
