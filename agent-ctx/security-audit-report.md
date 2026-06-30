# Security & Privacy Audit Report — Khojney.com

**Date:** 2026-06-30
**Project:** khojney.com — Nepal education/exam/college directory platform
**Stack:** Next.js 16 + Prisma + TypeScript + SQLite
**Path:** `/home/z/my-project`
**Audit type:** Security & privacy (read-only)

## Executive Summary

- **Total findings: 8 High, 6 Medium, 3 Low (17 findings)**
- **Overall posture: Critical.** Authentication is fundamentally broken in three independent ways — session cookies are unsigned user IDs (trivially forgeable), the `demoLogin` helper grants ADMIN role to anyone whose email contains "admin", and no password verification exists. A remote attacker can become admin in under 10 seconds with no exploit, just by calling `/api/auth/login` with `{"email":"a-admin@x.com","password":"x"}`. Combined with an SSRF-open webhook system and PII leakage in exam leaderboards and admin user listings, the platform should not be considered production-ready until H-1 through H-5 are fixed.

The good news: every admin route *does* call `requireAdmin`, Prisma parameterizes all queries (no SQL injection), the Google OAuth state is verified, and the error boundary is opaque — so the issue set is narrow and fixable in one session.

## Findings

### [H-1] Session cookie is an unsigned, unencrypted user ID — trivial account takeover
- **Severity**: Critical / High
- **Category**: Auth
- **Location**: `src/lib/auth-server.ts:10-29`
- **Issue**: `getSession()` reads `khojney_user_id` straight from the cookie and does `db.user.findUnique({ where: { id: userId } })`. The cookie is set as the raw user ID with no HMAC signature, no JWT, no server-side session table lookup.
- **Impact**: Anyone who learns or guesses a user's CUID can set `document.cookie = "khojney_user_id=<victim-id>"` in their browser and become that user — including any ADMIN or SUPER_ADMIN.
- **Fix**: Use a signed session token (HMAC-SHA256 with `process.env.SESSION_SECRET`) or a server-side session table (`Session` model already exists in schema). Store only the token in the cookie; look up `userId` from `db.session.findUnique({ where: { sessionToken } })`. Rotate on login. Add `secure: true` when behind HTTPS in prod.

### [H-2] `demoLogin` grants ADMIN role to anyone whose email contains "admin"
- **Severity**: Critical / High
- **Category**: Auth / Authorization
- **Location**: `src/lib/auth-server.ts:40-53`, called from `src/app/api/auth/login/route.ts:32` and `src/app/api/auth/register/route.ts:44`
- **Issue**: `demoLogin()` does `role: email.toLowerCase().includes("admin") ? "ADMIN" : "USER"`. The login route accepts **any** password. So `POST /api/auth/login {"email":"admin@evil.com","password":"anything"}` creates an ADMIN user and returns a valid session cookie.
- **Impact**: Trivial full admin takeover of the platform.
- **Fix**: Remove `demoLogin` entirely. In `/api/auth/login`, fetch user by email, verify `bcrypt.compare(password, user.passwordHash)`, return 401 on mismatch. In `/api/auth/register`, hash with `bcrypt.hash(password, 12)` before create; set `role: "USER"` always.

### [H-3] Passwords are stored as the literal string `"demo"` — no hashing
- **Severity**: High
- **Category**: Auth / PII
- **Location**: `src/lib/auth-server.ts:48`
- **Issue**: All password-based users have `passwordHash = "demo"`. `bcrypt` / `argon2` are not in `package.json`. The `_password` parameter to `demoLogin` is ignored.
- **Impact**: Even if H-2 is fixed, there's no way to verify a password today. And if the DB file leaks, every password is exposed as the literal `"demo"`.
- **Fix**: `bun add bcryptjs`; on register, `passwordHash = await bcrypt.hash(password, 12)`; on login, `await bcrypt.compare(password, user.passwordHash)`. Run a one-time migration to set `passwordHash = null` on all existing rows (force password reset).

### [H-4] `/api/admin/users` returns every user's `passwordHash` to the admin client
- **Severity**: High
- **Category**: PII / Info Disclosure
- **Location**: `src/app/api/admin/users/route.ts:42` (list) and `src/app/api/admin/users/[id]/route.ts:30` (detail)
- **Issue**: Both endpoints `select: { ..., passwordHash: true, ... }`.
- **Impact**: Combined with H-2, currently exploitable by anyone: register as `admin@x.com`, then `fetch('/api/admin/users').then(r=>r.json())` and read every user's password hash.
- **Fix**: Remove `passwordHash` from every `select` clause in admin user endpoints.

