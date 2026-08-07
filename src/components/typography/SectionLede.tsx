import type { CSSProperties, ReactNode } from "react";
import styles from "./SectionLede.module.css";

export interface SectionLedeProps {
  children: ReactNode;
  align?: "center" | "left";
  style?: CSSProperties;
  className?: string;
}

/** 35px centred section statement — names the range of the work in one sentence. */
export function SectionLede({ children, align = "center", style, className }: SectionLedeProps) {
  return (
    <p
      className={`${styles.lede} ${align === "center" ? styles.center : styles.left} ${className ?? ""}`}
      style={style}
    >
      {children}
    </p>
  );
}
