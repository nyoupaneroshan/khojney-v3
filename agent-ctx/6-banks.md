# Task 6-banks — Banks of Nepal module

**Agent**: Z.ai Code (Phase 2 builder)
**Date**: 2026-06-20
**Status**: ✅ Complete — all files created, lint passes, runtime verified

---

## Summary

Built the complete **Banks of Nepal** module for Khojney.com Phase 2: public list + detail pages, admin CRUD, and API routes — all following the established patterns from the colleges module. Also added two shared Khojney UI components (`bookmark-button`, `share-button`) that did not previously exist, and extended the polymorphic reviews system (`ReviewForm` + `/api/reviews`) to support the `BANK` entity so the public detail page's Reviews tab is fully functional.

---

## Files created

### Public pages (Server Components, `revalidate = 3600`)

1. **`src/app/banks/page.tsx`** — Banks list page
   - Title "Banks of Nepal", breadcrumb Home › Banks
   - Filter sidebar (type: COMMERCIAL / DEVELOPMENT / FINANCE / MICROFINANCE), search by name / shortName / description / headquarters, sort by rating / name / established year
   - Responsive card grid (1/2/3 cols) showing name (link), short name, type badge, established year, headquarters, rating stars, branch count, ATM count, savings rate range, mobile/internet banking badges, "View details" button
   - Pagination via `?page=1&pageSize=12`, uses `<AppShell user={user}>` + `getSession()`

2. **`src/app/banks/[slug]/page.tsx`** — Bank detail page
   - Fetches by slug via `db.bank.findUnique`, calls `notFound()` if missing/unpublished
   - Breadcrumb Home › Banks › {name}; hero with logo, name, short name badge, type, established year, headquarters, phone/email/website links, rating stars
   - Tabs: Overview · Interest Rates · Branches & ATMs · Cards & Loans · Reviews
   - Interest rates table (savings + fixed deposit, min/max/range columns)
   - Branches & ATMs stats grid (branchCount, atmCount, mobileBanking, internetBanking)
   - Cards & Loans rendered from parsed JSON arrays
   - Reviews section wired to existing `ReviewForm` (entity `BANK`) — fetches polymorphic reviews
   - `BookmarkButton` + `ShareButton` in hero and sidebar
   - JSON-LD `BankOrCreditUnion` schema (with `aggregateRating` when rating > 0)
   - `generateMetadata` for title/description/OG/Twitter cards

### Admin pages (Server Components, `dynamic = "force-dynamic"`)

3. **`src/app/admin/banks/page.tsx`** — Admin list using `AdminList` (the same component referenced in the task — the file exports `AdminList`, `AdminFormHeader`, `BackToAdminLink`)
   - Columns: Name (with slug), Short Name, Type, Established, Branches, Rating, Featured, Status, Created + Edit/Delete actions
   - Search across name/shortName/slug/headquarters

4. **`src/app/admin/banks/new/page.tsx`** — Renders `<BankForm mode="create" />` inside `AdminFormHeader` + `BackToAdminLink` chrome

5. **`src/app/admin/banks/[id]/page.tsx`** — Fetches bank by id, renders
   `<BankForm mode="edit" initial={parseBankInitial(bank as unknown as Record<string, unknown>)} />`
   (parser imported from `@/lib/admin-parsers` as instructed — not from the client form)

### Admin form component

6. **`src/components/admin/bank-form.tsx`** (`'use client'`)
   - Imports `BankInitial` from `@/lib/admin-parsers`, `SlugField`/`ImageUrlField` from `@/components/admin/form-fields`, `JsonListEditor` from `@/components/admin/json-list-editor`
   - Field cards: Basic Information · Headquarters & Contact · Interest Rates · Network & Digital Banking · Cards & Loans · Status
   - All bank fields covered: name, slug (auto), shortName, description, type, establishedYear, headquarters, website, phone, email, logo, swiftCode, savingsRateMin/Max, fixedDepositRateMin/Max, branchCount, atmCount, mobileBanking, internetBanking, cards (JsonListEditor), loans (JsonListEditor), isFeatured, isPublished
   - POST `/api/admin/banks` (create) or PUT `/api/admin/banks/{id}` (edit), toast on success/error, redirect to `/admin/banks` on success

### API routes

