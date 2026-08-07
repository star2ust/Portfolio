import Image from "next/image";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { Rule } from "@/components/core/Rule";
import { MediaPlaceholder } from "@/components/media/MediaPlaceholder";
import { ProjectMeta } from "@/components/media/ProjectMeta";
import { PrevNextLink } from "@/components/navigation/PrevNextLink";
import { getAdjacentProjects, type Project } from "@/lib/content";
import styles from "./DetailScreen.module.css";

export interface DetailScreenProps {
  project: Project;
}

/** Project detail — text column (index, title, role, body, Задачи/Результат) beside the media
 *  column (desktop/laptop/tablet-landscape) or above it (tablet-portrait/mobile), a pager below.
 *  §7 in the motion spec is a fade transition with a FLIP hand-off from the grid card and rules
 *  growing from centre; that lands in Phase 3. The footer mark is intentionally omitted here,
 *  same as the source — it would sit over the "Предыдущий" link. */
export function DetailScreen({ project }: DetailScreenProps) {
  const { prev, next } = getAdjacentProjects(project.slug);
  return (
    <div className={styles.stage}>
      <SiteChrome icon="close" backHref="/work" />
      <div className={styles.layout}>
        <div className={styles.mediaCol}>
          <div className={styles.imageWrap}>
            <Image src={project.image} alt="" fill sizes="(max-width: 1113px) 100vw, 50vw" className={styles.image} />
          </div>
          <div className={styles.placeholderRow}>
            <MediaPlaceholder kind="video" label="Видео" />
            <MediaPlaceholder kind="image" label="Слайдер" />
          </div>
        </div>

        <div className={styles.textCol}>
          <span className={styles.index}>{project.index}</span>
          <h1 className={styles.title}>{project.title}</h1>
          <div className={styles.roleRow}>
            <span className={styles.role}>{project.role}</span>
            <Rule tone="hairline" />
          </div>
          <p className={styles.body}>{project.body}</p>
          <div className={styles.metaRow}>
            <ProjectMeta label="Задачи:" body={project.tasks.join("\n")} />
            <ProjectMeta label="Результат:" body={project.result} />
          </div>
        </div>

        <div className={styles.pager}>
          <PrevNextLink direction="prev" href={`/work/${prev.slug}`} thumb={prev.image} />
          <PrevNextLink direction="next" href={`/work/${next.slug}`} thumb={next.image} />
        </div>
      </div>
    </div>
  );
}
