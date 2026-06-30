/**
 * Prisma error handler.
 *
 * Maps Prisma error codes to safe HTTP responses without leaking internal
 * details (no stack traces, no schema names, no field names beyond what the
 * user is allowed to know).
 *
 * Usage in API routes:
 *   try {
 *     await db.college.create({ ... });
 *   } catch (err) {
 *     return handlePrismaError(err, "college");
 *   }
 */
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

/**
 * Map a Prisma error to a safe HTTP response.
 *
 * Returns `null` if the error is not a recognized Prisma error — caller
 * should fall back to a generic 500.
 */
export function handlePrismaError(
  err: unknown,
  entityName = "record"
): NextResponse | null {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        // Unique constraint violation — tell the user which field conflicted
        // only if the target field is in the safe-to-disclose list.
        const target = (err.meta?.target as string[] | undefined)?.[0];
        const safeTargets = new Set([
          "slug",
          "email",
          "name",
          "shortName",
          "query",
        ]);
        const fieldLabel =
          target && safeTargets.has(target) ? target : "identifier";
        return NextResponse.json(
          {
            error: `A ${entityName} with this ${fieldLabel} already exists.`,
            code: "UNIQUE_CONFLICT",
          },
          { status: 409 }
        );

      case "P2003":
        // Foreign key constraint violation — don't disclose the FK name.
        return NextResponse.json(
          {
            error: `Referenced ${entityName} does not exist.`,
            code: "FOREIGN_KEY_VIOLATION",
          },
          { status: 400 }
        );

      case "P2025":
        // Record not found.
        return NextResponse.json(
          { error: `${entityName} not found.`, code: "NOT_FOUND" },
          { status: 404 }
        );

      case "P2000":
        // Value out of range / too long.
        return NextResponse.json(
          { error: "One of the provided values is too long.", code: "VALUE_TOO_LONG" },
          { status: 400 }
        );

      default:
        // Other known Prisma errors — log server-side, return generic message.
        console.error(`Prisma error ${err.code} on ${entityName}:`, err.message);
        return NextResponse.json(
          { error: "Database operation failed.", code: err.code },
          { status: 400 }
        );
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    // Validation error — field missing, wrong type, etc.
    console.error(`Prisma validation error on ${entityName}:`, err.message);
    return NextResponse.json(
      { error: "Invalid input provided.", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    console.error(`Unknown Prisma error on ${entityName}:`, err.message);
    return NextResponse.json(
      { error: "Database error.", code: "UNKNOWN_DB_ERROR" },
      { status: 500 }
    );
  }

  // Not a Prisma error — caller should handle.
  return null;
}

/**
 * Wrap an async DB operation with a try/catch that returns a safe HTTP
 * response on Prisma errors. Re-throws non-Prisma errors.
 *
 *   const result = await withPrismaSafe(db.college.create({ ... }), "college");
 *   if (result instanceof NextResponse) return result;
 *   // ...use result
 */
export async function withPrismaSafe<T>(
  promise: Promise<T>,
  entityName = "record"
): Promise<T | NextResponse> {
  try {
    return await promise;
  } catch (err) {
    const handled = handlePrismaError(err, entityName);
    if (handled) return handled;
    // Unknown error — log it server-side, return generic 500.
    console.error(`Unhandled DB error on ${entityName}:`, err);
    return NextResponse.json(
      { error: "Internal server error.", code: "INTERNAL" },
      { status: 500 }
    );
  }
}
