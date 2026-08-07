/**
 * The Work -> Detail FLIP hand-off (§7): "the card image flies to the detail slot." A real
 * client-side navigation unmounts the grid and mounts a brand new route, so there's no live
 * React tree spanning both screens to hand a bounding rect through as a prop — sessionStorage is
 * the bridge instead, written at click time on the grid and read once on the detail page's mount.
 *
 * One-shot by design: consuming a rect deletes it, so refreshing the detail page or navigating to
 * it any other way (a shared link, back/forward) never plays a stale or wrong animation.
 */

const KEY = "sd-flip-rect";
const MAX_AGE_MS = 4000; // guards against a rect surviving an unrelated later navigation

export interface FlipRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function storeFlipRect(slug: string, rect: FlipRect): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ slug, rect, ts: Date.now() }));
  } catch {
    // sessionStorage unavailable (private mode, etc.) — the detail page just renders unanimated
  }
}

export function consumeFlipRect(slug: string): FlipRect | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    const parsed = JSON.parse(raw) as { slug: string; rect: FlipRect; ts: number };
    if (parsed.slug !== slug) return null;
    if (Date.now() - parsed.ts > MAX_AGE_MS) return null;
    return parsed.rect;
  } catch {
    return null;
  }
}
