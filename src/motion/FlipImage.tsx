"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { consumeFlipRect } from "./flip";
import { useReducedMotion } from "./useReducedMotion";

export interface FlipImageProps {
  slug: string;
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}

const DURATION_MS = 620;

/** The detail page's half of the FLIP hand-off: if a grid card stored a rect for this exact
 *  project (ProjectCard's onClick, via flip.ts), the image container animates from that rect to
 *  its real, laid-out position instead of just appearing there — "flies to the detail slot."
 *  No stored rect (direct link, refresh, back/forward) just renders normally, no animation. */
export function FlipImage({ slug, src, alt, sizes, className }: FlipImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [animating, setAnimating] = useState(false);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el || reducedMotion) return;
    const from = consumeFlipRect(slug);
    if (!from) return;

    const to = el.getBoundingClientRect();
    if (to.width === 0 || to.height === 0) return;
    const dx = from.left - to.left;
    const dy = from.top - to.top;
    const sx = from.width / to.width;
    const sy = from.height / to.height;

    setAnimating(true);
    const anim = el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
        { transform: "none" },
      ],
      { duration: DURATION_MS, easing: "cubic-bezier(0.22,0.61,0.36,1)" }
    );
    anim.onfinish = () => setAnimating(false);
    return () => anim.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on mount, for this slug's one-shot rect
  }, [slug]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        position: "relative",
        zIndex: animating ? 60 : undefined,
        transformOrigin: "0 0",
      }}
    >
      <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: "cover" }} priority />
    </div>
  );
}
