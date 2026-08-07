import { HeroScreen } from "@/components/screens/HeroScreen";
import { getSiteSettings } from "@/sanity/queries";

export default async function HeroPage() {
  const settings = await getSiteSettings();
  return <HeroScreen settings={settings} />;
}
