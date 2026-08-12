"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { VideoLightbox } from "@/components/media/VideoLightbox";
import { getDictionary, type Locale } from "@/lib/i18n";
import styles from "./VideoTile.module.css";

export interface VideoTileProps {
  vimeoUrl: string;
  title: string;
  /** Vimeo's own oEmbed thumbnail (fetched server-side, see src/lib/vimeo.ts) — undefined while
   *  unavailable (private video, malformed URL, Vimeo hiccup), in which case this still renders
   *  a working play button on a flat fill, just without a preview image. */
  thumbnailUrl?: string;
  locale: Locale;
  className?: string;
}

/** A 16:9 poster + play button for the detail page's video slot, matching the gallery photo
 *  tiles right next to it — clicking opens VideoLightbox instead of embedding the live player at
 *  this tile's (necessarily modest) size, so the video isn't stuck playing in a "малюсенькое
 *  окошко" (a tiny window). object-fit: contain, same as the gallery tiles: a vertically-shot
 *  video's own thumbnail shrinks to fit this 16:9 frame instead of being cropped to fill it. */
export function VideoTile({ vimeoUrl, title, thumbnailUrl, locale, className }: VideoTileProps) {
  const [open, setOpen] = useState(false);
  const dict = getDictionary(locale);

  return (
    <>
      <button type="button" className={`${styles.tile} ${className ?? ""}`} onClick={() => setOpen(true)} aria-label={dict.gallery.openVideo}>
        {thumbnailUrl ? <Image src={thumbnailUrl} alt="" fill sizes="(max-width: 1113px) 100vw, 50vw" className={styles.poster} /> : null}
        <span className={styles.playBadge} aria-hidden="true">
          <svg width="18" height="20" viewBox="0 0 18 20" fill="currentColor">
            <path d="M0 0 18 10 0 20Z" />
          </svg>
        </span>
      </button>
      {/* Portaled straight to <body>, not rendered in place: VideoTile itself sits nested inside
          DetailMedia's Appear-animated wrapper, which sets a real (non-"none") `transform` for
          the ~1s entrance transition. A `position: fixed` descendant of *any* transformed
          ancestor is sized/positioned against that ancestor's own box, not the viewport — for a
          fast click within that first second, VideoLightbox's "fullscreen" stage measured out at
          the tile's own small size instead of the real viewport. Escaping to `document.body`
          sidesteps this outright, matching how Lightbox (rendered as an Appear-external sibling
          in DetailMedia, never nested inside it) never had the problem in the first place. */}
      {open ? createPortal(<VideoLightbox vimeoUrl={vimeoUrl} title={title} locale={locale} onClose={() => setOpen(false)} />, document.body) : null}
    </>
  );
}
