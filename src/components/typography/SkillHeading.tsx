"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import styles from "./SkillHeading.module.css";

export interface SkillHeadingProps {
  children: ReactNode;
  mark?: boolean;
  style?: CSSProperties;
}

const MIN_SCALE = 0.42; // floor so a very narrow panel can't shrink the name past legibility

/** 58px skill name + ↗ mark, on a hairline. Heading for the Skills info panel.
 *
 *  --fs-skill is one flat size for every breakpoint (no per-breakpoint token ladder) — that's
 *  fine for short names ("Unity", "Figma") but a long, unbroken one ("TouchDesigner",
 *  "Photogrammetry") genuinely doesn't fit a narrow mobile panel at 58px and was clipping
 *  ("TouchDesig..."), since .title is white-space:nowrap by design (see its own rule). Rather
 *  than pick one flat smaller size that under-uses the space for short names, this measures its
 *  own natural (unscaled) width against the available container width and scales down only the
 *  words that actually need it, down to MIN_SCALE. Scales via font-size (not a CSS transform,
 *  which would leave the element's layout box at its full unscaled width and risk overflow
 *  further up the tree) so the shrunk heading's *box* actually gets narrower too. useLayoutEffect
 *  (not useEffect): runs before paint, so there's no visible flash of the oversized/clipped text
 *  first — same pattern as useReducedMotion/WorkPhraseAndGrid elsewhere in this app for a
 *  hydration-safe browser-API read. */
export function SkillHeading({ children, mark = true, style }: SkillHeadingProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const title = titleRef.current;
    if (!wrap || !title) return;

    const measure = () => {
      const prevFontSize = title.style.fontSize;
      title.style.fontSize = ""; // fall back to the CSS var(--fs-skill) base size to measure it
      const natural = title.scrollWidth;
      title.style.fontSize = prevFontSize;
      const available = wrap.clientWidth;
      if (natural <= 0 || available <= 0) return;
      const next = natural > available ? Math.max(available / natural, MIN_SCALE) : 1;
      setScale((prev) => (Math.abs(prev - next) > 0.005 ? next : prev));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [children]);

  return (
    <div ref={wrapRef} className={styles.wrap} style={style}>
      <div className={styles.row}>
        <h2
          ref={titleRef}
          className={styles.title}
          style={scale < 1 ? { fontSize: `calc(var(--fs-skill) * ${scale})` } : undefined}
        >
          {children}
        </h2>
        {mark ? (
          <Image src="/icons/arrow-diagonal.png" alt="" width={35} height={35} className={styles.mark} />
        ) : null}
      </div>
      <div className={styles.rule} />
    </div>
  );
}
