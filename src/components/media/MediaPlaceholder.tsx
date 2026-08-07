import type { CSSProperties } from "react";
import styles from "./MediaPlaceholder.module.css";

export interface MediaPlaceholderProps {
  label?: string;
  kind?: "video" | "image";
  vertical?: boolean;
  style?: CSSProperties;
  className?: string;
}

/** Flat labelled block standing in for missing media — #D9D9D9 (image) or #AAB8C9 (video), a
 *  legitimate visible state in this system, not an error state. */
export function MediaPlaceholder({ label = "Видео", kind = "video", vertical = false, style, className }: MediaPlaceholderProps) {
  return (
    <div className={`${styles.wrap} ${kind === "video" ? styles.video : styles.image} ${className ?? ""}`} style={style}>
      <span className={styles.label} style={vertical ? { transform: "rotate(-90deg)" } : undefined}>
        {label}
      </span>
    </div>
  );
}
