import Image from "next/image";
import { getDictionary, type Locale } from "@/lib/i18n";
import styles from "./VideoTile.module.css";

export interface VideoTileProps {
  /** Vimeo's own oEmbed thumbnail (fetched server-side, see src/lib/vimeo.ts) — undefined while
   *  unavailable (private video, malformed URL, Vimeo hiccup), in which case this still renders
   *  a working play button on a flat fill, just without a preview image. */
  thumbnailUrl?: string;
  locale: Locale;
  className?: string;
  onClick: () => void;
}

/** A 16:9 poster + play button for the detail page's video slot, matching the gallery photo
 *  tiles right next to it. object-fit: contain, same as the gallery tiles: a vertically-shot
 *  video's own thumbnail shrinks to fit this 16:9 frame instead of being cropped to fill it.
 *
 *  A plain controlled button, not its own modal owner — clicking it opens the same Lightbox the
 *  cover/gallery photos use (via the parent's onClick, landing on this video's slide index),
 *  not a separate video-only lightbox: someone swiping through the fullscreen photo set now runs
 *  into the video too instead of it living in an isolated modal they might never discover. */
export function VideoTile({ thumbnailUrl, locale, className, onClick }: VideoTileProps) {
  const dict = getDictionary(locale);

  return (
    <button type="button" className={`${styles.tile} ${className ?? ""}`} onClick={onClick} aria-label={dict.gallery.openVideo}>
      {thumbnailUrl ? <Image src={thumbnailUrl} alt="" fill sizes="(max-width: 1113px) 100vw, 50vw" className={styles.poster} /> : null}
      <span className={styles.playBadge} aria-hidden="true">
        <svg width="18" height="20" viewBox="0 0 18 20" fill="currentColor">
          <path d="M0 0 18 10 0 20Z" />
        </svg>
      </span>
    </button>
  );
}
