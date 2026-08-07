import type { Metadata } from "next";
import { ContactScreen } from "@/components/screens/ContactScreen";
import { getSiteSettings } from "@/sanity/queries";

export const metadata: Metadata = { title: "Контакты" };

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return <ContactScreen settings={settings} />;
}
