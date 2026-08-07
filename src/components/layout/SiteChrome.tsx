import Link from "next/link";
import { IconButton } from "@/components/core/IconButton";
import { PrimaryNav } from "@/components/layout/PrimaryNav";
import styles from "./SiteChrome.module.css";

export interface SiteChromeProps {
  /** the nav label for the current route, e.g. "ОБО МНЕ" */
  active?: string;
  icon?: "back" | "close";
  backHref?: string;
  tone?: "default" | "invert";
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
export function SiteChrome({ active, icon = "back", backHref = "/", tone = "default" }: SiteChromeProps) {
  return (
    <>
      <Link href={backHref} aria-label={icon === "close" ? "закрыть" : "назад"} className={styles.back}>
        <IconButton icon={icon} as="span" style={{ width: "100%", height: "100%" }} />
      </Link>
      <PrimaryNav active={active} tone={tone} />
    </>
  );
}
