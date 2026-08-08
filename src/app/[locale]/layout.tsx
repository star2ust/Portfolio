import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, isLocale, localeHref, getDictionary } from "@/lib/i18n";
import "../globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio.vercel.app";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

// Reject any segment value other than the ones above (e.g. /fr) with a real 404 instead of
// silently rendering — this is a locale-prefixed route tree, not a free-form dynamic one.
export const dynamicParams = false;

export async function generateMetadata(props: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const dict = getDictionary(locale);
  const title = dict.meta.home;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s — ${locale === "ru" ? "Хабаров Егор" : "Egor Khabarov"}` },
    description: dict.meta.siteDescription,
    keywords: [
      "Interactive Developer",
      "Unity",
      "TouchDesigner",
      locale === "ru" ? "интерактивные инсталляции" : "interactive installations",
      locale === "ru" ? "VR тренажер" : "VR trainer",
      locale === "ru" ? "реалтайм графика" : "real-time graphics",
    ],
    authors: [{ name: "Хабаров Егор" }],
    alternates: {
      canonical: localeHref(locale, "/"),
      languages: Object.fromEntries(LOCALES.map((l) => [l, localeHref(l, "/")])),
    },
    openGraph: {
      type: "website",
      locale: dict.meta.ogLocale,
      url: `${siteUrl}${localeHref(locale, "/")}`,
      siteName: title,
      title,
      description: dict.meta.siteDescription,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: dict.meta.siteDescription,
    },
    robots: { index: true, follow: true },
  };
}

/**
 * Root layout for the whole locale-prefixed site (/ru/*, /en/*) — <html lang> here is per-locale
 * static params, not the true filesystem root: /studio has its own root layout (src/app/studio/
 * layout.tsx) instead of sharing this one, same reasoning as the old split between the bare
 * root layout and (site)/layout.tsx (Sanity Studio's own React app doesn't tolerate being
 * nested inside chrome meant for the marketing site — see that file's history). The
 * preloader/arc-wipe transition layer still lives one level down, in (site)/layout.tsx, not
 * here — /studio never routed through it and still shouldn't.
 */
export default async function LocaleLayout(props: LayoutProps<"/[locale]">) {
  const { locale: rawLocale } = await props.params;
  if (!isLocale(rawLocale)) notFound();
  return (
    <html lang={rawLocale}>
      <body>{props.children}</body>
    </html>
  );
}
