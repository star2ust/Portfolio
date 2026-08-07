"use client";

/* eslint-disable react-hooks/refs, react-hooks/purity --
   This is a physics-simulation component: node positions live in a mutable `bodies` ref that
   the rAF loop integrates every frame, and `tick` state is the render trigger. Copying the ref
   into state each frame would mean diffing/cloning the whole body array 60x/sec for no benefit —
   the ref is only ever written by this component's own effect/pointer handlers (never read
   during another component's render), so the concurrent-safety hazard this rule guards against
   doesn't apply here. The Math.random() seeding of each link's breathing phase is guarded to run
   exactly once per mount (the `!bodies.current || length mismatch` lazy-init check below), the
   standard "lazy ref initialization" escape hatch — it does not re-run on re-render. */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./SkillGraph.module.css";

export interface SkillGraphNode {
  label: string;
  /** link to this node instead of the hub */
  parent?: string;
}

export interface SkillGraphProps {
  nodes: (string | SkillGraphNode)[];
  /** label of the currently selected node */
  active?: string | null;
  /** fired on a click (a drag does not select) */
  onSelect?: (label: string) => void;
  /** fired when empty space inside the graph is clicked */
  onDeselect?: () => void;
  width?: number;
  height?: number;
  centerX?: number;
  centerY?: number;
  /** link length for top-level nodes */
  radius?: number;
  /** satellite diameter */
  dot?: number;
  /** hub diameter */
  hub?: number;
  /** label size in px */
  fontSize?: number;
  style?: CSSProperties;
}

interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
}
interface Link {
  from: number;
  to: number;
  rest: number;
  restBase: number;
  freq: number;
  phase: number;
}

/**
 * Obsidian-style force graph of the toolchain — small grey satellites spring-linked to a larger,
 * darker hub. Drag any node and the others follow with weight; a held or selected node turns
 * brand violet. The physics loop is intentionally identical to the design-system reference —
 * it's a self-contained simulation, not something CSS breakpoints reshape; screens instead pass
 * different width/height/radius/dot/hub/fontSize per breakpoint.
 */
