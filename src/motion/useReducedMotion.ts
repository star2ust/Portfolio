"use client";

import { useEffect, useState } from "react";

function getPreference(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True when the user has requested reduced motion — the choreographed layer (preloader, arc
 *  wipe, FLIP hand-off) checks this and skips straight to the end state instead of animating.
 *  CSS-transition-driven pieces are already covered globally by tokens/base.css's blanket
 *  @media(prefers-reduced-motion) override; this hook is for the rAF-driven pieces that aren't. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(getPreference);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
