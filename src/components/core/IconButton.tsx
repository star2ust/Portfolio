import type { CSSProperties } from "react";
import styles from "./IconButton.module.css";

export interface IconButtonProps {
  icon?: "back" | "close" | "diagonal";
  size?: number;
  label?: string;
  onClick?: () => void;
  style?: CSSProperties;
  className?: string;
  /** "button" (default) renders a real <button> — use for a standalone click target.
   *  "span" renders the same glyph with no interactive semantics — use when this is already
   *  wrapped by another interactive element (a Link or button), since HTML forbids nesting
   *  interactive content and React will hydration-error on it otherwise. */
  as?: "button" | "span";
}

const FILES: Record<string, string> = {
  back: "/icons/arrow-left.png",
  close: "/icons/close.png",
  diagonal: "/icons/arrow-diagonal.png",
};

/** Back / close / diagonal glyph. The three raster icons in the whole system, tinted via CSS mask. */
export function IconButton({ icon = "back", size = 48, label, onClick, style, className, as = "button" }: IconButtonProps) {
  const url = FILES[icon] ?? FILES.back;
  const glyph = <span className={styles.glyph} style={{ WebkitMaskImage: `url(${url})`, maskImage: `url(${url})` }} />;

  if (as === "span") {
    return (
      <span aria-hidden="true" className={`${styles.button} ${className ?? ""}`} style={{ width: size, height: size, ...style }}>
        {glyph}
      </span>
    );
  }

  return (
    <button
      type="button"
      aria-label={label ?? icon}
      onClick={onClick}
      className={`${styles.button} ${className ?? ""}`}
      style={{ width: size, height: size, ...style }}
    >
      {glyph}
    </button>
  );
}
