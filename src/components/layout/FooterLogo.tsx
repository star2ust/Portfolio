import { Logo } from "@/components/core/Logo";
import styles from "./FooterLogo.module.css";

/** The standing logo mark that closes out a page's content — positioned in normal document
 *  flow (see SiteChrome's doc comment for why it isn't viewport-fixed). Omit on screens whose
 *  own layout would collide with it (the project detail page, per the source). */
export function FooterLogo() {
  return (
    <div className={styles.wrap}>
      <Logo tone="ink" />
    </div>
  );
}
