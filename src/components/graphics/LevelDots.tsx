import type { CSSProperties } from "react";
import styles from "./LevelDots.module.css";

export interface LevelDotsProps {
  level?: number;
  total?: number;
  label?: string;
  style?: CSSProperties;
}

/** 34px orange proficiency dots — level dots are the only element that is orange at rest.
 *  `level` supports .5 steps (e.g. 3.5) — dots before it are fully filled, the dot exactly at
 *  its floor is half-filled, the rest stay empty. */
export function LevelDots({ level = 4, total = 5, label = "УРОВЕНЬ", style }: LevelDotsProps) {
  const full = Math.floor(level);
  const hasHalf = level - full >= 0.5;
  return (
    <div className={styles.wrap} style={style}>
      <div className={styles.rule} />
      {label ? <span className={styles.label}>{label}</span> : null}
      <div className={styles.dots}>
        {Array.from({ length: total }).map((_, i) => {
          const state = i < full ? styles.filled : i === full && hasHalf ? styles.half : "";
          return <div key={i} className={`${styles.dot} ${state}`} />;
        })}
      </div>
    </div>
  );
}
