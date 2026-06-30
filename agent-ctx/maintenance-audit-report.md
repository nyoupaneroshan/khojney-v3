# Maintenance & Technical Audit Report — Khojney.com

**Date:** 2026-06-30
**Project:** khojney.com — Nepal education/exam/college directory platform
**Stack:** Next.js 16 + Prisma + TypeScript + SQLite
**Path:** `/home/z/my-project`
**Audit type:** Maintenance & technical-debt (read-only)

## Executive Summary

- **Total findings: 11 high, 12 medium, 6 low (29 findings)**
- **Overall code health:** The codebase has clear architectural bones — a consistent admin CRUD pattern, a shared `requireAdmin` helper, well-structured `admin-utils.ts` / `admin-parsers.ts`, and a coherent Prisma schema. However, the entire safety net that a TypeScript/Next.js project is supposed to provide has been silently disabled: `typescript.ignoreBuildErrors: true`, `noImplicitAny: false`, and an ESLint config that turns off ~30 critical rules including `no-explicit-any`, `no-unused-vars`, `no-console`, `no-unreachable`, and `react-hooks/exhaustive-deps`. `bun run lint` exits clean but is effectively a no-op. As a result, two real production defects (`seoTitle`/`seoContent` columns queried in `admin/seo/page.tsx` that don't exist on the `Exam` model; a Date-vs-string type mismatch in `admin/automation/page.tsx`) ship to production undetected. Bundle is bloated by ~14 MB of unused heavy dependencies.

- **Top 3 maintenance risks:**
  1. All compile-time and lint-time guardrails are disabled. Defects accumulate silently.
  2. ~14 MB of heavy unused dependencies (`next-auth`, `@mdxeditor/editor`, `react-syntax-highlighter`, `framer-motion`, `next-intl`, `zod`, `date-fns`, `uuid`, `@dnd-kit/*`, `@tanstack/*`).
  3. Missing database indexes on hot read paths (`Notification.userId`, `ExamQuestion.examId`, `College/School/University/Bank.isFeatured+isPublished`, `Scholarship.deadline`).

## Findings

### [M-H-1] All TypeScript errors are silently swallowed at build time
- **Severity**: High
- **Category**: TypeScript / Config
- **Location**: `next.config.ts:5-7` (`typescript.ignoreBuildErrors: true`)
- **Issue**: Production builds succeed regardless of TypeScript errors. `bunx tsc --noEmit` currently reports 11 errors; 2 of them are real production-code defects (M-H-2, M-H-3), the rest are in orphaned `examples/` and `skills/` directories.
- **Fix**: Set `typescript.ignoreBuildErrors: false`. Fix the 2 production-code TS errors first. Exclude `examples/` and `skills/` from `tsconfig.json`.

### [M-H-2] Admin SEO page queries non-existent `seoTitle` / `seoContent` columns on `Exam`
- **Severity**: High
- **Category**: TypeScript / Database / Errors
- **Location**: `src/app/admin/seo/page.tsx:8-9`
- **Issue**: The `Exam` model has no `seoTitle` or `seoContent` columns. Both queries throw at runtime; the `.catch(()=>0)` masks the error and silently returns 0.
- **Impact**: The `/admin/seo` dashboard permanently shows "Exam SEO Title: 0/N" and "Exam SEO Content: 0/N". SEO score is permanently deflated.
- **Fix**: Either add `seoTitle` / `seoContent` columns to the `Exam` schema and run a migration, or remove the queries and the associated metric cards.

### [M-H-3] Admin automation page has Date-vs-string type mismatch on webhook data
- **Severity**: High
- **Category**: TypeScript / Component
- **Location**: `src/app/admin/automation/page.tsx:7`; `src/components/admin/automation-panel.tsx:13`
- **Issue**: `AutomationPanel` declares `lastTriggered: string | null` and `createdAt: string`, but the page passes raw Prisma rows where these are `Date | null` / `Date`.
- **Fix**: Serialize Date fields to ISO strings at the server/RSC boundary.

### [M-H-4] ESLint configuration disables every meaningful rule
- **Severity**: High
- **Category**: TypeScript / Lint
- **Location**: `eslint.config.mjs:10-45`
- **Issue**: The config explicitly turns off ~30 rules including `@typescript-eslint/no-explicit-any`, `no-unused-vars`, `react-hooks/exhaustive-deps`, `no-console`, `no-unreachable`, etc. `bun run lint` is effectively a no-op.
- **Fix**: Restore rules incrementally — start with `no-unused-vars`, `no-unreachable`, `prefer-const`, `no-debugger`, `@typescript-eslint/no-explicit-any` as `warn`.

### [M-H-5] ~14 MB of heavy unused dependencies inflate install and bundle
- **Severity**: High
- **Category**: Performance / Dead Code
- **Location**: `package.json:15-84`
- **Issue**: Verified zero imports in `src/` for: `@mdxeditor/editor`, `react-syntax-highlighter`, `framer-motion`, `next-auth`, `next-intl`, `@dnd-kit/*`, `@tanstack/react-query`, `@tanstack/react-table`, `@reactuses/core`, `@hookform/resolvers`, `uuid`, `date-fns`, `zod`. The shadcn primitives `ui/sidebar.tsx`, `ui/command.tsx`, `ui/carousel.tsx`, `ui/chart.tsx` are also never imported.
- **Fix**: Remove the listed packages from `dependencies`. Delete unused shadcn primitives.

### [M-H-6] No README, no `.env.example`, undocumented required env vars
- **Severity**: High
- **Category**: Documentation / Config
- **Location**: project root
- **Issue**: No `README.md`, no `.env.example`. Google OAuth reads `process.env.GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` with no fallback and no validation. If unset, OAuth silently fails at runtime.
- **Fix**: Add `README.md` with setup, scripts, env-var table, architecture overview. Add `.env.example`. Add a startup-time env validation module.

### [M-H-7] Missing database indexes on hot read paths
- **Severity**: High
- **Category**: Database / Performance
- **Location**: `prisma/schema.prisma`
- **Issue**:
  - `Notification` — no `@@index([userId])`.
  - `Session` — no `@@index([userId])`.
  - `ExamQuestion` — no `@@index([examId])`.
  - `College`, `School`, `University`, `Bank` — no `@@index([isPublished, isFeatured])`, no index on `province` / `city` / `categoryId`.
  - `Scholarship` — no `@@index([deadline])`.
  - `ExamAttempt` — no `@@index([userId, finishedAt])`.
- **Fix**: Add `@@index` declarations and run `bun run db:push`.

### [M-H-8] Unbounded `findMany` queries on growing tables
- **Severity**: High
- **Category**: Database / Performance
- **Location**:
  - `src/app/api/admin/community/guest-posts/route.ts:5`
  - `src/app/api/admin/community/questions/route.ts:5`
  - `src/app/api/comments/route.ts:8` (also no `take` on `replies` relation)
  - `src/app/api/reviews/route.ts:91`
  - `src/app/api/bookmarks/route.ts:7`
  - `src/app/page.tsx:49-52`
- **Fix**: Add `take: 50` (or paginate) to all listed queries. Cap replies per comment with `take: 100`.

### [M-H-9] Contact form is a fake — submissions are silently dropped
- **Severity**: High
- **Category**: Errors / Product defect
- **Location**: `src/components/khojney/contact-form.tsx:26-30`
- **Issue**: Form never POSTs to an API. It fakes an 800ms delay, logs PII to console, and shows a success toast.
- **Fix**: Create `src/app/api/contact/route.ts`. Replace `setTimeout` with real `fetch`. Remove `console.log`.

### [M-H-10] No route-level error boundary; admin routes don't catch Prisma errors
- **Severity**: High
- **Category**: Errors
- **Location**: No `src/app/error.tsx`; admin POST/PUT handlers lack `try/catch`
- **Issue**: Route-segment errors fall through to Next's default 500 page. Prisma `P2002` / `P2003` / `P2025` errors bubble up as unstructured 500s.
- **Fix**: Add `src/app/error.tsx`. Wrap all admin `db.create`/`db.update` in try/catch; map Prisma error codes to structured responses.

### [M-H-11] `tsconfig.json` partially disables strict mode
- **Severity**: High
- **Category**: TypeScript / Config
- **Location**: `tsconfig.json:11-13`
- **Issue**: `"strict": true` is undermined by `"noImplicitAny": false`. `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess` are not enabled.
- **Fix**: Set `"noImplicitAny": true`. Add `"noUnusedLocals": true`, `"noUnusedParameters": true`.

### [M-M-1] Orphaned `examples/websocket/` directory
- **Severity**: Medium
- **Category**: Dead Code
- **Location**: `examples/websocket/`
- **Fix**: Delete `examples/websocket/` or exclude from `tsconfig.json`.

### [M-M-2] `skills/`, `mini-services/`, `tool-results/`, `download/` are non-project artifacts at root
- **Severity**: Medium
- **Category**: Dead Code / Config
- **Fix**: Move `skills/` out. Delete `mini-services/`, `tool-results/`, `download/`. Update `.gitignore` and `tsconfig.json` exclude.

### [M-M-3] `db:seed` script missing despite 4 seed files existing
- **Severity**: Medium
- **Category**: Config / Documentation
- **Fix**: Add `"db:seed": "bun run scripts/seed.ts"` (and variants) to `package.json`.

### [M-M-4] Zod is installed but unused; admin route validation is hand-rolled and inconsistent
- **Severity**: Medium
- **Category**: API / TypeScript
- **Issue**: Every admin route hand-rolls validation. `colleges` validates `body.name` but coerces everything else via `?? null`. `exams`/`blog` only check `if (!body.title)`. `government` is the only module with a category whitelist. No route validates emails/URLs/numbers.
- **Fix**: Define a `z.object({...})` schema per admin module in `src/lib/admin-schemas.ts`.

### [M-M-5] `admin-parsers.ts` is misnamed
- **Severity**: Medium
- **Category**: API / Docs
- **Issue**: The file contains form-hydration parsers, not input validation. Discoverability friction.
- **Fix**: Rename to `admin-form-initializers.ts`. Create `admin-schemas.ts` for input validation.

### [M-M-6] Homepage sets `revalidate = 3600` but calls `getSession()` (forces dynamic)
- **Severity**: Medium
- **Category**: Performance
- **Location**: `src/app/page.tsx:15-18`
- **Issue**: Any route that reads cookies is forced dynamic — the `revalidate` export is ignored. Homepage runs 9 `findMany` + 9 `count` queries per request.
- **Fix**: Either remove `getSession()` from the homepage (defer header avatar to a client component) or remove the misleading `revalidate` export.

### [M-M-7] Contact form logs PII to the browser console
- **Severity**: Medium
- **Category**: Logging / Privacy
- **Location**: `src/components/khojney/contact-form.tsx:28`
- **Fix**: Remove the `console.log` entirely.

### [M-M-8] `reactStrictMode: false` disables React's bug-detection mode
- **Severity**: Medium
- **Category**: Config / Errors
- **Location**: `next.config.ts:8`
- **Fix**: Set `reactStrictMode: true` (or remove the line).

### [M-M-9] No request-logging middleware; no structured logging; no error tracking
- **Severity**: Medium
- **Category**: Logging / Observability
- **Issue**: No `src/middleware.ts`. All logging is unstructured `console.*`. No Sentry / Bugsnag / OpenTelemetry.
- **Fix**: Add `src/middleware.ts` with request IDs. Adopt `pino`. Integrate Sentry.

### [M-M-10] `global-error.tsx` logs the full error object to the browser console
- **Severity**: Medium
- **Category**: Errors / Logging
- **Location**: `src/app/global-error.tsx:14-16`
- **Fix**: Log only `error.digest` and `error.message`, not the stack.

### [M-M-11] Build script relies on manual `cp` of `.next/static` into standalone
- **Severity**: Medium
- **Category**: Config / Build
- **Location**: `package.json:7`
- **Fix**: Wrap in a `scripts/build.sh` for portability.

### [M-M-12] `console.log` of OAuth token-response body in error path
- **Severity**: Medium
- **Category**: Logging / Privacy
- **Location**: `src/app/api/auth/google/callback/route.ts:72`
- **Fix**: Log only `tokenResponse.status` and a redacted snippet.

### [M-L-1] Two components exceed 800 lines
- **Severity**: Low
- **Category**: Component / Maintainability
- **Location**: `src/components/khojney/exam-runner.tsx` (878 lines), `src/components/khojney/dashboard-tabs.tsx` (747 lines)
- **Fix**: Extract sub-components. Use `next/dynamic` for the result display.

### [M-L-2] No `next/dynamic` usage for heavy client components
- **Severity**: Low
- **Category**: Performance / Bundle
- **Fix**: Use `next/dynamic` with `ssr: false` for components that only mount after user interaction.

### [M-L-3] Raw `<img>` tags in 2 places (eslint rule disabled)
- **Severity**: Low
- **Category**: Performance / Component
- **Location**: `src/components/khojney/recent-posts.tsx:47,81`; `src/components/khojney/markdown-content.tsx:137`
- **Fix**: Switch to `next/image` with explicit dimensions.

### [M-L-4] Stale screenshots and stale `dev.log` / `server.log` files
- **Severity**: Low
- **Category**: Config / Hygiene
- **Fix**: Add `dev.log`, `server.log`, `download/`, `tool-results/` to `.gitignore`.

### [M-L-5] No API route JSDoc convention
- **Severity**: Low
- **Category**: Documentation
- **Fix**: Adopt a JSDoc convention for route handlers.

### [M-L-6] `worklog.md` and `agent-ctx/` are process artifacts masquerading as docs
- **Severity**: Low
- **Category**: Documentation / Hygiene
- **Fix**: Move into `docs/history/`.

## Passed Checks (what's already correct)

- Admin CRUD route shape consistency across all 11 modules.
- `requireAdmin()` helper is clean and consistently used.
- Pagination cap: `pageSize ≤ 100` enforced via `parsePagination`.
- Slug uniqueness pre-check on every create route.
- Error response shape consistency (`{ error: "..." }` with proper status codes).
- Only 4 explicit `any` occurrences in `src/`. Zero `@ts-ignore` / `@ts-expect-error` / `@ts-nocheck`.
- No `lodash` or `moment` dependency.
- Prisma schema is well-commented.
- `output: "standalone"` is set.
- `src/lib/admin-utils.ts` is correctly split client-safe vs server-only.
- `global-error.tsx` exists and calls `reset()`.
- `not-found.tsx` exists.
- No `console.log` in admin or auth API routes.
- Search API uses bounded `take: 25` per module.
- All required scripts exist in `package.json` (only `db:seed` missing).
- `force-dynamic` is set on all admin and dashboard routes that read cookies.
- JSON-string columns are consistently parsed via `parseJson<T>` with try/catch.

## Recommended Fix Order

1. **M-H-1, M-H-11**: Enable TypeScript strictness. Fix M-H-2, M-H-3. Exclude `examples/` and `skills/` from tsconfig.
2. **M-H-4**: Re-enable meaningful ESLint rules.
3. **M-H-5**: Remove ~14 MB of unused dependencies.
4. **M-H-7, M-H-8**: Add Prisma indexes. Cap unbounded queries.
5. **M-H-9**: Fix contact form.
6. **M-H-6**: Add `README.md` and `.env.example`.
7. **M-H-10**: Add route-level error boundary + Prisma error mapping.
8. **M-M-4**: Adopt `zod` for admin input validation.
9. **M-M-6**: Decide on ISR strategy for homepage.
10. **M-M-9, M-M-10, M-M-12**: Structured logging + Sentry.
11. **M-M-8**: Enable `reactStrictMode: true`.
12. **M-M-2, M-L-4, M-L-6**: Clean up non-project artifacts at root.
13. **M-M-3**: Add `db:seed` script.
14. **M-L-1, M-L-2**: Refactor large components + `next/dynamic`.
15. **M-L-3**: Switch raw `<img>` to `next/image`.
16. **M-L-5**: JSDoc convention for API routes.
