"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import styles from "./NavMenu.module.css";

export interface NavItem {
  label: string;
  href: string;
}

export interface NavMenuProps {
  items?: NavItem[];
  active?: string;
  tone?: "default" | "invert";
  style?: CSSProperties;
  className?: string;
}

export const SITE_NAV: NavItem[] = [
  { label: "ГЛАВНАЯ", href: "/" },
  { label: "ОБО МНЕ", href: "/about" },
  { label: "ПРОЕКТЫ", href: "/work" },
  { label: "НАВЫКИ", href: "/skills" },
  { label: "КОНТАКТЫ", href: "/contact" },
];

/** Right-aligned vertical site menu — pinned top-right on every content screen. */
export function NavMenu({ items = SITE_NAV, active, tone = "default", style, className }: NavMenuProps) {
  return (
    <nav
      aria-label="Основная навигация"
      className={`${styles.nav} ${tone === "invert" ? styles.invert : ""} ${className ?? ""}`}
      style={style}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={styles.item}
          aria-current={item.label === active ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
