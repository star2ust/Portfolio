"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, type Locale } from "@/lib/i18n";
import styles from "./LanguageSwitcher.module.css";

export interface LanguageSwitcherProps {
  locale: Locale;
  tone?: "default" | "invert";
  /** true when rendered inside PrimaryNav's full-screen mobile overlay — lighter-on-dark
   *  colors regardless of `tone`, centered instead of right-aligned, matching that overlay's
   *  own nav list. */
  overlay?: boolean;
  className?: string;
}

/** RU / EN toggle. Rendered as a flow child directly under the site nav (desktop: below the
 *  vertical NavMenu column; mobile: below the overlay's nav list) rather than its own
 *  fixed-position corner — every screen already has *something* pinned to a bottom corner
 *  (Hero's spec strip, Detail's pager, various FooterLogo placements), so sitting inside the
 *  nav's own positioning context was the one spot guaranteed not to collide with any of them.
 *  Swaps only the locale segment of the current URL, so switching language mid-project-detail
 *  page stays on the same project instead of bouncing home. */
export function LanguageSwitcher({ locale, tone = "default", overlay = false, className }: LanguageSwitcherProps) {
  const pathname = usePathname() ?? `/${locale}`;
  const rest = pathname.replace(/^\/(ru|en)/, "");

  return (
    <div
      className={`${styles.wrap} ${overlay ? styles.overlay : ""} ${tone === "invert" ? styles.invert : ""} ${className ?? ""}`}
    >
      {LOCALES.map((l, i) => (
        <span key={l} className={styles.pair}>
          {i > 0 ? (
            <span className={styles.divider} aria-hidden="true">
              /
            </span>
          ) : null}
          <Link
            href={`/${l}${rest}`}
            aria-current={l === locale ? "page" : undefined}
            className={`${styles.item} ${l === locale ? styles.active : ""}`}
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}
