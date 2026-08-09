import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, getDictionary, DEFAULT_LOCALE } from "@/lib/i18n";
import { getVimeoOEmbed } from "@/lib/vimeo";
import { DetailScreen } from "@/components/screens/DetailScreen";
import { getAdjacentProjects, getProjectBySlug, getProjects } from "@/sanity/queries";

// Project slugs are locale-independent (only the prose differs, see queries.ts) — one fetch,
// in any locale, is enough to enumerate every /work/[slug] page for every locale prefix.
export async function generateStaticParams() {
  const projects = await getProjects(DEFAULT_LOCALE);
  return projects.map((p) => ({ slug: p.slug }));
}

// The [locale] root layout sets dynamicParams = false (rejecting any segment value besides
// ru/en), and that setting inherits down through every nested dynamic segment below it unless a
// segment re-declares its own — including this one. Left inherited, any project slug published
// in Sanity *after* the last build/dev-server start 404s outright, since it was never in the
// generateStaticParams snapshot above: exactly the bug reported ("first project I added works,
// every one after 404s"). true here means slugs outside that snapshot render on demand instead.
export const dynamicParams = true;

export async function generateMetadata(props: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { locale, slug } = await props.params;
  if (!isLocale(locale)) notFound();
  const project = await getProjectBySlug(locale, slug);
  return { title: project?.title ?? getDictionary(locale).meta.projectFallback };
}

export default async function ProjectDetailPage(props: PageProps<"/[locale]/work/[slug]">) {
  const { locale, slug } = await props.params;
  if (!isLocale(locale)) notFound();
  const project = await getProjectBySlug(locale, slug);
  if (!project) notFound();
  const [{ prev, next }, videoThumbnail] = await Promise.all([
    getAdjacentProjects(locale, slug),
    project.vimeoUrl ? getVimeoOEmbed(project.vimeoUrl).then((r) => r?.thumbnailUrl) : Promise.resolve(undefined),
  ]);
  return <DetailScreen project={project} prev={prev} next={next} locale={locale} videoThumbnail={videoThumbnail} />;
}
