/**
 * This route is now handled by src/app/(app)/dashboard/page.tsx to resolve parallel routing conflicts.
 * The root dashboard path is neutralized here to allow the Next.js build to proceed.
 */
export default function RootDashboardNeuter() {
  return null;
}
