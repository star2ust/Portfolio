/**
 * Compiles src/lib/content.ts's SEED_* exports to plain JSON for seed-sanity.mjs to consume
 * (that script is plain Node and can't import TypeScript directly). Run via `npm run export-seed`.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SEED_PROJECTS, SEED_SKILLS, SEED_SITE_SETTINGS } from "../src/lib/content";

async function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const out = {
    projects: SEED_PROJECTS,
    skills: SEED_SKILLS,
    site: SEED_SITE_SETTINGS,
  };

  const dest = path.join(__dirname, "seed-data.generated.json");
  await writeFile(dest, JSON.stringify(out, null, 2));
  console.log(`Wrote ${dest}`);
}

main();
