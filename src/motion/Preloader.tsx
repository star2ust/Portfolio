"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";
import { heroVideoReady } from "./heroReady";
import styles from "./Preloader.module.css";

// §1 — full black screen, abstract glyphs (Micra + Montserrat characters) cycling in place.
const GLYPHS = "✦✧✳✷✸✹※◆◇◈◉○●△▽◁▷⬦⬧⌁⌖⍟⍜⎔⌬⏣⟡⟠⧫⧉⧗⧖".split("");
const GLYPH_COUNT = 7;
const CYCLE_MS = 160;
const MIN_VISIBLE_MS = 640; // "minimum one full cycle" — reads as intentional, not a glitch
const SAFETY_CAP_MS = 2500;
// A visit that lands directly on the Hero waits a good deal longer if it has to — the Hero video
// is a real ~7MB download, worth genuinely waiting on so the visitor never sees its poster
// image — but still gives up eventually rather than holding the site shut over a stalled/blocked
// request (a network hiccup, an ad-blocker on the video host, whatever).
const SAFETY_CAP_WITH_HERO_MS = 4500;

export interface PreloaderProps {
  /** stable across renders (e.g. a useCallback with an empty dep array) — this effect re-runs
   *  whenever it changes identity, which would restart the whole sequence. */
  onDone?: () => void;
  /** true when this first-visit's landing route is the Hero — see heroReady.ts. Any other
   *  landing route never mounts HeroVideo, so heroVideoReady would just sit unresolved and this
   *  must not be awaited in that case. */
  waitForHero?: boolean;
}

/**
 * Runs until assets are ready (document.fonts.ready — the real signal, unlike the prototype's
 * fixed timer) with a minimum visible time so it never just flashes, and a safety cap so a
 * font load that never settles can't hang the site open.
 */
export function Preloader({ onDone, waitForHero = false }: PreloaderProps) {
  const [chars, setChars] = useState<string[]>(() => Array.from({ length: GLYPH_COUNT }, () => GLYPHS[0]));
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      onDone?.();
      return;
    }
    const spin = setInterval(() => {
      setChars((c) => c.map(() => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]));
    }, CYCLE_MS);

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      clearInterval(spin);
      onDone?.();
    };

    const ready = typeof document !== "undefined" && "fonts" in document ? document.fonts.ready : Promise.resolve();
    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, MIN_VISIBLE_MS));
    const heroSignal = waitForHero ? heroVideoReady : Promise.resolve();
    const safetyCap = new Promise<void>((resolve) =>
      setTimeout(resolve, waitForHero ? SAFETY_CAP_WITH_HERO_MS : SAFETY_CAP_MS),
    );

    Promise.race([Promise.all([ready, minDelay, heroSignal]), safetyCap]).then(finish);

    return () => {
      clearInterval(spin);
      finished = true;
    };
  }, [reducedMotion, onDone, waitForHero]);

  if (reducedMotion) return null;

  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.glyphs}>
        {chars.map((c, i) => (
          <span key={i} className={styles.glyph}>
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
