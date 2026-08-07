import type { Metadata } from "next";
import { AboutScreen } from "@/components/screens/AboutScreen";

export const metadata: Metadata = { title: "Обо мне" };

export default function AboutPage() {
  return <AboutScreen />;
}
