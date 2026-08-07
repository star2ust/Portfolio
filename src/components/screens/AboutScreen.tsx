import Image from "next/image";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { FooterLogo } from "@/components/layout/FooterLogo";
import { MetaField } from "@/components/data/MetaField";
import { Appear } from "@/motion/Appear";
import type { SiteSettings } from "@/lib/content";
import styles from "./AboutScreen.module.css";

export interface AboutScreenProps {
  settings: SiteSettings;
}

/** Обо мне — portrait beside (desktop/laptop/tablet-landscape) or above (tablet-portrait/mobile)
 *  the copy, a title+lede, two body paragraphs, and a three-group fact strip
 *  (ИМЯ+Y.O. share one hairline, per the motion spec's §4 layout fix).
 *
 *  §4: title reveals left→right, then the subtitle, then the two body blocks top→bottom with
 *  blur — the layout fix (ИМЯ/Y.O. sharing one rule) is already just how the layout is built. */
export function AboutScreen({ settings }: AboutScreenProps) {
  const [imya, yo, role, contacts] = settings.about.meta;
  return (
    <main className={styles.stage}>
      <SiteChrome active="ОБО МНЕ" />
      <div className={styles.layout}>
        <div className={styles.portraitWrap}>
          <Image
            src={settings.about.portrait}
            alt={settings.name}
            fill
            sizes="(max-width: 1113px) 100vw, 30vw"
            className={styles.portrait}
          />
        </div>
        <div className={styles.copy}>
          <Appear delay={0} from="left">
            <h1 className={styles.title}>{settings.about.title}</h1>
          </Appear>
          <Appear delay={140} from="left">
            <p className={styles.lede}>{settings.about.lede}</p>
          </Appear>
          <Appear delay={210} from="left">
            <div className={styles.rule} />
          </Appear>
          <div className={styles.bodyCols}>
            <Appear delay={280} from="up" blur>
              <p className={styles.body}>{settings.about.body1}</p>
            </Appear>
            <Appear delay={420} from="up" blur>
              <p className={styles.body}>{settings.about.body2}</p>
            </Appear>
          </div>
          <Appear delay={560} from="up">
            <div className={styles.metaRow}>
              <div className={styles.metaGroup}>
                <div className={styles.metaRule} />
                <div className={styles.metaFields}>
                  <MetaField label={imya.label} value={imya.value} style={{ flex: 6 }} />
                  <MetaField label={yo.label} value={yo.value} align="right" style={{ flex: 1 }} />
                </div>
              </div>
              <div className={styles.metaGroup}>
                <div className={styles.metaRule} />
                <MetaField label={role.label} value={role.value} valueLineHeight="150%" />
              </div>
              <div className={styles.metaGroup}>
                <div className={styles.metaRule} />
                <MetaField label={contacts.label} value={contacts.value} valueLineHeight="150%" />
              </div>
            </div>
          </Appear>
          <FooterLogo className={styles.footerLogo} />
        </div>
      </div>
    </main>
  );
}
