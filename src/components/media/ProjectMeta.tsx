import type { CSSProperties } from "react";
import styles from "./ProjectMeta.module.css";

export interface ProjectMetaProps {
  /** e.g. "Задачи:" or "Результат:" — the colon is part of the label */
  label: string;
  body: string;
  ruleAbove?: boolean;
  style?: CSSProperties;
}

/** Narrow detail column: hairline, label, body. Used for Задачи / Результат on the project detail page. */
export function ProjectMeta({ label, body, ruleAbove = true, style }: ProjectMetaProps) {
  return (
    <div className={styles.wrap} style={style}>
      {ruleAbove ? <div className={styles.rule} /> : null}
      <span className={styles.label}>{label}</span>
      <span className={styles.body}>{body}</span>
    </div>
  );
}
