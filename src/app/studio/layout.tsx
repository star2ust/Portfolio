import type { Metadata } from "next";
import "../globals.css";

// /studio's own root layout — it deliberately does NOT sit under src/app/[locale]/layout.tsx.
// Studio is a single admin-only tool (not a localized marketing page), and it used to sit under
// a shared root layout with the marketing site's page-transition chrome, which caused real
// hydration mismatches (Sanity Studio's own React app doesn't tolerate being nested inside
// that). Two independent top-level segments, each with their own root layout and no shared
// ancestor layout.tsx above them, is Next.js's supported "multiple root layouts" shape.
export const metadata: Metadata = {
  title: "Sanity Studio",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
