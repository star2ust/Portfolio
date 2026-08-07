import type { CSSProperties } from "react";

export interface RuleProps {
  tone?: "hairline" | "ink" | "invert" | "grey";
  weight?: "hair" | "strong" | "full";
  length?: string | number;
  vertical?: boolean;
  style?: CSSProperties;
  className?: string;
}

const TONE: Record<string, string> = {
  hairline: "var(--rule-hairline)",
  ink: "var(--rule-ink)",
  invert: "var(--rule-invert)",
  grey: "var(--sd-grey-b2)",
};
const WEIGHT: Record<string, string> = { hair: "0.25px", strong: "0.5px", full: "1px" };

/** A 0.25/0.5/1px rule — the single most-used element in the system. Lines are the layout. */
export function Rule({
  tone = "hairline",
  weight = "hair",
  length,
  vertical = false,
  style,
  className,
}: RuleProps) {
  const color = TONE[tone] ?? TONE.hairline;
  const w = WEIGHT[weight] ?? WEIGHT.hair;
  const base: CSSProperties = vertical
    ? { width: w, height: length ?? "100%" }
    : { height: w, width: length ?? "100%" };
  return (
    <div
      role="separator"
      className={className}
      style={{ flexShrink: 0, background: color, ...base, ...style }}
    />
  );
}