### [H-5] Webhook system is a server-side request forgery (SSRF) primitive
- **Severity**: High
- **Category**: SSRF
- **Location**: `src/lib/webhook.ts:15`; `src/app/api/admin/webhooks/route.ts:6`
- **Issue**: An admin can store any URL as a webhook target; `triggerWebhooks` calls `fetch(url)` with no validation against `localhost`, `127.0.0.1`, `169.254.169.254` (AWS/GCP metadata), RFC1918 ranges, `file://`, `gopher://`, etc. The response body (up to 500 chars) is stored in `WebhookLog.response` and returned by the GET endpoint — exfiltration possible.
- **Impact**: Once an attacker has admin (one POST to `/api/auth/login`), they can read AWS metadata, port-scan internal network, hit internal endpoints.
- **Fix**: Validate URL on create/update: must be `https:` (or `http:` only in dev), hostname must not resolve to private/loopback/link-local ranges. Use Node's `dns.lookup` to resolve and reject private IPs. Do not store `response` body in `WebhookLog`.

### [H-6] Exam-taking page ships `correctIdx` and `explanation` to the client before submission
- **Severity**: High
- **Category**: Privacy / Integrity
- **Location**: `src/app/exams/[slug]/take/page.tsx:50-66`; `src/components/khojney/exam-runner.tsx:55-56`
- **Issue**: When a logged-in user opens `/exams/[slug]/take`, the server maps each question to a client-safe object that includes `correctIdx` (the index of the correct option) and `explanation`. Anyone with DevTools open can read all correct answers before submitting.
- **Impact**: All exam scores on the platform are unreliable. Ranks, leaderboards, certificates cannot be trusted.
- **Fix**: Send only `{ id, question, options, marks, order }` to the client. The server already re-computes `correctIdx` and `explanation` from the DB in `/api/exam-attempts` `handleSubmit` — that's the correct pattern. Return `correctIdx` and `explanation` only as part of the submit *response*.

### [H-7] AI assistant endpoint has no authentication, no rate limit, no abuse controls
- **Severity**: High
- **Category**: Auth / Abuse
- **Location**: `src/app/api/ai/assistant/route.ts:33-72`
- **Issue**: `POST /api/ai/assistant` is fully public — no `getSession()`, no rate limit, no IP throttle. Each call hits `zai.chat.completions.create` (a paid third-party API). Body is unbounded.
- **Impact**: Anyone can drive the platform's AI bill to any amount with a simple `while true; curl ...` loop.
- **Fix**: Require `getSession()` (return 401 if absent). Add per-IP and per-user rate limiting — 10 msgs/min/user, 50/day. Cap each message to ~4,000 chars. Return only a generic error to the client; log full error server-side.

### [H-8] No rate limiting on `/api/auth/login` or `/api/auth/register`
- **Severity**: High
- **Category**: Auth / Abuse
- **Location**: `src/app/api/auth/login/route.ts:16`, `src/app/api/auth/register/route.ts:17`
- **Issue**: Neither endpoint throttles attempts. `package.json` has no `@upstash/ratelimit`, `lru-cache`, or similar.
- **Fix**: After fixing H-2/H-3, add: (a) per-IP rate limit on `/api/auth/login` (5 attempts / 15 min); (b) per-email exponential backoff on failed login; (c) per-IP rate limit on `/api/auth/register` (5 / hour); (d) email verification before account is usable.

### [M-1] Google OAuth `callbackUrl` is an open redirect
- **Severity**: Medium
- **Category**: CSRF / Open Redirect
- **Location**: `src/app/api/auth/google/callback/route.ts:128-129`
- **Issue**: The handler verifies `state` matches the cookie, then trusts `callbackUrl` from the URL and does `NextResponse.redirect(new URL(callbackUrl, req.url))`. Since `new URL("https://evil.com", req.url)` returns `https://evil.com`, an attacker can initiate their own OAuth flow with `callbackUrl=https://evil.com`, get the victim to authenticate, and bounce them to `evil.com` post-login.
- **Fix**: Validate that `callbackUrl` starts with `/` (no protocol) before redirecting.

### [M-2] Google OAuth `state` cookie has `secure: false`
- **Severity**: Medium
- **Category**: Auth
- **Location**: `src/app/api/auth/google/route.ts:46`
- **Issue**: In production behind Caddy HTTPS, the cookie is also sent on any plain-HTTP request to the same origin, exposing it to MITM.
- **Fix**: `secure: process.env.NODE_ENV === "production"`. Same for the session cookie in `auth-server.ts:23`.

