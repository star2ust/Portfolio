import type { CSSProperties } from "react";
import styles from "./LevelDots.module.css";

export interface LevelDotsProps {
  level?: number;
  total?: number;
  label?: string;
  style?: CSSProperties;
}

/** 34px orange proficiency dots — level dots are the only element that is orange at rest. */
export function LevelDots({ level = 4, total = 5, label = "УРОВЕНЬ", style }: LevelDotsProps) {
  return (
    <div className={styles.wrap} style={style}>
      <div className={styles.rule} />
      {label ? <span className={styles.label}>{label}</span> : null}
      <div className={styles.dots}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`${styles.dot} ${i < level ? styles.filled : ""}`} />
        ))}
      </div>
    </div>
  );
}
