"use client";

import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { IconButton } from "@/components/core/IconButton";
import { VideoEmbed } from "@/components/media/VideoEmbed";
import { getDictionary, type Locale } from "@/lib/i18n";
import styles from "./Lightbox.module.css";

export type LightboxSlide = { type: "photo"; src: string } | { type: "video"; vimeoUrl: string };

export interface LightboxProps {
  slides: LightboxSlide[];
  alt: string;
  index: number;
  locale: Locale;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/** Full-screen viewer for the detail page: dims everything behind it and steps through the same
 *  combined [cover, video?, ...gallery] set the compact strip and rail both use — a video slide
 *  isn't a separate modal off to the side, it's a real stop in this same sequence, so someone
 *  swiping through photos runs into it rather than possibly never noticing it exists. A photo
 *  slide shows at full size (object-fit: contain, nothing cropped); a video slide plays inline
 *  here (autoplay — opening a lightbox already *is* the "play it" gesture, same reasoning
 *  VideoLightbox used before this merged into here). Arrow keys, swipe, and on-screen arrows all
 *  drive the same onNavigate callback; the parent (DetailMedia) owns the open/index state so this
 *  stays a plain controlled view. */
export function Lightbox({ slides, alt, index, locale, onClose, onNavigate }: LightboxProps) {
  const dict = getDictionary(locale);
  const count = slides.length;
  const slide = slides[index];
  // Numbered among photo slides only, not the raw slide index — a video slide interleaved
  // between photos shouldn't skip a number or get counted as one.
  const photoNumber = slides.slice(0, index + 1).filter((s) => s.type === "photo").length;
  const touchStartX = useRef<number | null>(null);

  const go = useCallback((delta: number) => onNavigate((index + delta + count) % count), [index, count, onNavigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && count > 1) go(-1);
      else if (e.key === "ArrowRight" && count > 1) go(1);
    };
    window.addEventListener("keydown", onKey);
    // Lock page scroll behind the modal while it's open, restore whatever was there on close.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, go, count]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || count <= 1) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return; // not a deliberate swipe
    go(delta < 0 ? 1 : -1);
  };

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      style={{ "--icon-tint": "#fff" } as CSSProperties}
    >
      <IconButton
        icon="close"
        size={34}
        label={dict.aria.close}
        className={styles.closeBtn}
        onClick={onClose}
      />

      <div className={styles.stage} onClick={(e) => e.stopPropagation()} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {slide.type === "video" ? (
          <VideoEmbed key={slide.vimeoUrl} vimeoUrl={slide.vimeoUrl} title={`${alt} — ${dict.detail.videoTitleSuffix}`} autoplay className={styles.video} />
        ) : (
          <Image
            key={slide.src}
            src={slide.src}
            alt={photoNumber === 1 ? alt : `${alt} — ${dict.gallery.photoSuffix} ${photoNumber}`}
            fill
            sizes="100vw"
            className={styles.image}
            priority
          />
        )}
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            aria-label={dict.gallery.prevPhoto}
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
          >
            <svg width="18" height="13" viewBox="0 0 18 13" aria-hidden="true">
              <path d="M18 6.5H1M5 1 1 6.5 5 12" strokeWidth="1" fill="none" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={dict.gallery.nextPhoto}
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
          >
            <svg width="18" height="13" viewBox="0 0 18 13" aria-hidden="true">
              <path d="M0 6.5h17M13 1l4 5.5-4 5.5" strokeWidth="1" fill="none" />
            </svg>
          </button>
          <span className={styles.count}>
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
        </>
      ) : null}
    </div>
  );
}
