/**
 * Media-budget enforcement (rubric gate G3) for public/media/<slug>/.
 *
 * For each entry in registry/designs/<slug>/:
 *   - sums bytes under public/media/<slug>/, EXCLUDING generated derivatives
 *     produced by the capture pipeline (poster-*.avif, poster-*.webp, og.png,
 *     loop.webm) — those are outputs, not authored payload;
 *   - compares against meta.media.budgetKB (default cap 5120 KB);
 *   - fails on any .png/.jpg/.jpeg payload except og.png (stills must be
 *     AVIF/WebP; loops WebM).
 * A missing media dir passes at 0 bytes — capture comes in a later phase.
 *
 * Run: pnpm check-budget
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DESIGNS_DIR = path.join(ROOT, "registry", "designs");
const MEDIA_ROOT = path.join(ROOT, "public", "media");

const DEFAULT_BUDGET_KB = 5120;

/** Capture-pipeline derivatives, excluded from the authored-media budget. */
const DERIVATIVE_PATTERNS: { label: string; test: (name: string) => boolean }[] = [
  { label: "poster-*.avif", test: (n) => /^poster-.*\.avif$/.test(n) },
  { label: "poster-*.webp", test: (n) => /^poster-.*\.webp$/.test(n) },
  { label: "og.png", test: (n) => n === "og.png" },
  { label: "loop.webm", test: (n) => n === "loop.webm" },
];

const FORBIDDEN_RASTER = /\.(png|jpe?g)$/i;

type Row = {
  slug: string;
  usedKB: number;
  budgetKB: number;
  excluded: string[];
  problems: string[];
};

function walk(dir: string, base = dir): string[] {
  const out: string[] = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, item.name);
    if (item.isDirectory()) out.push(...walk(abs, base));
    else out.push(path.relative(base, abs).replaceAll("\\", "/"));
  }
  return out;
}

function budgetFor(slug: string): number {
  try {
    const meta = JSON.parse(
      fs.readFileSync(path.join(DESIGNS_DIR, slug, "meta.json"), "utf8"),
    );
    const kb = meta?.media?.budgetKB;
    if (typeof kb === "number" && Number.isFinite(kb) && kb > 0) return kb;
  } catch {
    // meta problems are `pnpm validate`'s job; use the default cap here
  }
  return DEFAULT_BUDGET_KB;
}

function checkEntry(slug: string): Row {
  const budgetKB = budgetFor(slug);
  const mediaDir = path.join(MEDIA_ROOT, slug);
  const row: Row = { slug, usedKB: 0, budgetKB, excluded: [], problems: [] };

  if (!fs.existsSync(mediaDir)) return row; // no media yet — passes at 0 bytes

  let bytes = 0;
  for (const rel of walk(mediaDir)) {
    const name = path.posix.basename(rel);
    const derivative = DERIVATIVE_PATTERNS.find((p) => p.test(name));
    if (derivative) {
      row.excluded.push(rel);
      continue;
    }
    if (FORBIDDEN_RASTER.test(name)) {
      row.problems.push(
        `forbidden raster format: ${rel} (use AVIF/WebP for stills, WebM for loops; only og.png is allowed)`,
      );
    }
    bytes += fs.statSync(path.join(mediaDir, rel)).size;
  }

  row.usedKB = bytes / 1024;
  if (row.usedKB > budgetKB) {
    row.problems.push(
      `over budget: ${row.usedKB.toFixed(1)} KB > ${budgetKB} KB`,
    );
  }
  return row;
}

function main() {
  if (!fs.existsSync(DESIGNS_DIR)) {
    console.log("[check-budget] no registry/designs directory — nothing to check");
    return;
  }

  const slugs = fs
    .readdirSync(DESIGNS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
    .map((d) => d.name)
    .sort();

  const rows = slugs.map(checkEntry);
  const failed = rows.filter((r) => r.problems.length > 0);

  const wSlug = Math.max(5, ...rows.map((r) => r.slug.length));
  console.log(
    `  ${"ENTRY".padEnd(wSlug)}  ${"USED".padStart(10)}  ${"BUDGET".padStart(10)}  ${"EXCLUDED".padStart(8)}  STATUS`,
  );
  console.log(
    `  ${"-".repeat(wSlug)}  ${"-".repeat(10)}  ${"-".repeat(10)}  ${"-".repeat(8)}  ------`,
  );
  for (const r of rows) {
    console.log(
      `  ${r.slug.padEnd(wSlug)}  ${(r.usedKB.toFixed(1) + " KB").padStart(10)}  ${(r.budgetKB + " KB").padStart(10)}  ${String(r.excluded.length).padStart(8)}  ${r.problems.length ? "FAIL" : "ok"}`,
    );
  }

  const excludedTotal = rows.flatMap((r) => r.excluded);
  console.log(
    `\n  excluded derivative patterns (capture-pipeline outputs, not counted): ${DERIVATIVE_PATTERNS.map((p) => p.label).join(", ")}`,
  );
  if (excludedTotal.length > 0) {
    for (const r of rows) {
      for (const rel of r.excluded) console.log(`    - ${r.slug}/${rel}`);
    }
  }

  if (failed.length > 0) {
    console.error(`\n[check-budget] FAILED:`);
    for (const r of failed) {
      for (const p of r.problems) console.error(`  ${r.slug}: ${p}`);
    }
    process.exit(1);
  }

  console.log(
    `\n[check-budget] OK — ${rows.length} entr${rows.length === 1 ? "y" : "ies"} within the ${DEFAULT_BUDGET_KB} KB cap`,
  );
}

main();
