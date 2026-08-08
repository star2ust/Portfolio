"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IconButton } from "@/components/core/IconButton";
import { NavMenu, SITE_NAV } from "@/components/navigation/NavMenu";
import styles from "./PrimaryNav.module.css";

export interface PrimaryNavProps {
  /** the nav label for the current route, e.g. "ГЛАВНАЯ" */
  active?: string;
  tone?: "default" | "invert";
  /** false scrolls the nav toggle (desktop menu / mobile burger) away with the page instead of
   *  pinning it to the viewport — Work wants this specifically, so the chrome disappears once
   *  you scroll past it instead of floating over the grid. The open overlay itself always stays
   *  position:fixed regardless (it's a full-screen modal, scroll position shouldn't matter). */
  fixed?: boolean;
}

/** The site nav — a fixed vertical menu top-right at 768px+, a burger + full-screen overlay
 *  below that. Shared between SiteChrome (content screens) and the Hero, which has no back
 *  button or footer mark but still needs this. */
export function PrimaryNav({ active, tone = "default", fixed = true }: PrimaryNavProps) {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Move focus into the overlay on open, back to the burger on close (not just visually toggle)
  // — keyboard users shouldn't lose their place. Escape closes it too, the standard dialog convention.
  useEffect(() => {
    if (open) {
      closeRef.current?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    burgerRef.current?.focus();
  }, [open]);

  return (
    <>
      <div className={`${styles.navSlot} ${styles.navDesktop} ${fixed ? "" : styles.scrollsAway}`}>
        <NavMenu items={SITE_NAV} active={active} tone={tone} />
      </div>

      <button
        ref={burgerRef}
        type="button"
        className={`${styles.burger} ${fixed ? "" : styles.scrollsAway}`}
        aria-label="меню"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className={`${styles.bar} ${tone === "invert" ? styles.barInvert : ""}`} />
        <span className={`${styles.bar} ${tone === "invert" ? styles.barInvert : ""}`} />
        <span className={`${styles.bar} ${tone === "invert" ? styles.barInvert : ""}`} />
      </button>

      {/* inert while closed: removes the whole panel from tab order and the AT tree in one
          go, instead of the offscreen-but-still-focusable trap opacity/pointer-events alone leave */}
      <div className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`} inert={!open}>
        <IconButton
          ref={closeRef}
          icon="close"
          size={34}
          label="закрыть"
          className={styles.overlayClose}
          onClick={() => setOpen(false)}
        />
        <nav className={styles.overlayNav} aria-label="Основная навигация">
          {SITE_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.overlayItem} ${item.label === active ? styles.overlayItemActive : ""}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
