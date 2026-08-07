"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SectionLede } from "@/components/typography/SectionLede";
import { ProjectCard } from "@/components/media/ProjectCard";
import type { Project } from "@/lib/content";
import styles from "./WorkPhraseAndGrid.module.css";
import gridStyles from "./WorkScreen.module.css";

export interface WorkPhraseAndGridProps {
  projects: Project[];
  lede: string;
}

// Matches the source's `instant` prop: "returning from a project [detail page]: the grid is
// simply already there" — once the phrase has played and the grid has been revealed in this
// browser tab, it stays revealed for the rest of the session (closing the detail page back to
// /work is a real unmount+remount of this component, not a state that survives on its own).
const SEEN_KEY = "sd-work-grid-seen";

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
  // True only for the "already seen this session" correction below. Belt-and-braces alongside
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
  // corrects itself here, before paint, if this tab has already seen the grid — the same
  // hydration-safe shape as useReducedMotion, not a lazy useState initializer. Not a
  // useSyncExternalStore candidate like that one, though: sessionStorage has no same-tab change
  // event to subscribe to (the `storage` event only fires in *other* tabs), so there's no
  // "external store" to subscribe to here — just a one-time read-on-mount.
  useLayoutEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // sessionStorage unavailable — just plays the intro again, no worse than before this fix
    }
    if (seen) {
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
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {
          // no persistence available — next mount just plays the intro again
        }
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
                {w}
                {i < words.length - 1 ? " " : ""}
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
