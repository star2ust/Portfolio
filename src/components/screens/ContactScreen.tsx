import { SiteChrome } from "@/components/layout/SiteChrome";
import { Logo } from "@/components/core/Logo";
import { PageTitle } from "@/components/typography/PageTitle";
import { ContactRow } from "@/components/screens/ContactRow";
import { SITE } from "@/lib/content";
import styles from "./ContactScreen.module.css";

/** Контакты — «Связь.» centred, rule below, then the contact rows. §9 in the motion spec grows
 *  the rule from its centre and reveals the rows left→right with fade; that lands in Phase 3. */
export function ContactScreen() {
  return (
    <div className={styles.stage}>
      <SiteChrome active="КОНТАКТЫ" />
      <div className={styles.center}>
        <div className={styles.block}>
          <PageTitle align="center">{SITE.contact.title}</PageTitle>
          <div className={styles.rows}>
            {SITE.contact.rows.map((r) => (
              <ContactRow key={r.href} label={r.label} value={r.value} href={r.href} mark={r.mark} />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <Logo tone="ink" />
      </div>
    </div>
  );
}
