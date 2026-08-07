import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const sizes = [
  { name: "mobile-360", w: 360, h: 800 },
  { name: "tabletP-768", w: 768, h: 1024 },
  { name: "tabletL-1024", w: 1024, h: 768 },
  { name: "laptop-1440", w: 1440, h: 900 },
  { name: "desktop-1920", w: 1920, h: 1080 },
];
const routes = ["/", "/about", "/contact"];

mkdirSync("/tmp/shots", { recursive: true });
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let overflowFound = false;
for (const route of routes) {
  for (const s of sizes) {
    const page = await browser.newPage({ viewport: { width: s.w, height: s.h } });
    await page.goto(`http://localhost:3411${route}`, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 0) {
      overflowFound = true;
      console.log(`OVERFLOW ${route} @ ${s.name}: ${overflow}px`);
    }
    const file = `/tmp/shots/${route === "/" ? "hero" : route.slice(1)}-${s.name}.png`;
    await page.screenshot({ path: file, fullPage: false });
    await page.close();
  }
}
if (!overflowFound) console.log("No horizontal overflow at any tested size.");
await browser.close();
