import type { Metadata } from "next";
import { SkillsScreen } from "@/components/screens/SkillsScreen";
import { getSiteSettings, getSkills } from "@/sanity/queries";

export const metadata: Metadata = { title: "Навыки" };

export default async function SkillsPage() {
  const [skills, settings] = await Promise.all([getSkills(), getSiteSettings()]);
  return <SkillsScreen skills={skills} emptyState={settings.skills.emptyState} />;
}
