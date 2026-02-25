// This file is deprecated to resolve a routing conflict with src/app/dashboard/page.tsx.
// Next.js does not allow two parallel pages to resolve to the same path (/dashboard).
// The active dashboard logic is now maintained in src/app/dashboard/page.tsx.

export const dynamic = 'force-dynamic';

/**
 * Inert component to prevent build conflicts.
 * In a production environment, this file should be deleted manually.
 */
export default function DeprecatedDashboardPage() {
  return null;
}
