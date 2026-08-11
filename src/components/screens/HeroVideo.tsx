"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { markHeroVideoReady } from "@/motion/heroReady";
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
 *
 * The poster is still a real fallback (not decorative — a slow/throttled connection can spend a
 * few real seconds fetching the ~7MB video before *any* frame exists, and a blank/black flash
 * there would read as broken, not "loading"), but it should show for as short a window as
 * physically possible on every kind of visit, first one included, not just feel instant once the
 * video is already warm in the browser's HTTP cache. Two changes push on that: `preload="auto"`
 * + `fetchPriority="high"` tell the browser to fetch the video as aggressively as it fetches
 * anything else on the page instead of leaving it to each browser's own (often conservative,
 * data-saver-aware) default heuristic, and swapping the crossfade trigger from `onCanPlay` (the
 * browser's own, fairly conservative "won't need to stall for more buffering soon" estimate) to
 * `onLoadedData` (fires as soon as the very first frame actually exists) starts playback the
 * moment there's something real to show, rather than waiting for a further buffering margin a
 * muted looping background video doesn't meaningfully need.
 *
 * The remaining case that can't be preload-attribute'd away — a first-ever visit on a slow
 * connection genuinely hasn't received a single frame yet — is covered from the other side: this
 * fires markHeroVideoReady() (see heroReady.ts) on the same onLoadedData, which RouteTransition's
 * Preloader can optionally stay up and wait on so the video is what greets a first-time visitor,
 * not its poster.
 *
 * One more real-world gap the attributes alone don't close: some browsers — most commonly on a
 * data-saver-enabled mobile connection, or inside an in-app/embedded webview (Instagram, etc.) —
 * treat the declarative `autoplay` attribute as a hint they're free to skip, even for a muted
 * video that's always supposed to be autoplay-eligible. When that happens the video still loads
 * (onLoadedData fires, the crossfade happens) but sits frozen on its first frame — visually
 * indistinguishable from "the video never started." The effect below is the standard backstop:
 * an explicit imperative play() call, retried if the browser (or an OS-level interruption —
 * switching apps, a phone call) ever pauses it afterward. play()'s promise rejects rather than
 * throwing when a browser genuinely, deliberately blocks it — caught and ignored, same graceful
 * "just stay on the poster" fallback as the video-not-loaded-yet case. */
export function HeroVideo() {
  const reducedMotion = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const video = videoRef.current;
    if (!video) return;
    const tryPlay = () => {
      video.play().catch(() => {});
    };
    tryPlay();
    video.addEventListener("pause", tryPlay);
    return () => video.removeEventListener("pause", tryPlay);
  }, [reducedMotion]);

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
          ref={videoRef}
          className={styles.video}
          style={{ opacity: videoReady ? 1 : 0 }}
          src="/images/hero/BookRender1.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          // @ts-expect-error -- fetchPriority is a real, standard HTML attribute (React's DOM
          // typings for <video> haven't caught up to it yet, same gap as <img>/<link>).
          fetchPriority="high"
          aria-hidden="true"
          onLoadedData={() => {
            setVideoReady(true);
            markHeroVideoReady();
          }}
        />
      )}
    </div>
  );
}