export function SkillGraph({
  nodes,
  active,
  onSelect,
  onDeselect,
  width = 1920,
  height = 1080,
  centerX,
  centerY,
  radius = 330,
  dot = 18,
  hub = 30,
  fontSize = 14,
  style,
}: SkillGraphProps) {
  const list = nodes.map((n) => (typeof n === "string" ? { label: n } : n));
  const cx = centerX == null ? width / 2 : centerX;
  const cy = centerY == null ? height / 2 : centerY;

  const bodies = useRef<Body[] | null>(null);
  const links = useRef<Link[]>([]);

  if (!bodies.current || bodies.current.length !== list.length + 1) {
    const index: Record<string, number> = { HUB: 0 };
    list.forEach((n, i) => {
      index[n.label] = i + 1;
    });
    const tops = list.filter((n) => !n.parent);
    const b: Body[] = [{ x: cx, y: cy, vx: 0, vy: 0 }];
    const seatOf: Record<string, number> = {};
    list.forEach(() => {
      b.push({ x: cx, y: cy, vx: 0, vy: 0 });
    });
    tops.forEach((n, k) => {
      const a = -Math.PI / 2 + (k * 2 * Math.PI) / tops.length;
      const body = b[index[n.label]];
      body.x = cx + Math.cos(a) * radius;
      body.y = cy + Math.sin(a) * radius * 0.72;
      seatOf[n.label] = a;
    });
    list
      .filter((n) => n.parent)
      .forEach((n, k) => {
        const pa = seatOf[n.parent!] || 0;
        const a = pa + (k % 2 ? 0.55 : -0.55);
        const p = b[index[n.parent!]];
        const body = b[index[n.label]];
        body.x = p.x + Math.cos(a) * radius * 0.5;
        body.y = p.y + Math.sin(a) * radius * 0.42;
      });
    bodies.current = b;
    links.current = list.map((n) => {
      const from = n.parent ? index[n.parent] : 0;
      const to = index[n.label];
      const a = b[from],
        c = b[to];
      const rest = Math.hypot(c.x - a.x, c.y - a.y);
      // each bond breathes on its own clock, so the lattice never pulses in unison
      return { from, to, rest, restBase: rest, freq: 0.22 + Math.random() * 0.38, phase: Math.random() * Math.PI * 2 };
    });
  }

  const [, tick] = useState(0);
  const [held, setHeld] = useState<string | null>(null);
  const drag = useRef<{ index: number; label: string | null; x: number; y: number; ox: number; oy: number; moved: boolean } | null>(
    null
  );
  const grab = dot + 26;

  useEffect(() => {
    let raf: number;
    const step = () => {
      const b = bodies.current!;
      const L = links.current;
      const di = drag.current ? drag.current.index : -1;
      const now = performance.now() / 1000;
      for (let k = 0; k < L.length; k++) {
        const l = L[k];
        l.rest = l.restBase * (1 + 0.35 * Math.sin(now * l.freq + l.phase));
      }
      for (let s = 0; s < 2; s++) {
        for (let k = 0; k < L.length; k++) {
          const l = L[k],
            a = b[l.from],
            c = b[l.to];
          let dx = c.x - a.x,
            dy = c.y - a.y;
          const d = Math.hypot(dx, dy) || 0.001;
          const f = (d - l.rest) * 0.055;
          dx /= d;
          dy /= d;
          // constant correction weight: a pinned end must not stiffen the bond, or the
          // spring/repulsion balance shifts and the link visibly contracts on grab
          if (l.from !== di) {
            a.vx += dx * f;
            a.vy += dy * f;
          }
          if (l.to !== di) {
            c.vx -= dx * f;
            c.vy -= dy * f;
          }
        }
        for (let i = 0; i < b.length; i++) {
          for (let j = i + 1; j < b.length; j++) {
            const a = b[i],
              c = b[j];
            let dx = c.x - a.x,
              dy = c.y - a.y;
            const d2 = dx * dx + dy * dy || 1;
            if (d2 > 160000) continue;
            const f = 9000 / d2;
            const d = Math.sqrt(d2);
            dx /= d;
            dy /= d;
            a.vx -= dx * f;
            a.vy -= dy * f;
            c.vx += dx * f;
            c.vy += dy * f;
          }
        }
        b[0].vx += (cx - b[0].x) * 0.0015;
        b[0].vy += (cy - b[0].y) * 0.0015;
        // slow drift around the hub — the lattice is never quite still
        for (let i = 1; i < b.length; i++) {
          if (i === di) continue;
          const n = b[i];
          n.vx += -(n.y - b[0].y) * 0.0000583;
          n.vy += (n.x - b[0].x) * 0.0000583;
        }
        for (let i = 0; i < b.length; i++) {
          const n = b[i];
          if (i === di) {
            n.vx = 0;
            n.vy = 0;
            continue;
          }
          n.vx *= 0.82;
          n.vy *= 0.82;
          n.x += n.vx;
          n.y += n.vy;
        }
      }
      let moving = false;
      for (let i = 0; i < b.length; i++) if (Math.abs(b[i].vx) + Math.abs(b[i].vy) > 0.01) moving = true;
      if (moving || drag.current) tick((t) => t + 1);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [cx, cy]);

  const down = (e: React.PointerEvent, index: number, label: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    setHeld(label || "HUB");
    drag.current = { index, label, x: e.clientX, y: e.clientY, ox: bodies.current![index].x, oy: bodies.current![index].y, moved: false };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic pointers */
    }
  };
  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x,
      dy = e.clientY - d.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) d.moved = true;
    const n = bodies.current![d.index];
    n.x = d.ox + dx;
    n.y = d.oy + dy;
    tick((t) => t + 1);
  };
  const up = (e?: React.PointerEvent) => {
    const d = drag.current;
    if (d && !d.moved && d.label) onSelect?.(d.label);
    if (e?.currentTarget && e.pointerId != null) {
      try {
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);
      } catch {
        /* not captured */
      }
    }
    drag.current = null;
    setHeld(null);
  };

  const b = bodies.current;
  const lit = (label: string) => held === label || active === label;

  return (
    <div
      onPointerMove={move}
      onPointerUp={up}
      className={styles.wrap}
      style={{ width, height, ...style }}
    >
      <div
        onPointerDown={() => {
          if (!drag.current) onDeselect?.();
        }}
        className={styles.hitArea}
      />
      <svg width={width} height={height} className={styles.lines}>
        {links.current.map((l, i) => (
          <line key={i} x1={b[l.from].x} y1={b[l.from].y} x2={b[l.to].x} y2={b[l.to].y} className={styles.line} />
        ))}
      </svg>
      <div
        onPointerDown={(e) => down(e, 0, null)}
        onPointerUp={up}
        onPointerCancel={up}
        className={styles.node}
        style={{ left: b[0].x - grab / 2, top: b[0].y - grab / 2, width: grab, height: grab, cursor: held ? "grabbing" : "grab" }}
      >
        <div className={`${styles.hub} ${held === "HUB" ? styles.hubHeld : ""}`} style={{ width: hub, height: hub }} />
      </div>
      {list.map((n, i) => (
        <div
          key={n.label}
          onPointerDown={(e) => down(e, i + 1, n.label)}
          onPointerUp={up}
          onPointerCancel={up}
          className={styles.node}
          style={{ left: b[i + 1].x - grab / 2, top: b[i + 1].y - grab / 2, width: grab, height: grab, cursor: held ? "grabbing" : "grab" }}
        >
          <div className={`${styles.dot} ${lit(n.label) ? styles.dotLit : ""}`} style={{ width: dot, height: dot }} />
          <span
            className={`${styles.nodeLabel} ${lit(n.label) ? styles.nodeLabelLit : ""}`}
            style={{ top: grab / 2 + dot / 2 + 9, fontSize }}
          >
            {n.label}
          </span>
        </div>
      ))}
    </div>
  );
}
