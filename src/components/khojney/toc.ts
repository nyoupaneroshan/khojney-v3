/**
 * Generates a list of H2 headings from markdown content, for use as a
 * table of contents. Returns `[{id, text}]` where `id` is a slug.
 */
import { slugify } from "./format";

export interface TocHeading {
  id: string;
  text: string;
}

export function extractTocHeadings(markdown: string): TocHeading[] {
  if (!markdown) return [];
  const headings: TocHeading[] = [];
  const lines = markdown.split("\n");
  let inFenced = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inFenced = !inFenced;
      continue;
    }
    if (inFenced) continue;
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) {
      const text = m[1].replace(/[`*_]/g, "").trim();
      headings.push({ id: slugify(text), text });
    }
  }
  return headings;
}
