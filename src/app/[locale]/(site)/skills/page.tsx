import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, getDictionary } from "@/lib/i18n";
import { SkillsScreen } from "@/components/screens/SkillsScreen";
import { getSiteSettings, getSkills } from "@/sanity/queries";

export async function generateMetadata(props: PageProps<"/[locale]/skills">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  return { title: getDictionary(locale).meta.skills };
}

export default async function SkillsPage(props: PageProps<"/[locale]/skills">) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const [skills, settings] = await Promise.all([getSkills(locale), getSiteSettings(locale)]);
  return <SkillsScreen skills={skills} emptyState={settings.skills.emptyState} locale={locale} />;
}
