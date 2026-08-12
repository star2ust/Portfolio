"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { MediaGallery } from "@/components/media/MediaGallery";
import { VideoTile } from "@/components/media/VideoTile";
import { Lightbox, type LightboxSlide } from "@/components/media/Lightbox";
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
 *  Every clickable slide — cover, video, every gallery photo — opens the *same* Lightbox, landing
 *  on that slide's position within one combined [cover, video?, ...gallery] sequence: swiping
 *  through from a photo runs into the video too instead of it living in a separate modal someone
 *  might swipe straight past without ever noticing. `slides`/the three index helpers below are
 *  the single source of truth for that sequence — everything that can open the Lightbox (both the
 *  compact strip's buttons and the landscape+ rail's) computes its own index from them rather than
 *  hardcoding the offset a video slide shifts gallery photos by.
 *
 *  Not every project has both — a project with neither drops the rail entirely rather than
 *  showing an empty placeholder chip; .imageWrap's own flex:1 in the landscape+ layout absorbs
 *  the freed space automatically.
 *
 *  Two different shapes live here, CSS-toggled by breakpoint (see DetailScreen.module.css's
 *  .compactStrip/.imageWrap comments): mobile/tablet-portrait gets one flat horizontally-
 *  swipeable strip — cover, video, and every gallery photo as equal peer slides, so the cover
 *  photo and the rest of the gallery aren't two separate blocks each eating their own chunk of
 *  vertical space. Landscape+ keeps the original cover-left/rail-right split.
 *
 *  The strip scrolls fine by touch/swipe on its own, but nothing about a row of same-sized tiles
 *  signals "there's more to the right" — arrowLeft/arrowRight are a plain affordance (visible on
 *  every breakpoint the strip itself is visible on, i.e. via touch OR a mouse/trackpad) that
 *  scrollBy() one slide's own measured width, not a guessed constant, so this keeps working if a
 *  slide's own size ever changes without this file's own math needing to track it. */
export function DetailMedia({ project, locale, videoThumbnail }: DetailMediaProps) {
  const dict = getDictionary(locale);
  const gallery = project.gallery ?? [];
  const hasVideo = Boolean(project.vimeoUrl);
  const hasGallery = gallery.length > 0;
  const hasRail = hasVideo || hasGallery;

  // The one shared [cover, video?, ...gallery] sequence every slide's click handler indexes into.
  const slides: LightboxSlide[] = [
    { type: "photo", src: project.image },
    ...(hasVideo ? [{ type: "video", vimeoUrl: project.vimeoUrl! } as const] : []),
    ...gallery.map((src): LightboxSlide => ({ type: "photo", src })),
  ];
  const videoIndex = hasVideo ? 1 : -1;
  const galleryStartIndex = hasVideo ? 2 : 1;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
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
            {hasVideo ? (
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
                <VideoTile thumbnailUrl={videoThumbnail} locale={locale} onClick={() => setLightboxIndex(videoIndex)} />
              </div>
            ) : null}
            {gallery.map((src, i) => (
              <button
                key={`compact-${i}-${src}`}
                type="button"
                className={styles.compactSlide}
                onClick={() => setLightboxIndex(galleryStartIndex + i)}
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
            {hasVideo ? (
              <VideoTile
                thumbnailUrl={videoThumbnail}
                locale={locale}
                className={styles.videoSlot}
                onClick={() => setLightboxIndex(videoIndex)}
              />
            ) : null}
            {hasGallery ? (
              <MediaGallery
                images={gallery}
                alt={project.title}
                locale={locale}
                className={styles.sliderSlot}
                onPhotoClick={(i) => setLightboxIndex(galleryStartIndex + i)}
              />
            ) : null}
          </div>
        ) : null}
      </Appear>

      {lightboxIndex != null ? (
        <Lightbox
          slides={slides}
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
