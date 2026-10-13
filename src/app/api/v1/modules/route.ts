import { NextResponse } from "next/server";
import { getModuleCatalog } from "@/lib/integrations/module-registry.mjs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Metadata-only feature discovery. This endpoint grants no permissions.
 * Every future module operation must independently authenticate the actor,
 * resolve tenant membership server-side, and enforce its own policy.
 */
export function GET() {
  return NextResponse.json(
    {
      version: 1,
      modules: getModuleCatalog(),
      note: "Catalog status is not proof of implementation; disabled modules are unavailable for use.",
    },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}
