/**
 * Locale plumbing: the two supported locales, a UI-string dictionary (nav labels, chrome
 * aria-labels, pager/meta labels, per-route <title>s), and small helpers for building
 * locale-prefixed hrefs. Content (project/skill/site copy) is *not* here — that's
 * locale-aware too, but it comes from Sanity/content.ts (see queries.ts), since it's authored
 * content rather than fixed UI chrome.
 *
 * Both locales are always prefixed (/ru/..., /en/...) — no bare, unprefixed default — so a URL
 * is unambiguous on its own. src/proxy.ts redirects unprefixed requests (old bookmarks/links,
 * or a fresh "/") to the right prefix.
 */

export const LOCALES = ["ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ru";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** path is the unprefixed route, e.g. "/", "/about", "/work/some-slug" — never build one of
 *  these by hand with string concatenation elsewhere, so a locale never gets missed. */
export function localeHref(locale: Locale, path: string): string {
  return `/${locale}${path === "/" ? "" : path}`;
}

/** Rewrites an already-prefixed pathname (from usePathname()) onto a different locale, keeping
 *  everything after the locale segment as-is — used by the language switcher so flipping
 *  language mid-project-detail-page stays on that same project instead of bouncing home. */
export function swapLocalePath(pathname: string, locale: Locale): string {
  const rest = pathname.replace(/^\/(ru|en)/, "");
  return `/${locale}${rest}`;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Dictionary {
  nav: { home: string; about: string; work: string; skills: string; contact: string };
  aria: { primaryNav: string; menu: string; close: string; back: string };
  prevNext: { prev: string; next: string; projectWord: string };
  projectMeta: { tasks: string; result: string };
  detail: { videoTitleSuffix: string };
  gallery: {
    prevPhoto: string;
    nextPhoto: string;
    photoSuffix: string;
    openPhoto: string;
    openVideo: string;
    scrollPrev: string;
    scrollNext: string;
  };
  skillGraph: { ariaLabel: string };
  levelDots: { label: string };
  meta: {
    home: string;
    about: string;
    work: string;
    skills: string;
    contact: string;
    projectFallback: string;
    siteDescription: string;
    ogLocale: string;
  };
  languageSwitcher: { switchTo: Record<Locale, string> };
}

const ru: Dictionary = {
  nav: { home: "ГЛАВНАЯ", about: "ОБО МНЕ", work: "ПРОЕКТЫ", skills: "НАВЫКИ", contact: "КОНТАКТЫ" },
  aria: { primaryNav: "Основная навигация", menu: "меню", close: "закрыть", back: "назад" },
  prevNext: { prev: "Предыдущий", next: "Следующий", projectWord: "проект" },
  projectMeta: { tasks: "Задачи:", result: "Результат:" },
  detail: { videoTitleSuffix: "видео" },
  gallery: {
    prevPhoto: "Предыдущее фото",
    nextPhoto: "Следующее фото",
    photoSuffix: "фото",
    openPhoto: "Открыть фото крупнее",
    openVideo: "Открыть видео",
    scrollPrev: "Прокрутить назад",
    scrollNext: "Прокрутить вперёд",
  },
  skillGraph: { ariaLabel: "Граф навыков — выберите узел, чтобы увидеть описание" },
  levelDots: { label: "УРОВЕНЬ" },
  meta: {
    home: "Хабаров Егор — Interactive Developer",
    about: "Обо мне",
    work: "Проекты",
    skills: "Навыки",
    contact: "Контакты",
    projectFallback: "Проект",
    siteDescription:
      "Я Егор, создаю информационные приложения и интерактивные инсталляции с реалтайм-опытом. Unity, TouchDesigner, Arduino, VR, фотограмметрия.",
    ogLocale: "ru_RU",
  },
  languageSwitcher: { switchTo: { ru: "Переключить на русский", en: "Переключить на английский" } },
};

const en: Dictionary = {
  nav: { home: "HOME", about: "ABOUT", work: "WORK", skills: "SKILLS", contact: "CONTACT" },
  aria: { primaryNav: "Primary navigation", menu: "menu", close: "close", back: "back" },
  prevNext: { prev: "Previous", next: "Next", projectWord: "project" },
  projectMeta: { tasks: "Tasks:", result: "Result:" },
  detail: { videoTitleSuffix: "video" },
  gallery: {
    prevPhoto: "Previous photo",
    nextPhoto: "Next photo",
    photoSuffix: "photo",
    openPhoto: "Open photo full-size",
    openVideo: "Open video",
    scrollPrev: "Scroll back",
    scrollNext: "Scroll forward",
  },
  skillGraph: { ariaLabel: "Skills graph — select a node to see the description" },
  levelDots: { label: "LEVEL" },
  meta: {
    home: "Egor Khabarov — Interactive Developer",
    about: "About",
    work: "Work",
    skills: "Skills",
    contact: "Contact",
    projectFallback: "Project",
    siteDescription:
      "I'm Egor — I build interactive installations and information kiosks with real-time graphics. Unity, TouchDesigner, Arduino, VR, photogrammetry.",
    ogLocale: "en_US",
  },
  languageSwitcher: { switchTo: { ru: "Switch to Russian", en: "Switch to English" } },
};

const DICTIONARIES: Record<Locale, Dictionary> = { ru, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/** The site nav, translated + locale-prefixed — shared by NavMenu's default items and
 *  PrimaryNav's mobile overlay so the two lists can never drift apart. */
export function getSiteNav(locale: Locale): NavItem[] {
  const dict = getDictionary(locale);
  return [
    { label: dict.nav.home, href: localeHref(locale, "/") },
    { label: dict.nav.about, href: localeHref(locale, "/about") },
    { label: dict.nav.work, href: localeHref(locale, "/work") },
    { label: dict.nav.skills, href: localeHref(locale, "/skills") },
    { label: dict.nav.contact, href: localeHref(locale, "/contact") },
  ];
}
