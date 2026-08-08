"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary, getSiteNav, swapLocalePath, LOCALES, type Locale, type NavItem } from "@/lib/i18n";
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

/** Right-aligned vertical site menu — pinned top-right on every content screen. The RU/EN
 *  language switcher is one more row in this exact same list (same .item class, same flex
 *  column) rather than a separate element nearby, by request — both languages share that one
 *  row ("RU / EN"), not two separate rows, so it reads as a single menu entry. */
export function NavMenu({ locale, items, active, tone = "default", style, className }: NavMenuProps) {
  const dict = getDictionary(locale);
  const navItems = items ?? getSiteNav(locale);
  const pathname = usePathname() ?? `/${locale}`;
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
      <div className={`${styles.item} ${styles.langRow}`}>
        {LOCALES.map((l, i) => (
          <span key={l} className={styles.langPair}>
            {i > 0 ? (
              <span className={styles.langDivider} aria-hidden="true">
                /
              </span>
            ) : null}
            <Link
              href={swapLocalePath(pathname, l)}
              className={styles.langLink}
              aria-current={l === locale ? "page" : undefined}
              aria-label={dict.languageSwitcher.switchTo[l]}
            >
              {l.toUpperCase()}
            </Link>
          </span>
        ))}
      </div>
    </nav>
  );
}
