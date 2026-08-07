import Image from "next/image";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { MediaPlaceholder } from "@/components/media/MediaPlaceholder";
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

/** Project detail — text column (index, title, role, body, Задачи/Результат) beside the media
 *  column (desktop/laptop/tablet-landscape) or above it (tablet-portrait/mobile), a pager below.
 *
 *  §7: text blocks slide in left→right with opacity, rules grow from centre. The transition
 *  into/out of this page is a fade rather than the arc (see RouteTransition). Not implemented:
 *  the FLIP hand-off that flies the clicked grid card's image into the slot here — it needs the
 *  card's click-time bounding rect carried across a real navigation (sessionStorage or a
 *  shared layout), which is a meaningfully bigger piece deferred past this pass; the image
 *  cross-fades in with the rest of the media column instead. The footer mark is intentionally
 *  omitted here, same as the source — it would sit over the "Предыдущий" link. */
export function DetailScreen({ project, prev, next }: DetailScreenProps) {
  return (
    <div className={styles.stage}>
      <SiteChrome icon="close" backHref="/work" />
      <div className={styles.layout}>
        <Appear delay={0} from="up" className={styles.mediaCol}>
          <div className={styles.imageWrap}>
            <Image src={project.image} alt="" fill sizes="(max-width: 1113px) 100vw, 50vw" className={styles.image} />
          </div>
          <div className={styles.placeholderRow}>
            <MediaPlaceholder kind="video" label="Видео" />
            <MediaPlaceholder kind="image" label="Слайдер" />
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

        <div className={styles.pager}>
          <PrevNextLink direction="prev" href={`/work/${prev.slug}`} thumb={prev.image} />
          <PrevNextLink direction="next" href={`/work/${next.slug}`} thumb={next.image} />
        </div>
      </div>
    </div>
  );
}
