import { NextResponse } from "next/server";

/** Liveness only: never initialize providers or disclose internal configuration. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export function GET() {
  return NextResponse.json(
    { status: "ok", service: "dukaanmitra", timestamp: new Date().toISOString() },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}
