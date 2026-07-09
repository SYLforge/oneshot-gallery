/**
 * Structural validator for every entry in registry/designs/<slug>/.
 * Enforces the mechanical half of docs/RUBRIC.md (gates G3/G4) and the
 * entry anatomy from CONTRIBUTING.md:
 *   - required files present
 *   - meta.json / tokens.json parse against lib/schema.ts
 *   - meta.slug matches the folder, entry numbers are unique
 *   - PROMPT.md front-matter declares provenance: one-shot | distilled-recipe
 *     (and agrees with meta.prompt.oneshot)
 *   - no "@/" imports inside entry sources (must survive shadcn install)
 *   - styles.css contains a prefers-reduced-motion block
 *   - no preload="auto" in entry sources
 *
 * Run: pnpm validate
 */
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { entryMetaSchema, tokensSchema, type EntryMeta } from "../lib/schema";

const ROOT = path.resolve(import.meta.dirname, "..");
const DESIGNS_DIR = path.join(ROOT, "registry", "designs");

const REQUIRED_FILES = [
  "page.tsx",
  "meta.json",
  "tokens.json",
  "PROMPT.md",
  "DESIGN.md",
  "breakdown.en.mdx",
  "breakdown.ko.mdx",
];

const PROVENANCE_CLASSES = ["one-shot", "distilled-recipe"] as const;

type Failure = { slug: string; check: string; detail: string };
const failures: Failure[] = [];

function fail(slug: string, check: string, detail: string) {
  failures.push({ slug, check, detail });
}

/** Recursively collect files under dir, as paths relative to dir. */
function walk(dir: string, base = dir): string[] {
  const out: string[] = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, item.name);
    if (item.isDirectory()) out.push(...walk(abs, base));
    else out.push(path.relative(base, abs).replaceAll("\\", "/"));
  }
  return out;
}

/**
 * Tiny hand-rolled YAML front-matter reader: returns the top-level
 * `key: value` pairs of the leading --- block (nested/indented keys are
 * intentionally ignored). Enough for the provenance contract — no deps.
 */
