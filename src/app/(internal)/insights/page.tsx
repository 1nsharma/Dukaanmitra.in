// This file is intentionally modified to resolve a build conflict.
// The primary page for this route is located at /app/insights/page.tsx.
// By not default-exporting a React component from this file, we prevent it
// from being treated as a page by the Next.js App Router, which resolves the
// "two parallel pages" error.

export const message = "This file is disabled to prevent a routing conflict.";
