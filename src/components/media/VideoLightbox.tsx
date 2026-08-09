"use client";

import { useEffect, type CSSProperties } from "react";
import { IconButton } from "@/components/core/IconButton";
import { VideoEmbed } from "@/components/media/VideoEmbed";
import { getDictionary, type Locale } from "@/lib/i18n";
import lightboxStyles from "./Lightbox.module.css";
import styles from "./VideoLightbox.module.css";

export interface VideoLightboxProps {
  vimeoUrl: string;
  title: string;
  locale: Locale;
  onClose: () => void;
}

/** Full-screen video player, the same dark-backdrop chrome as the photo Lightbox (shares that
 *  CSS module's .backdrop/.closeBtn) — opened from VideoTile's poster instead of embedding the
 *  live Vimeo player inline in the (narrow) detail-page rail, which used to play in a "малюсенькое
 *  окошко" (a tiny window) at rail width. Autoplays once opened — that's the one context on this
 *  site where starting playback unprompted is actually the point, since opening this *is* "play
 *  the video". */
export function VideoLightbox({ vimeoUrl, title, locale, onClose }: VideoLightboxProps) {
  const dict = getDictionary(locale);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className={lightboxStyles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      style={{ "--icon-tint": "#fff" } as CSSProperties}
    >
      <IconButton icon="close" size={34} label={dict.aria.close} className={lightboxStyles.closeBtn} onClick={onClose} />
      <div className={styles.stage} onClick={(e) => e.stopPropagation()}>
        <VideoEmbed vimeoUrl={vimeoUrl} title={title} autoplay className={styles.embed} />
      </div>
    </div>
  );
}
