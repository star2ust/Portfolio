/**
 * Compiles src/lib/content.ts's SEED_* exports to plain JSON for seed-sanity.mjs to consume
 * (that script is plain Node and can't import TypeScript directly). Run via `npm run export-seed`.
 *
 * Merges the RU and EN seed pairs into one row per project/skill (titleEn/bodyEn/... alongside
 * title/body/...), matched by array position — RU and EN arrays are always the same length and
 * order by construction (see content.ts) — so seed-sanity.mjs can push both language's fields
 * onto the same Sanity document in one createOrReplace call.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  SEED_PROJECTS_RU,
  SEED_PROJECTS_EN,
  SEED_SKILLS_RU,
  SEED_SKILLS_EN,
  SEED_SITE_SETTINGS_RU,
  SEED_SITE_SETTINGS_EN,
} from "../src/lib/content";

async function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const projects = SEED_PROJECTS_RU.map((ru, i) => {
    const en = SEED_PROJECTS_EN[i];
    return {
      ...ru,
      titleEn: en.title,
      roleEn: en.role,
      techEn: en.tech,
      bodyEn: en.body,
      tasksEn: en.tasks,
      resultEn: en.result,
    };
  });

  const skills = SEED_SKILLS_RU.map((ru, i) => ({ ...ru, bodyEn: SEED_SKILLS_EN[i].body }));

  const site = {
    ...SEED_SITE_SETTINGS_RU,
    nameEn: SEED_SITE_SETTINGS_EN.name,
    roleEn: SEED_SITE_SETTINGS_EN.role,
    heroSpecsEn: SEED_SITE_SETTINGS_EN.heroSpecs,
    about: {
      ...SEED_SITE_SETTINGS_RU.about,
      titleEn: SEED_SITE_SETTINGS_EN.about.title,
      ledeEn: SEED_SITE_SETTINGS_EN.about.lede,
      body1En: SEED_SITE_SETTINGS_EN.about.body1,
      body2En: SEED_SITE_SETTINGS_EN.about.body2,
      metaEn: SEED_SITE_SETTINGS_EN.about.meta,
    },
    workLedeEn: SEED_SITE_SETTINGS_EN.work.lede,
    skillsEmptyStateEn: SEED_SITE_SETTINGS_EN.skills.emptyState,
    contactTitleEn: SEED_SITE_SETTINGS_EN.contact.title,
  };

  const out = { projects, skills, site };

  const dest = path.join(__dirname, "seed-data.generated.json");
  await writeFile(dest, JSON.stringify(out, null, 2));
  console.log(`Wrote ${dest}`);
}

main();
