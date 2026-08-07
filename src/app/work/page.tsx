import type { Metadata } from "next";
import { WorkScreen } from "@/components/screens/WorkScreen";

export const metadata: Metadata = { title: "Проекты" };

export default function WorkPage() {
  return <WorkScreen />;
}
