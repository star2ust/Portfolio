import type { Metadata } from "next";
import { AboutScreen } from "@/components/screens/AboutScreen";
import { getSiteSettings } from "@/sanity/queries";

export const metadata: Metadata = { title: "Обо мне" };

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return <AboutScreen settings={settings} />;
}
