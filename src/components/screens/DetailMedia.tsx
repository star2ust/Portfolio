"use client";

import { useState } from "react";
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
 *  the freed space automatically. */
export function DetailMedia({ project, locale, videoThumbnail }: DetailMediaProps) {
  const dict = getDictionary(locale);
  const combined = [project.image, ...(project.gallery ?? [])];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const hasGallery = (project.gallery?.length ?? 0) > 0;
  const hasRail = Boolean(project.vimeoUrl) || hasGallery;

  return (
    <>
      <Appear delay={0} from="up" className={styles.mediaCol}>
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
                images={project.gallery!}
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
