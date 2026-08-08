import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { HeroScreen } from "@/components/screens/HeroScreen";
import { getSiteSettings } from "@/sanity/queries";

export default async function HeroPage(props: PageProps<"/[locale]">) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const settings = await getSiteSettings(locale);
  return <HeroScreen settings={settings} locale={locale} />;
}
