import { SiteChrome } from "@/components/layout/SiteChrome";
import { FooterLogo } from "@/components/layout/FooterLogo";
import { WorkPhraseAndGrid } from "./WorkPhraseAndGrid";
import type { Project } from "@/lib/content";
import styles from "./WorkScreen.module.css";

export interface WorkScreenProps {
  projects: Project[];
  lede: string;
}

/** Проекты — the section lede assembles word by word over the (hidden) grid, then exits upward
 *  the moment the visitor scrolls, revealing the grid card by card underneath (§6, see
 *  WorkPhraseAndGrid — the interactive half of this screen, since it's driven by scroll
 *  position). 3 columns everywhere except mobile's 2.
 *
 *  fixed={false}: the back button and nav scroll away with the grid on this screen instead of
 *  staying pinned to the viewport, by request — .stage's own position:relative is what the
 *  resulting position:absolute scrolls away within. */
export function WorkScreen({ projects, lede }: WorkScreenProps) {
  return (
    <main className={styles.stage}>
      <SiteChrome active="ПРОЕКТЫ" fixed={false} />
      <div className={styles.layout}>
        <WorkPhraseAndGrid projects={projects} lede={lede} />
        <FooterLogo />
      </div>
    </main>
  );
}
