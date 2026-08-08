"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconButton } from "@/components/core/IconButton";
import { NavMenu } from "@/components/navigation/NavMenu";
import { getDictionary, getSiteNav, swapLocalePath, LOCALES, type Locale } from "@/lib/i18n";
import styles from "./PrimaryNav.module.css";

export interface PrimaryNavProps {
  locale: Locale;
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
export function PrimaryNav({ locale, active, tone = "default", fixed = true }: PrimaryNavProps) {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dict = getDictionary(locale);
  const navItems = getSiteNav(locale);
  const pathname = usePathname() ?? `/${locale}`;

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
        <NavMenu locale={locale} items={navItems} active={active} tone={tone} />
      </div>

      <button
        ref={burgerRef}
        type="button"
        className={`${styles.burger} ${fixed ? "" : styles.scrollsAway}`}
        aria-label={dict.aria.menu}
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
          label={dict.aria.close}
          className={styles.overlayClose}
          onClick={() => setOpen(false)}
        />
        <nav className={styles.overlayNav} aria-label={dict.aria.primaryNav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.overlayItem} ${item.label === active ? styles.overlayItemActive : ""}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {/* Same .overlayItem class as the site-nav links above — the language rows read as a
              natural continuation of the same list instead of a visually distinct control. */}
          {LOCALES.map((l) => (
            <Link
              key={l}
              href={swapLocalePath(pathname, l)}
              className={`${styles.overlayItem} ${l === locale ? styles.overlayItemActive : ""}`}
              aria-label={dict.languageSwitcher.switchTo[l]}
              onClick={() => setOpen(false)}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