7. **`src/app/api/admin/banks/route.ts`** — `GET` (paginated list, search) + `POST` (create). Imports `requireAdmin` from `@/app/api/admin/_lib/require-admin` (absolute path), `db` from `@/lib/db`, `parsePagination`/`slugify`/`stringifyJson` from `@/lib/admin-utils`

8. **`src/app/api/admin/banks/[id]/route.ts`** — `GET` (single), `PUT` (update), `DELETE`. All guarded by `requireAdmin()`. Slug uniqueness checked on update.

### Shared UI components created (referenced by task but did not exist)

9. **`src/components/khojney/bookmark-button.tsx`** (`'use client'`)
   - Bookmark toggle persisted to `localStorage` under `khojney:bookmarks` key
   - Hydration-safe (renders placeholder until mounted), cross-tab sync via `storage` event + same-page `khojney:bookmark-change` custom event
   - Toast feedback on add/remove; props: `entity`, `entityId`, `entityName`, `variant`, `size`, `className`

10. **`src/components/khojney/share-button.tsx`** (`'use client'`)
    - Dropdown with: native Web Share API (with clipboard fallback), copy-link, Facebook, Twitter/X, LinkedIn, WhatsApp share targets
    - Props: `title`, `text`, `url` (defaults to `window.location.href`), `variant`, `size`, `className`

### Supporting extensions (small, additive changes)

11. **`src/components/khojney/review-form.tsx`** — Extended the `ReviewFormProps.entity` union from `"COLLEGE" | "SCHOOL" | "UNIVERSITY" | "SCHOLARSHIP"` to also include `"BANK"` so the Reviews tab on the bank detail page type-checks against the existing `ReviewForm` component.

12. **`src/app/api/reviews/route.ts`** — Extended the `ENTITY_TABLE` map to include `BANK: "Bank"` so review submissions for banks verify the bank record exists and update its `rating` / `reviewCount` aggregates on the `Bank` table.

---

## Patterns followed (as instructed)

- Public pages use `<AppShell user={user}>` from `@/components/layout/app-shell`, get user via `const user = await getSession()` from `@/lib/auth-server`
- `notFound()` from `next/navigation` when slug is missing
- `generateMetadata` for SEO on detail page
- Admin pages use `AdminList` + `AdminFormHeader` + `BackToAdminLink` from `@/components/admin/admin-list`
- Admin edit page imports `parseBankInitial` from `@/lib/admin-parsers` (NOT from the client form)
- All admin API routes call `requireAdmin()` and return the `error` response if not admin
- `requireAdmin` imported from `@/app/api/admin/_lib/require-admin` (absolute path, never relative)
- `db` imported from `@/lib/db`; `slugify`/`stringifyJson`/`parsePagination` from `@/lib/admin-utils`
- Form component imports `BankInitial` (interface) from `@/lib/admin-parsers` so the server parser and the client form agree on the same shape
- JSON-encoded fields (`cards`, `loans`) round-tripped with `stringifyJson` on write and `parseJsonArray` on read

---

## Verification

### Lint
`bun run lint` → **0 errors, 2 pre-existing warnings** (both in `src/components/khojney/recent-posts.tsx`, which is outside this task's scope — left untouched).

### Runtime (curl on dev server)
| Endpoint                                    | Expected | Actual |
|---------------------------------------------|----------|--------|
| `GET /banks`                                | 200      | 200 ✅  |
| `GET /banks/does-not-exist`                 | 404      | 404 ✅  |
| `GET /api/admin/banks` (no session cookie)  | 401      | 401 ✅  |

The banks list page renders the "Banks of Nepal" header and "No banks found" empty state (database currently has no Bank rows — admins can add them via `/admin/banks/new`).

### Notes for downstream agents
- `bun run db:push` was re-run during this task to regenerate the Prisma client after the Bank model was added to `prisma/schema.prisma` by an earlier agent. Without that regeneration, `db.bank` was `undefined` at runtime.
- Dev server was restarted (via the init-fullstack script) so the singleton `PrismaClient` instance picked up the new `bank` delegate.
- The `Bookmark` model already exists in the schema (polymorphic `entity`/`entityId`) but there is no `/api/bookmarks` route yet. The `BookmarkButton` component uses localStorage for now; when a server bookmark API is added later, the component API can stay the same.
