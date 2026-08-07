import type { Metadata } from "next";
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

// Bare shell only — the marketing site's preloader/page-transition chrome lives in
// (site)/layout.tsx, not here, so /studio (Sanity Studio's own React app) doesn't get
// wrapped in it. See that file's doc comment for why that combination broke.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
