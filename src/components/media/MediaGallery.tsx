"use client";

import { useState } from "react";
import Image from "next/image";
import { getDictionary, type Locale } from "@/lib/i18n";
import styles from "./MediaGallery.module.css";

export interface MediaGalleryProps {
  images: string[];
  alt: string;
  locale: Locale;
  className?: string;
  /** Opens the current slide (its index within `images`) in the full-screen Lightbox instead of
   *  this inline strip — the inline slider is too small to make out detail on a phone, which is
   *  the specific case this exists for. Omit to leave the frame non-interactive. */
  onPhotoClick?: (index: number) => void;
}

/** A small image slider for the detail page's "Слайдер" slot — real content when the project has
 *  more than one gallery photo in Sanity, otherwise the caller falls back to a single static
 *  image or the flat placeholder. Arrows reuse the thin-shaft line motif from PrevNextLink
 *  rather than the raster icon set, since this is inline chrome, not a page-level control. */
export function MediaGallery({ images, alt, locale, className, onPhotoClick }: MediaGalleryProps) {
  const [index, setIndex] = useState(0);
  const dict = getDictionary(locale);
  if (images.length === 0) return null;

  const go = (delta: number) => setIndex((i) => (i + delta + images.length) % images.length);

  return (
    <div className={`${styles.wrap} ${className ?? ""}`}>
      <div
        className={styles.frame}
        role={onPhotoClick ? "button" : undefined}
        tabIndex={onPhotoClick ? 0 : undefined}
        aria-label={onPhotoClick ? dict.gallery.openPhoto : undefined}
        onClick={onPhotoClick ? () => onPhotoClick(index) : undefined}
        onKeyDown={
          onPhotoClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onPhotoClick(index);
                }
              }
            : undefined
        }
        style={onPhotoClick ? { cursor: "pointer" } : undefined}
      >
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i === 0 ? alt : `${alt} — ${dict.gallery.photoSuffix} ${i + 1}`}
            fill
            sizes="(max-width: 1113px) 100vw, 50vw"
            className={styles.image}
            style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? "auto" : "none" }}
            priority={i === 0}
          />
        ))}
      </div>
      {images.length > 1 ? (
        <div className={styles.controls}>
          <button type="button" aria-label={dict.gallery.prevPhoto} className={styles.arrow} onClick={() => go(-1)}>
            <svg width="18" height="13" viewBox="0 0 18 13" aria-hidden="true">
              <path d="M18 6.5H1M5 1 1 6.5 5 12" strokeWidth="1" fill="none" />
            </svg>
          </button>
          <span className={styles.count}>
            {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </span>
          <button type="button" aria-label={dict.gallery.nextPhoto} className={styles.arrow} onClick={() => go(1)}>
            <svg width="18" height="13" viewBox="0 0 18 13" aria-hidden="true">
              <path d="M0 6.5h17M13 1l4 5.5-4 5.5" strokeWidth="1" fill="none" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
