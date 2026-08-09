import Image from "next/image";
import { getDictionary, type Locale } from "@/lib/i18n";
import styles from "./MediaGallery.module.css";

export interface MediaGalleryProps {
  images: string[];
  alt: string;
  locale: Locale;
  className?: string;
  /** Opens a photo (its index within `images`) in the full-screen Lightbox — the point of this
   *  list is a quick, legible preview; the Lightbox is where you actually look at a photo.
   *  Omit to render plain (non-interactive) tiles. */
  onPhotoClick?: (index: number) => void;
}

/** The detail page's "Слайдер" slot: every gallery photo as its own 16:9 tile, stacked (not a
 *  one-at-a-time carousel — the source's own gallery photos are frequently shot in portrait, and
 *  a carousel that fills a tall narrow rail with one portrait photo at a time read as "one solid
 *  vertical photo", not a gallery). object-fit: contain, not cover: a portrait photo shrinks to
 *  fit its 16:9 frame with letterboxing (var(--surface-media) fill) instead of being cropped to
 *  fill it — matches the cover photo's own hero crop being the one deliberately-cropped photo on
 *  this page, not every photo on it. */
export function MediaGallery({ images, alt, locale, className, onPhotoClick }: MediaGalleryProps) {
  const dict = getDictionary(locale);
  if (images.length === 0) return null;

  return (
    <div className={`${styles.list} ${className ?? ""}`}>
      {images.map((src, i) => {
        const photoAlt = i === 0 ? alt : `${alt} — ${dict.gallery.photoSuffix} ${i + 1}`;
        const image = <Image src={src} alt={photoAlt} fill sizes="(max-width: 1113px) 100vw, 50vw" className={styles.image} priority={i === 0} />;
        return onPhotoClick ? (
          <button key={`${i}-${src}`} type="button" className={styles.tile} onClick={() => onPhotoClick(i)} aria-label={dict.gallery.openPhoto}>
            {image}
          </button>
        ) : (
          <div key={`${i}-${src}`} className={styles.tile}>
            {image}
          </div>
        );
      })}
    </div>
  );
}
