import type { CSSProperties } from "react";
import styles from "./Logo.module.css";

export interface LogoProps {
  /** omit to size responsively via --chrome-logo-size (the breakpoint-banded chrome token);
   *  pass a number for a one-off fixed size (the Hero identity block wants an exact px value) */
  size?: number;
  tone?: "ink" | "black" | "invert" | "accent" | "violet" | "grey";
  rotate?: number;
  style?: CSSProperties;
  className?: string;
}

const LOGO_ASPECT = 195.57 / 329.89;
const FILLS: Record<string, string> = {
  accent: "var(--accent)",
  violet: "var(--sd-violet)",
  grey: "var(--sd-grey-b2)",
};

/** The Stardust star mark — a four-point star inside a compass ring broken at the top.
 *  Monochrome only: ink, white, or the orange accent — never rotated in a different direction. */
export function Logo({ size, tone = "ink", rotate = 12, style, className }: LogoProps) {
  const transform = `rotate(${rotate}deg)`;
  const dimensions: CSSProperties =
    size != null
      ? { width: size * LOGO_ASPECT, height: size }
      : { width: `calc(var(--chrome-logo-size, 44px) * ${LOGO_ASPECT})`, height: "var(--chrome-logo-size, 44px)" };

  if (tone === "ink" || tone === "black" || tone === "invert") {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- recolours via CSS filter, not next/image territory
      <img
        src="/logo.svg"
        alt="Stardust"
        className={`${styles.img} ${className ?? ""}`}
        style={{
          ...dimensions,
          transform,
          filter: tone === "invert" ? "invert(1)" : "none",
          ...style,
        }}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label="Stardust"
      className={`${styles.mask} ${className ?? ""}`}
      style={{
        ...dimensions,
        background: FILLS[tone] ?? "var(--sd-ink)",
        transform,
        WebkitMaskImage: "url(/logo.svg)",
        maskImage: "url(/logo.svg)",
        ...style,
      }}
    />
  );
}
