"use client";

import { useState } from "react";
import Link from "next/link";
import { IconButton } from "@/components/core/IconButton";
import { NavMenu, SITE_NAV } from "@/components/navigation/NavMenu";
import styles from "./PrimaryNav.module.css";

export interface PrimaryNavProps {
  /** the nav label for the current route, e.g. "ГЛАВНАЯ" */
  active?: string;
  tone?: "default" | "invert";
}

/** The site nav — a fixed vertical menu top-right at 768px+, a burger + full-screen overlay
 *  below that. Shared between SiteChrome (content screens) and the Hero, which has no back
 *  button or footer mark but still needs this. */
export function PrimaryNav({ active, tone = "default" }: PrimaryNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={`${styles.navSlot} ${styles.navDesktop}`}>
        <NavMenu items={SITE_NAV} active={active} tone={tone} />
      </div>

      <button
        type="button"
        className={styles.burger}
        aria-label="меню"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className={`${styles.bar} ${tone === "invert" ? styles.barInvert : ""}`} />
        <span className={`${styles.bar} ${tone === "invert" ? styles.barInvert : ""}`} />
        <span className={`${styles.bar} ${tone === "invert" ? styles.barInvert : ""}`} />
      </button>

      <div className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}>
        <IconButton icon="close" size={34} label="закрыть" className={styles.overlayClose} onClick={() => setOpen(false)} />
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
