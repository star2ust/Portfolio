"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SectionLede } from "@/components/typography/SectionLede";
import { ProjectCard } from "@/components/media/ProjectCard";
import { consumeReturningToWorkInstant } from "@/motion/workReturnFlag";
import { localeHref, type Locale } from "@/lib/i18n";
import type { Project } from "@/lib/content";
import styles from "./WorkPhraseAndGrid.module.css";
import gridStyles from "./WorkScreen.module.css";

export interface WorkPhraseAndGridProps {
  projects: Project[];
  lede: string;
  locale: Locale;
}

/** §6 of the motion spec: the lede assembles word by word as the page opens, covering the grid;
 *  the moment the visitor starts scrolling, the phrase exits upward and the grid reveals card by
 *  card underneath, once, for the life of the page (matches the source: `gone` only ever flips
 *  false -> true, scrolling back up doesn't bring the phrase back). A client component since it's
 *  driven entirely by scroll position and a mount timer — WorkScreen itself stays free to be a
 *  server component around it.
 *
 *  The intro replays on every fresh visit to /work — it only skips straight to the revealed grid
 *  when returning from a project detail page (matches the source's `instant` prop: "returning
 *  from a project: the grid is simply already there"), tracked via workReturnFlag.ts. */
export function WorkPhraseAndGrid({ projects, lede, locale }: WorkPhraseAndGridProps) {
  const words = lede.split(" ");
  const [on, setOn] = useState(false);
  const [gone, setGone] = useState(false);
  // True only for the "returning from detail" correction below. Belt-and-braces alongside
  // useLayoutEffect: Next.js wraps router.push navigations in startTransition, and a
  // transition-priority commit doesn't reliably get useLayoutEffect's usual "blocks paint until
  // layout effects settle" guarantee the way an urgent update does — confirmed with a real
  // navigation trace: the corrective re-render to gone=true landed ~10ms after mount
  // (imperceptible on its own), but the browser still painted the intermediate gone=false frame
  // first and then genuinely animated the 620ms transition away from it. Suppressing the
  // transition itself for this one corrective render makes the fix robust either way: painted
  // in between or not, it *snaps* to the end state instead of visibly fading through it.
  const [skipAnim, setSkipAnim] = useState(false);
  const goneRef = useRef(false);

  // Always starts false/false (matching the server, which has no sessionStorage to read) and
  // corrects itself here, before paint, if this mount is a "closing detail" return — the same
  // hydration-safe shape as useReducedMotion, not a lazy useState initializer. Not a
  // useSyncExternalStore candidate like that one, though: sessionStorage has no same-tab change
  // event to subscribe to (the `storage` event only fires in *other* tabs), so there's no
  // "external store" to subscribe to here — just a one-time read-on-mount.
  useLayoutEffect(() => {
    if (consumeReturningToWorkInstant()) {
      goneRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time correction from a browser API unavailable during SSR, not a props-echo (see the note above)
      setSkipAnim(true);
      setOn(true);
      setGone(true);
    }
  }, []);

  useEffect(() => {
    if (goneRef.current) return;
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
          transition: skipAnim ? "none" : "opacity 620ms var(--ease), visibility 0s linear 620ms",
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
                  transition: skipAnim
                    ? "none"
                    : gone
                      ? `opacity 460ms var(--ease) ${i * 16}ms, transform 620ms var(--ease) ${i * 16}ms`
                      : `opacity 820ms var(--ease) ${i * 90}ms, transform 820ms var(--ease) ${i * 90}ms`,
                }}
              >
                {/* The separator below is U+00A0 (non-breaking space), not a plain space: a
                    trailing plain space is the LAST character inside an inline-block (.word)
                    whose parent (.wordMask) clips overflow, and CSS's whitespace-collapsing
                    rules drop a collapsible space right at that boundary — the words visibly
                    ran together with no gap between them. A non-breaking space isn't
                    collapsible, so it survives (matches the source's own choice here). */}
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
              transition: skipAnim
                ? "none"
                : `opacity 720ms var(--ease) ${140 + i * 70}ms, transform 720ms var(--ease) ${140 + i * 70}ms`,
              willChange: "opacity, transform",
            }}
          >
            <ProjectCard
              href={localeHref(locale, `/work/${p.slug}`)}
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
