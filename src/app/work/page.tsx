import type { Metadata } from "next";
import { WorkScreen } from "@/components/screens/WorkScreen";
import { getProjects, getSiteSettings } from "@/sanity/queries";

export const metadata: Metadata = { title: "Проекты" };

export default async function WorkPage() {
  const [projects, settings] = await Promise.all([getProjects(), getSiteSettings()]);
  return <WorkScreen projects={projects} lede={settings.work.lede} />;
}
