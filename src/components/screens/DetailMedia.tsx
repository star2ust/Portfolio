"use client";

import { useState } from "react";
import Image from "next/image";
import { MediaPlaceholder } from "@/components/media/MediaPlaceholder";
import { MediaGallery } from "@/components/media/MediaGallery";
import { VideoEmbed } from "@/components/media/VideoEmbed";
import { Lightbox } from "@/components/media/Lightbox";
import { Appear } from "@/motion/Appear";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { Project } from "@/lib/content";
import styles from "./DetailScreen.module.css";

export interface DetailMediaProps {
  project: Project;
  locale: Locale;
}

/** The detail page's media column (cover photo + video/slider rail) — split out from
 *  DetailScreen as its own client island specifically to own the Lightbox's open/index state,
 *  so DetailScreen itself can stay a server component for everything else.
 *
 *  Clicking the cover photo, or any photo inside the inline slider, opens the same full-screen
 *  Lightbox at that photo's position within the combined [cover, ...gallery] set — "flip
 *  through the photos like in a gallery" from a photo that's otherwise too small to make out on
 *  a phone (§13 of the mobile test-round feedback). A project with no gallery still gets a
 *  working lightbox with just the one (cover) photo — no arrows, just the enlarge. */
export function DetailMedia({ project, locale }: DetailMediaProps) {
  const dict = getDictionary(locale);
  const combined = [project.image, ...(project.gallery ?? [])];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
        <div className={styles.mediaRail}>
          {project.vimeoUrl ? (
            <VideoEmbed
              vimeoUrl={project.vimeoUrl}
              title={`${project.title} — ${dict.detail.videoTitleSuffix}`}
              className={styles.videoSlot}
            />
          ) : (
            <MediaPlaceholder kind="video" label={dict.detail.video} className={styles.videoSlot} />
          )}
          {project.gallery && project.gallery.length > 0 ? (
            <MediaGallery
              images={project.gallery}
              alt={project.title}
              locale={locale}
              className={styles.sliderSlot}
              onPhotoClick={(i) => setLightboxIndex(i + 1)}
            />
          ) : (
            <MediaPlaceholder kind="image" label={dict.detail.slider} className={styles.sliderSlot} />
          )}
        </div>
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
