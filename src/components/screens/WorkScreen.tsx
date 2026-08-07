import { SiteChrome } from "@/components/layout/SiteChrome";
import { SectionLede } from "@/components/typography/SectionLede";
import { ProjectCard } from "@/components/media/ProjectCard";
import { FooterLogo } from "@/components/layout/FooterLogo";
import { Appear } from "@/motion/Appear";
import { RevealOnScroll } from "@/motion/RevealOnScroll";
import { PROJECTS, SITE } from "@/lib/content";
import styles from "./WorkScreen.module.css";

/** Проекты — a section lede, then the work grid (3 columns everywhere except mobile's 2).
 *
 *  §6 in the source scroll-builds the lede word by word, then exits it and reveals the grid
 *  card by card as you keep scrolling. Simplified here to: the lede fades/rises in on load, and
 *  each card reveals as it scrolls into view (RevealOnScroll) — the word-by-word phrase
 *  build/exit choreography is a meaningfully bigger, lower-value piece left for later. */
export function WorkScreen() {
  return (
    <div className={styles.stage}>
      <SiteChrome active="ПРОЕКТЫ" />
      <div className={styles.layout}>
        <Appear delay={0} from="up" className={styles.ledeWrap}>
          <SectionLede className={styles.lede}>{SITE.work.lede}</SectionLede>
        </Appear>
        <div className={styles.grid}>
          {PROJECTS.map((p, i) => (
            <RevealOnScroll key={p.slug} delay={(i % 3) * 70}>
              <ProjectCard
                href={`/work/${p.slug}`}
                title={p.title}
                tech={p.tech}
                year={p.year}
                image={p.image}
                priority={i < 2}
              />
            </RevealOnScroll>
          ))}
        </div>
        <FooterLogo />
      </div>
    </div>
  );
}
