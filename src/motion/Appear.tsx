"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

export interface AppearProps {
  delay?: number;
  from?: "left" | "up";
  blur?: boolean;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

/** The shared element-entrance primitive: opacity + a small directional shift, optionally with
 *  a blur-in (used for the About body blocks, §4). Delay is in ms, added on top of a fixed
 *  260ms base so a whole screen's staggered reveal reads as one continuous move. */
export function Appear({ delay = 0, from = "left", blur = false, children, style, className }: AppearProps) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), 260 + delay);
    return () => clearTimeout(t);
  }, [delay]);
  const shift = from === "up" ? "translateY(34px)" : "translateX(-38px)";
  return (
    <div
      className={className}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? "none" : shift,
        filter: blur && !on ? "blur(9px)" : "blur(0px)",
        transition: "opacity 760ms var(--ease), transform 760ms var(--ease), filter 760ms var(--ease)",
        willChange: "opacity, transform, filter",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
