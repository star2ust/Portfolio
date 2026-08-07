"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

// §5 — a small star seeds, grows into the full four-point star, then the compass ring draws in
// clockwise around it. Ported and available, but not mounted anywhere yet — same state as the
// source (project/ui_kits/portfolio/README.md: "built and ready but not yet mounted on a
// screen"). Per §6 it's meant to open the Projects section before the scroll-driven phrase.
function pie(deg: number): string {
  const pts = ["50% 50%"];
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const a = ((-95 + (deg * i) / steps) * Math.PI) / 180;
    pts.push(`${50 + Math.cos(a) * 160}% ${50 + Math.sin(a) * 160}%`);
  }
  return `polygon(${pts.join(",")})`;
}

export interface LogoIntroProps {
  onDone?: () => void;
  tone?: "invert" | "default";
  /** render just the mark (no full-screen black backdrop) — e.g. resting in place after intro */
  bare?: boolean;
  size?: number;
}

export function LogoIntro({ onDone, tone = "invert", bare = false, size = 190 }: LogoIntroProps) {
  const reducedMotion = useReducedMotion();
  // 0 seed · 1 star grown · 2 ring drawing · 3 whole mark — starts at the end state when reduced
  // motion is on, so there's no setState-in-effect for that branch, just the onDone() call below.
  const [stage, setStage] = useState(() => (reducedMotion ? 3 : 0));
  const ringEl = useRef<HTMLDivElement>(null);

  const w = size * (115 / 140);
  const ink = tone === "invert" ? "#fff" : "var(--sd-ink)";

  useEffect(() => {
    if (reducedMotion) {
      onDone?.();
      return;
    }
    const a = setTimeout(() => setStage(1), 80);
    const b = setTimeout(() => setStage(2), 900);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [reducedMotion, onDone]);

  useEffect(() => {
    if (stage !== 2 || reducedMotion) return;
    let raf = 0;
    let done = false;
    const start = performance.now();
    const dur = 820;
    const finish = () => {
      if (done) return;
      done = true;
      if (ringEl.current) ringEl.current.style.clipPath = "none";
      setStage(3);
      setTimeout(() => onDone?.(), 420);
    };
    const loop = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      if (ringEl.current) ringEl.current.style.clipPath = pie(Math.max(0.001, e) * 360);
      if (p < 1) raf = requestAnimationFrame(loop);
      else finish();
    };
    raf = requestAnimationFrame(loop);
    const guard = setTimeout(finish, dur + 400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(guard);
    };
  }, [stage, reducedMotion, onDone]);

  const mark = {
    WebkitMaskImage: "url(/logo.png)",
    maskImage: "url(/logo.png)",
    WebkitMaskSize: "contain" as const,
    maskSize: "contain" as const,
    WebkitMaskRepeat: "no-repeat" as const,
    maskRepeat: "no-repeat" as const,
    WebkitMaskPosition: "center" as const,
    maskPosition: "center" as const,
    background: ink,
    position: "absolute" as const,
    inset: 0,
  };
  const grown = stage >= 1;

  return (
    <div
      style={
        bare
          ? { position: "relative", width: w, height: size }
          : { position: "fixed", inset: 0, background: "#000", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center" }
      }
    >
      <div style={{ position: "relative", width: w, height: size }}>
        <div
          style={{
            ...mark,
            clipPath: "ellipse(13% 50% at 50% 50%)",
            transform: grown ? "scale(1)" : "scale(0.14)",
            opacity: grown ? 1 : 0,
            transition: "transform 720ms var(--ease), opacity 340ms var(--ease)",
          }}
        />
        <div
          style={{
            ...mark,
            clipPath: "ellipse(24% 7% at 50% 47%)",
            transform: grown ? "scale(1)" : "scale(0.14)",
            opacity: grown ? 1 : 0,
            transition: "transform 720ms var(--ease) 90ms, opacity 340ms var(--ease) 90ms",
          }}
        />
        <div ref={ringEl} style={{ ...mark, clipPath: stage >= 3 ? "none" : pie(0.001), opacity: stage >= 2 ? 1 : 0 }} />
      </div>
    </div>
  );
}
