import { Logo } from "@/components/core/Logo";
import styles from "./FooterLogo.module.css";

export interface FooterLogoProps {
  /** overrides the default in-flow bottom-left placement — Skills positions it absolutely
   *  over its otherwise-full-bleed graph instead, since that screen has no natural end-of-
   *  content flow position to render it in. */
  className?: string;
}

/** The standing logo mark that closes out a page's content — positioned in normal document
 *  flow by default (see SiteChrome's doc comment for why it isn't viewport-fixed). Omit on
 *  screens whose own layout would collide with it (the project detail page, per the source). */
export function FooterLogo({ className }: FooterLogoProps) {
  return (
    <div className={`${styles.wrap} ${className ?? ""}`}>
      <Logo tone="ink" />
    </div>
  );
}
