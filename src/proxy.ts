import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n";

// NOTE: this file is intentionally named proxy.ts, not middleware.ts — that file convention was
// renamed in this Next.js version (see AGENTS.md: this isn't the Next.js you know). It exports
// `proxy`, not `middleware`.

function detectLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language");
  if (!header) return DEFAULT_LOCALE;
  // Naive but dependency-free negotiation: walk the header's comma-separated tags in the
  // order the browser sent them (already its own preference order) and take the first one
  // that matches a locale we support.
  for (const tag of header.split(",")) {
    const lang = tag.split(";")[0].trim().toLowerCase().split("-")[0];
    if ((LOCALES as readonly string[]).includes(lang)) return lang as Locale;
  }
  return DEFAULT_LOCALE;
}

/** Every real page route lives under /ru or /en (see src/app/[locale]) — this redirects a
 *  request with no locale prefix (a fresh "/", or an old bookmark/indexed link like "/about"
 *  from before this site had locales) to the right prefix, so every other route in the app can
 *  assume the prefix is already there instead of re-implementing this check per page. /studio
 *  and /api are deliberately unprefixed (see the matcher below) — neither is a localized page. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Skip Next internals, /studio, /api, and anything that looks like a static file
    // (has a dot in the last path segment — icons, the sitemap/robots outputs, etc).
    "/((?!_next|studio|api|.*\\..*).*)",
  ],
};
