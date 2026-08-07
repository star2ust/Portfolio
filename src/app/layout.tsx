import type { Metadata } from "next";
import { RouteTransition } from "@/motion/RouteTransition";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio.vercel.app";
const title = "Хабаров Егор — Interactive Developer";
const description =
  "Я Егор, создаю информационные приложения и интерактивные инсталляции с реалтайм-опытом. Unity, TouchDesigner, Arduino, VR, фотограмметрия.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s — Хабаров Егор" },
  description,
  keywords: [
    "Interactive Developer",
    "Unity",
    "TouchDesigner",
    "интерактивные инсталляции",
    "VR тренажер",
    "реалтайм графика",
  ],
  authors: [{ name: "Хабаров Егор" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: title,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body>
        <RouteTransition>{children}</RouteTransition>
      </body>
    </html>
  );
}
