"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/admin-utils";

/** A simple slug field that auto-fills from the title unless the user manually edits it. */
export function SlugField({
  value,
  onChange,
  titleValue,
}: {
  value: string;
  onChange: (v: string) => void;
  titleValue: string;
}) {
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!touched) {
      const newSlug = slugify(titleValue);
      if (newSlug !== value) {
        onChange(newSlug);
      }
    }
  }, [titleValue, touched]);

  return (
    <div className="space-y-2">
      <Label>Slug</Label>
      <Input
        value={value}
        onChange={(e) => {
          setTouched(true);
          onChange(slugify(e.target.value));
        }}
        placeholder="auto-generated-from-title"
      />
      <p className="text-xs text-muted-foreground">
        URL-friendly identifier. Auto-generated from title; edit to override.
      </p>
    </div>
  );
}

/** Markdown editor with split-pane preview. */
export function MarkdownEditor({
  value,
  onChange,
  label = "Content",
  minHeight = 320,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  minHeight?: number;
}) {
  const preview = useMemo(() => value, [value]);
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write markdown here... supports # headings, **bold**, lists, links, images, etc."
            style={{ minHeight }}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Tip: use <code>#</code> for H1, <code>##</code> for H2, <code>**text**</code> for
            bold, <code>[link](url)</code> for links.
          </p>
        </div>
        <div
          className="rounded-md border border-input bg-background p-4 overflow-y-auto prose-sm"
          style={{ minHeight }}
        >
          <div className="markdown-preview">
            <ReactMarkdown
              components={{
                h1: (props) => <h1 className="text-xl font-bold mt-3 mb-2" {...props} />,
                h2: (props) => <h2 className="text-lg font-bold mt-3 mb-2" {...props} />,
                h3: (props) => <h3 className="text-base font-semibold mt-2 mb-1" {...props} />,
                p: (props) => <p className="text-sm mb-2 leading-relaxed" {...props} />,
                ul: (props) => <ul className="list-disc ml-5 mb-2 text-sm" {...props} />,
                ol: (props) => <ol className="list-decimal ml-5 mb-2 text-sm" {...props} />,
                li: (props) => <li className="mb-1" {...props} />,
                a: (props) => (
                  <a
                    className="text-primary underline underline-offset-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
                code: (props) => (
                  <code
                    className="rounded bg-muted px-1 py-0.5 text-xs font-mono"
                    {...props}
                  />
                ),
                pre: (props) => (
                  <pre
                    className="rounded bg-muted p-2 text-xs font-mono overflow-x-auto mb-2"
                    {...props}
                  />
                ),
                blockquote: (props) => (
                  <blockquote
                    className="border-l-4 border-primary pl-3 italic text-muted-foreground mb-2"
                    {...props}
                  />
                ),
              }}
            >
              {preview}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Image URL field with live preview. */
export function ImageUrlField({
  label,
  value,
  onChange,
  placeholder = "https://...",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-3">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        {value && (
          <img
            src={value}
            alt="Preview"
            className="h-9 w-9 rounded-md object-cover border border-border"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
      </div>
    </div>
  );
}
