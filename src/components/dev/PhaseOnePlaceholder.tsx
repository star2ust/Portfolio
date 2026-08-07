import Link from "next/link";
import styles from "./PhaseOnePlaceholder.module.css";

const NAV: { label: string; href: string }[] = [
  { label: "ГЛАВНАЯ", href: "/" },
  { label: "ОБО МНЕ", href: "/about" },
  { label: "ПРОЕКТЫ", href: "/work" },
  { label: "НАВЫКИ", href: "/skills" },
  { label: "КОНТАКТЫ", href: "/contact" },
];

/**
 * Temporary Phase 1 stand-in — proves the route + the fluid breakpoint tokens
 * are wired up correctly. Replaced screen-by-screen in Phase 2.
 */
export function PhaseOnePlaceholder({
  route,
  title,
  note,
}: {
  route: string;
  title: string;
  note: string;
}) {
  return (
    <div className={styles.frame}>
      <nav className={styles.nav} aria-label="Основная навигация">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={styles.navItem}
            aria-current={item.href === route ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <main className={styles.main}>
        <p className={styles.kicker}>Phase 1 — routing skeleton</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.note}>{note}</p>
        <p className={styles.gutterProbe}>
          --page-gutter resolves to <code>{"var(--page-gutter)"}</code> at this width — resize
          the window to confirm it scales smoothly through 360 / 768 / 1024 / 1440 / 1920px.
        </p>
      </main>
    </div>
  );
}
