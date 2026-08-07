import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const sizes = [
  { name: "mobile-360", w: 360, h: 800 },
  { name: "tabletP-768", w: 768, h: 1024 },
  { name: "tabletL-1024", w: 1024, h: 768 },
  { name: "laptop-1440", w: 1440, h: 900 },
  { name: "desktop-1920", w: 1920, h: 1080 },
];
const routes = ["/", "/about", "/contact", "/work", "/work/vr-upnl", "/skills"];

mkdirSync("/tmp/shots2", { recursive: true });
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let issues = 0;
for (const route of routes) {
  for (const s of sizes) {
    const page = await browser.newPage({ viewport: { width: s.w, height: s.h } });
    const errors = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
    await page.goto(`http://localhost:3411${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(300); // let ResizeObserver-driven SkillGraph settle
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 0) {
      console.log(`OVERFLOW ${route} @ ${s.name}: ${overflow}px`);
      issues++;
    }
    if (errors.length) {
      console.log(`CONSOLE ERRORS ${route} @ ${s.name}:\n  ` + errors.join("\n  "));
      issues++;
    }
    const safeName = route === "/" ? "hero" : route.replace(/\//g, "_").replace(/^_/, "");
    await page.screenshot({ path: `/tmp/shots2/${safeName}-${s.name}.png` });
    await page.close();
  }
}
console.log(issues === 0 ? "\nAll clear: no overflow, no console errors, across all routes x breakpoints." : `\n${issues} issue(s) found.`);
await browser.close();
