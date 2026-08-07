"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

// The server has no `window` to read a real preference from — always reporting "no reduced
// motion" here (never true) is what keeps the server-rendered HTML matching the client's very
// first hydration pass; useSyncExternalStore then swaps in the real value right after mount.
function getServerSnapshot(): boolean {
  return false;
}

/** True when the user has requested reduced motion — the choreographed layer (preloader, arc
 *  wipe, FLIP hand-off) checks this and skips straight to the end state instead of animating.
 *  CSS-transition-driven pieces are already covered globally by tokens/base.css's blanket
 *  @media(prefers-reduced-motion) override; this hook is for the rAF-driven pieces that aren't.
 *
 *  useSyncExternalStore (not useState+useEffect) on purpose: reading matchMedia synchronously
 *  in a useState initializer makes the client's first hydration pass disagree with the
 *  server-rendered HTML for every reduced-motion visitor (Preloader/ArcWipe branch their JSX
 *  directly on this value) — a real, reproducible hydration error (React #418), not just a
 *  cosmetic risk. This is exactly the case useSyncExternalStore exists for: external state that
 *  can't be known during SSR, made hydration-safe via its separate server-snapshot argument. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
