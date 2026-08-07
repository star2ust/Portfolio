import Image from "next/image";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { MediaPlaceholder } from "@/components/media/MediaPlaceholder";
import { MediaGallery } from "@/components/media/MediaGallery";
import { VideoEmbed } from "@/components/media/VideoEmbed";
import { ProjectMeta } from "@/components/media/ProjectMeta";
import { PrevNextLink } from "@/components/navigation/PrevNextLink";
import { Appear } from "@/motion/Appear";
import { GrowRule } from "@/motion/GrowRule";
import type { Project } from "@/lib/content";
import styles from "./DetailScreen.module.css";

export interface DetailScreenProps {
  project: Project;
  prev: Project;
  next: Project;
}

/** Project detail — text column left, media column right (tablet-landscape and up) or media
 *  above text (tablet-portrait/mobile), a pager pinned at the bottom. §7: text blocks slide in
 *  left→right with opacity, rules grow from centre. The transition into/out of this page is a
 *  fade rather than the arc (see RouteTransition). The site nav is hidden here entirely (source:
 *  `Chrome menu={false}`) — the close (×) button is the only way out.
 *
 *  The whole screen holds to one viewport, no page scroll, on every breakpoint — matching the
 *  source's fixed 1080-tall canvas — by fixing .stage's height and letting only .textCol scroll
 *  internally if a project's description/tasks/result run long (.textCol's own overflow-y,
 *  not the page's). The media column sits beside the text (image + a narrow video/slider rail),
 *  not stacked under it.
 *
 *  The image fades in with the rest of the media column (a plain Appear, no other motion) —
 *  the source's own FLIP hand-off, flying the clicked grid card's image into this slot, was
 *  tried and then deliberately dropped in favor of this simpler fade, by request. The footer
 *  mark is intentionally omitted here, same as the source — it would sit over "Предыдущий".
 *
 *  The video/slider rail: the source bundle itself ships these as "labelled placeholders" —
 *  project/ui_kits/portfolio/README.md calls them "deliberately unfinished, as in the source."
 *  Once a project has real `gallery`/`vimeoUrl` values in Sanity, this renders an actual photo
 *  slider and a Vimeo embed in that rail instead; a project with neither still falls back to the
 *  flat placeholder chips, so an empty CMS entry never renders a broken player. */
export function DetailScreen({ project, prev, next }: DetailScreenProps) {
  return (
    <main className={styles.stage}>
      <SiteChrome icon="close" backHref="/work" menu={false} />
      <div className={styles.layout}>
        <div className={styles.contentRow}>
          <Appear delay={0} from="up" className={styles.mediaCol}>
            <div className={styles.imageWrap}>
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 1113px) 100vw, 50vw"
                className={styles.image}
              />
            </div>
            <div className={styles.mediaRail}>
              {project.vimeoUrl ? (
                <VideoEmbed vimeoUrl={project.vimeoUrl} title={`${project.title} — видео`} className={styles.videoSlot} />
              ) : (
                <MediaPlaceholder kind="video" label="Видео" className={styles.videoSlot} />
              )}
              {project.gallery && project.gallery.length > 0 ? (
                <MediaGallery images={project.gallery} alt={project.title} className={styles.sliderSlot} />
              ) : (
                <MediaPlaceholder kind="image" label="Слайдер" className={styles.sliderSlot} />
              )}
            </div>
          </Appear>

          <div className={styles.textCol}>
            <Appear delay={60}>
              <span className={styles.index}>{project.index}</span>
            </Appear>
            <Appear delay={120}>
              <h1 className={styles.title}>{project.title}</h1>
            </Appear>
            <div className={styles.roleRow}>
              <Appear delay={220}>
                <span className={styles.role}>{project.role}</span>
              </Appear>
              <GrowRule delay={280} />
            </div>
            <Appear delay={340}>
              <p className={styles.body}>{project.body}</p>
            </Appear>
            <Appear delay={440} className={styles.metaRow}>
              <ProjectMeta label="Задачи:" body={project.tasks.join("\n")} />
              <ProjectMeta label="Результат:" body={project.result} />
            </Appear>
          </div>
        </div>

        <div className={styles.pager}>
          <PrevNextLink direction="prev" href={`/work/${prev.slug}`} thumb={prev.image} projectTitle={prev.title} />
          <PrevNextLink direction="next" href={`/work/${next.slug}`} thumb={next.image} projectTitle={next.title} />
        </div>
      </div>
    </main>
  );
}
