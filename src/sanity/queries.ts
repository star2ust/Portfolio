import { groq } from "next-sanity";
import { client } from "./client";
import { urlFor } from "./image";
import { SKILL_GRAPH_PARENTS } from "@/components/screens/skillGraphEdges";
import {
  findAdjacentProjects,
  findProjectBySlug,
  SEED_PROJECTS,
  SEED_SITE_SETTINGS,
  SEED_SKILLS,
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

interface RawProject {
  slug: string;
  title: string;
  tech: string;
  year: string;
  cover: SanityImage;
  gallery?: SanityImage[];
  role?: string;
  body?: string;
  tasks?: string[];
  result?: string;
  vimeoUrl?: string;
  order: number;
}

function mapProject(raw: RawProject): Project {
  return {
    slug: raw.slug,
    title: raw.title,
    tech: raw.tech,
    year: raw.year,
    image: imageUrl(raw.cover, 1400) ?? "/images/work/veb-generative.jpg",
    gallery: (raw.gallery ?? []).map((g) => imageUrl(g, 1400)).filter((u): u is string => Boolean(u)),
    index: String(raw.order).padStart(2, "0"),
    role: raw.role ?? "",
    body: raw.body ?? "",
    tasks: raw.tasks ?? [],
    result: raw.result ?? "",
    vimeoUrl: raw.vimeoUrl,
  };
}

const PROJECTS_QUERY = groq`*[_type == "project"] | order(order asc) {
  "slug": slug.current, title, tech, year, cover, gallery, role, body, tasks, result, vimeoUrl, order
}`;

export async function getProjects(): Promise<Project[]> {
  if (!client) return SEED_PROJECTS;
  const raw = await client.fetch<RawProject[]>(PROJECTS_QUERY, {}, { next: { tags: [TAGS.project] } });
  return raw.length ? raw.map(mapProject) : SEED_PROJECTS;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return findProjectBySlug(projects, slug);
}

export async function getAdjacentProjects(slug: string): Promise<{ prev: Project; next: Project }> {
  const projects = await getProjects();
  return findAdjacentProjects(projects, slug);
}

const SKILLS_QUERY = groq`*[_type == "skill"] | order(name asc) { name, level, body }`;

export async function getSkills(): Promise<Skill[]> {
  if (!client) return SEED_SKILLS;
  const raw = await client.fetch<Skill[]>(SKILLS_QUERY, {}, { next: { tags: [TAGS.skill] } });
  if (!raw.length) return SEED_SKILLS;
  return raw.map((s) => ({ ...s, parent: SKILL_GRAPH_PARENTS[s.name] }));
}

interface RawSiteSettings {
  name?: string;
  role?: string;
  heroSpecs?: { label: string; value: string }[];
  aboutTitle?: string;
  aboutLede?: string;
  aboutBody1?: string;
  aboutBody2?: string;
  aboutPortrait?: SanityImage;
  aboutMeta?: { label: string; value: string }[];
  workLede?: string;
  skillsEmptyState?: string;
  contactTitle?: string;
  contactRows?: { label?: string; value: string; href: string; mark?: boolean }[];
}

const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]`;

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!client) return SEED_SITE_SETTINGS;
  const raw = await client.fetch<RawSiteSettings | null>(SITE_SETTINGS_QUERY, {}, { next: { tags: [TAGS.siteSettings] } });
  if (!raw) return SEED_SITE_SETTINGS;
  return {
    name: raw.name || SEED_SITE_SETTINGS.name,
    role: raw.role || SEED_SITE_SETTINGS.role,
    heroSpecs: raw.heroSpecs?.length ? raw.heroSpecs : SEED_SITE_SETTINGS.heroSpecs,
    about: {
      title: raw.aboutTitle || SEED_SITE_SETTINGS.about.title,
      lede: raw.aboutLede || SEED_SITE_SETTINGS.about.lede,
      body1: raw.aboutBody1 || SEED_SITE_SETTINGS.about.body1,
      body2: raw.aboutBody2 || SEED_SITE_SETTINGS.about.body2,
      portrait: imageUrl(raw.aboutPortrait, 1200) ?? SEED_SITE_SETTINGS.about.portrait,
      meta: raw.aboutMeta?.length ? raw.aboutMeta : SEED_SITE_SETTINGS.about.meta,
    },
    work: { lede: raw.workLede || SEED_SITE_SETTINGS.work.lede },
    skills: { emptyState: raw.skillsEmptyState || SEED_SITE_SETTINGS.skills.emptyState },
    contact: {
      title: raw.contactTitle || SEED_SITE_SETTINGS.contact.title,
      rows: raw.contactRows?.length
        ? raw.contactRows.map((r) => ({ label: r.label ?? "", value: r.value, href: r.href, mark: r.mark ?? true }))
        : SEED_SITE_SETTINGS.contact.rows,
    },
  };
}
