import type { MetadataRoute } from "next";
import { getProjects } from "@/sanity/queries";
import { LOCALES, localeHref, type Locale } from "@/lib/i18n";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio.vercel.app";

const STATIC_PATHS = [
  { path: "/", changeFrequency: "monthly" as const, priority: 1 },
  { path: "/about", changeFrequency: "yearly" as const, priority: 0.6 },
  { path: "/work", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/skills", changeFrequency: "yearly" as const, priority: 0.5 },
  { path: "/contact", changeFrequency: "yearly" as const, priority: 0.5 },
];

/** { ru: "...url", en: "...url" } for a given unprefixed path — Next.js turns this into the
 *  sitemap's <xhtml:link rel="alternate" hreflang="..."> entries pointing every locale's URL at
 *  its siblings, so search engines serve the visitor's language instead of guessing. */
function languageAlternates(path: string): Record<Locale, string> {
  return Object.fromEntries(LOCALES.map((l) => [l, `${siteUrl}${localeHref(l, path)}`])) as Record<Locale, string>;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projectsByLocale = Object.fromEntries(
    await Promise.all(LOCALES.map(async (l) => [l, await getProjects(l)] as const))
  ) as Record<Locale, Awaited<ReturnType<typeof getProjects>>>;

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const { path, changeFrequency, priority } of STATIC_PATHS) {
      entries.push({
        url: `${siteUrl}${localeHref(locale, path)}`,
        changeFrequency,
        priority,
        alternates: { languages: languageAlternates(path) },
      });
    }
    for (const p of projectsByLocale[locale]) {
      entries.push({
        url: `${siteUrl}${localeHref(locale, `/work/${p.slug}`)}`,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: languageAlternates(`/work/${p.slug}`) },
      });
    }
  }

  return entries;
}
