import type { CSSProperties } from "react";
import styles from "./MetaBar.module.css";

export interface MetaBarField {
  label: string;
  value: string;
  flex?: number;
}

export interface MetaBarProps {
  fields?: MetaBarField[];
  style?: CSSProperties;
}

/** A segmented row of hairlines with 21px gaps — "makes a table". Used for the Detail tech/role strip. */
export function MetaBar({ fields = [], style }: MetaBarProps) {
  return (
    <div className={styles.bar} style={style}>
      <div className={styles.rules}>
        {fields.map((f, i) => (
          <div key={i} className={styles.rule} style={{ flex: f.flex ?? 1 }} />
        ))}
      </div>
      <div className={styles.row}>
        {fields.map((f, i) => (
          <div key={i} className={styles.cell} style={{ flex: f.flex ?? 1 }}>
            <span className={styles.label}>{f.label}</span>
            <span className={styles.value}>{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
