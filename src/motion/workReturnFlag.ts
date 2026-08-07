/**
 * The Work grid's phrase intro (§6, see WorkPhraseAndGrid) should replay on every fresh visit
 * to /work — from Home, Contact, Skills, wherever — and only skip straight to the revealed grid
 * when the visitor is specifically *closing* a project detail page back out to it. A real
 * client-side navigation unmounts the grid before the detail page even exists, so there's no
 * live state to carry that distinction through — sessionStorage is the bridge, written at the
 * moment a project card is clicked (about to leave for its detail page) and consumed once, right
 * back off, the next time the grid mounts. Landing on /work any other way never sets this flag,
 * so the intro plays normally.
 */

const KEY = "sd-work-return-instant";

export function markReturningToWorkInstant(): void {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    // sessionStorage unavailable — the grid just plays its intro again, no worse than not having this at all
  }
}

export function consumeReturningToWorkInstant(): boolean {
  try {
    const flagged = sessionStorage.getItem(KEY) === "1";
    sessionStorage.removeItem(KEY);
    return flagged;
  } catch {
    return false;
  }
}
