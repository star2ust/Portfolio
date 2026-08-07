import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import path from "node:path";

// Renders brand icons/OG image using the same visual language as the live site (Logo's CSS
// mask, Micra display font) — src/app/icon.png, apple-icon.png, public/og-image.png.
const root = path.join(import.meta.dirname, "..");
const svg = readFileSync(path.join(root, "public", "logo.svg"), "utf8");
const svgDataUri = "data:image/svg+xml;base64," + Buffer.from(svg).toString("base64");
const micraBase64 = readFileSync(path.join(root, "public", "fonts", "Micra.ttf")).toString("base64");
const montserratBase64 = readFileSync(path.join(root, "public", "fonts", "Montserrat-Regular.ttf")).toString("base64");

let browser;
async function shot(width, height, html, outPath, { omitBackground = false } = {}) {
  browser ??= await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(html);
  await page.waitForTimeout(150); // let @font-face settle
  await page.screenshot({ path: outPath, omitBackground });
  await page.close();
}

// The browser-tab favicon: white mark, transparent tile, as large as the canvas allows — pad
// is just breathing room so the rotated mark's corners don't clip, not a background inset.
function transparentIconHtml(size, pad = 0.2) {
  return `<!doctype html><html><head><style>
    html,body{margin:0;padding:0;background:transparent}
    .tile{width:${size}px;height:${size}px;background:transparent;display:flex;align-items:center;justify-content:center}
    .mark{width:${Math.round(size * (1 - pad * 2))}px;aspect-ratio:195.57/329.89;background:#fff;
      transform:rotate(12deg);
      -webkit-mask:url(${svgDataUri}) center/contain no-repeat;mask:url(${svgDataUri}) center/contain no-repeat}
  </style></head><body><div class="tile"><div class="mark"></div></div></body></html>`;
}

// The iOS "add to home screen" icon: kept on its dark tile, not transparent — iOS fills any
// alpha in this specific icon with solid black itself, so an actually-transparent PNG here
// would just look like an unstyled accident instead of a deliberate mark-on-a-plate.
function appleIconHtml(size, pad = 0.22) {
  return `<!doctype html><html><head><style>
    html,body{margin:0;padding:0}
    .tile{width:${size}px;height:${size}px;background:#1F2125;display:flex;align-items:center;justify-content:center}
    .mark{width:${Math.round(size * (1 - pad * 2))}px;aspect-ratio:195.57/329.89;background:#fff;
      transform:rotate(12deg);
      -webkit-mask:url(${svgDataUri}) center/contain no-repeat;mask:url(${svgDataUri}) center/contain no-repeat}
  </style></head><body><div class="tile"><div class="mark"></div></div></body></html>`;
}

function ogHtml() {
  return `<!doctype html><html><head><style>
    @font-face{font-family:"Micra";src:url(data:font/ttf;base64,${micraBase64}) format("truetype")}
    @font-face{font-family:"Montserrat";src:url(data:font/ttf;base64,${montserratBase64}) format("truetype")}
    html,body{margin:0;padding:0}
    .stage{width:1200px;height:630px;background:#1F2125;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:0 90px;box-sizing:border-box}
    .row{display:flex;align-items:center;gap:28px;margin-bottom:36px}
    .mark{width:56px;aspect-ratio:195.57/329.89;background:#fff;transform:rotate(12deg);
      -webkit-mask:url(${svgDataUri}) center/contain no-repeat;mask:url(${svgDataUri}) center/contain no-repeat}
    .role{font-family:"Montserrat";font-weight:400;font-size:26px;color:rgba(255,255,255,0.7);letter-spacing:0.02em}
    .name{font-family:"Micra";font-weight:400;font-size:96px;color:#fff;line-height:1}
    .tagline{font-family:"Montserrat";font-weight:300;font-size:24px;color:rgba(255,255,255,0.55);max-width:820px;line-height:1.4}
  </style></head><body>
    <div class="stage">
      <div class="row"><div class="mark"></div><span class="role">Interactive Developer</span></div>
      <div class="name">Хабаров Егор</div>
      <div class="tagline" style="margin-top:28px">Информационные приложения и интерактивные инсталляции с реалтайм-опытом — Unity, TouchDesigner, VR.</div>
    </div>
  </body></html>`;
}

await shot(512, 512, transparentIconHtml(512), path.join(root, "src", "app", "icon.png"), { omitBackground: true });
await shot(180, 180, appleIconHtml(180, 0.18), path.join(root, "src", "app", "apple-icon.png"));
await shot(1200, 630, ogHtml(), path.join(root, "src", "app", "opengraph-image.png"));

if (browser) await browser.close();
console.log("Wrote src/app/icon.png, src/app/apple-icon.png, src/app/opengraph-image.png");
