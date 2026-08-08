import Link from "next/link";
import { IconButton } from "@/components/core/IconButton";
import { PrimaryNav } from "@/components/layout/PrimaryNav";
import { getDictionary, localeHref, type Locale } from "@/lib/i18n";
import styles from "./SiteChrome.module.css";

export interface SiteChromeProps {
  locale: Locale;
  /** the nav label for the current route, e.g. "ОБО МНЕ" */
  active?: string;
  icon?: "back" | "close";
  /** unprefixed — e.g. "/" or "/work", never "/ru/work". Localized internally via localeHref(). */
  backHref?: string;
  tone?: "default" | "invert";
  /** the detail screen hides the site nav entirely (source: `Chrome menu={false}`) — closing
   *  is the only way out of that screen, there's no "jump straight to another section" menu. */
  menu?: boolean;
  /** false scrolls the back button and nav toggle away with the page instead of pinning them
   *  to the viewport — Work wants this specifically (the requesting screen needs its own
   *  position:relative ancestor for the resulting position:absolute to scroll away within). */
  fixed?: boolean;
}

/**
 * Persistent viewport chrome for every content screen: back/close button (top-left) and the
 * site nav (top-right — a burger + full-screen overlay below 768px, via PrimaryNav).
 *
 * The standing logo mark is NOT here on purpose: in the source it's positioned within the
 * scrollable page canvas near the end of the content (e.g. WorkScreen.jsx computes
 * `logoTop = WORK_HEIGHT - 100`), not pinned to the viewport — a fixed logo would sit on top
 * of scrolling body copy on any content-heavy page (confirmed by screenshot: it overlapped the
 * About body text on mobile). Screens render it themselves via <FooterLogo /> at the end of
 * their own content flow instead.
 */
export function SiteChrome({
  locale,
  active,
  icon = "back",
  backHref = "/",
  tone = "default",
  menu = true,
  fixed = true,
}: SiteChromeProps) {
  const dict = getDictionary(locale);
  return (
    <>
      <Link
        href={localeHref(locale, backHref)}
        aria-label={icon === "close" ? dict.aria.close : dict.aria.back}
        className={`${styles.back} ${fixed ? "" : styles.scrollsAway}`}
      >
        <IconButton icon={icon} as="span" style={{ width: "100%", height: "100%" }} />
      </Link>
      {menu ? <PrimaryNav locale={locale} active={active} tone={tone} fixed={fixed} /> : null}
    </>
  );
}
