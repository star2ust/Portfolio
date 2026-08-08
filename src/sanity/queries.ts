import { groq } from "next-sanity";
import { client } from "./client";
import { urlFor } from "./image";
import { SKILL_GRAPH_PARENTS } from "@/components/screens/skillGraphEdges";
import type { Locale } from "@/lib/i18n";
import {
  findAdjacentProjects,
  findProjectBySlug,
  getSeedProjects,
  getSeedSiteSettings,
  getSeedSkills,
  type Project,
  type Skill,
  type SiteSettings,
} from "@/lib/content";

// Revalidation tags — the webhook route (src/app/api/revalidate/route.ts) calls
// revalidateTag(...) with the changed document's _type, which is exactly these tag names.
const TAGS = { project: "project", skill: "skill", siteSettings: "siteSettings" } as const;

type SanityImage = { asset?: { _ref?: string } } | null | undefined;

function imageUrl(img: SanityImage, width: number): string | undefined {
  if (!img?.asset?._ref) return undefined;
  return urlFor(img).width(width).auto("format").url();
}

/** locale === "en": prefer the *En field, fall back to the Russian one (a document only
 *  partway translated in Studio still renders something instead of a blank field). */
function pick(locale: Locale, en: string | undefined, ru: string | undefined): string | undefined {
  if (locale === "en") return en || ru;
  return ru;
}

interface RawProject {
  slug: string;
  title: string;
  titleEn?: string;
  tech: string;
  year: string;
  cover: SanityImage;
  gallery?: SanityImage[];
  role?: string;
  roleEn?: string;
  body?: string;
  bodyEn?: string;
  tasks?: string[];
  tasksEn?: string[];
  result?: string;
  resultEn?: string;
  vimeoUrl?: string;
  order: number;
}

function mapProject(raw: RawProject, locale: Locale): Project {
  return {
    slug: raw.slug,
    title: pick(locale, raw.titleEn, raw.title) ?? raw.title,
    tech: raw.tech,
    year: raw.year,
    image: imageUrl(raw.cover, 1400) ?? "/images/work/veb-generative.jpg",
    gallery: (raw.gallery ?? []).map((g) => imageUrl(g, 1400)).filter((u): u is string => Boolean(u)),
    index: String(raw.order).padStart(2, "0"),
    role: pick(locale, raw.roleEn, raw.role) ?? "",
    body: pick(locale, raw.bodyEn, raw.body) ?? "",
    tasks: (locale === "en" && raw.tasksEn?.length ? raw.tasksEn : raw.tasks) ?? [],
    result: pick(locale, raw.resultEn, raw.result) ?? "",
    vimeoUrl: raw.vimeoUrl,
  };
}

const PROJECTS_QUERY = groq`*[_type == "project"] | order(order asc) {
  "slug": slug.current, title, titleEn, tech, year, cover, gallery,
  role, roleEn, body, bodyEn, tasks, tasksEn, result, resultEn, vimeoUrl, order
}`;

export async function getProjects(locale: Locale): Promise<Project[]> {
  if (!client) return getSeedProjects(locale);
  const raw = await client.fetch<RawProject[]>(PROJECTS_QUERY, {}, { next: { tags: [TAGS.project] } });
  return raw.length ? raw.map((p) => mapProject(p, locale)) : getSeedProjects(locale);
}

export async function getProjectBySlug(locale: Locale, slug: string): Promise<Project | undefined> {
  const projects = await getProjects(locale);
  return findProjectBySlug(projects, slug);
}

export async function getAdjacentProjects(locale: Locale, slug: string): Promise<{ prev: Project; next: Project }> {
  const projects = await getProjects(locale);
  return findAdjacentProjects(projects, slug);
}

interface RawSkill {
  name: string;
  level: number;
  body: string;
  bodyEn?: string;
}

const SKILLS_QUERY = groq`*[_type == "skill"] | order(name asc) { name, level, body, bodyEn }`;

export async function getSkills(locale: Locale): Promise<Skill[]> {
  if (!client) return getSeedSkills(locale);
  const raw = await client.fetch<RawSkill[]>(SKILLS_QUERY, {}, { next: { tags: [TAGS.skill] } });
  if (!raw.length) return getSeedSkills(locale);
  return raw.map((s) => ({
    name: s.name,
    level: s.level,
    body: pick(locale, s.bodyEn, s.body) ?? s.body,
    parent: SKILL_GRAPH_PARENTS[s.name],
  }));
}

interface RawSiteSettings {
  name?: string;
  role?: string;
  heroSpecs?: { label: string; value: string }[];
  heroSpecsEn?: { label: string; value: string }[];
  aboutTitle?: string;
  aboutTitleEn?: string;
  aboutLede?: string;
  aboutLedeEn?: string;
  aboutBody1?: string;
  aboutBody1En?: string;
  aboutBody2?: string;
  aboutBody2En?: string;
  aboutPortrait?: SanityImage;
  aboutMeta?: { label: string; value: string }[];
  aboutMetaEn?: { label: string; value: string }[];
  workLede?: string;
  workLedeEn?: string;
  skillsEmptyState?: string;
  skillsEmptyStateEn?: string;
  contactTitle?: string;
  contactTitleEn?: string;
  contactRows?: { label?: string; value: string; href: string; mark?: boolean }[];
}

const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]`;

export async function getSiteSettings(locale: Locale): Promise<SiteSettings> {
  const seed = getSeedSiteSettings(locale);
  if (!client) return seed;
  const raw = await client.fetch<RawSiteSettings | null>(SITE_SETTINGS_QUERY, {}, { next: { tags: [TAGS.siteSettings] } });
  if (!raw) return seed;
  const heroSpecs = locale === "en" && raw.heroSpecsEn?.length ? raw.heroSpecsEn : raw.heroSpecs;
  const aboutMeta = locale === "en" && raw.aboutMetaEn?.length ? raw.aboutMetaEn : raw.aboutMeta;
  return {
    name: raw.name || seed.name,
    role: raw.role || seed.role,
    heroSpecs: heroSpecs?.length ? heroSpecs : seed.heroSpecs,
    about: {
      title: pick(locale, raw.aboutTitleEn, raw.aboutTitle) || seed.about.title,
      lede: pick(locale, raw.aboutLedeEn, raw.aboutLede) || seed.about.lede,
      body1: pick(locale, raw.aboutBody1En, raw.aboutBody1) || seed.about.body1,
      body2: pick(locale, raw.aboutBody2En, raw.aboutBody2) || seed.about.body2,
      portrait: imageUrl(raw.aboutPortrait, 1200) ?? seed.about.portrait,
      meta: aboutMeta?.length ? aboutMeta : seed.about.meta,
    },
    work: { lede: pick(locale, raw.workLedeEn, raw.workLede) || seed.work.lede },
    skills: { emptyState: pick(locale, raw.skillsEmptyStateEn, raw.skillsEmptyState) || seed.skills.emptyState },
    contact: {
      title: pick(locale, raw.contactTitleEn, raw.contactTitle) || seed.contact.title,
      rows: raw.contactRows?.length
        ? raw.contactRows.map((r) => ({ label: r.label ?? "", value: r.value, href: r.href, mark: r.mark ?? true }))
        : seed.contact.rows,
    },
  };
}
