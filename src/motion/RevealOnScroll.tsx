"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/** Fades + rises an element in the first time it scrolls into view — the grid-reveal half of
 *  §6 (the work grid "reveals, animated" as you scroll to it). Simplified from the source: the
 *  full scroll-driven word-by-word lede build/exit that precedes the grid in the source isn't
 *  reproduced here, just this per-card reveal. */
export function RevealOnScroll({ children, delay = 0, className }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(50px)",
        transition: `opacity 720ms var(--ease) ${delay}ms, transform 720ms var(--ease) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
