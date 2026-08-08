import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, getDictionary } from "@/lib/i18n";
import { AboutScreen } from "@/components/screens/AboutScreen";
import { getSiteSettings } from "@/sanity/queries";

export async function generateMetadata(props: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  return { title: getDictionary(locale).meta.about };
}

export default async function AboutPage(props: PageProps<"/[locale]/about">) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const settings = await getSiteSettings(locale);
  return <AboutScreen settings={settings} locale={locale} />;
}
