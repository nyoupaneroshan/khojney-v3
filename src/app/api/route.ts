import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../_lib/require-admin";

export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}