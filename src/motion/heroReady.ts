/**
 * A one-shot signal HeroVideo fires once its video has a real first frame (see its own
 * onLoadedData), and Preloader can optionally wait on before it finishes §1's boot sequence —
 * so on a first-ever visit that lands on the homepage, the preloader stays up long enough for the
 * video itself to be ready, instead of finishing on its own schedule (fonts + a fixed minimum
 * time) and handing off to a page that's still showing its poster image underneath.
 *
 * HeroVideo mounts and starts its own video download in parallel with the preloader (RouteTransition
 * keeps `children` mounted, just opacity: 0, the whole time the preloader is up) — so this isn't
 * extra wait bolted on top of the existing load; it's the preloader staying up for exactly the
 * remainder of a download that was already happening underneath it.
 *
 * A plain module-level Promise (not e.g. a React context) is enough: there is exactly one Hero
 * video and exactly one Preloader alive at a time, both under the same root layout.
 */

let resolveReady: (() => void) | null = null;

export const heroVideoReady = new Promise<void>((resolve) => {
  resolveReady = resolve;
});

export function markHeroVideoReady(): void {
  resolveReady?.();
  resolveReady = null;
}
