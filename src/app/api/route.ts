import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "healthy";
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    await db.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
  } catch (err) {
    dbStatus = "unreachable";
    console.error("Health check DB ping failed:", err);
  }

  const isHealthy = dbStatus === "healthy";

  return NextResponse.json(
    {
      status: isHealthy ? "pass" : "fail",
      service: "khojney-api",
      version: "0.2.0",
      timestamp: new Date().toISOString(),
      responseTimeMs: Date.now() - startTime,
      checks: {
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
        },
      },
      endpoints: {
        search: "/api/search?q={query}",
        reviews: "/api/reviews?entity={entity}&entityId={id}",
        bookmarks: "/api/bookmarks",
        comments: "/api/comments?entity={entity}&entityId={id}",
        examAttempts: "/api/exam-attempts",
        auth: {
          login: "/api/auth/login",
          register: "/api/auth/register",
          logout: "/api/auth/logout",
          forgotPassword: "/api/auth/forgot-password",
        },
      },
    },
    { status: isHealthy ? 200 : 503 },
  );
}