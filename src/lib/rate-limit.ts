/**
 * Simple in-memory rate limiter.
 *
 * For single-instance deployments (Vercel serverless functions with a single
 * instance, Docker containers, etc.) this is sufficient. For multi-instance
 * deployments, swap `MemoryStore` for a Redis-backed store.
 *
 * Usage:
 *   const limiter = new RateLimiter({ windowMs: 60_000, max: 10 });
 *   const result = limiter.check(identifier);
 *   if (!result.allowed) return new Response("Too many requests", { status: 429 });
 */
import "server-only";

interface Bucket {
  count: number;
  resetAt: number;
}

interface RateLimiterOptions {
  /** Sliding window length in milliseconds. */
  windowMs: number;
  /** Max requests allowed per window per identifier. */
  max: number;
  /** Optional: max buckets to keep in memory (default 10_000). */
  maxEntries?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export class RateLimiter {
  private buckets = new Map<string, Bucket>();
  private windowMs: number;
  private max: number;
  private maxEntries: number;

  constructor(opts: RateLimiterOptions) {
    this.windowMs = opts.windowMs;
    this.max = opts.max;
    this.maxEntries = opts.maxEntries ?? 10_000;
  }

  check(identifier: string): RateLimitResult {
    const now = Date.now();
    const existing = this.buckets.get(identifier);

    if (!existing || existing.resetAt <= now) {
      // Start a new bucket.
      const resetAt = now + this.windowMs;
      this.buckets.set(identifier, { count: 1, resetAt });
      this.maybeEvict();
      return { allowed: true, remaining: this.max - 1, resetAt };
    }

    existing.count += 1;
    if (existing.count > this.max) {
      return { allowed: false, remaining: 0, resetAt: existing.resetAt };
    }
    return {
      allowed: true,
      remaining: this.max - existing.count,
      resetAt: existing.resetAt,
    };
  }

  /** Reset a specific identifier's bucket (e.g. after successful login). */
  reset(identifier: string): void {
    this.buckets.delete(identifier);
  }

  /** Periodically evict expired entries to bound memory. */
  private maybeEvict(): void {
    if (this.buckets.size < this.maxEntries) return;
    const now = Date.now();
    for (const [key, bucket] of this.buckets) {
      if (bucket.resetAt <= now) {
        this.buckets.delete(key);
      }
    }
  }
}

// ── Pre-configured limiters for common use cases ─────────────────────────

/** 5 failed login attempts per 15 minutes per IP. */
export const loginLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

/** 5 registrations per hour per IP. */
export const registerLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
});

/** 10 AI assistant messages per minute per user/IP. */
export const aiLimiter = new RateLimiter({
  windowMs: 60 * 1000,
  max: 10,
});

/** 50 AI assistant messages per day per user/IP. */
export const aiDailyLimiter = new RateLimiter({
  windowMs: 24 * 60 * 60 * 1000,
  max: 50,
});

/** 5 contact-form submissions per hour per IP. */
export const contactLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
});
