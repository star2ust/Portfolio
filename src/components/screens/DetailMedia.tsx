"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { MediaGallery } from "@/components/media/MediaGallery";
import { VideoTile } from "@/components/media/VideoTile";
import { Lightbox } from "@/components/media/Lightbox";
import { Appear } from "@/motion/Appear";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { Project } from "@/lib/content";
import styles from "./DetailScreen.module.css";

export interface DetailMediaProps {
  project: Project;
  locale: Locale;
  /** Vimeo's own oEmbed thumbnail, fetched server-side by the page (see src/lib/vimeo.ts) —
   *  undefined when there's no video or the fetch failed, either way VideoTile still renders a
   *  working (just plain) poster. */
  videoThumbnail?: string;
}

/** The detail page's media column: the cover photo, then the video/gallery rail below (mobile/
 *  tablet-portrait) or beside it (landscape+) — split out from DetailScreen as its own client
 *  island specifically to own the Lightbox's open/index state, so DetailScreen itself can stay a
 *  server component for everything else.
 *
 *  The rail is a stack of 16:9 tiles (VideoTile + MediaGallery's photo tiles), not the old narrow
 *  height-driven strip — a portrait-shot gallery photo used to fill that strip nearly
 *  edge-to-edge and read as "one solid vertical photo" rather than a gallery; a 16:9 tile with
 *  object-fit: contain shrinks a portrait photo to fit instead, matching what "compress it and
 *  give it a 16:9 preview" describes.
 *
 *  Clicking the cover photo, or any photo inside the gallery list, opens the same full-screen
 *  Lightbox at that photo's position within the combined [cover, ...gallery] set — "flip through
 *  the photos like in a gallery" from a photo that's otherwise too small to make out on a phone.
 *  Clicking the video tile opens VideoLightbox (see VideoTile) instead of playing inline at rail
 *  size. Not every project has both — a project with neither drops the rail entirely rather than
 *  showing an empty placeholder chip; .imageWrap's own flex:1 in the landscape+ layout absorbs
 *  the freed space automatically.
 *
 *  Two different shapes live here, CSS-toggled by breakpoint (see DetailScreen.module.css's
 *  .compactStrip/.imageWrap comments): mobile/tablet-portrait gets one flat horizontally-
 *  swipeable strip — cover, video, and every gallery photo as equal peer slides, so the cover
 *  photo and the rest of the gallery aren't two separate blocks each eating their own chunk of
 *  vertical space. Landscape+ keeps the original cover-left/rail-right split. Both branches share
 *  the same lightboxIndex/click semantics — clicking a photo slide in either one opens the same
 *  Lightbox at the same index.
 *
 *  The strip scrolls fine by touch/swipe on its own, but nothing about a row of same-sized tiles
 *  signals "there's more to the right" — arrowLeft/arrowRight are a plain affordance (visible on
 *  every breakpoint the strip itself is visible on, i.e. via touch OR a mouse/trackpad) that
 *  scrollBy() one slide's own measured width, not a guessed constant, so this keeps working if a
 *  slide's own size ever changes without this file's own math needing to track it. */
