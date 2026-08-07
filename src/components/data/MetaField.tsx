import type { CSSProperties, ReactNode } from "react";
import styles from "./MetaField.module.css";

export interface MetaFieldProps {
  label: ReactNode;
  value: ReactNode;
  align?: "left" | "right";
  /** use "150%" for multi-line values (e.g. the ИМЯ/РОЛЬ fact strip) */
  valueLineHeight?: string;
  style?: CSSProperties;
}

/** Label-over-value pair — used in the About screen's data strip (ИМЯ, РОЛЬ, КОНТАКТЫ...). */
export function MetaField({ label, value, align = "left", valueLineHeight, style }: MetaFieldProps) {
  return (
    <div className={styles.field} style={{ textAlign: align, ...style }}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value} style={valueLineHeight ? { lineHeight: valueLineHeight } : undefined}>
        {value}
      </span>
    </div>
  );
}
