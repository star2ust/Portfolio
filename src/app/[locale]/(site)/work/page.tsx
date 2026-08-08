import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, getDictionary } from "@/lib/i18n";
import { WorkScreen } from "@/components/screens/WorkScreen";
import { getProjects, getSiteSettings } from "@/sanity/queries";

export async function generateMetadata(props: PageProps<"/[locale]/work">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  return { title: getDictionary(locale).meta.work };
}

export default async function WorkPage(props: PageProps<"/[locale]/work">) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const [projects, settings] = await Promise.all([getProjects(locale), getSiteSettings(locale)]);
  return <WorkScreen projects={projects} lede={settings.work.lede} locale={locale} />;
}
