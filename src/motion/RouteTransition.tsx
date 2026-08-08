"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Preloader } from "./Preloader";
import { ArcWipe } from "./ArcWipe";
import { useReducedMotion } from "./useReducedMotion";

const DETAIL_PATTERN = /^\/(ru|en)\/work\/[^/]+$/;

function isDetailRoute(path: string): boolean {
  return DETAIL_PATTERN.test(path);
}

type Phase = "idle" | "covering" | "revealing";

/**
 * Root-layout chrome for the choreographed page-transition layer:
 *  - §1/§2: the preloader plays once on first load, then the first page fades in.
 *  - §3: every route change covers the screen, navigates underneath the cover, then cross-fades
 *    it away to reveal the new page — matching the source's own two-stage approach (an arc-
 *    shaped wipe to cover, then a separate flat sheet that fades away, "so the new screen
 *    surfaces through it with no flash"). Transitions into/out of the project detail page (§7)
 *    use a plain fade for the covering stage instead of the arc shape.
 *
 * Real `<Link>`s degrade gracefully: this only intercepts clicks once mounted client-side — a
 * click before hydration (or with JS disabled) just navigates normally, no transition.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  const [booted, setBooted] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [useFadeCover, setUseFadeCover] = useState(false);
  const pendingHref = useRef<string | null>(null);
  const currentPath = useRef(pathname);
  const phaseRef = useRef<Phase>("idle");

  const onPreloaderDone = useCallback(() => setBooted(true), []);

  // Once the new route has actually landed, start the reveal cross-fade.
  useEffect(() => {
    const changed = currentPath.current !== pathname;
    currentPath.current = pathname;
    if (changed && phaseRef.current === "covering") {
      phaseRef.current = "revealing";
      setPhase("revealing");
    }
  }, [pathname]);

  // Intercept internal <Link> clicks app-wide so the cover plays before the route actually swaps.
  useEffect(() => {
    if (reducedMotion) return;
    const onClick = (e: MouseEvent) => {
      if (phaseRef.current !== "idle") return; // a transition is already in flight — ignore
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element).closest?.("a");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      const url = new URL(anchor.href);
      if (url.pathname === currentPath.current) return;

      e.preventDefault();
      pendingHref.current = url.pathname + url.search;
      setUseFadeCover(isDetailRoute(currentPath.current) || isDetailRoute(url.pathname));
      phaseRef.current = "covering";
      setPhase("covering");
    };
    // Capture phase: must run before Next's own <Link> click handler (React's event delegation),
    // or that handler navigates first and this preventDefault() is too late to stop it.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [reducedMotion]);

  // Fires once the covering animation (arc shape or flat fade) has fully covered the screen.
  const onCoverComplete = useCallback(() => {
    const href = pendingHref.current;
    pendingHref.current = null;
    if (href) {
      router.push(href);
      // the pathname effect above flips to "revealing" once the new route actually lands
    }
  }, [router]);

  const onRevealComplete = useCallback(() => {
    phaseRef.current = "idle";
    setPhase("idle");
  }, []);

  return (
    <>
      {!booted ? <Preloader onDone={onPreloaderDone} /> : null}
      {/* key={pathname}: forces a real unmount+remount on every navigation. Without it, two
          routes that render the same component at the same tree position (e.g. /work/a ->
          /work/b, both DetailScreen) can get reconciled onto the *existing* fiber instead of
          mounting fresh, so Appear/GrowRule's useEffect-driven entrance timers never refire. */}
      <div key={pathname} style={{ opacity: booted ? 1 : 0, transition: "opacity 620ms var(--ease)" }}>
        {children}
      </div>

      {phase === "covering" &&
        (useFadeCover ? <FadeCover onEnd={onCoverComplete} /> : <ArcWipe active onEnd={onCoverComplete} />)}
      {phase === "revealing" && <RevealSheet onEnd={onRevealComplete} />}
    </>
  );
}

/** A plain full-screen fade to cover the screen — used instead of the arc for detail-page
 *  transitions (§7: "a fade, not the arc"). Mounted fresh each time it's needed, so its opacity
 *  always starts at 0 with no reset branch required. */
function FadeCover({ onEnd }: { onEnd: () => void }) {
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setOpacity(1));
    const t = setTimeout(onEnd, 340);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [onEnd]);
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
        background: "var(--surface-page)",
        opacity,
        transition: "opacity 320ms var(--ease)",
      }}
    />
  );
}

/** The reveal stage, shared by both cover kinds: a flat sheet held at full opacity for one
 *  frame, then cross-faded away so the new page surfaces with no flash. */
function RevealSheet({ onEnd }: { onEnd: () => void }) {
  const [opacity, setOpacity] = useState(1);
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setOpacity(0)));
    const t = setTimeout(onEnd, 520);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [onEnd]);
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
        background: "var(--surface-page)",
        opacity,
        transition: "opacity 460ms var(--ease)",
      }}
    />
  );
}
