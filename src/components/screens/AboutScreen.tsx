import Image from "next/image";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { FooterLogo } from "@/components/layout/FooterLogo";
import { MetaField } from "@/components/data/MetaField";
import { SITE } from "@/lib/content";
import styles from "./AboutScreen.module.css";

/** Обо мне — portrait beside (desktop/laptop/tablet-landscape) or above (tablet-portrait/mobile)
 *  the copy, a title+lede, two body paragraphs, and a three-group fact strip
 *  (ИМЯ+Y.O. share one hairline, per the motion spec's §4 layout fix). */
export function AboutScreen() {
  const [imya, yo, role, contacts] = SITE.about.meta;
  return (
    <div className={styles.stage}>
      <SiteChrome active="ОБО МНЕ" />
      <div className={styles.layout}>
        <div className={styles.portraitWrap}>
          <Image
            src={SITE.about.portrait}
            alt=""
            fill
            sizes="(max-width: 1113px) 100vw, 30vw"
            className={styles.portrait}
          />
        </div>
        <div className={styles.copy}>
          <h1 className={styles.title}>{SITE.about.title}</h1>
          <p className={styles.lede}>{SITE.about.lede}</p>
          <div className={styles.rule} />
          <div className={styles.bodyCols}>
            <p className={styles.body}>{SITE.about.body1}</p>
            <p className={styles.body}>{SITE.about.body2}</p>
          </div>
          <div className={styles.metaRow}>
            <div className={styles.metaGroup}>
              <div className={styles.metaRule} />
              <div className={styles.metaFields}>
                <MetaField label={imya.label} value={imya.value} />
                <MetaField label={yo.label} value={yo.value} align="right" />
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
          <FooterLogo />
        </div>
      </div>
    </div>
  );
}
