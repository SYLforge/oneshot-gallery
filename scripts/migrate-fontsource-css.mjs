// Patches every registry/designs/*/styles.css: replaces
//   var(--font-xxx), "Fallback"
// with the direct family name, since @fontsource rules are global and the
// CSS custom property is no longer injected by next/font's .variable class.
//
// Reads the var→family map from scripts/.fontsource-vars.json (produced by
// migrate-fontsource.mjs) plus clay's manual mapping.
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DESIGNS = "registry/designs";
const clayMap = [
  { cssVar: "--font-baloo", family: "Baloo 2" },
  { cssVar: "--font-gowun-dodum", family: "Gowun Dodum" },
];
const maps = JSON.parse(readFileSync("scripts/.fontsource-vars.json", "utf8"));
maps.clay = clayMap;

let patched = 0;
for (const slug of readdirSync(DESIGNS)) {
  const dir = join(DESIGNS, slug);
  if (!statSync(dir).isDirectory()) continue;
  const cssFile = join(dir, "styles.css");
  let css;
  try {
    css = readFileSync(cssFile, "utf8");
  } catch {
    continue;
  }
  const vars = maps[slug];
  if (!vars) continue;
  let changed = false;
  for (const { cssVar, family } of vars) {
    // Replace patterns like:
    //   var(--font-x), "Family", fallback
    //   var(--font-x)
    // Turn them into: "Family", fallback  /  "Family"
    const quoted = `"${family}"`;
    // var(--x), "Family", ...  ->  "Family", ...
    const re1 = new RegExp(
      `var\\(${cssVar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\),\\s*"${family.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`,
      "g",
    );
    if (re1.test(css)) {
      css = css.replace(re1, quoted);
      changed = true;
    }
    // var(--x), 'Family', ...  (single quotes)
    const re1s = new RegExp(
      `var\\(${cssVar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\),\\s*'${family.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}'`,
      "g",
    );
    if (re1s.test(css)) {
      css = css.replace(re1s, quoted);
      changed = true;
    }
    // standalone var(--x) not followed by a quoted family -> "Family"
    const re2 = new RegExp(
      `var\\(${cssVar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\)(?!")`,
      "g",
    );
    if (re2.test(css)) {
      css = css.replace(re2, quoted);
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(cssFile, css);
    patched++;
    console.log(`✓ ${slug}`);
  }
}
console.log(`\n${patched} styles.css patched.`);
