"use client";

import { useEffect, useState, type CSSProperties } from "react";

export interface GrowRuleProps {
  delay?: number;
  style?: CSSProperties;
}

/** A hairline that grows from its centre outward — used under the About lede, the Detail role
 *  line, and the Contact title. */
export function GrowRule({ delay = 0, style }: GrowRuleProps) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), 260 + delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      style={{
        height: "0.25px",
        background: "var(--rule-hairline)",
        transformOrigin: "50% 50%",
        transform: `scaleX(${on ? 1 : 0})`,
        transition: "transform 760ms var(--ease)",
        ...style,
      }}
    />
  );
}
