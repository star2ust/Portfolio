import type { CSSProperties } from "react";
import styles from "./ProjectMeta.module.css";

export interface ProjectMetaProps {
  /** e.g. "Задачи:" or "Результат:" — the colon is part of the label */
  label: string;
  /** Plain paragraph body — for a single block of prose (e.g. "Результат"). Mutually exclusive
   *  with `items`. */
  body?: string;
  /** Bulleted list body — for genuinely separate items (e.g. "Задачи"), so they render as their
   *  own lines with a real gap between them instead of one run-on paragraph. */
  items?: string[];
  ruleAbove?: boolean;
  style?: CSSProperties;
}

/** Narrow detail column: hairline, label, body. Used for Задачи / Результат on the project detail page. */
export function ProjectMeta({ label, body, items, ruleAbove = true, style }: ProjectMetaProps) {
  return (
    <div className={styles.wrap} style={style}>
      {ruleAbove ? <div className={styles.rule} /> : null}
      <span className={styles.label}>{label}</span>
      {items ? (
        <ul className={styles.list}>
          {items.map((item, i) => (
            <li key={i} className={styles.listItem}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <span className={styles.body}>{body}</span>
      )}
    </div>
  );
}
