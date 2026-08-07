import { chromium } from "playwright-core";

const sizes = [
  { name: "mobile 360", w: 360, h: 800 },
  { name: "tablet portrait 768", w: 768, h: 1024 },
  { name: "tablet landscape 1024", w: 1024, h: 768 },
  { name: "laptop 1440", w: 1440, h: 900 },
  { name: "desktop 1920", w: 1920, h: 1080 },
  { name: "mid mobile->tablet 560", w: 560, h: 800 },
  { name: "mid laptop->desktop 1700", w: 1700, h: 950 },
];

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
for (const s of sizes) {
  const page = await browser.newPage({ viewport: { width: s.w, height: s.h } });
  await page.goto("http://localhost:3411/", { waitUntil: "networkidle" });
  const gutter = await page.evaluate(() => {
    const el = document.querySelector("main")?.parentElement; // .frame
    return el ? getComputedStyle(el).paddingLeft : "n/a";
  });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  console.log(`${s.name.padEnd(28)} gutter=${gutter.padEnd(8)} hOverflowPx=${overflow}`);
  await page.close();
}
await browser.close();
