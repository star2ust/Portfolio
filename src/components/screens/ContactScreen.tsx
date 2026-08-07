import { SiteChrome } from "@/components/layout/SiteChrome";
import { Logo } from "@/components/core/Logo";
import { PageTitle } from "@/components/typography/PageTitle";
import { ContactRow } from "@/components/screens/ContactRow";
import { Appear } from "@/motion/Appear";
import { GrowRule } from "@/motion/GrowRule";
import type { SiteSettings } from "@/lib/content";
import styles from "./ContactScreen.module.css";

export interface ContactScreenProps {
  settings: SiteSettings;
}

/** Контакты — §9: «Связь.» rises bottom→top, its rule grows from the centre outward, then the
 *  contact rows reveal left→right with fade, staggered. */
export function ContactScreen({ settings }: ContactScreenProps) {
  return (
    <div className={styles.stage}>
      <SiteChrome active="КОНТАКТЫ" />
      <div className={styles.center}>
        <div className={styles.block}>
          <Appear delay={0} from="up">
            <PageTitle align="center" underline={false}>
              {settings.contact.title}
            </PageTitle>
          </Appear>
          <GrowRule delay={160} style={{ marginTop: 30 }} />
          <div className={styles.rows}>
            {settings.contact.rows.map((r, i) => (
              <Appear key={r.href} delay={420 + i * 100} from="left">
                <ContactRow label={r.label} value={r.value} href={r.href} mark={r.mark} />
              </Appear>
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
