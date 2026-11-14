import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSession();
    return NextResponse.json(
      { user },
      {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