### [M-3] `/api/admin/users/[id] DELETE` only nulls `passwordHash`; user remains fully usable via session cookie
- **Severity**: Medium
- **Category**: Auth
- **Location**: `src/app/api/admin/users/[id]/route.ts:117-121`
- **Fix**: Add `isActive Boolean @default(true)` to User schema; check it in `getSession()`; on deactivate, also delete all `Session` rows for the user.

### [M-4] Webhook secrets are returned in plaintext by `GET /api/admin/webhooks`
- **Severity**: Medium
- **Category**: PII / Secret Exposure
- **Location**: `src/app/api/admin/webhooks/route.ts:5`
- **Fix**: Exclude `secret` from the response. And implement HMAC signing in `fireWebhook` (`X-Khojney-Signature: hmac_sha256(secret, body)`).

### [M-5] Public exam leaderboard exposes user emails when `name` is null
- **Severity**: Medium
- **Category**: Privacy / PII
- **Location**: `src/app/exams/[slug]/page.tsx:191` (selects `email`); rendered at lines 391 and 426 as `a.user.name ?? a.user.email`
- **Fix**: Never select `email` for public leaderboards. Fall back to `"Anonymous user"` instead of email.

### [M-6] `console.log("Contact form submission:", payload)` ships full form contents to the browser console
- **Severity**: Medium
- **Category**: PII
- **Location**: `src/components/khojney/contact-form.tsx:28`
- **Fix**: Implement `/api/contact` POST route. Remove the `console.log`.

### [L-1] `next.config.ts` does not disable `x-powered-by` or set security headers
- **Severity**: Low
- **Category**: Info Disclosure
- **Location**: `next.config.ts:1-12`
- **Fix**: Add `poweredByHeader: false` and `headers()` config for `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`.

### [L-2] AI assistant error handler returns upstream error `message` to the client
- **Severity**: Low
- **Category**: Info Disclosure
- **Location**: `src/app/api/ai/assistant/route.ts:66-70`
- **Fix**: `console.error` the full error server-side; return only `{ error: "AI service unavailable" }` to the client.

### [L-3] `GET /api/auth/logout` allows logout via `<a href>` (no CSRF)
- **Severity**: Low
- **Category**: CSRF
- **Location**: `src/app/api/auth/logout/route.ts:13-18`
- **Fix**: Remove the GET handler; require POST with a CSRF token. The current GET also hardcodes `http://localhost:3000` as the redirect base — broken in prod.

## Passed Checks (what's already correct)

- All 33 admin API route files import and call `requireAdmin`.
- Admin page layout gates the entire `/admin/*` route tree behind `getSession() + isAdmin()`.
- No raw SQL anywhere in the codebase. All Prisma queries are parameterized.
- Google OAuth `state` parameter is verified against a cookie.
- `dangerouslySetInnerHTML` is only used for `application/ld+json` and an injected `<style>` block — no user-controlled HTML.
- React-markdown is used *without* `rehypeRaw`, so HTML embedded in user-submitted markdown is rendered as plain text — no XSS.
- Global error boundary is opaque in production — logs to `console.error` server-side, shows only `error.digest` to the user.
- `robots.ts` correctly disallows `/admin`, `/dashboard`, `/api`.
- `sitemap.ts` only includes `isPublished: true` content.
- Per-user ownership checks are correct on `/api/exam-attempts` submit, `/api/comments` DELETE, `/dashboard/api/notifications/[id]` PATCH/DELETE, `/api/bookmarks`, `/api/community/guest-posts?status=mine`, `/api/community/questions?filter=mine`.
- `getSession()` uses `select` to exclude `passwordHash` from the session lookup itself.
- Bulk upload validates structure per row.
- Only one `NEXT_PUBLIC_*` env var exists (`NEXT_PUBLIC_ADSENSE_CLIENT`, intentionally public).
- `.env` contains only `DATABASE_URL` — no production secrets are checked in.
- Comment POST has a 2,000-char length cap.
- Webhook trigger has a 10-second timeout.
- `requireAdmin` returns proper 401/403 with correct status codes.

## Recommended Fix Order

1. **H-1 + H-2 + H-3** (do together — fix sessions, delete `demoLogin`, add bcrypt). Without this, nothing else matters.
2. **H-4** (stop leaking `passwordHash`) — one-line change per file.
3. **H-6** (stop sending `correctIdx` to the client) — one-line change in `take/page.tsx`.
4. **H-5** (webhook SSRF) — add URL validation + drop `response` from logs.
5. **H-7 + H-8** (AI + auth rate limits) — add `@upstash/ratelimit` or in-memory limiter.
6. M-1 through M-6 in any order.
7. L-1 through L-3 as cleanup.
