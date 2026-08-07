"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

// §2/§3 — a white sheet with a rope-like sag sweeps bottom → top, tinting the outgoing page
// 30% as it rises. y and sag are in the 0–140 viewBox the source authored this in.
function arcPath(t: number): string {
  const y = 142 - t * 184;
  const sag = Math.sin(Math.PI * t) * 26; // flat at the bottom, deepest mid-way, straight at the top
  return `M0,${y} Q50,${y + sag} 100,${y} L100,140 L0,140 Z`;
}

const DURATION_MS = 1400;

export interface ArcWipeProps {
  active: boolean;
  /** stable across renders (e.g. a useCallback) — this effect re-runs whenever it changes identity. */
  onEnd?: () => void;
}

/** The shared page-transition wipe. Every route change uses this except the project detail
 *  page, which fades instead (§7). */
export function ArcWipe({ active, onEnd }: ArcWipeProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    if (reducedMotion) {
      onEnd?.();
      return;
    }
    let raf = 0;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onEnd?.();
    };
    const start = performance.now();
    const loop = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION_MS);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      if (pathRef.current) pathRef.current.setAttribute("d", arcPath(e));
      if (tintRef.current) tintRef.current.style.opacity = String(Math.min(1, e * 2.2) * 0.3);
      if (p < 1) raf = requestAnimationFrame(loop);
      else finish();
    };
    raf = requestAnimationFrame(loop);
    // rAF stalls in a background tab — never leave the wipe half-drawn
    const guard = setTimeout(finish, DURATION_MS + 400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(guard);
    };
  }, [active, reducedMotion, onEnd]);

  if (!active || reducedMotion) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, pointerEvents: "none" }} aria-hidden="true">
      <div ref={tintRef} style={{ position: "absolute", inset: 0, background: "var(--sd-ink)", opacity: 0 }} />
      <svg viewBox="0 0 100 140" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <path ref={pathRef} d={arcPath(0)} fill="#fff" />
      </svg>
    </div>
  );
}
