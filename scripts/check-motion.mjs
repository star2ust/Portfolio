import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

console.log("1. Load / — expect preloader then Hero");
await page.goto("http://localhost:3411/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(100);
const preloaderVisible = await page.evaluate(() => !!document.querySelector('[aria-hidden="true"]')?.textContent);
console.log("   preloader glyphs present early:", preloaderVisible);
await page.waitForTimeout(1200);
const heroVisible = await page.evaluate(() => document.body.innerText.includes("ГЛАВНАЯ"));
console.log("   settled, nav visible:", heroVisible);

console.log("2. Click ОБО МНЕ nav link — expect arc transition then About");
await page.click("text=ОБО МНЕ");
await page.waitForTimeout(200);
const midTransitionOverlay = await page.evaluate(() => document.querySelectorAll('svg[viewBox="0 0 100 140"]').length > 0);
console.log("   arc overlay appeared mid-transition:", midTransitionOverlay);
await page.waitForTimeout(2200);
const onAbout = page.url();
const aboutContent = await page.evaluate(() => document.body.innerText.includes("ОБО МНЕ"));
console.log("   landed on:", onAbout, " about content present:", aboutContent);

console.log("3. Navigate to a project card then close — expect fade (no arc svg) for detail");
await page.click("text=ПРОЕКТЫ");
await page.waitForTimeout(2200);
await page.click('a[href^="/work/"] >> nth=0');
await page.waitForTimeout(200);
const noArcOnDetail = await page.evaluate(() => document.querySelectorAll('svg[viewBox="0 0 100 140"]').length === 0);
console.log("   no arc svg during work->detail transition (should be true, fade used instead):", noArcOnDetail);
await page.waitForTimeout(1500);
console.log("   detail url:", page.url());

console.log("\nConsole/page errors:", errors.length ? errors.join("\n") : "none");
await browser.close();
