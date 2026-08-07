import type { ReactNode } from "react";
import { RouteTransition } from "@/motion/RouteTransition";

/**
 * Route group for the marketing site's pages only — the preloader/arc-wipe page-transition
 * layer belongs here, NOT at the root layout. It used to wrap /studio too, and Sanity Studio
 * (its own large client-rendered React app with its own Suspense/routing internals) doesn't
 * tolerate being nested inside that: real hydration mismatches and "state update on an
 * unmounted component" errors showed up in production, not just theory. Studio now mounts
 * directly under the bare root layout instead.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <RouteTransition>{children}</RouteTransition>;
}
