"use client";

import { useEffect, useRef, useState } from "react";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { SkillGraph } from "@/components/graphics/SkillGraph";
import { SkillHeading } from "@/components/typography/SkillHeading";
import { LevelDots } from "@/components/graphics/LevelDots";
import { SKILLS, SITE } from "@/lib/content";
import { pickSkillGraphBase, scaleSkillGraphConfig } from "./skillGraphConfig";
import styles from "./SkillsScreen.module.css";

const NODES = SKILLS.map((s) => ({ label: s.name, parent: s.parent }));

/** Навыки — a force-directed graph of the toolchain (SkillGraph) with a per-node info panel,
 *  beside the graph on wide screens, below it on tablet-portrait/mobile. §8 in the motion spec
 *  sequences heading→body→level-dots on select and slides the panel out on deselect; this
 *  screen shows the settled state (no animation), which lands in Phase 3. */
export function SkillsScreen() {
  const [active, setActive] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<ReturnType<typeof scaleSkillGraphConfig> | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const recompute = () => {
      const width = el.clientWidth;
      if (width <= 0) return;
      const orientation = window.matchMedia("(orientation: landscape)").matches ? "landscape" : "portrait";
      const base = pickSkillGraphBase(window.innerWidth, orientation);
      setConfig(scaleSkillGraphConfig(base, width));
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

  const selected = SKILLS.find((s) => s.name === active) ?? null;
  const panelSide = config?.panel ?? "side";

  return (
    <div className={styles.stage}>
      <SiteChrome active="НАВЫКИ" />
      <div className={`${styles.layout} ${panelSide === "below" ? styles.stacked : styles.sideBySide}`}>
        <div ref={containerRef} className={styles.graphWrap}>
          {config ? (
            <SkillGraph
              nodes={NODES}
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

        <div className={styles.panel} style={{ pointerEvents: selected ? "auto" : "none" }}>
          {selected ? (
            <>
              <SkillHeading>{selected.name}</SkillHeading>
              <p className={styles.body}>{selected.body}</p>
              <LevelDots level={selected.level} />
            </>
          ) : (
            <p className={styles.empty}>{SITE.skills.emptyState}</p>
          )}
        </div>
      </div>
    </div>
  );
}
