import type { CSSProperties, ReactNode } from "react";
import styles from "./FooterMark.module.css";

export interface FooterMarkProps {
  children?: ReactNode;
  tone?: "muted" | "label" | "invert";
  style?: CSSProperties;
}

/** The standing index mark in the bottom-left gutter of every content screen. */
export function FooterMark({ children = "01", tone = "muted", style }: FooterMarkProps) {
  return (
    <span className={`${styles.mark} ${styles[tone]}`} style={style}>
      {children}
    </span>
  );
}
