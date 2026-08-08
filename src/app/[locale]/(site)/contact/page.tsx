import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, getDictionary } from "@/lib/i18n";
import { ContactScreen } from "@/components/screens/ContactScreen";
import { getSiteSettings } from "@/sanity/queries";

export async function generateMetadata(props: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  return { title: getDictionary(locale).meta.contact };
}

export default async function ContactPage(props: PageProps<"/[locale]/contact">) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const settings = await getSiteSettings(locale);
  return <ContactScreen settings={settings} locale={locale} />;
}