function parseFrontMatter(src: string): Record<string, string> | null {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(src);
  if (!match) return null;
  const out: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/.exec(line);
    if (kv) out[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

function validateEntry(slug: string): EntryMeta | null {
  const dir = path.join(DESIGNS_DIR, slug);

  // 1. required files
  let filesOk = true;
  for (const required of REQUIRED_FILES) {
    if (!fs.existsSync(path.join(dir, required))) {
      fail(slug, "required-files", `missing ${required}`);
      filesOk = false;
    }
  }

  // 2. meta.json against schema
  let meta: EntryMeta | null = null;
  const metaPath = path.join(dir, "meta.json");
  if (fs.existsSync(metaPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(metaPath, "utf8"));
      const parsed = entryMetaSchema.safeParse(raw);
      if (!parsed.success) {
        fail(
          slug,
          "meta-schema",
          z.prettifyError(parsed.error).split("\n").join(" | "),
        );
      } else {
        meta = parsed.data;
        if (meta.slug !== slug) {
          fail(slug, "meta-slug", `meta.slug "${meta.slug}" != folder name`);
        }
        if (meta.media.source !== "code" && !meta.media.provenance) {
          fail(
            slug,
            "media-provenance",
            `media.source=${meta.media.source} requires media.provenance`,
          );
        }
      }
    } catch (e) {
      fail(slug, "meta-schema", `meta.json is not valid JSON: ${String(e)}`);
    }
  }

  // 3. tokens.json against schema
  const tokensPath = path.join(dir, "tokens.json");
  if (fs.existsSync(tokensPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(tokensPath, "utf8"));
      const parsed = tokensSchema.safeParse(raw);
      if (!parsed.success) {
        fail(
          slug,
          "tokens-schema",
          z.prettifyError(parsed.error).split("\n").join(" | "),
        );
      }
    } catch (e) {
      fail(slug, "tokens-schema", `tokens.json is not valid JSON: ${String(e)}`);
    }
  }

  // 4. PROMPT.md provenance front-matter
  const promptPath = path.join(dir, "PROMPT.md");
  if (fs.existsSync(promptPath)) {
    const fm = parseFrontMatter(fs.readFileSync(promptPath, "utf8"));
    if (!fm) {
      fail(slug, "prompt-front-matter", "PROMPT.md has no --- front-matter block");
    } else if (!fm.provenance) {
      fail(slug, "prompt-provenance", "front-matter missing provenance:");
    } else if (!(PROVENANCE_CLASSES as readonly string[]).includes(fm.provenance)) {
      fail(
        slug,
        "prompt-provenance",
        `provenance "${fm.provenance}" must be one of: ${PROVENANCE_CLASSES.join(" | ")}`,
      );
    } else if (meta) {
      const expected = fm.provenance === "one-shot";
      if (meta.prompt.oneshot !== expected) {
        fail(
          slug,
          "provenance-agreement",
          `PROMPT.md provenance "${fm.provenance}" disagrees with meta.prompt.oneshot=${meta.prompt.oneshot}`,
        );
      }
    }
  }

  // 5. source scans (only if the folder exists at all)
  if (filesOk || fs.existsSync(dir)) {
    const sources = walk(dir).filter(
      (rel) => rel.endsWith(".ts") || rel.endsWith(".tsx"),
    );
    for (const rel of sources) {
      const src = fs.readFileSync(path.join(dir, rel), "utf8");
      if (/(?:from\s*|import\s*\(\s*|require\s*\(\s*)["']@\//.test(src)) {
        fail(
          slug,
          "no-alias-imports",
          `${rel} imports via "@/" — entries must use relative imports only`,
        );
      }
      if (/preload\s*=\s*["']auto["']|preload\s*:\s*["']auto["']/.test(src)) {
        fail(slug, "no-preload-auto", `${rel} uses preload="auto"`);
      }
    }

    const stylesPath = path.join(dir, "styles.css");
    if (fs.existsSync(stylesPath)) {
      const css = fs.readFileSync(stylesPath, "utf8");
      if (!css.includes("prefers-reduced-motion")) {
        fail(
          slug,
          "reduced-motion",
          "styles.css has no prefers-reduced-motion block (gate G2)",
        );
      }
    } else {
      fail(slug, "reduced-motion", "styles.css not found");
    }
  }

  return meta;
}

function printFailureTable() {
  const header = { slug: "ENTRY", check: "CHECK", detail: "DETAIL" };
  const rows = [header, ...failures];
  const wSlug = Math.max(...rows.map((r) => r.slug.length));
  const wCheck = Math.max(...rows.map((r) => r.check.length));
  const line = (r: Failure | typeof header) =>
    `  ${r.slug.padEnd(wSlug)}  ${r.check.padEnd(wCheck)}  ${r.detail}`;
  console.error(`\n[validate] FAILED — ${failures.length} problem${failures.length === 1 ? "" : "s"}:\n`);
  console.error(line(header));
  console.error(`  ${"-".repeat(wSlug)}  ${"-".repeat(wCheck)}  ${"-".repeat(40)}`);
  for (const f of failures) console.error(line(f));
  console.error("");
}

function main() {
  if (!fs.existsSync(DESIGNS_DIR)) {
    console.log("[validate] no registry/designs directory — nothing to validate");
    return;
  }

  const slugs = fs
    .readdirSync(DESIGNS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
    .map((d) => d.name)
    .sort();

  const metas = new Map<string, EntryMeta>();
  for (const slug of slugs) {
    const meta = validateEntry(slug);
    if (meta) metas.set(slug, meta);
  }

  // cross-entry: unique numbers
  const byNo = new Map<number, string[]>();
  for (const [slug, meta] of metas) {
    byNo.set(meta.no, [...(byNo.get(meta.no) ?? []), slug]);
  }
  for (const [no, owners] of byNo) {
    if (owners.length > 1) {
      for (const slug of owners) {
        fail(slug, "unique-no", `entry no ${no} also used by: ${owners.filter((s) => s !== slug).join(", ")}`);
      }
    }
  }

  if (failures.length > 0) {
    printFailureTable();
    process.exit(1);
  }

  for (const slug of slugs) {
    const meta = metas.get(slug);
    console.log(`OK  ${slug} (no ${meta?.no}) — files, schema, provenance, imports, reduced-motion, preload`);
  }
  console.log(`[validate] OK — ${slugs.length} entr${slugs.length === 1 ? "y" : "ies"} clean`);
}

main();
