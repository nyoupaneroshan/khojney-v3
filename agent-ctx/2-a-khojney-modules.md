# Task 2-a — Khojney public module pages (Agent record)

**Task ID:** 2-a
**Agent:** Subagent (Z.ai Code)
**Scope:** Build public-facing list + detail pages for 5 modules: Colleges, Schools, Universities, Scholarships, Blog.

## What was built

### Shared khojney components (`src/components/khojney/`)
| File | Purpose |
|---|---|
| `breadcrumb-nav.tsx` | Reusable breadcrumb with array-of-items API |
| `star-rating.tsx` | Star rating display (supports fractional rating via overlap) |
| `pagination-control.tsx` | URL-aware pagination (preserves filter params) |
| `empty-state.tsx` | Empty state with optional icon + CTA |
| `filters-shell.tsx` | Desktop sidebar + mobile Sheet wrapper for filters |
| `filter-select.tsx` | Auto-submitting `<Select>` that updates URL param |
| `filter-text-input.tsx` | Debounced text input filter |
| `search-bar.tsx` | Debounced search input (preserves other params) |
| `filter-url.ts` | Helpers: `asString`, `asInt`, `buildFilterUrl`, `getPageRange` |
| `format.ts` | `parseJsonArray`, `formatDate`, `daysUntil`, `formatNumber`, `slugify` |
| `list-page-header.tsx` | Standard list page header (breadcrumb + title + count badge) |
| `info-card.tsx` | Sidebar info card with `InfoRow` (label + value) |
| `entity-badge.tsx` | Badge that auto-hides on null |
| `avatar-initial.tsx` | Colored square with first letter (logo placeholder) |
| `markdown-content.tsx` | `react-markdown` wrapper with explicit Tailwind styles + heading IDs |
| `toc.ts` | Extract H2 headings for blog TOC |
| `review-form.tsx` | Client form POSTing to `/api/reviews` (uses sonner toast) |
| `json-ld.tsx` | Renders JSON-LD `<script>` |

### Module pages built
| Module | List | Detail |
|---|---|---|
| Colleges | `src/app/colleges/page.tsx` | `src/app/colleges/[slug]/page.tsx` |
| Schools | `src/app/schools/page.tsx` | `src/app/schools/[slug]/page.tsx` |
| Universities | `src/app/universities/page.tsx` | `src/app/universities/[slug]/page.tsx` |
| Scholarships | `src/app/scholarships/page.tsx` | `src/app/scholarships/[slug]/page.tsx` |
| Blog | `src/app/blog/page.tsx` | `src/app/blog/[slug]/page.tsx` |

## Feature checklist
- ✅ Every list page has working filters (province/district/affiliation/type/category/rating for colleges; level for schools; type/city for universities; level/field/country/open for scholarships; category/tag chips for blog)
- ✅ Every list page has search + sort + pagination (`?page=N&pageSize=12`)
- ✅ Every list page has empty state with "Clear filters" CTA
- ✅ Every list page has `export const revalidate = 3600` for ISR
- ✅ Every detail page uses `<AppShell user={user}>` and `notFound()` when missing
- ✅ Every detail page has breadcrumb + complete info + JSON-LD schema
- ✅ Detail pages: colleges/schools/universities render programs/facilities/notices/results parsed from JSON columns
- ✅ Review section on colleges/schools/universities with form (login CTA when logged out)
- ✅ Blog detail uses `react-markdown` with explicit Tailwind styling (no dependency on `prose` plugin)
- ✅ Blog detail has TOC (from H2s), related posts, tags, fire-and-forget view increment
- ✅ Scholarships detail has related scholarships + apply button + JSON-LD Article
- ✅ All pages pass `bun run lint` with 0 errors (4 pre-existing warnings in files I don't own)

## Implementation notes for downstream agents
- **Filter pattern:** Filters use URL `searchParams`. Client components (`FilterSelect`, `FilterTextInput`, `SearchBar`) call `router.push()` to update the URL. The server page reads `searchParams` and queries Prisma accordingly. All filter changes reset `page` to 1.
- **Filter helpers live in `src/components/khojney/filter-url.ts`**: `asString`, `asInt`, `buildFilterUrl`, `getPageRange`. Other modules can re-use these.
- **`FiltersShell`** renders a sticky desktop `<aside>` and a left-docked mobile `<Sheet>`. Pass `<FilterSelect>` / `<FilterTextInput>` children.
- **`PaginationControl`** takes `currentPage`, `totalPages`, `basePath`, `searchParams`. It preserves all current filter params. Uses the shadcn `Pagination` primitives (which render `<a>` tags) with `href` props — no `asChild` because the shadcn Pagination primitives don't support `asChild`.
- **`ReviewForm`** POSTs to `/api/reviews` with `{ entity, entityId, rating, title?, comment? }`. **The API must accept this shape and return `{ ok: true }` on success.** If user is not logged in, the form renders a login CTA instead.
- **Reviews are NOT a Prisma relation** — the `Review` model stores `entity` (string: COLLEGE | SCHOOL | UNIVERSITY | SCHOLARSHIP) + `entityId` (string) polymorphically. Detail pages fetch reviews with a separate `db.review.findMany({ where: { entity, entityId } })` call. The /api/reviews API must insert rows into `Review` with these fields, AND increment the `rating`/`reviewCount` denormalized fields on the parent entity (e.g. recompute College.rating as the average of all reviews for entity='COLLEGE' entityId=college.id, and set College.reviewCount to the count). Otherwise the rating shown on cards / detail pages won't update.
- **JSON parsing:** All JSON columns (`programs`, `facilities`, `notices`, `results`, `eligibility`, `gallery`, `faculties`) are parsed via `parseJsonArray<T>(raw)` — safe against null/malformed JSON.
- **Markdown rendering:** `MarkdownContent` adds slugified `id` attributes to all headings (H1–H4) so the TOC and in-page anchor links work. It does NOT use `@tailwindcss/typography` (not installed).
- **Blog view tracking:** `db.blogPost.update({ where: { id }, data: { views: { increment: 1 } } })` is called fire-and-forget (no await) on every blog detail render. The display uses `views + 1` to show the count including the current view.

## Known issue blocking visual QA (NOT in my scope)

**The site is currently broken at the CSS level** due to `src/app/globals.css` (owned by main agent) using `@apply prose prose-sm sm:prose-base max-w-none prose-headings:font-display prose-a:text-primary prose-img:rounded-lg` in the `.prose-content` utility class. Tailwind v4 does not include the `prose` utilities by default, and `@tailwindcss/typography` is not installed.

Per my task constraints I did NOT modify `globals.css` (it's outside `src/app/{colleges,schools,universities,scholarships,blog}/`).

**Fix for main agent:** Either (a) `bun add @tailwindcss/typography` and register it in `tailwind.config.ts` `plugins: [typography]`, OR (b) remove the unused `.prose-content` block from `src/app/globals.css` (it's not referenced anywhere in the codebase — verified with `rg prose-content`).

My pages don't depend on `.prose-content` (I built `MarkdownContent` with explicit Tailwind classes), so removing it has zero impact on my work.

## Files I did NOT touch
- `prisma/schema.prisma` — schema is final.
- `src/lib/*` — owned by main agent.
- `src/app/globals.css`, `src/app/layout.tsx` — outside my scope (foundation).
- Other agents' page dirs (`exams/`, `dashboard/`, `admin/`, etc.).
