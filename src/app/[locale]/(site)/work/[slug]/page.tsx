import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, getDictionary, DEFAULT_LOCALE } from "@/lib/i18n";
import { DetailScreen } from "@/components/screens/DetailScreen";
import { getAdjacentProjects, getProjectBySlug, getProjects } from "@/sanity/queries";

// Project slugs are locale-independent (only the prose differs, see queries.ts) — one fetch,
// in any locale, is enough to enumerate every /work/[slug] page for every locale prefix.
export async function generateStaticParams() {
  const projects = await getProjects(DEFAULT_LOCALE);
  return projects.map((p) => ({ slug: p.slug }));
}

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
  const { prev, next } = await getAdjacentProjects(locale, slug);
  return <DetailScreen project={project} prev={prev} next={next} locale={locale} />;
}
