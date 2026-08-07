import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

await page.goto("http://localhost:3411/skills", { waitUntil: "networkidle" });
await page.waitForTimeout(300);

console.log("1. Empty state visible before any selection:");
console.log("  ", (await page.locator("text=Коснитесь узла графа").count()) > 0);

await page.locator("text=Unity").first().click({ force: true });
await page.waitForTimeout(100);
console.log("2. Right after clicking Unity (entering, should show heading at least):");
console.log("   heading present:", (await page.locator("h2:has-text('Unity')").count()) > 0);
await page.waitForTimeout(750);
console.log("   after entrance settles, body+dots present:", (await page.locator("text=VR-тренажёров").count()) > 0);

await page.locator("text=TouchDesigner").first().click({ force: true });
await page.waitForTimeout(50);
console.log("3. Right after switching to TouchDesigner (should swap instantly, no wait needed):");
console.log("   new heading present almost immediately:", (await page.locator("h2:has-text('TouchDesigner')").count()) > 0);

// deselect by clicking empty space in the graph area
await page.mouse.click(200, 200);
await page.waitForTimeout(100);
console.log("4. Right after deselect click (exiting - panel still in DOM, animating out):");
const midExit = await page.evaluate(() => {
  const panel = document.querySelector('[class*="panel"]');
  return panel ? getComputedStyle(panel).opacity : null;
});
console.log("   panel opacity mid-exit (~0 to <1):", midExit);
await page.waitForTimeout(500);
console.log("   after exit settles, empty state back:", (await page.locator("text=Коснитесь узла графа").count()) > 0);

console.log("\nErrors:", errors.length ? errors.join("\n") : "none");
await browser.close();
