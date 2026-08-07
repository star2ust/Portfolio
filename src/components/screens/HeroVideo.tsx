"use client";

import { useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/motion/useReducedMotion";
import styles from "./HeroScreen.module.css";

/**
 * The Hero's full-bleed background video. Split out as its own client component so the rest of
 * HeroScreen can stay a server component, and so it can check prefers-reduced-motion: an
 * indefinitely-looping autoplaying video with no pause control is a real WCAG 2.2.2 (Pause,
 * Stop, Hide) gap — for reduced-motion users this shows the poster frame instead of playing,
 * rather than adding a visible pause button just for this one background element.
 *
 * The poster is a next/image (not the <video poster> attribute) so it gets the same responsive
 * srcset/AVIF-WebP treatment as every other image on the site — Lighthouse flagged the raw
 * attribute for shipping a full desktop-width poster to phones with no way to size down.
 */
export function HeroVideo() {
  const reducedMotion = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);

  return (
    <div className={styles.videoWrap}>
      <Image
        src="/images/hero/poster.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.video}
        style={{ opacity: videoReady && !reducedMotion ? 0 : 1 }}
      />
      {!reducedMotion && (
        <video
          className={styles.video}
          style={{ opacity: videoReady ? 1 : 0 }}
          src="/images/hero/BookRender1.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          onCanPlay={() => setVideoReady(true)}
        />
      )}
    </div>
  );
}
