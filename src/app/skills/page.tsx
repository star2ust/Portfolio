import type { Metadata } from "next";
import { SkillsScreen } from "@/components/screens/SkillsScreen";

export const metadata: Metadata = { title: "Навыки" };

export default function SkillsPage() {
  return <SkillsScreen />;
}