export function DetailMedia({ project, locale, videoThumbnail }: DetailMediaProps) {
  const dict = getDictionary(locale);
  const gallery = project.gallery ?? [];
  const combined = [project.image, ...gallery];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const hasGallery = gallery.length > 0;
  const hasRail = Boolean(project.vimeoUrl) || hasGallery;
  const stripRef = useRef<HTMLDivElement>(null);

  const scrollStrip = (direction: 1 | -1) => {
    const strip = stripRef.current;
    if (!strip) return;
    const firstSlide = strip.firstElementChild as HTMLElement | null;
    const step = (firstSlide?.getBoundingClientRect().width ?? strip.clientWidth) + 8; // + .compactStrip's own gap
    strip.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <>
      <Appear delay={0} from="up" className={styles.mediaCol}>
        <div className={styles.compactStripWrap}>
          {hasRail ? (
            <>
              <button
                type="button"
                className={`${styles.compactArrow} ${styles.compactArrowLeft}`}
                onClick={() => scrollStrip(-1)}
                aria-label={dict.gallery.scrollPrev}
              >
                <svg width="14" height="10" viewBox="0 0 18 13" aria-hidden="true">
                  <path d="M18 6.5H1M5 1 1 6.5 5 12" strokeWidth="1" fill="none" />
                </svg>
              </button>
              <button
                type="button"
                className={`${styles.compactArrow} ${styles.compactArrowRight}`}
                onClick={() => scrollStrip(1)}
                aria-label={dict.gallery.scrollNext}
              >
                <svg width="14" height="10" viewBox="0 0 18 13" aria-hidden="true">
                  <path d="M0 6.5h17M13 1l4 5.5-4 5.5" strokeWidth="1" fill="none" />
                </svg>
              </button>
            </>
          ) : null}
          <div className={styles.compactStrip} ref={stripRef}>
            <button
              type="button"
              className={styles.compactSlide}
              onClick={() => setLightboxIndex(0)}
              aria-label={dict.gallery.openPhoto}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="100vw"
                className={styles.compactSlideCoverImg}
                priority
              />
            </button>
            {project.vimeoUrl ? (
              // A plain wrapper, not className={styles.compactSlide} merged directly onto
              // VideoTile's own button (like .videoSlot does in the landscape+ rail below) —
              // VideoTile's own .tile already sets width/aspect-ratio/background, and those
              // collide with .compactSlide's *different* values for the same properties. Which
              // one wins is undefined (equal specificity, cross-file source order), and in
              // practice VideoTile's own width: 100% won, stretching the slide to the container's
              // *full* width instead of matching its siblings, with .compactSlide's background:
              // transparent on top of that hiding the tile entirely. A separate wrapper div sidesteps
              // the conflict outright — VideoTile keeps its own untouched internal sizing, which
              // naturally lands on the same 16:9 shape as the wrapper around it instead of fighting it.
              <div className={styles.compactSlide}>
                <VideoTile
                  vimeoUrl={project.vimeoUrl}
                  title={`${project.title} — ${dict.detail.videoTitleSuffix}`}
                  thumbnailUrl={videoThumbnail}
                  locale={locale}
                />
              </div>
            ) : null}
            {gallery.map((src, i) => (
              <button
                key={`compact-${i}-${src}`}
                type="button"
                className={styles.compactSlide}
                onClick={() => setLightboxIndex(i + 1)}
                aria-label={dict.gallery.openPhoto}
              >
                <Image
                  src={src}
                  alt={`${project.title} — ${dict.gallery.photoSuffix} ${i + 1}`}
                  fill
                  sizes="100vw"
                  className={styles.compactSlidePhoto}
                />
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={styles.imageWrap}
          onClick={() => setLightboxIndex(0)}
          aria-label={dict.gallery.openPhoto}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 1113px) 100vw, 50vw"
            className={styles.image}
          />
        </button>
        {hasRail ? (
          <div className={styles.mediaRail}>
            {project.vimeoUrl ? (
              <VideoTile
                vimeoUrl={project.vimeoUrl}
                title={`${project.title} — ${dict.detail.videoTitleSuffix}`}
                thumbnailUrl={videoThumbnail}
                locale={locale}
                className={styles.videoSlot}
              />
            ) : null}
            {hasGallery ? (
              <MediaGallery
                images={gallery}
                alt={project.title}
                locale={locale}
                className={styles.sliderSlot}
                onPhotoClick={(i) => setLightboxIndex(i + 1)}
              />
            ) : null}
          </div>
        ) : null}
      </Appear>

      {lightboxIndex != null ? (
        <Lightbox
          images={combined}
          alt={project.title}
          index={lightboxIndex}
          locale={locale}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      ) : null}
    </>
  );
}
