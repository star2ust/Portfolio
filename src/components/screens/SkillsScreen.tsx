"use client";

import { useEffect, useRef, useState } from "react";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { FooterLogo } from "@/components/layout/FooterLogo";
import { SkillGraph } from "@/components/graphics/SkillGraph";
import { SkillHeading } from "@/components/typography/SkillHeading";
import { LevelDots } from "@/components/graphics/LevelDots";
import { Appear } from "@/motion/Appear";
import type { Skill } from "@/lib/content";
import { pickSkillGraphBase, scaleSkillGraphConfig } from "./skillGraphConfig";
import styles from "./SkillsScreen.module.css";

export interface SkillsScreenProps {
  skills: Skill[];
  emptyState: string;
}

type PanelState = "hidden" | "entering" | "shown" | "exiting";

/** Навыки — a force-directed graph of the toolchain (SkillGraph) with a per-node info panel,
 *  beside the graph on wide screens, below it on tablet-portrait/mobile.
 *
 *  §8: selecting a node from no-selection sequences heading→body→level-dots in; switching
 *  straight to a different node swaps the text instantly, no animation; deselecting (clicking
 *  empty space) slides the whole panel out to the right and fades it; selecting again replays
 *  the entrance. */
export function SkillsScreen({ skills, emptyState }: SkillsScreenProps) {
  const [active, setActive] = useState<string | null>(null);
  const [displayed, setDisplayed] = useState<Skill | null>(null);
  const [panelState, setPanelState] = useState<PanelState>("hidden");
  const nodes = skills.map((s) => ({ label: s.name, parent: s.parent }));

  // React's documented "adjust state during render" pattern: derive displayed/panelState the
  // instant `active` changes, without a useEffect round-trip. See
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevActive, setPrevActive] = useState<string | null>(null);
  if (active !== prevActive) {
    setPrevActive(active);
    if (active) {
      setDisplayed(skills.find((s) => s.name === active) ?? null);
      setPanelState(prevActive ? "shown" : "entering"); // swap instantly vs. sequence in
    } else {
      setPanelState("exiting");
    }
  }

  // Timed follow-ups: once "entering"/"exiting" has had time to play, settle into the end state.
  useEffect(() => {
    if (panelState === "entering") {
      const t = setTimeout(() => setPanelState("shown"), 700);
      return () => clearTimeout(t);
    }
    if (panelState === "exiting") {
      const t = setTimeout(() => {
        setPanelState("hidden");
        setDisplayed(null);
      }, 460);
      return () => clearTimeout(t);
    }
  }, [panelState]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<ReturnType<typeof scaleSkillGraphConfig> | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const recompute = () => {
      const width = el.clientWidth;
      const height = el.clientHeight;
      if (width <= 0 || height <= 0) return;
      const orientation = window.matchMedia("(orientation: landscape)").matches ? "landscape" : "portrait";
      const base = pickSkillGraphBase(window.innerWidth, orientation);
      setConfig(scaleSkillGraphConfig(base, width, height));
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    window.addEventListener("orientationchange", recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", recompute);
    };
  }, []);

  const panelSide = config?.panel ?? "side";
  const exiting = panelState === "exiting";
  const entering = panelState === "entering";

  return (
    <main className={styles.stage}>
      <SiteChrome active="НАВЫКИ" />
      <div className={`${styles.layout} ${panelSide === "below" ? styles.stacked : styles.sideBySide}`}>
        <div ref={containerRef} className={styles.graphWrap}>
          {config ? (
            <SkillGraph
              nodes={nodes}
              active={active ?? undefined}
              onSelect={setActive}
              onDeselect={() => setActive(null)}
              width={config.width}
              height={config.height}
              centerX={config.centerX}
              centerY={config.centerY}
              radius={config.radius}
              dot={config.dot}
              hub={config.hub}
              fontSize={config.fontSize}
            />
          ) : null}
        </div>

        <div
          className={`${styles.panel} ${!displayed ? styles.panelEmpty : ""}`}
          style={{
            pointerEvents: displayed ? "auto" : "none",
            opacity: exiting ? 0 : 1,
            transform: exiting ? "translateX(40px)" : "none",
            transition: exiting ? "opacity 460ms var(--ease), transform 460ms var(--ease)" : "none",
          }}
        >
          {displayed ? (
            entering ? (
              <>
                <Appear delay={0}>
                  <SkillHeading mark={false}>{displayed.name}</SkillHeading>
                </Appear>
                <Appear delay={160}>
                  <p className={styles.body}>{displayed.body}</p>
                </Appear>
                <Appear delay={320}>
                  <LevelDots level={displayed.level} style={{ paddingTop: 40 }} />
                </Appear>
              </>
            ) : (
              <>
                <SkillHeading mark={false}>{displayed.name}</SkillHeading>
                <p className={styles.body}>{displayed.body}</p>
                <LevelDots level={displayed.level} style={{ paddingTop: 40 }} />
              </>
            )
          ) : (
            <p className={styles.empty}>{emptyState}</p>
          )}
        </div>

        <FooterLogo className={styles.footerLogo} />
      </div>
    </main>
  );
}
