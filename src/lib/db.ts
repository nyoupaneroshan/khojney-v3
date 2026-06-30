import { PrismaClient } from "@prisma/client";

/**
 * Singleton Prisma client.
 *
 * Why singleton: Next.js dev mode hot-reloads modules, which would create a
 * new PrismaClient on every reload and exhaust the connection pool. We stash
 * the instance on `globalThis` so reuses survive HMR.
 *
 * In production, the same instance is reused across all serverless invocations
 * within the same warm container.
 *
 * Connection pool tuning:
 *   - For Neon / Postgres with PgBouncer: set `?pgbouncer=true&connection_limit=1`
 *     in DATABASE_URL. The settings here are fallbacks.
 *   - For SQLite: only one connection is used regardless.
 *
 * If you see "Timed out fetching a new connection from the connection pool":
 *   1. Verify DATABASE_URL uses the pooler hostname (e.g. `-pooler.` in Neon).
 *   2. Add `&connection_limit=1&pool_timeout=30` to DATABASE_URL.
 *   3. Restart the dev server.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const isProd = process.env.NODE_ENV === "production";

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    // production: errors + warnings only.
    // dev: include query logging for profiling.
    log: isProd
      ? ["error", "warn"]
      : ["query", "error", "warn"],
  });

if (!isProd) globalForPrisma.prisma = db;
