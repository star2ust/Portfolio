import type { CSSProperties, ReactNode } from "react";
import styles from "./PageTitle.module.css";

export interface PageTitleProps {
  children: ReactNode;
  underline?: boolean;
  align?: "center" | "left";
  style?: CSSProperties;
  className?: string;
}

/** 64px title + 0.5px rule — used once per page ("Связь.", "Обо мне"). */
export function PageTitle({ children, underline = true, align = "center", style, className }: PageTitleProps) {
  return (
    <div className={`${styles.wrap} ${align === "center" ? styles.center : styles.left} ${className ?? ""}`} style={style}>
      <h1 className={styles.title}>{children}</h1>
      {underline ? <div className={styles.rule} /> : null}
    </div>
  );
}
