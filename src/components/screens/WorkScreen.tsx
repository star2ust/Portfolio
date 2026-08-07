import { SiteChrome } from "@/components/layout/SiteChrome";
import { SectionLede } from "@/components/typography/SectionLede";
import { ProjectCard } from "@/components/media/ProjectCard";
import { FooterLogo } from "@/components/layout/FooterLogo";
import { PROJECTS, SITE } from "@/lib/content";
import styles from "./WorkScreen.module.css";

/** Проекты — a section lede, then the work grid (3 columns everywhere except mobile's 2).
 *  §6 in the motion spec scroll-builds the lede word by word and reveals the grid card by
 *  card; this screen renders the settled end-state, motion lands in Phase 3. */
export function WorkScreen() {
  return (
    <div className={styles.stage}>
      <SiteChrome active="ПРОЕКТЫ" />
      <div className={styles.layout}>
        <div className={styles.ledeWrap}>
          <SectionLede className={styles.lede}>{SITE.work.lede}</SectionLede>
        </div>
        <div className={styles.grid}>
          {PROJECTS.map((p, i) => (
            <ProjectCard
              key={p.slug}
              href={`/work/${p.slug}`}
              title={p.title}
              tech={p.tech}
              year={p.year}
              image={p.image}
              priority={i < 2}
            />
          ))}
        </div>
        <FooterLogo />
      </div>
    </div>
  );
}
