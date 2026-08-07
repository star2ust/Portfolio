import type { CSSProperties } from "react";
import styles from "./NameLockup.module.css";

export interface NameLockupProps {
  name?: string;
  role?: string;
  tone?: "invert" | "default";
  /** overrides --fs-hero for this instance — the mobile kit sets it to 52px so the lockup stays one line */
  size?: number | string;
  style?: CSSProperties;
  className?: string;
}

/** Hero identity block: role in Montserrat over the name in Micra — the display font's one use per composition. */
export function NameLockup({
  name = "Хабаров Егор",
  role = "Interactive Developer",
  tone = "invert",
  size,
  style,
  className,
}: NameLockupProps) {
  return (
    <div
      className={`${styles.lockup} ${tone === "invert" ? styles.invert : styles.default} ${className ?? ""}`}
      style={{ ...(size !== undefined ? { fontSize: size } : {}), ...style }}
    >
      <span className={styles.role}>{role}</span>
      <span className={styles.name}>{name}</span>
    </div>
  );
}
