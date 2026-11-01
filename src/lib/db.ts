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

function createPrismaClient(): PrismaClient {
  let ClientConstructor = PrismaClient;

  if (!isProd) {
    try {
      // Use native Node require to bypass Turbopack's stale module wrapper
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const nativeRequire = typeof eval !== "undefined" ? eval("require") : undefined;
      if (nativeRequire && nativeRequire.cache) {
        for (const key of Object.keys(nativeRequire.cache)) {
          if (key.includes("@prisma/client") || key.includes(".prisma/client")) {
            delete nativeRequire.cache[key];
          }
        }
        const fresh = nativeRequire("@prisma/client");
        if (fresh && fresh.PrismaClient) {
          ClientConstructor = fresh.PrismaClient;
        }
      }
    } catch (e) {
      console.error("[db.ts] Failed to reload native PrismaClient:", e);
    }
  }

  return new ClientConstructor({
    log: isProd
      ? ["error", "warn"]
      : ["query", "error", "warn"],
  });
}

function getClient(): PrismaClient {
  let existing = globalForPrisma.prisma;
  if (!existing || !("hospital" in existing)) {
    existing = createPrismaClient();
    if (!isProd) {
      globalForPrisma.prisma = existing;
    }
  }
  return existing;
}

export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getClient();
    const val = Reflect.get(client, prop, receiver);
    if (typeof val === "function") {
      return val.bind(client);
    }
    return val;
  },
});
