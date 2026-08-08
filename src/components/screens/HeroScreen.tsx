import { Logo } from "@/components/core/Logo";
import { NameLockup } from "@/components/typography/NameLockup";
import { SpecBlock } from "@/components/data/SpecBlock";
import { PrimaryNav } from "@/components/layout/PrimaryNav";
import { HeroVideo } from "./HeroVideo";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/content";
import styles from "./HeroScreen.module.css";

export interface HeroScreenProps {
  settings: SiteSettings;
  locale: Locale;
}

/** Главная — full-bleed looping video, identity lockup top-left, nav top-right (invert), a
 *  three-column spec strip along the bottom edge. No back button, no footer mark — the only
 *  screen without either. */
export function HeroScreen({ settings, locale }: HeroScreenProps) {
  const dict = getDictionary(locale);
  return (
    <main className={styles.stage}>
      <HeroVideo />

      <div className={styles.identity}>
        <Logo tone="invert" className={styles.logo} />
        <NameLockup name={settings.name} role={settings.role} tone="invert" className={styles.lockup} />
      </div>

      <PrimaryNav locale={locale} active={dict.nav.home} tone="invert" />

      <div className={styles.specs}>
        {settings.heroSpecs.map((s) => (
          <SpecBlock key={s.label} label={s.label} value={s.value} tone="invert" />
        ))}
      </div>
    </main>
  );
}
