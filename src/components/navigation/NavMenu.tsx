"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { getDictionary, getSiteNav, type Locale, type NavItem } from "@/lib/i18n";
import styles from "./NavMenu.module.css";

export type { NavItem };

export interface NavMenuProps {
  locale: Locale;
  /** overrides the default site nav (getSiteNav(locale)) — nothing currently needs this, kept
   *  as an escape hatch since it cost nothing to keep. */
  items?: NavItem[];
  active?: string;
  tone?: "default" | "invert";
  style?: CSSProperties;
  className?: string;
}

/** Right-aligned vertical site menu — pinned top-right on every content screen. */
export function NavMenu({ locale, items, active, tone = "default", style, className }: NavMenuProps) {
  const dict = getDictionary(locale);
  const navItems = items ?? getSiteNav(locale);
  return (
    <nav
      aria-label={dict.aria.primaryNav}
      className={`${styles.nav} ${tone === "invert" ? styles.invert : ""} ${className ?? ""}`}
      style={style}
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={styles.item}
          aria-current={item.label === active ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
