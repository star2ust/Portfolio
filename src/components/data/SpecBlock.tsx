import type { CSSProperties } from "react";
import styles from "./SpecBlock.module.css";

export interface SpecBlockProps {
  label: string;
  value: string;
  tone?: "invert" | "default";
  style?: CSSProperties;
}

/** Hero spec column on dark: a rule, an uppercase label, and a value at 85% opacity. */
export function SpecBlock({ label, value, tone = "invert", style }: SpecBlockProps) {
  return (
    <div className={`${styles.block} ${tone === "invert" ? styles.invert : styles.default}`} style={style}>
      <div className={styles.rule} />
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}
