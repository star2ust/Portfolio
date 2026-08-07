"use client";

import { useEffect, useRef, useState } from "react";
import { SectionLede } from "@/components/typography/SectionLede";
import { ProjectCard } from "@/components/media/ProjectCard";
import type { Project } from "@/lib/content";
import styles from "./WorkPhraseAndGrid.module.css";
import gridStyles from "./WorkScreen.module.css";

export interface WorkPhraseAndGridProps {
  projects: Project[];
  lede: string;
}

/** §6 of the motion spec: the lede assembles word by word as the page opens, covering the grid;
 *  the moment the visitor starts scrolling, the phrase exits upward and the grid reveals card by
 *  card underneath, once, for the life of the page (matches the source: `gone` only ever flips
 *  false -> true, scrolling back up doesn't bring the phrase back). A client component since it's
 *  driven entirely by scroll position and a mount timer — WorkScreen itself stays free to be a
 *  server component around it. */
export function WorkPhraseAndGrid({ projects, lede }: WorkPhraseAndGridProps) {
  const words = lede.split(" ");
  const [on, setOn] = useState(false);
  const [gone, setGone] = useState(false);
  const goneRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setOn(true), 320);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const reveal = () => {
      if (goneRef.current) return;
      if (window.scrollY > 24) {
        goneRef.current = true;
        setGone(true);
      }
    };
    reveal(); // already scrolled past 24px on mount (e.g. a hash link) — skip straight to "gone"
    window.addEventListener("scroll", reveal, { passive: true });
    return () => window.removeEventListener("scroll", reveal);
  }, []);

  return (
    <>
      <div
        aria-hidden={gone}
        className={styles.cover}
        style={{
          opacity: gone ? 0 : 1,
          visibility: gone ? "hidden" : "visible",
          transition: "opacity 620ms var(--ease), visibility 0s linear 620ms",
        }}
      >
        <SectionLede className={styles.lede}>
          {words.map((w, i) => (
            <span key={i} className={styles.wordMask}>
              <span
                className={styles.word}
                style={{
                  opacity: on && !gone ? 1 : 0,
                  transform: gone ? "translateY(-105%)" : on ? "translateY(0)" : "translateY(105%)",
                  transition: gone
                    ? `opacity 460ms var(--ease) ${i * 16}ms, transform 620ms var(--ease) ${i * 16}ms`
                    : `opacity 820ms var(--ease) ${i * 90}ms, transform 820ms var(--ease) ${i * 90}ms`,
                }}
              >
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            </span>
          ))}
        </SectionLede>
      </div>

      <div className={gridStyles.grid}>
        {projects.map((p, i) => (
          <div
            key={p.slug}
            style={{
              opacity: gone ? 1 : 0,
              transform: gone ? "translateY(0)" : "translateY(70px)",
              transition: `opacity 720ms var(--ease) ${140 + i * 70}ms, transform 720ms var(--ease) ${140 + i * 70}ms`,
              willChange: "opacity, transform",
            }}
          >
            <ProjectCard
              href={`/work/${p.slug}`}
              title={p.title}
              tech={p.tech}
              year={p.year}
              image={p.image}
              priority={i < 2}
            />
          </div>
        ))}
      </div>
    </>
  );
}
