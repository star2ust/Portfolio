import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Хабаров Егор — Interactive Developer",
    template: "%s — Хабаров Егор",
  },
  description:
    "Я Егор, создаю информационные приложения и интерактивные инсталляции с реалтайм-опытом. Unity, TouchDesigner, Arduino, VR, фотограмметрия.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
