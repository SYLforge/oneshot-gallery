// Converts every registry/designs/*/fonts.ts from next/font/google to
// @fontsource self-hosted imports, so builds never contact Google Fonts.
//
// For each fonts.ts:
//  - reads the `import { A, B } from "next/font/google"` line
//  - for each font, finds its `export const x = Font({ weight: [...], variable: "--font-y" })`
//  - rewrites to: CSS imports for each weight + a stub `{ variable: "" }` export
//  - collects (cssVar -> familyName) so styles.css can be patched too
//
// Run: node scripts/migrate-fontsource.mjs
// Idempotent: skips files that already import @fontsource.
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DESIGNS = "registry/designs";

/** @param {string} pascal e.g. "Noto_Sans_KR" */
const toKebab = (p) =>
  p
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-");

/** @param {string} pascal e.g. "Gowun_Dodum" */
const toFamily = (p) =>
  p.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** @param {string} file */
function migrate(file) {
  let src = readFileSync(file, "utf8");
  if (src.includes("@fontsource")) return { skipped: true };

  // Capture the google import + exported font configs.
  const importMatch = src.match(
    /import\s*\{([^}]+)\}\s*from\s*"next\/font\/google"/,
  );
  if (!importMatch) return { skipped: true };
  const pascalNames = importMatch[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const cssImports = [];
  const exports = [];
  const cssVarMap = []; // {cssVar, family}

  for (const pascal of pascalNames) {
    // Find the export const for this font, e.g.
    //   export const notoSansKR = Noto_Sans_KR({ weight: ["400","700"], variable: "--font-x", ... })
    // Handle weight as array OR string OR variable-font object.
    const exportRe = new RegExp(
      `export\\s+const\\s+(\\w+)\\s*=\\s*${pascal.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      )}\\s*\\(\\s*([\\s\\S]*?)\\n\\}\\s*\\)?;?`,
      "m",
    );
    const em = src.match(exportRe);
    const varName = em ? em[1] : pascal.charAt(0).toLowerCase() + pascal.slice(1);
    const body = em ? em[1] : "";

    // Extract variable name (CSS custom property).
    const varMatch = body.match(/variable:\s*"([^"]+)"/);
    const cssVar = varMatch ? varMatch[1] : `--font-${toKebab(pascal)}`;
    const family = toFamily(pascal);

    // Extract weights.
    let weights = [];
    const wArr = body.match(/weight:\s*\[([^\]]+)\]/);
    if (wArr) {
      weights = wArr[1]
        .split(",")
        .map((w) => w.trim().replace(/["']/g, ""))
        .filter(Boolean);
    } else {
      const wStr = body.match(/weight:\s*"([^"]+)"/);
      if (wStr) weights = [wStr[1]];
      else if (body.includes('weight: "variable"')) {
        // variable font — use the variable package css if available, else index.
        weights = []; // handled below
      }
    }

    // Generate CSS imports.
    const pkg = `@fontsource/${toKebab(pascal)}`;
    if (weights.length === 0) {
      // variable font or no weight specified → index.css (whole family)
      cssImports.push(`import "${pkg}";`);
    } else {
      for (const w of weights) cssImports.push(`import "${pkg}/${w}.css";`);
    }

    exports.push(
      `export const ${varName} = { variable: "" };`,
    );
    cssVarMap.push({ cssVar, family });
  }

  // Build the new file: keep the original doc comment if present.
  const commentMatch = src.match(/^\/\*\*[\s\S]*?\*\//);
  const comment = commentMatch ? commentMatch[0] + "\n\n" : "";

  const header = `${comment}// Self-hosted via @fontsource — no build-time Google Fonts fetch.\n`;
  const newSrc =
    header +
    cssImports.join("\n") +
    "\n\n" +
    exports.join("\n") +
    "\n";

  writeFileSync(file, newSrc);
  return { skipped: false, cssVarMap };
}

let total = 0;
let migrated = 0;
const cssVarMaps = {};

for (const slug of readdirSync(DESIGNS)) {
  const dir = join(DESIGNS, slug);
  if (!statSync(dir).isDirectory()) continue;
  const file = join(dir, "fonts.ts");
  try {
    readFileSync(file, "utf8");
  } catch {
    continue;
  }
  total++;
  const r = migrate(file);
  if (r.skipped) continue;
  migrated++;
  cssVarMaps[slug] = r.cssVarMap;
  console.log(`✓ ${slug}: ${r.cssVarMap.length} fonts`);
}

// Emit a map for the styles.css patcher.
writeFileSync(
  "scripts/.fontsource-vars.json",
  JSON.stringify(cssVarMaps, null, 2),
);
console.log(`\n${migrated}/${total} fonts.ts migrated.`);
console.log("Next: node scripts/migrate-fontsource-css.mjs");
