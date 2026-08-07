import type { Metadata } from "next";
import { ContactScreen } from "@/components/screens/ContactScreen";

export const metadata: Metadata = { title: "Контакты" };

export default function ContactPage() {
  return <ContactScreen />;
}
